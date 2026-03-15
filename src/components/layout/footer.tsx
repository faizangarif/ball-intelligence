import Link from 'next/link';

const quickLinks = [
  { href: '/nba', label: 'NBA' },
  { href: '/nfl', label: 'NFL' },
  { href: '/live', label: 'Live Games' },
  { href: '/shot-iq', label: 'Shot IQ' },
  { href: '/blog', label: 'Blog' },
  { href: '/about', label: 'About' },
];

export function Footer() {
  return (
    <footer className="hidden md:block py-12 border-t border-border bg-surface">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-0.5 text-xl font-bold mb-2">
              <span className="text-text">BALL</span>
              <span className="text-accent">INTELLIGENCE</span>
            </div>
            <p className="text-textMuted text-sm">Gain Ball Knowledge</p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-text uppercase tracking-wide mb-3">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-textMuted hover:text-text transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Credits */}
          <div>
            <h3 className="text-sm font-semibold text-text uppercase tracking-wide mb-3">
              About
            </h3>
            <p className="text-sm text-textMuted">
              Built by <span className="text-text">Ayaan Arif</span>
            </p>
            <p className="text-sm text-textMuted mt-4">
              &copy; 2025 Ball Intelligence. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
