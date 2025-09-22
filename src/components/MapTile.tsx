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
      return 'bg-green-600';
    case 'path':
      return 'bg-yellow-700';
    case 'tree':
      return 'bg-green-800';
    case 'water':
      return 'bg-blue-500';
    case 'building':
      return 'bg-gray-600';
    default:
      return 'bg-green-600';
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
        "relative w-8 h-8 border border-border/20 transition-all duration-200",
        getTerrainColor(terrain),
        hasPlayer && "ring-2 ring-primary ring-opacity-60",
        className
      )}
    >
      {/* Terrain indicator */}
      <div className="absolute inset-0 flex items-center justify-center text-xs opacity-70">
        {getTerrainEmoji(terrain)}
      </div>

      {/* Player sprite */}
      {hasPlayer && playerSprite && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="w-6 h-6 rounded-full overflow-hidden border border-primary bg-primary/20 animate-pulse-glow">
            <img 
              src={playerSprite} 
              alt="Player"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}
    </div>
  );
};