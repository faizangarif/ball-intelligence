import { cn } from '@/lib/utils';

interface CardProps {
  className?: string;
  children: React.ReactNode;
  hover?: boolean;
  glow?: boolean;
}

export function Card({ className, children, hover, glow }: CardProps) {
  return (
    <div
      className={cn(
        'bg-surface border border-border rounded-xl p-5 transition-all duration-300',
        hover && 'hover:border-accent/30 hover:scale-[1.01] cursor-pointer',
        glow && 'glow-accent',
        className
      )}
    >
      {children}
    </div>
  );
}
