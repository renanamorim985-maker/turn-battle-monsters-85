export interface Character {
  id: string;
  name: string;
  hp: number;
  maxHp: number;
  energy: number;
  maxEnergy: number;
  attack: number;
  defense: number;
  speed: number;
  level: number;
  experience: number;
  specialUses: number;
  maxSpecialUses: number;
  isDefending: boolean;
  sprite: string;
}

export interface BattleAction {
  type: 'attack' | 'defend' | 'special' | 'flee' | 'capture';
  damage?: number;
  success?: boolean;
  message?: string;
}

export interface GameState {
  player: Character;
  enemy: Character;
  currentTurn: 'player' | 'enemy';
  battlePhase: 'selection' | 'animation' | 'result';
  battleMessages: string[];
  gameOver: boolean;
  winner?: 'player' | 'enemy' | 'captured' | null;
  playerTeam: Character[];
  captureItems: number; // Pokéballs
}

export interface ActionResult {
  damage: number;
  message: string;
  success: boolean;
  energyCost?: number;
}