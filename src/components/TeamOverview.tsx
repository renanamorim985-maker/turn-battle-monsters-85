import React from 'react';
import { Character } from '@/types/game';
import { Card } from '@/components/ui/card';
import { HealthBar } from './HealthBar';
import { cn } from '@/lib/utils';

interface TeamOverviewProps {
  team: Character[];
  className?: string;
}

export const TeamOverview: React.FC<TeamOverviewProps> = ({ team, className }) => {
  if (team.length === 0) {
    return (
      <Card className={cn("p-4 text-center", className)}>
        <p className="text-muted-foreground">Nenhum monstro capturado ainda</p>
        <p className="text-xs text-muted-foreground mt-1">
          Capture monstros durante as batalhas!
        </p>
      </Card>
    );
  }

  return (
    <div className={cn("space-y-3", className)}>
      <h3 className="text-lg font-semibold text-center">👥 Sua Equipe ({team.length}/6)</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {team.map((monster, index) => (
          <Card key={monster.id} className="p-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full overflow-hidden border border-border">
                <img 
                  src={monster.sprite} 
                  alt={monster.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium text-sm truncate">{monster.name}</h4>
                  <span className="text-xs bg-muted px-1 py-0.5 rounded">
                    Lvl {monster.level}
                  </span>
                </div>
                <div className="space-y-1">
                  <HealthBar 
                    current={monster.hp} 
                    max={monster.maxHp} 
                    type="health"
                    size="sm"
                  />
                  <HealthBar 
                    current={monster.energy} 
                    max={monster.maxEnergy} 
                    type="energy"
                    size="sm"
                  />
                </div>
                <div className="flex gap-2 mt-1 text-xs text-muted-foreground">
                  <span>⚔️{monster.attack}</span>
                  <span>🛡️{monster.defense}</span>
                  <span>💨{monster.speed}</span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};