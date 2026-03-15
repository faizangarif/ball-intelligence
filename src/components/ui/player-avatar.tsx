import { cn } from '@/lib/utils';
import { getPlayerInitials } from '@/lib/utils';

interface PlayerAvatarProps {
  name: string;
  size?: 'sm' | 'md' | 'lg';
  teamColor?: string;
  className?: string;
}

const sizeClasses = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-12 h-12 text-sm',
  lg: 'w-20 h-20 text-xl',
};

export function PlayerAvatar({ name, size = 'md', teamColor, className }: PlayerAvatarProps) {
  const initials = getPlayerInitials(name);

  return (
    <div
      className={cn(
        'rounded-full bg-surfaceLight flex items-center justify-center font-semibold text-textMuted border-2 shrink-0',
        sizeClasses[size],
        className
      )}
      style={{ borderColor: teamColor || '#2a2a3a' }}
    >
      {initials}
    </div>
  );
}
