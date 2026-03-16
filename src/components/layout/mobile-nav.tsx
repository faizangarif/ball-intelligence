'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  House,
  CircleDot,
  Trophy,
  Radio,
  MoreHorizontal,
  X,
  Target,
  BarChart3,
  Newspaper,
  Search,
  Heart,
  User,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const mainTabs = [
  { href: '/', label: 'Home', icon: House },
  { href: '/nba', label: 'NBA', icon: CircleDot },
  { href: '/nfl', label: 'NFL', icon: Trophy },
  { href: '/live', label: 'Live', icon: Radio, isLive: true },
];

const moreLinks = [
  { href: '/shot-iq', label: 'Shot IQ', icon: Target },
  { href: '/stats', label: 'Stats', icon: BarChart3 },
  { href: '/blog', label: 'Blog', icon: Newspaper },
  { href: '/discover', label: 'Discover', icon: Search },
  { href: '/favorites', label: 'Favorites', icon: Heart },
  { href: '/about', label: 'About', icon: User },
];

export function MobileNav() {
  const pathname = usePathname();
  const [showMore, setShowMore] = useState(false);

  const isMoreActive = moreLinks.some(
    (link) => pathname === link.href || pathname.startsWith(link.href + '/')
  );

  return (
    <>
      {/* More menu overlay */}
      {showMore && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={() => setShowMore(false)}
        />
      )}

      {/* More menu panel */}
      {showMore && (
        <div className="fixed bottom-16 left-0 right-0 z-50 md:hidden p-3 animate-slide-up">
          <div className="bg-surface border border-border rounded-2xl p-2 shadow-xl">
            <div className="flex items-center justify-between px-3 py-2 mb-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-textMuted">
                More
              </span>
              <button
                onClick={() => setShowMore(false)}
                className="p-1 text-textMuted hover:text-text"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-3 gap-1">
              {moreLinks.map((link) => {
                const Icon = link.icon;
                const isActive =
                  pathname === link.href || pathname.startsWith(link.href + '/');
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setShowMore(false)}
                    className={cn(
                      'flex flex-col items-center gap-1.5 rounded-xl px-3 py-3 transition-colors',
                      isActive
                        ? 'bg-accent/10 text-accent'
                        : 'text-textMuted hover:bg-surfaceLight hover:text-text'
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-[11px] font-medium">{link.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Bottom tab bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-surface/95 backdrop-blur border-t border-border">
        <div className="flex items-center justify-around h-16">
          {mainTabs.map((item) => {
            const isActive =
              item.href === '/'
                ? pathname === '/'
                : pathname === item.href || pathname.startsWith(item.href + '/');
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex flex-col items-center justify-center gap-1 w-full h-full transition-colors',
                  isActive ? 'text-accent' : 'text-textMuted'
                )}
              >
                <div className="relative">
                  <Icon className="w-5 h-5" />
                  {item.isLive && (
                    <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-live animate-pulse-live" />
                  )}
                </div>
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            );
          })}

          {/* More button */}
          <button
            onClick={() => setShowMore(!showMore)}
            className={cn(
              'flex flex-col items-center justify-center gap-1 w-full h-full transition-colors',
              showMore || isMoreActive ? 'text-accent' : 'text-textMuted'
            )}
          >
            <MoreHorizontal className="w-5 h-5" />
            <span className="text-[10px] font-medium">More</span>
          </button>
        </div>
      </nav>
    </>
  );
}
