export const revalidate = 60;

import { PenLine } from 'lucide-react';
import { getArticles, getFeaturedArticle } from '@/lib/services/blog';
import { ArticleCard } from '@/components/blog/article-card';
import { FeaturedArticle } from '@/components/blog/featured-article';

export const metadata = {
  title: 'Blog | BALL INTELLIGENCE',
  description: 'Expert sports analysis, recaps, previews, and features from BALL INTELLIGENCE.',
};

const categories = [
  { value: '', label: 'All' },
  { value: 'analysis', label: 'Analysis' },
  { value: 'recap', label: 'Recaps' },
  { value: 'preview', label: 'Previews' },
  { value: 'feature', label: 'Features' },
  { value: 'stats', label: 'Stats' },
  { value: 'draft', label: 'Draft' },
  { value: 'opinion', label: 'Opinion' },
];

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const params = await searchParams;
  const activeCategory = params.category ?? '';
  const [articles, featuredArticle] = await Promise.all([
    getArticles(activeCategory || undefined),
    getFeaturedArticle(),
  ]);

  const nonFeaturedArticles = activeCategory
    ? articles
    : articles.filter((a) => !a.featured);

  return (
    <main className="min-h-screen bg-[#0a0a0f] px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="mb-4 inline-flex items-center gap-3 rounded-full border border-[#2a2a3a] bg-[#111118] px-5 py-2">
            <PenLine className="h-5 w-5 text-[#00a651]" />
            <span className="text-sm font-semibold uppercase tracking-widest text-[#8a8a9a]">
              Ball Intelligence Blog
            </span>
          </div>
          <h1 className="mb-3 text-4xl font-black tracking-tight text-[#e5e5e5] md:text-5xl">
            BALL INTELLIGENCE <span className="text-[#00a651]">BLOG</span>
          </h1>
          <p className="mx-auto max-w-lg text-base text-[#8a8a9a]">
            Expert analysis, deep dives, and stories from the world of sports.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="mb-10 flex flex-wrap justify-center gap-2">
          {categories.map((cat) => (
            <a
              key={cat.value}
              href={cat.value ? `/blog?category=${cat.value}` : '/blog'}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${
                activeCategory === cat.value
                  ? 'bg-[#00a651] text-white'
                  : 'border border-[#2a2a3a] bg-[#111118] text-[#8a8a9a] hover:border-[#00a651]/30 hover:text-[#e5e5e5]'
              }`}
            >
              {cat.label}
            </a>
          ))}
        </div>

        {/* Featured Article */}
        {!activeCategory && featuredArticle && (
          <div className="mb-12">
            <FeaturedArticle article={featuredArticle} />
          </div>
        )}

        {/* Articles Grid */}
        {nonFeaturedArticles.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2">
            {nonFeaturedArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        ) : (
          <div className="py-16 text-center">
            <p className="text-lg text-[#8a8a9a]">No articles found in this category.</p>
          </div>
        )}
      </div>
    </main>
  );
}
