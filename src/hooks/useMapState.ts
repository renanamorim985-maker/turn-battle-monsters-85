import { useState, useCallback } from 'react';
import { GameMap, Position, TerrainType, MapTile, GameMode } from '@/types/map';
import playerSprite from '@/assets/player-character.png';

// Create a simple 15x15 map
const createMap = (): GameMap => {
  const width = 15;
  const height = 15;
  const tiles: MapTile[][] = [];

  for (let y = 0; y < height; y++) {
    tiles[y] = [];
    for (let x = 0; x < width; x++) {
      let terrain: TerrainType = 'grass';
      let walkable = true;
      let encounterRate = 0.1; // 10% chance in grass

      // Create paths
      if ((x === 7 && y >= 2 && y <= 12) || (y === 7 && x >= 2 && x <= 12)) {
        terrain = 'path';
        encounterRate = 0.02; // Lower encounter rate on paths
      }

      // Add some trees randomly
      if (Math.random() < 0.15 && terrain === 'grass') {
        terrain = 'tree';
        walkable = false;
        encounterRate = 0;
      }

      // Add water in corners
      if ((x < 2 && y < 2) || (x > 12 && y > 12)) {
        terrain = 'water';
        walkable = false;
        encounterRate = 0;
      }

      // Add a small building
      if (x === 7 && y === 2) {
        terrain = 'building';
        walkable = false;
        encounterRate = 0;
      }

      tiles[y][x] = {
        terrain,
        walkable,
        encounterRate,
      };
    }
  }

  return {
    width,
    height,
    tiles,
    playerPosition: { x: 7, y: 10 }, // Start on the path
  };
};

export const useMapState = () => {
  const [gameMap, setGameMap] = useState<GameMap>(createMap);
  const [gameMode, setGameMode] = useState<GameMode>('exploration');
  const [playerFacing, setPlayerFacing] = useState<'up' | 'down' | 'left' | 'right'>('up');

  const movePlayer = useCallback((direction: 'up' | 'down' | 'left' | 'right') => {
    setPlayerFacing(direction);
    
    setGameMap(prevMap => {
      const newPosition: Position = { ...prevMap.playerPosition };
      
      switch (direction) {
        case 'up':
          newPosition.y = Math.max(0, newPosition.y - 1);
          break;
        case 'down':
          newPosition.y = Math.min(prevMap.height - 1, newPosition.y + 1);
          break;
        case 'left':
          newPosition.x = Math.max(0, newPosition.x - 1);
          break;
        case 'right':
          newPosition.x = Math.min(prevMap.width - 1, newPosition.x + 1);
          break;
      }

      // Check if the tile is walkable
      const targetTile = prevMap.tiles[newPosition.y][newPosition.x];
      if (!targetTile.walkable) {
        return prevMap; // Don't move if tile is not walkable
      }

      return {
        ...prevMap,
        playerPosition: newPosition,
      };
    });
  }, []);

  const checkRandomEncounter = useCallback(() => {
    const currentTile = gameMap.tiles[gameMap.playerPosition.y][gameMap.playerPosition.x];
    const encounterChance = Math.random();
    
    if (encounterChance < currentTile.encounterRate) {
      setGameMode('battle');
      return true;
    }
    return false;
  }, [gameMap]);

  const startBattle = useCallback(() => {
    setGameMode('battle');
  }, []);

  const endBattle = useCallback(() => {
    setGameMode('exploration');
  }, []);

  return {
    gameMap,
    gameMode,
    playerFacing,
    movePlayer,
    checkRandomEncounter,
    startBattle,
    endBattle,
  };
};