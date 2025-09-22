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
    case 'tall_grass':
      return 'bg-terrain-tall-grass';
    case 'path':
      return 'bg-terrain-path';
    case 'tree':
      return 'bg-terrain-tree';
    case 'water':
      return 'bg-terrain-water';
    case 'building':
      return 'bg-terrain-building';
    case 'fence':
      return 'bg-terrain-fence';
    case 'flower':
      return 'bg-terrain-flower';
    case 'sand':
      return 'bg-terrain-sand';
    default:
      return 'bg-terrain-grass';
  }
};

const getTerrainEmoji = (terrain: TerrainType): string => {
  switch (terrain) {
    case 'grass':
      return '🌱';
    case 'tall_grass':
      return '🌿';
    case 'path':
      return '🛤️';
    case 'tree':
      return '🌳';
    case 'water':
      return '💧';
    case 'building':
      return '🏠';
    case 'fence':
      return '🧱';
    case 'flower':
      return '🌸';
    case 'sand':
      return '🏖️';
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
        "relative w-6 h-6 border border-border/40 transition-none",
        getTerrainColor(terrain),
        hasPlayer && "ring-1 ring-accent animate-retro-blink",
        className
      )}
      style={{
        imageRendering: 'pixelated',
      }}
    >
      {/* Terrain indicator */}
      <div className="absolute inset-0 flex items-center justify-center text-xs pointer-events-none">
        <span style={{ fontSize: '10px' }}>
          {getTerrainEmoji(terrain)}
        </span>
      </div>

      {/* Player sprite */}
      {hasPlayer && playerSprite && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="w-5 h-5 border border-accent bg-accent/30 overflow-hidden">
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