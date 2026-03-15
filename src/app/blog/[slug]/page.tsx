import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowLeft, Clock, Calendar, User, Tag } from 'lucide-react';
import { getArticleBySlug, getRelatedArticles } from '@/lib/services/blog';
import { formatDate } from '@/lib/utils';
import { ArticleCard } from '@/components/blog/article-card';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return { title: 'Article Not Found | BALL INTELLIGENCE' };
  return {
    title: `${article.title} | BALL INTELLIGENCE Blog`,
    description: article.excerpt,
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const relatedArticles = await getRelatedArticles(article.slug, 3);

  // Convert markdown-style headers and paragraphs to basic HTML
  const contentHtml = article.content
    .split('\n')
    .map((line) => {
      const trimmed = line.trim();
      if (trimmed.startsWith('## ')) {
        return `<h2 class="mt-8 mb-4 text-2xl font-bold text-[#e5e5e5]">${trimmed.slice(3)}</h2>`;
      }
      if (trimmed.startsWith('### ')) {
        return `<h3 class="mt-6 mb-3 text-xl font-bold text-[#e5e5e5]">${trimmed.slice(4)}</h3>`;
      }
      if (trimmed.length === 0) return '';
      return `<p class="mb-4 leading-relaxed text-[#c5c5d0]">${trimmed}</p>`;
    })
    .join('\n');

  return (
    <main className="min-h-screen bg-[#0a0a0f] px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        {/* Back Link */}
        <Link
          href="/blog"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-[#8a8a9a] transition-colors hover:text-[#00a651]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Blog
        </Link>

        {/* Article Header */}
        <header className="mb-8">
          {/* Category Badge */}
          <span className="mb-4 inline-flex items-center rounded-full bg-[#00a651]/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#00a651]">
            {article.category}
          </span>

          {/* Title */}
          <h1 className="mb-5 text-3xl font-black leading-tight text-[#e5e5e5] md:text-4xl lg:text-5xl">
            {article.title}
          </h1>

          {/* Meta Row */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-[#8a8a9a]">
            <span className="flex items-center gap-1.5">
              <User className="h-4 w-4" />
              {article.authorName}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              {formatDate(article.publishedAt)}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              {article.readingTime} min read
            </span>
          </div>
        </header>

        {/* Cover Image Placeholder */}
        <div className="mb-10 overflow-hidden rounded-2xl border border-[#2a2a3a]">
          <div className="flex h-56 items-center justify-center bg-gradient-to-br from-[#00a651]/20 via-[#1a1a24] to-[#111118] md:h-72">
            <div className="text-center">
              <div className="mx-auto mb-2 h-16 w-16 rounded-full bg-[#00a651]/10" />
              <span className="text-xs text-[#8a8a9a]">Cover Image</span>
            </div>
          </div>
        </div>

        {/* Article Content */}
        <article
          className="mb-12"
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        />

        {/* Divider */}
        <div className="my-10 h-px bg-[#2a2a3a]" />

        {/* Tags */}
        {article.tags.length > 0 && (
          <div className="mb-12">
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-[#8a8a9a]">
              <Tag className="h-4 w-4" />
              Tags
            </div>
            <div className="flex flex-wrap gap-2">
              {article.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-[#2a2a3a] bg-[#111118] px-3 py-1 text-xs text-[#8a8a9a]"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <section>
            <h2 className="mb-6 text-xl font-bold text-[#e5e5e5]">Related Articles</h2>
            <div className="grid gap-6 md:grid-cols-2">
              {relatedArticles.map((related) => (
                <ArticleCard key={related.id} article={related} />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
