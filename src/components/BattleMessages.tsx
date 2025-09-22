import React, { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface BattleMessagesProps {
  messages: string[];
  className?: string;
}

export const BattleMessages: React.FC<BattleMessagesProps> = ({ messages, className }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className={cn(
      "bg-gradient-card rounded-lg p-4 border border-border",
      "h-32 overflow-y-auto",
      className
    )}>
      <h4 className="font-semibold mb-2 text-accent">📜 Log da Batalha</h4>
      <div className="space-y-1 text-sm">
        {messages.map((message, index) => (
          <div 
            key={index}
            className={cn(
              "animate-fade-in opacity-90",
              index === messages.length - 1 && "font-medium text-foreground"
            )}
          >
            {message}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};