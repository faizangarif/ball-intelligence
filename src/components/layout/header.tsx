'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, Heart, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SearchModal } from './search-modal';
import { LiveIndicator } from '@/components/ui/live-indicator';

const navLinks = [
  { href: '/nba', label: 'NBA' },
  { href: '/nfl', label: 'NFL' },
  { href: '/live', label: 'Live', isLive: true },
  { href: '/shot-iq', label: 'Shot IQ' },
  { href: '/stats', label: 'Stats' },
  { href: '/blog', label: 'Blog' },
];

export function Header() {
  const pathname = usePathname();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="fixed top-0 z-50 w-full glass border-b border-border">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-0.5 text-xl font-bold">
            <span className="text-text">BALL</span>
            <span className="text-accent">INTELLIGENCE</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'px-3 py-2 text-sm rounded-lg transition-colors',
                  pathname === link.href || pathname.startsWith(link.href + '/')
                    ? 'text-accent'
                    : 'text-textMuted hover:text-text'
                )}
              >
                <span className="flex items-center gap-1.5">
                  {link.label}
                  {link.isLive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-live animate-pulse-live" />
                  )}
                </span>
              </Link>
            ))}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2 text-textMuted hover:text-text transition-colors rounded-lg hover:bg-surfaceLight"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>
            <Link
              href="/favorites"
              className="p-2 text-textMuted hover:text-text transition-colors rounded-lg hover:bg-surfaceLight hidden md:flex"
              aria-label="Favorites"
            >
              <Heart className="w-5 h-5" />
            </Link>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-textMuted hover:text-text transition-colors rounded-lg hover:bg-surfaceLight md:hidden"
              aria-label="Menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-surface">
            <nav className="flex flex-col p-4 gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    'px-3 py-2.5 text-sm rounded-lg transition-colors',
                    pathname === link.href || pathname.startsWith(link.href + '/')
                      ? 'text-accent bg-accent/10'
                      : 'text-textMuted hover:text-text hover:bg-surfaceLight'
                  )}
                >
                  <span className="flex items-center gap-2">
                    {link.label}
                    {link.isLive && <LiveIndicator />}
                  </span>
                </Link>
              ))}
              <Link
                href="/favorites"
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-3 py-2.5 text-sm text-textMuted hover:text-text hover:bg-surfaceLight rounded-lg transition-colors flex items-center gap-2"
              >
                <Heart className="w-4 h-4" />
                Favorites
              </Link>
            </nav>
          </div>
        )}
      </header>

      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
