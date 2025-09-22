import { useState, useCallback } from 'react';
import { GameMap, Position, TerrainType, MapTile, GameMode } from '@/types/map';
import playerSprite from '@/assets/player-character.png';

// Create a rich Pokémon-style 20x20 map
const createMap = (): GameMap => {
  const width = 20;
  const height = 20;
  const tiles: MapTile[][] = [];

  // Initialize with grass
  for (let y = 0; y < height; y++) {
    tiles[y] = [];
    for (let x = 0; x < width; x++) {
      tiles[y][x] = {
        terrain: 'grass',
        walkable: true,
        encounterRate: 0.15, // 15% chance in grass
      };
    }
  }

  // Create main path system (like Pokémon town roads)
  const createPath = (startX: number, startY: number, endX: number, endY: number) => {
    if (startX === endX) {
      // Vertical path
      const minY = Math.min(startY, endY);
      const maxY = Math.max(startY, endY);
      for (let y = minY; y <= maxY; y++) {
        if (y >= 0 && y < height && startX >= 0 && startX < width) {
          tiles[y][startX] = { terrain: 'path', walkable: true, encounterRate: 0.02 };
        }
      }
    } else {
      // Horizontal path
      const minX = Math.min(startX, endX);
      const maxX = Math.max(startX, endX);
      for (let x = minX; x <= maxX; x++) {
        if (x >= 0 && x < width && startY >= 0 && startY < height) {
          tiles[startY][x] = { terrain: 'path', walkable: true, encounterRate: 0.02 };
        }
      }
    }
  };

  // Main cross paths
  createPath(10, 0, 10, 19); // Vertical main road
  createPath(0, 10, 19, 10); // Horizontal main road

  // Add buildings (like Pokémon Center, Poké Mart, houses)
  const buildings = [
    { x: 7, y: 7, width: 2, height: 2 }, // House
    { x: 13, y: 7, width: 2, height: 2 }, // Pokémon Center
    { x: 7, y: 13, width: 3, height: 2 }, // Poké Mart
    { x: 15, y: 15, width: 2, height: 2 }, // House
    { x: 3, y: 3, width: 2, height: 2 }, // House
  ];

  buildings.forEach(building => {
    for (let y = building.y; y < building.y + building.height; y++) {
      for (let x = building.x; x < building.x + building.width; x++) {
        if (x < width && y < height) {
          tiles[y][x] = { terrain: 'building', walkable: false, encounterRate: 0 };
        }
      }
    }
  });

  // Add fences around buildings
  buildings.forEach(building => {
    // Top and bottom fences
    for (let x = building.x - 1; x <= building.x + building.width; x++) {
      if (x >= 0 && x < width) {
        if (building.y - 1 >= 0) {
          tiles[building.y - 1][x] = { terrain: 'fence', walkable: false, encounterRate: 0 };
        }
        if (building.y + building.height < height) {
          tiles[building.y + building.height][x] = { terrain: 'fence', walkable: false, encounterRate: 0 };
        }
      }
    }
    // Left and right fences
    for (let y = building.y - 1; y <= building.y + building.height; y++) {
      if (y >= 0 && y < height) {
        if (building.x - 1 >= 0) {
          tiles[y][building.x - 1] = { terrain: 'fence', walkable: false, encounterRate: 0 };
        }
        if (building.x + building.width < width) {
          tiles[y][building.x + building.width] = { terrain: 'fence', walkable: false, encounterRate: 0 };
        }
      }
    }
  });

  // Add water areas (like ponds)
  const waterAreas = [
    { x: 2, y: 16, width: 4, height: 3 },
    { x: 15, y: 2, width: 3, height: 4 },
  ];

  waterAreas.forEach(water => {
    for (let y = water.y; y < water.y + water.height; y++) {
      for (let x = water.x; x < water.x + water.width; x++) {
        if (x < width && y < height) {
          tiles[y][x] = { terrain: 'water', walkable: false, encounterRate: 0 };
        }
      }
    }
  });

  // Add trees randomly (like in Pokémon towns)
  const treePositions = [
    { x: 1, y: 1 }, { x: 18, y: 1 }, { x: 1, y: 18 }, { x: 18, y: 18 },
    { x: 5, y: 5 }, { x: 14, y: 5 }, { x: 5, y: 14 }, { x: 16, y: 12 },
    { x: 8, y: 2 }, { x: 11, y: 2 }, { x: 2, y: 8 }, { x: 17, y: 8 },
  ];

  treePositions.forEach(pos => {
    if (pos.x < width && pos.y < height && tiles[pos.y][pos.x].terrain === 'grass') {
      tiles[pos.y][pos.x] = { terrain: 'tree', walkable: false, encounterRate: 0 };
    }
  });

  // Add flowers scattered around (like in Pokémon)
  const flowerPositions = [
    { x: 4, y: 4 }, { x: 15, y: 4 }, { x: 4, y: 15 }, { x: 12, y: 16 },
    { x: 6, y: 6 }, { x: 13, y: 6 }, { x: 6, y: 13 }, { x: 17, y: 13 },
    { x: 9, y: 3 }, { x: 12, y: 3 }, { x: 3, y: 9 }, { x: 16, y: 9 },
  ];

  flowerPositions.forEach(pos => {
    if (pos.x < width && pos.y < height && tiles[pos.y][pos.x].terrain === 'grass') {
      tiles[pos.y][pos.x] = { terrain: 'flower', walkable: true, encounterRate: 0.05 };
    }
  });

  // Add tall grass areas (higher encounter rate)
  const tallGrassAreas = [
    { x: 0, y: 0, width: 3, height: 3 },
    { x: 17, y: 17, width: 3, height: 3 },
    { x: 0, y: 17, width: 3, height: 3 },
    { x: 17, y: 0, width: 3, height: 3 },
  ];

  tallGrassAreas.forEach(area => {
    for (let y = area.y; y < area.y + area.height; y++) {
      for (let x = area.x; x < area.x + area.width; x++) {
        if (x < width && y < height && tiles[y][x].terrain === 'grass') {
          tiles[y][x] = { terrain: 'tall_grass', walkable: true, encounterRate: 0.25 };
        }
      }
    }
  });

  return {
    width,
    height,
    tiles,
    playerPosition: { x: 10, y: 12 }, // Start on the main road
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