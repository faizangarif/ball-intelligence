import Link from 'next/link';
import { cn } from '@/lib/utils';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  href?: string;
  action?: React.ReactNode;
  className?: string;
}

export function SectionHeader({ title, subtitle, href, action, className }: SectionHeaderProps) {
  return (
    <div className={cn('flex items-end justify-between gap-4 mb-6', className)}>
      <div>
        <h2 className="text-2xl font-bold text-text">{title}</h2>
        {subtitle && <p className="text-textMuted text-sm mt-1">{subtitle}</p>}
      </div>
      {href && (
        <Link
          href={href}
          className="text-sm text-accent hover:text-accent-light transition-colors whitespace-nowrap"
        >
          View All &rarr;
        </Link>
      )}
      {action && !href && action}
    </div>
  );
}
