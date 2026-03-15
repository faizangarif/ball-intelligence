'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Clock, ArrowRight, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDate } from '@/lib/utils';
import type { Article } from '@/lib/types';

interface FeaturedArticleProps {
  article: Article;
}

export function FeaturedArticle({ article }: FeaturedArticleProps) {
  return (
    <Link href={`/blog/${article.slug}`}>
      <motion.article
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={cn(
          'group relative overflow-hidden rounded-2xl border border-[#2a2a3a] bg-[#111118]',
          'transition-colors duration-300 hover:border-[#00a651]/50'
        )}
      >
        {/* Cover Image Placeholder */}
        <div className="relative h-64 w-full overflow-hidden bg-gradient-to-br from-[#00a651]/20 via-[#1a1a24] to-[#111118] md:h-80">
          <div className="absolute inset-0 bg-gradient-to-t from-[#111118] via-[#111118]/60 to-transparent" />

          {/* Featured Badge */}
          <div className="absolute left-5 top-5 rounded-full bg-[#00a651] px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white">
            Featured
          </div>

          {/* Decorative Elements */}
          <div className="absolute right-8 top-8 h-32 w-32 rounded-full bg-[#00a651]/10 blur-3xl" />
          <div className="absolute bottom-12 left-12 h-24 w-24 rounded-full bg-[#00a651]/5 blur-2xl" />
        </div>

        {/* Content */}
        <div className="relative -mt-16 px-6 pb-6 md:px-8 md:pb-8">
          {/* Category */}
          <span className="mb-3 inline-flex items-center rounded-full bg-[#00a651]/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#00a651]">
            {article.category}
          </span>

          {/* Title */}
          <h2 className="mb-3 text-2xl font-bold leading-tight text-[#e5e5e5] transition-colors group-hover:text-[#00a651] md:text-3xl">
            {article.title}
          </h2>

          {/* Excerpt */}
          <p className="mb-5 max-w-2xl text-base leading-relaxed text-[#8a8a9a]">
            {article.excerpt}
          </p>

          {/* Meta + CTA */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4 text-sm text-[#8a8a9a]">
              <span className="flex items-center gap-1.5">
                <User className="h-4 w-4" />
                {article.authorName}
              </span>
              <span>{formatDate(article.publishedAt)}</span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {article.readingTime} min read
              </span>
            </div>

            <span className="inline-flex items-center gap-2 text-sm font-semibold text-[#00a651] transition-transform group-hover:translate-x-1">
              Read Article
              <ArrowRight className="h-4 w-4" />
            </span>
          </div>
        </div>
      </motion.article>
    </Link>
  );
}
