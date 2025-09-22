import React from 'react';
import { TerrainType } from '@/types/map';
import { cn } from '@/lib/utils';

interface MapTileProps {
  terrain: TerrainType;
  hasPlayer: boolean;
  playerSprite?: string;
  className?: string;
}

const getTerrainColor = (terrain: TerrainType): string => {
  switch (terrain) {
    case 'grass':
      return 'bg-terrain-grass';
    case 'path':
      return 'bg-terrain-path';
    case 'tree':
      return 'bg-terrain-tree';
    case 'water':
      return 'bg-terrain-water';
    case 'building':
      return 'bg-terrain-building';
    default:
      return 'bg-terrain-grass';
  }
};

const getTerrainEmoji = (terrain: TerrainType): string => {
  switch (terrain) {
    case 'grass':
      return '🌱';
    case 'path':
      return '🛤️';
    case 'tree':
      return '🌳';
    case 'water':
      return '💧';
    case 'building':
      return '🏠';
    default:
      return '🌱';
  }
};

export const MapTile: React.FC<MapTileProps> = ({
  terrain,
  hasPlayer,
  playerSprite,
  className,
}) => {
  return (
    <div
      className={cn(
        "relative w-10 h-10 border-2 border-border transition-none",
        getTerrainColor(terrain),
        hasPlayer && "shadow-glow animate-retro-blink",
        className
      )}
      style={{
        imageRendering: 'pixelated', // Ensure crisp pixel art
      }}
    >
      {/* Terrain indicator */}
      <div className="absolute inset-0 flex items-center justify-center text-sm pointer-events-none">
        {getTerrainEmoji(terrain)}
      </div>

      {/* Player sprite */}
      {hasPlayer && playerSprite && (
        <div className="absolute inset-0 flex items-center justify-center z-10 animate-pixel-move">
          <div className="w-8 h-8 border-2 border-primary bg-primary/20 overflow-hidden">
            <img 
              src={playerSprite} 
              alt="Player"
              className="w-full h-full object-cover"
              style={{ imageRendering: 'pixelated' }}
            />
          </div>
        </div>
      )}
    </div>
  );
};