import Link from 'next/link';
import { SectionHeader } from '@/components/ui/section-header';
import { Badge } from '@/components/ui/badge';
import { Clock, ArrowRight } from 'lucide-react';
import type { Article } from '@/lib/types';

interface BlogPreviewProps {
  articles: Article[];
}

export function BlogPreview({ articles }: BlogPreviewProps) {
  if (articles.length === 0) return null;

  const [featured, ...rest] = articles;
  const sideArticles = rest.slice(0, 2);

  return (
    <section>
      <SectionHeader title="Latest from the Blog" href="/blog" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Featured article */}
        <Link
          href={`/blog/${featured.slug}`}
          className="lg:col-span-2 group"
        >
          <div className="bg-surface border border-border rounded-xl p-6 h-full hover:border-accent/20 transition-all">
            <div className="flex items-center gap-2 mb-3">
              <Badge>{featured.category}</Badge>
              <span className="flex items-center gap-1 text-xs text-textMuted">
                <Clock className="w-3 h-3" />
                {featured.readingTime} min read
              </span>
            </div>

            <h3 className="text-xl font-bold text-text mb-3 group-hover:text-accent transition-colors">
              {featured.title}
            </h3>

            <p className="text-textMuted text-sm leading-relaxed line-clamp-2 mb-4">
              {featured.excerpt}
            </p>

            <span className="inline-flex items-center gap-1 text-sm text-accent font-semibold group-hover:gap-2 transition-all">
              Read <ArrowRight className="w-4 h-4" />
            </span>
          </div>
        </Link>

        {/* Side articles */}
        <div className="flex flex-col gap-4">
          {sideArticles.map((article) => (
            <Link key={article.id} href={`/blog/${article.slug}`} className="group flex-1">
              <div className="bg-surface border border-border rounded-xl p-5 h-full hover:border-accent/20 transition-all">
                <div className="flex items-center gap-2 mb-2">
                  <Badge>{article.category}</Badge>
                  <span className="flex items-center gap-1 text-xs text-textMuted">
                    <Clock className="w-3 h-3" />
                    {article.readingTime} min
                  </span>
                </div>

                <h4 className="text-sm font-bold text-text group-hover:text-accent transition-colors line-clamp-2">
                  {article.title}
                </h4>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
