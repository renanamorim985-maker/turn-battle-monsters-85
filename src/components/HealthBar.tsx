import React from 'react';
import { cn } from '@/lib/utils';

interface HealthBarProps {
  current: number;
  max: number;
  type: 'health' | 'energy';
  size?: 'sm' | 'md';
  className?: string;
}

export const HealthBar: React.FC<HealthBarProps> = ({ 
  current, 
  max, 
  type, 
  size = 'md',
  className 
}) => {
  const percentage = Math.max(0, (current / max) * 100);
  const isLow = percentage < 25;
  const isMedium = percentage < 50;
  
  const barHeight = size === 'sm' ? 'h-2' : 'h-3';
  const textSize = size === 'sm' ? 'text-xs' : 'text-sm';
  
  return (
    <div className={cn("w-full", className)}>
      <div className={cn("flex justify-between mb-1", textSize)}>
        <span className="font-medium">
          {type === 'health' ? '❤️ HP' : '⚡ Energia'}
        </span>
        <span className="font-mono">
          {current}/{max}
        </span>
      </div>
      <div className={cn("w-full bg-muted rounded-full overflow-hidden shadow-inner", barHeight)}>
        <div
          className={cn(
            "h-full transition-all duration-500 ease-out",
            type === 'health' 
              ? isLow 
                ? "bg-destructive animate-health-pulse" 
                : isMedium 
                  ? "bg-accent" 
                  : "bg-gradient-health"
              : "bg-gradient-energy",
            "shadow-inner"
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};