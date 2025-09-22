import React from 'react';
import { Button } from '@/components/ui/button';
import { BattleAction } from '@/types/game';
import { cn } from '@/lib/utils';

interface ActionMenuProps {
  onAction: (action: BattleAction) => void;
  disabled: boolean;
  playerEnergy: number;
  specialUses: number;
  captureItems: number;
  enemyHpPercentage: number;
  className?: string;
}

export const ActionMenu: React.FC<ActionMenuProps> = ({ 
  onAction, 
  disabled, 
  playerEnergy,
  specialUses,
  captureItems,
  enemyHpPercentage,
  className 
}) => {
  const actions = [
    {
      type: 'attack' as const,
      label: 'Atacar',
      icon: '⚔️',
      description: 'Golpe básico (10 energia)',
      energyCost: 10,
      variant: 'default' as const,
    },
    {
      type: 'defend' as const,
      label: 'Defender',
      icon: '🛡️',
      description: 'Reduz dano e recupera energia',
      energyCost: 0,
      variant: 'secondary' as const,
    },
    {
      type: 'special' as const,
      label: 'Especial',
      icon: '✨',
      description: 'Golpe poderoso (15 energia)',
      energyCost: 15,
      variant: 'destructive' as const,
    },
    {
      type: 'capture' as const,
      label: 'Capturar',
      icon: '⚽',
      description: 'Tentar capturar o monstro',
      energyCost: 0,
      variant: 'secondary' as const,
    },
    {
      type: 'flee' as const,
      label: 'Fugir',
      icon: '🏃',
      description: 'Tentar escapar da batalha',
      energyCost: 0,
      variant: 'outline' as const,
    },
  ];

  return (
    <div className={cn("space-y-3", className)}>
      <h3 className="text-lg font-semibold text-center mb-2">Escolha sua ação:</h3>
      <div className="text-center mb-4 text-sm text-muted-foreground">
        Pokéballs: {captureItems} | Taxa de captura: ~{Math.max(10, Math.min(90, Math.floor((100 - enemyHpPercentage) + 20)))}%
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {actions.map((action) => {
          const canUse = !disabled && 
                        playerEnergy >= action.energyCost && 
                        (action.type !== 'special' || specialUses > 0) &&
                        (action.type !== 'capture' || captureItems > 0);
          
          return (
            <Button
              key={action.type}
              variant={action.variant}
              onClick={() => onAction({ type: action.type })}
              disabled={!canUse}
              className={cn(
                "h-auto p-4 flex flex-col items-center gap-2",
                "transition-all duration-200 hover:scale-105",
                "animate-slide-in"
              )}
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">{action.icon}</span>
                <span className="font-semibold">{action.label}</span>
              </div>
              <span className="text-xs opacity-75 text-center">
                {action.description}
              </span>
              {!canUse && (
                <span className="text-xs text-destructive">
                  {action.type === 'capture' && captureItems <= 0 ? 'Sem Pokéballs' :
                   playerEnergy < action.energyCost ? 'Energia insuficiente' : 
                   'Sem usos restantes'}
                </span>
              )}
            </Button>
          );
        })}
      </div>
    </div>
  );
};