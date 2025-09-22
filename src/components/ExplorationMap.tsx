import React, { useEffect } from 'react';
import { GameMap } from '@/types/map';
import { MapTile } from './MapTile';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import playerSprite from '@/assets/player-character.png';

interface ExplorationMapProps {
  gameMap: GameMap;
  playerFacing: 'up' | 'down' | 'left' | 'right';
  onMove: (direction: 'up' | 'down' | 'left' | 'right') => void;
  onRandomEncounter: () => boolean;
  className?: string;
}

export const ExplorationMap: React.FC<ExplorationMapProps> = ({
  gameMap,
  playerFacing,
  onMove,
  onRandomEncounter,
  className,
}) => {
  // Handle keyboard movement
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          event.preventDefault();
          onMove('up');
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          event.preventDefault();
          onMove('down');
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          event.preventDefault();
          onMove('left');
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          event.preventDefault();
          onMove('right');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [onMove]);

  // Check for random encounters after movement
  useEffect(() => {
    const timer = setTimeout(() => {
      onRandomEncounter();
    }, 300); // Small delay after movement

    return () => clearTimeout(timer);
  }, [gameMap.playerPosition, onRandomEncounter]);

  return (
    <div className={cn("space-y-6", className)}>
      {/* Map Grid */}
      <div className="flex flex-col items-center">
        <div className="bg-gradient-card p-4 rounded-lg border border-border shadow-card">
          <div 
            className="grid gap-0 border-2 border-primary/30 rounded-lg overflow-hidden"
            style={{ 
              gridTemplateColumns: `repeat(${gameMap.width}, 1fr)`,
              gridTemplateRows: `repeat(${gameMap.height}, 1fr)`,
            }}
          >
            {gameMap.tiles.map((row, y) =>
              row.map((tile, x) => (
                <MapTile
                  key={`${x}-${y}`}
                  terrain={tile.terrain}
                  hasPlayer={gameMap.playerPosition.x === x && gameMap.playerPosition.y === y}
                  playerSprite={playerSprite}
                />
              ))
            )}
          </div>
        </div>
      </div>

      {/* Movement Controls */}
      <div className="flex flex-col items-center space-y-4">
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">🗺️ Exploração</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Use as setas ou WASD para se mover. Cuidado com a grama alta!
          </p>
        </div>

        {/* Movement Buttons */}
        <div className="grid grid-cols-3 gap-2">
          <div></div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onMove('up')}
            className="w-12 h-12 p-0"
          >
            ⬆️
          </Button>
          <div></div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => onMove('left')}
            className="w-12 h-12 p-0"
          >
            ⬅️
          </Button>
          
          <div className="w-12 h-12 flex items-center justify-center border border-border rounded bg-muted/20">
            <span className="text-sm">
              {playerFacing === 'up' && '👆'}
              {playerFacing === 'down' && '👇'}
              {playerFacing === 'left' && '👈'}
              {playerFacing === 'right' && '👉'}
            </span>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => onMove('right')}
            className="w-12 h-12 p-0"
          >
            ➡️
          </Button>
          
          <div></div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onMove('down')}
            className="w-12 h-12 p-0"
          >
            ⬇️
          </Button>
          <div></div>
        </div>

        {/* Legend */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
          <div className="flex items-center gap-1">
            <span>🌱</span>
            <span>Grama</span>
          </div>
          <div className="flex items-center gap-1">
            <span>🛤️</span>
            <span>Caminho</span>
          </div>
          <div className="flex items-center gap-1">
            <span>🌳</span>
            <span>Árvore</span>
          </div>
          <div className="flex items-center gap-1">
            <span>💧</span>
            <span>Água</span>
          </div>
          <div className="flex items-center gap-1">
            <span>🏠</span>
            <span>Edifício</span>
          </div>
        </div>
      </div>
    </div>
  );
};