import { cn } from '@/lib/utils';

interface IconProps {
  className?: string;
}

export function BasketballIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn('w-5 h-5', className)}
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20" />
      <path d="M12 2v20" />
      <path d="M5.2 5.2c2.6 2 4.2 5.2 4.2 6.8s-1.6 4.8-4.2 6.8" />
      <path d="M18.8 5.2c-2.6 2-4.2 5.2-4.2 6.8s1.6 4.8 4.2 6.8" />
    </svg>
  );
}

export function FootballIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn('w-5 h-5', className)}
    >
      <ellipse cx="12" cy="12" rx="10" ry="6.5" transform="rotate(-45 12 12)" />
      <path d="M7.5 7.5l9 9" />
      <path d="M10 9l-1.5-1.5" />
      <path d="M12 11l-1.5-1.5" />
      <path d="M14 13l-1.5-1.5" />
      <path d="M15 14l1.5 1.5" />
    </svg>
  );
}
