import React from 'react';
import { Character } from '@/types/game';
import { HealthBar } from './HealthBar';
import { cn } from '@/lib/utils';

interface CharacterCardProps {
  character: Character;
  isPlayer: boolean;
  isCurrentTurn: boolean;
  className?: string;
}

export const CharacterCard: React.FC<CharacterCardProps> = ({ 
  character, 
  isPlayer, 
  isCurrentTurn,
  className 
}) => {
  return (
    <div 
      className={cn(
        "bg-gradient-card rounded-lg p-6 shadow-card border border-border",
        "transition-all duration-300",
        isCurrentTurn && "shadow-glow animate-pulse-glow",
        className
      )}
    >
      <div className={cn(
        "flex items-center gap-4",
        !isPlayer && "flex-row-reverse"
      )}>
        {/* Character Sprite */}
        <div className="relative">
          <div className={cn(
            "w-20 h-20 rounded-full overflow-hidden border-2",
            "transition-all duration-300",
            isCurrentTurn ? "border-primary shadow-glow" : "border-border"
          )}>
            <img 
              src={character.sprite} 
              alt={character.name}
              className="w-full h-full object-cover"
            />
          </div>
          {character.isDefending && (
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-defense rounded-full flex items-center justify-center border border-background">
              <span className="text-xs">🛡️</span>
            </div>
          )}
        </div>

        {/* Character Info */}
        <div className={cn("flex-1", !isPlayer && "text-right")}>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-bold text-lg text-foreground">{character.name}</h3>
            <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
              Lvl {character.level}
            </span>
          </div>
          
          <div className="space-y-2">
            <HealthBar 
              current={character.hp} 
              max={character.maxHp} 
              type="health"
            />
            <HealthBar 
              current={character.energy} 
              max={character.maxEnergy} 
              type="energy"
            />
          </div>

          {/* Stats */}
          <div className={cn(
            "flex gap-4 mt-3 text-xs",
            !isPlayer && "justify-end"
          )}>
            <div className="flex items-center gap-1">
              <span>⚔️</span>
              <span>{character.attack}</span>
            </div>
            <div className="flex items-center gap-1">
              <span>🛡️</span>
              <span>{character.defense}</span>
            </div>
            <div className="flex items-center gap-1">
              <span>💨</span>
              <span>{character.speed}</span>
            </div>
            <div className="flex items-center gap-1">
              <span>✨</span>
              <span>{character.specialUses}/{character.maxSpecialUses}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};