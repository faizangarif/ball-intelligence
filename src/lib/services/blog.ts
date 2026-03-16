import { getCached } from '@/lib/services/cache';
import { mockArticles } from '@/lib/data/mock/articles';
import type { Article } from '@/lib/types';

function getAllArticles(): Article[] {
  const cached = getCached<Article[]>('sports-news');
  const webArticles = cached && cached.length > 0 ? cached : [];
  const slugs = new Set(webArticles.map((a) => a.slug));
  const combined = [
    ...webArticles,
    ...mockArticles.filter((a) => a.published && !slugs.has(a.slug)),
  ];
  return combined.sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

export async function getArticles(category?: string): Promise<Article[]> {
  let results = getAllArticles();
  if (category) results = results.filter((a) => a.category === category);
  return results;
}

export async function getArticle(slug: string): Promise<Article | null> {
  return getAllArticles().find((a) => a.slug === slug) ?? null;
}

export const getArticleBySlug = getArticle;

export async function getFeaturedArticles(): Promise<Article[]> {
  return getAllArticles().filter((a) => a.featured);
}

export async function getFeaturedArticle(): Promise<Article | null> {
  return getAllArticles().find((a) => a.featured) ?? getAllArticles()[0] ?? null;
}

export async function getRelatedArticles(slug: string, limit = 3): Promise<Article[]> {
  const current = getAllArticles().find((a) => a.slug === slug);
  if (!current) return [];
  return getAllArticles()
    .filter((a) => a.slug !== slug && (a.category === current.category || a.tags.some((t) => current.tags.includes(t))))
    .slice(0, limit);
}

export async function getCategories(): Promise<string[]> {
  return Array.from(new Set(getAllArticles().map((a) => a.category))).sort();
}
