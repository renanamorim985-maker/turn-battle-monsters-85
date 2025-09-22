export type TerrainType = 'grass' | 'path' | 'tree' | 'water' | 'building' | 'fence' | 'flower' | 'tall_grass' | 'sand';

export interface Position {
  x: number;
  y: number;
}

export interface MapTile {
  terrain: TerrainType;
  walkable: boolean;
  encounterRate: number; // 0-1, chance of random encounter
}

export interface GameMap {
  width: number;
  height: number;
  tiles: MapTile[][];
  playerPosition: Position;
}

export interface Player {
  position: Position;
  sprite: string;
  facing: 'up' | 'down' | 'left' | 'right';
}

export type GameMode = 'exploration' | 'battle';