import { useState, useCallback } from 'react';
import { Character, GameState, BattleAction, ActionResult } from '@/types/game';
import playerSprite from '@/assets/player-character.png';
import enemySprite from '@/assets/enemy-character.png';

const createPlayer = (): Character => ({
  id: 'player',
  name: 'Herói Místico',
  hp: 100,
  maxHp: 100,
  energy: 50,
  maxEnergy: 50,
  attack: 25,
  defense: 15,
  speed: 18,
  level: 1,
  experience: 0,
  specialUses: 3,
  maxSpecialUses: 3,
  isDefending: false,
  sprite: playerSprite,
});

const createEnemy = (): Character => ({
  id: 'enemy',
  name: 'Sombra Sinistra',
  hp: 80,
  maxHp: 80,
  energy: 40,
  maxEnergy: 40,
  attack: 20,
  defense: 12,
  speed: 15,
  level: 1,
  experience: 0,
  specialUses: 2,
  maxSpecialUses: 2,
  isDefending: false,
  sprite: enemySprite,
});

export const useGameState = () => {
  const [gameState, setGameState] = useState<GameState>(() => {
    const player = createPlayer();
    const enemy = createEnemy();
    
    return {
      player,
      enemy,
      currentTurn: player.speed >= enemy.speed ? 'player' : 'enemy',
      battlePhase: 'selection',
      battleMessages: ['A batalha começou!'],
      gameOver: false,
      winner: null,
      playerTeam: [],
      captureItems: 5, // Start with 5 Pokéballs
    };
  });

  const calculateDamage = useCallback((attacker: Character, defender: Character, actionType: 'attack' | 'special'): ActionResult => {
    const baseDamage = actionType === 'special' ? attacker.attack * 1.8 : attacker.attack;
    const defense = defender.isDefending ? defender.defense * 1.5 : defender.defense;
    const randomFactor = 0.8 + Math.random() * 0.4; // 80% - 120%
    
    const damage = Math.max(1, Math.floor((baseDamage - defense * 0.5) * randomFactor));
    const energyCost = actionType === 'special' ? 15 : 10;
    
    let message = '';
    if (actionType === 'special') {
      message = `${attacker.name} usou Ataque Especial e causou ${damage} de dano!`;
    } else {
      message = `${attacker.name} atacou e causou ${damage} de dano!`;
    }
    
    return { damage, message, success: true, energyCost };
  }, []);

  const performAction = useCallback((action: BattleAction) => {
    setGameState(prevState => {
      const newState = { ...prevState };
      const isPlayerTurn = newState.currentTurn === 'player';
      const attacker = isPlayerTurn ? newState.player : newState.enemy;
      const defender = isPlayerTurn ? newState.enemy : newState.player;
      
      let result: ActionResult = { damage: 0, message: '', success: false };
      
      switch (action.type) {
        case 'attack':
          if (attacker.energy >= 10) {
            result = calculateDamage(attacker, defender, 'attack');
            attacker.energy -= result.energyCost!;
            defender.hp = Math.max(0, defender.hp - result.damage);
          } else {
            result = { damage: 0, message: `${attacker.name} não tem energia suficiente!`, success: false };
          }
          break;
          
        case 'defend':
          attacker.isDefending = true;
          attacker.energy = Math.min(attacker.maxEnergy, attacker.energy + 5);
          result = { damage: 0, message: `${attacker.name} assumiu posição defensiva!`, success: true };
          break;
          
        case 'special':
          if (attacker.specialUses > 0 && attacker.energy >= 15) {
            result = calculateDamage(attacker, defender, 'special');
            attacker.energy -= result.energyCost!;
            attacker.specialUses -= 1;
            defender.hp = Math.max(0, defender.hp - result.damage);
          } else if (attacker.specialUses <= 0) {
            result = { damage: 0, message: `${attacker.name} não pode mais usar ataques especiais!`, success: false };
          } else {
            result = { damage: 0, message: `${attacker.name} não tem energia suficiente!`, success: false };
          }
          break;
          
        case 'capture':
          if (newState.captureItems > 0) {
            const enemyHpPercentage = (defender.hp / defender.maxHp) * 100;
            const captureRate = Math.max(10, Math.min(90, (100 - enemyHpPercentage) + 20));
            const captureChance = Math.random() * 100;
            
            newState.captureItems -= 1;
            
            if (captureChance <= captureRate) {
              // Successful capture
              result = { damage: 0, message: `${defender.name} foi capturado com sucesso!`, success: true };
              
              // Add to team if there's space
              if (newState.playerTeam.length < 6) {
                const capturedMonster: Character = {
                  ...defender,
                  id: `captured-${Date.now()}`,
                  hp: defender.maxHp, // Heal the captured monster
                  energy: defender.maxEnergy,
                  isDefending: false,
                };
                newState.playerTeam.push(capturedMonster);
                newState.battleMessages.push(`${defender.name} foi adicionado à sua equipe!`);
              } else {
                newState.battleMessages.push(`Sua equipe está cheia! ${defender.name} foi enviado para o PC.`);
              }
              
              newState.gameOver = true;
              newState.winner = 'captured';
            } else {
              result = { damage: 0, message: `${defender.name} escapou da Pokéball!`, success: false };
            }
          } else {
            result = { damage: 0, message: `${attacker.name} não tem Pokéballs!`, success: false };
          }
          break;
          
        case 'flee':
          const fleeChance = Math.random();
          if (fleeChance > 0.3) {
            result = { damage: 0, message: `${attacker.name} fugiu da batalha!`, success: true };
            newState.gameOver = true;
            newState.winner = null;
          } else {
            result = { damage: 0, message: `${attacker.name} não conseguiu fugir!`, success: false };
          }
          break;
      }
      
      newState.battleMessages = [...newState.battleMessages, result.message];
      
      // Check for game over
      if (newState.player.hp <= 0) {
        newState.gameOver = true;
        newState.winner = 'enemy';
        newState.battleMessages.push('Você foi derrotado!');
      } else if (newState.enemy.hp <= 0) {
        newState.gameOver = true;
        newState.winner = 'player';
        newState.battleMessages.push('Vitória! Você derrotou o inimigo!');
        newState.player.experience += 50;
        // Gain a Pokéball as reward
        newState.captureItems += 1;
        newState.battleMessages.push('Você ganhou uma Pokéball!');
      }
      
      // Switch turns if game is not over and action was successful (except capture)
      if (!newState.gameOver && (result.success || action.type === 'flee') && action.type !== 'capture') {
        // Reset defending status
        attacker.isDefending = false;
        newState.currentTurn = newState.currentTurn === 'player' ? 'enemy' : 'player';
      } else if (!newState.gameOver && !result.success && action.type === 'capture') {
        // Failed capture still switches turns
        attacker.isDefending = false;
        newState.currentTurn = newState.currentTurn === 'player' ? 'enemy' : 'player';
      }
      
      return newState;
    });
  }, [calculateDamage]);

  const performEnemyAction = useCallback(() => {
    const actions: BattleAction['type'][] = ['attack', 'defend', 'special'];
    const weights = [0.6, 0.2, 0.2]; // 60% attack, 20% defend, 20% special
    
    let actionType: BattleAction['type'] = 'attack';
    const random = Math.random();
    let cumulative = 0;
    
    for (let i = 0; i < actions.length; i++) {
      cumulative += weights[i];
      if (random <= cumulative) {
        actionType = actions[i];
        break;
      }
    }
    
    // Enemy logic adjustments
    if (actionType === 'special' && (gameState.enemy.specialUses <= 0 || gameState.enemy.energy < 15)) {
      actionType = 'attack';
    }
    
    if (actionType === 'attack' && gameState.enemy.energy < 10) {
      actionType = 'defend';
    }
    
    setTimeout(() => {
      performAction({ type: actionType });
    }, 1500);
  }, [gameState.enemy, performAction]);

  const resetGame = useCallback(() => {
    const player = createPlayer();
    const enemy = createEnemy();
    
    setGameState(prevState => ({
      player,
      enemy,
      currentTurn: player.speed >= enemy.speed ? 'player' : 'enemy',
      battlePhase: 'selection',
      battleMessages: ['A batalha começou!'],
      gameOver: false,
      winner: null,
      playerTeam: prevState.playerTeam, // Keep captured monsters
      captureItems: prevState.captureItems, // Keep Pokéballs
    }));
  }, []);

  return {
    gameState,
    performAction,
    performEnemyAction,
    resetGame,
  };
};