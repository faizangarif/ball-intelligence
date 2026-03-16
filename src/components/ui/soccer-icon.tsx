import { cn } from '@/lib/utils';

export function SoccerIcon({ className }: { className?: string }) {
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
      <path d="M12 2l2.5 4.5h5L16 10l1.5 5h-5L12 18.5 11.5 15h-5L8 10 4.5 6.5h5L12 2z" />
    </svg>
  );
}
