import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface GameOverModalProps {
  isOpen: boolean;
  winner: 'player' | 'enemy' | 'captured' | null;
  onRestart: () => void;
  experienceGained?: number;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({ 
  isOpen, 
  winner, 
  onRestart,
  experienceGained = 0 
}) => {
  if (!isOpen) return null;

  const getTitle = () => {
    if (winner === 'player') return '🎉 Vitória!';
    if (winner === 'enemy') return '💀 Derrota...';
    if (winner === 'captured') return '⚽ Captura!';
    return '🏃 Fuga!';
  };

  const getMessage = () => {
    if (winner === 'player') return `Parabéns! Você derrotou o inimigo e ganhou ${experienceGained} XP!`;
    if (winner === 'enemy') return 'Você foi derrotado... Tente novamente!';
    if (winner === 'captured') return 'Parabéns! Você capturou um novo monstro para sua equipe!';
    return 'Você fugiu da batalha. Às vezes é melhor ser cauteloso!';
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className={cn(
        "bg-gradient-card rounded-lg p-8 border border-border shadow-battle",
        "max-w-md w-full text-center animate-bounce-in"
      )}>
        <h2 className="text-3xl font-bold mb-4">{getTitle()}</h2>
        <p className="text-muted-foreground mb-6 leading-relaxed">
          {getMessage()}
        </p>
        
        {(winner === 'player' || winner === 'captured') && experienceGained > 0 && (
          <div className="mb-6 p-4 bg-accent/10 rounded-lg border border-accent/20">
            <div className="flex items-center justify-center gap-2 text-accent font-semibold">
              <span>⭐</span>
              <span>+{experienceGained} XP</span>
              <span>⭐</span>
            </div>
          </div>
        )}

        <Button 
          onClick={onRestart}
          size="lg"
          className="w-full bg-gradient-primary hover:scale-105 transition-transform"
        >
          {winner === 'player' ? '🔄 Nova Batalha' : winner === 'captured' ? '🔄 Nova Aventura' : '🔄 Tentar Novamente'}
        </Button>
      </div>
    </div>
  );
};