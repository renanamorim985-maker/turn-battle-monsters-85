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
      {/* Map Grid - Pokémon Style */}
      <div className="flex flex-col items-center">
        <div className="bg-card p-4 border-4 border-primary shadow-battle">
          {/* Game Boy Screen Effect */}
          <div className="bg-background p-1 border-2 border-border">
            <div 
              className="grid gap-0 border-2 border-primary"
              style={{ 
                gridTemplateColumns: `repeat(${gameMap.width}, 1fr)`,
                gridTemplateRows: `repeat(${gameMap.height}, 1fr)`,
                imageRendering: 'pixelated',
                maxWidth: '480px',
                maxHeight: '480px',
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
      </div>

      {/* Movement Controls */}
      <div className="flex flex-col items-center space-y-6">
        <div className="text-center bg-card p-4 border-2 border-primary shadow-card">
          <h3 className="text-xl font-bold mb-2 text-primary">🗺️ EXPLORAÇÃO</h3>
          <p className="text-sm text-foreground">
            Use as setas ou WASD para se mover. Cuidado com a grama alta!
          </p>
        </div>

        {/* Game Boy Style D-Pad */}
        <div className="bg-card p-4 border-2 border-primary shadow-card">
          <div className="grid grid-cols-3 gap-1">
            <div></div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onMove('up')}
              className="w-14 h-14 p-0 border-2 border-primary shadow-[2px_2px_0px_hsl(var(--primary))] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all font-bold text-lg"
            >
              ▲
            </Button>
            <div></div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => onMove('left')}
              className="w-14 h-14 p-0 border-2 border-primary shadow-[2px_2px_0px_hsl(var(--primary))] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all font-bold text-lg"
            >
              ◀
            </Button>
            
            <div className="w-14 h-14 flex items-center justify-center border-2 border-primary bg-primary/20">
              <span className="text-xl font-bold text-primary">
                {playerFacing === 'up' && '↑'}
                {playerFacing === 'down' && '↓'}
                {playerFacing === 'left' && '←'}
                {playerFacing === 'right' && '→'}
              </span>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => onMove('right')}
              className="w-14 h-14 p-0 border-2 border-primary shadow-[2px_2px_0px_hsl(var(--primary))] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all font-bold text-lg"
            >
              ▶
            </Button>
            
            <div></div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onMove('down')}
              className="w-14 h-14 p-0 border-2 border-primary shadow-[2px_2px_0px_hsl(var(--primary))] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all font-bold text-lg"
            >
              ▼
            </Button>
            <div></div>
          </div>
        </div>

        {/* Legend - Pokémon Style */}
        <div className="bg-card p-4 border-2 border-primary shadow-card">
          <h4 className="text-sm font-bold text-primary mb-3 text-center">🗺️ MAPA DA CIDADE</h4>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 text-xs font-semibold">
            <div className="flex items-center gap-1">
              <span className="text-sm">🌱</span>
              <span>Grama</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-sm">🌿</span>
              <span>Grama Alta</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-sm">🛤️</span>
              <span>Estrada</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-sm">🌳</span>
              <span>Árvore</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-sm">💧</span>
              <span>Água</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-sm">🏠</span>
              <span>Prédio</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-sm">🧱</span>
              <span>Cerca</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-sm">🌸</span>
              <span>Flores</span>
            </div>
          </div>
          <div className="mt-2 text-center text-xs text-muted-foreground">
            <p>🎯 Grama Alta = Mais Pokémon Selvagens!</p>
          </div>
        </div>
      </div>
    </div>
  );
};