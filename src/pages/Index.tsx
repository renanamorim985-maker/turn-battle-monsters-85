import React, { useEffect } from 'react';
import { useGameState } from '@/hooks/useGameState';
import { useMapState } from '@/hooks/useMapState';
import { CharacterCard } from '@/components/CharacterCard';
import { ActionMenu } from '@/components/ActionMenu';
import { BattleMessages } from '@/components/BattleMessages';
import { GameOverModal } from '@/components/GameOverModal';
import { ExplorationMap } from '@/components/ExplorationMap';
import { TeamOverview } from '@/components/TeamOverview';
import { Button } from '@/components/ui/button';

const Index = () => {
  const { gameState, performAction, performEnemyAction, resetGame } = useGameState();
  const { 
    gameMap, 
    gameMode, 
    playerFacing, 
    movePlayer, 
    checkRandomEncounter, 
    startBattle, 
    endBattle 
  } = useMapState();

  // Handle enemy turn
  useEffect(() => {
    if (gameState.currentTurn === 'enemy' && !gameState.gameOver && gameMode === 'battle') {
      performEnemyAction();
    }
  }, [gameState.currentTurn, gameState.gameOver, gameMode, performEnemyAction]);

  // Handle battle end
  useEffect(() => {
    if (gameState.gameOver) {
      setTimeout(() => {
        endBattle();
      }, 3000); // Return to exploration after 3 seconds
    }
  }, [gameState.gameOver, endBattle]);

  // Handle random encounter trigger
  const handleRandomEncounter = () => {
    const hasEncounter = checkRandomEncounter();
    if (hasEncounter) {
      resetGame(); // Reset battle state for new encounter
      startBattle();
    }
    return hasEncounter;
  };

  return (
    <div className="min-h-screen bg-gradient-battle p-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
            ⚔️ RPG Pokémon
          </h1>
          <p className="text-muted-foreground">
            {gameMode === 'exploration' 
              ? 'Explore o mundo e encontre monstros selvagens!' 
              : 'Batalha épica por turnos - Derrote seu inimigo!'
            }
          </p>
        </div>

        {/* Game Mode Switch */}
        {gameMode === 'exploration' ? (
          /* Exploration Mode */
          <div className="animate-fade-in space-y-8">
            <ExplorationMap
              gameMap={gameMap}
              playerFacing={playerFacing}
              onMove={movePlayer}
              onRandomEncounter={handleRandomEncounter}
            />
            
            {/* Team Overview */}
            <TeamOverview team={gameState.playerTeam} />
          </div>
        ) : (
          /* Battle Mode */
          <div className="animate-fade-in">

            {/* Battle Field */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Player Character */}
              <div className="animate-slide-in">
                <CharacterCard 
                  character={gameState.player}
                  isPlayer={true}
                  isCurrentTurn={gameState.currentTurn === 'player'}
                />
              </div>

              {/* Enemy Character */}
              <div className="animate-slide-in" style={{ animationDelay: '0.2s' }}>
                <CharacterCard 
                  character={gameState.enemy}
                  isPlayer={false}
                  isCurrentTurn={gameState.currentTurn === 'enemy'}
                />
              </div>
            </div>

            {/* Battle Messages */}
            <div className="mb-8 animate-slide-in" style={{ animationDelay: '0.4s' }}>
              <BattleMessages messages={gameState.battleMessages} />
            </div>

            {/* Action Menu */}
            {gameState.currentTurn === 'player' && !gameState.gameOver && (
              <div className="animate-slide-in" style={{ animationDelay: '0.6s' }}>
                <div className="bg-gradient-card rounded-lg p-6 border border-border shadow-card">
                  <ActionMenu
                    onAction={performAction}
                    disabled={gameState.currentTurn !== 'player' || gameState.gameOver}
                    playerEnergy={gameState.player.energy}
                    specialUses={gameState.player.specialUses}
                    captureItems={gameState.captureItems}
                    enemyHpPercentage={(gameState.enemy.hp / gameState.enemy.maxHp) * 100}
                  />
                </div>
              </div>
            )}

            {/* Enemy Turn Indicator */}
            {gameState.currentTurn === 'enemy' && !gameState.gameOver && (
              <div className="text-center animate-pulse">
                <div className="bg-gradient-card rounded-lg p-6 border border-border shadow-card">
                  <h3 className="text-lg font-semibold">🤖 Turno do Inimigo</h3>
                  <p className="text-muted-foreground">O inimigo está pensando...</p>
                </div>
              </div>
            )}

            {/* Battle Controls */}
            <div className="text-center mt-8 space-x-4">
              <Button 
                onClick={() => endBattle()}
                variant="outline"
                className="hover:scale-105 transition-transform"
              >
                🔙 Voltar ao Mapa
              </Button>
              <Button 
                onClick={resetGame}
                variant="outline"
                className="hover:scale-105 transition-transform"
              >
                🔄 Reiniciar Batalha
              </Button>
            </div>

            {/* Game Over Modal */}
            <GameOverModal
              isOpen={gameState.gameOver}
              winner={gameState.winner}
              onRestart={resetGame}
              experienceGained={gameState.winner === 'player' ? 50 : 0}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
