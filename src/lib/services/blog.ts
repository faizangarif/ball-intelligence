import { fetchLatestSportsNews } from '@/lib/services/web-data';
import { mockArticles } from '@/lib/data/mock/articles';
import type { Article } from '@/lib/types';

async function getAllArticles(): Promise<Article[]> {
  try {
    const webNews = await fetchLatestSportsNews();
    // Combine web news with mock articles (which have good evergreen content)
    const combined = [...webNews, ...mockArticles.filter((a) => a.published)];
    // Deduplicate by slug
    const seen = new Set<string>();
    const unique: Article[] = [];
    for (const article of combined) {
      if (!seen.has(article.slug)) {
        seen.add(article.slug);
        unique.push(article);
      }
    }
    if (unique.length === 0) return mockArticles.filter((a) => a.published);
    return unique;
  } catch {
    return mockArticles.filter((a) => a.published);
  }
}

export async function getArticles(category?: string): Promise<Article[]> {
  try {
    let results = await getAllArticles();
    if (category) {
      results = results.filter((a) => a.category === category);
    }
    return results.sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
    );
  } catch {
    let results = mockArticles.filter((a) => a.published);
    if (category) {
      results = results.filter((a) => a.category === category);
    }
    return results.sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
    );
  }
}

export async function getArticle(slug: string): Promise<Article | null> {
  try {
    const articles = await getAllArticles();
    return articles.find((a) => a.slug === slug) ?? null;
  } catch {
    return mockArticles.find((a) => a.slug === slug && a.published) ?? null;
  }
}

export const getArticleBySlug = getArticle;

export async function getFeaturedArticles(): Promise<Article[]> {
  try {
    const articles = await getAllArticles();
    return articles.filter((a) => a.featured);
  } catch {
    return mockArticles.filter((a) => a.featured && a.published);
  }
}

export async function getFeaturedArticle(): Promise<Article | null> {
  try {
    const articles = await getAllArticles();
    return articles.find((a) => a.featured) ?? articles[0] ?? null;
  } catch {
    return mockArticles.find((a) => a.featured && a.published) ?? mockArticles[0] ?? null;
  }
}

export async function getRelatedArticles(
  slug: string,
  limit: number = 3,
): Promise<Article[]> {
  try {
    const articles = await getAllArticles();
    const current = articles.find((a) => a.slug === slug);
    if (!current) return [];

    return articles
      .filter(
        (a) =>
          a.slug !== slug &&
          (a.category === current.category ||
            a.tags.some((t) => current.tags.includes(t))),
      )
      .slice(0, limit);
  } catch {
    const current = mockArticles.find((a) => a.slug === slug);
    if (!current) return [];

    return mockArticles
      .filter(
        (a) =>
          a.slug !== slug &&
          a.published &&
          (a.category === current.category ||
            a.tags.some((t) => current.tags.includes(t))),
      )
      .slice(0, limit);
  }
}

export async function getCategories(): Promise<string[]> {
  try {
    const articles = await getAllArticles();
    const categories = new Set<string>();
    for (const article of articles) {
      categories.add(article.category);
    }
    return Array.from(categories).sort();
  } catch {
    const categories = new Set<string>();
    for (const article of mockArticles) {
      if (article.published) {
        categories.add(article.category);
      }
    }
    return Array.from(categories).sort();
  }
}
