'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Clock, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDate } from '@/lib/utils';
import type { Article } from '@/lib/types';

interface ArticleCardProps {
  article: Article;
}

export function ArticleCard({ article }: ArticleCardProps) {
  return (
    <Link href={`/blog/${article.slug}`}>
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -4 }}
        transition={{ duration: 0.3 }}
        className={cn(
          'group relative flex flex-col rounded-xl border border-[#2a2a3a] bg-[#111118] p-5',
          'transition-colors duration-300 hover:border-[#00a651]/50'
        )}
      >
        {/* Category Badge */}
        <span className="mb-3 inline-flex w-fit items-center rounded-full bg-[#00a651]/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#00a651]">
          {article.category}
        </span>

        {/* Title */}
        <h3 className="mb-2 text-lg font-bold text-[#e5e5e5] transition-colors group-hover:text-[#00a651]">
          {article.title}
        </h3>

        {/* Excerpt */}
        <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-[#8a8a9a]">
          {article.excerpt}
        </p>

        {/* Meta */}
        <div className="mt-auto flex items-center gap-4 text-xs text-[#8a8a9a]">
          <span className="font-medium text-[#e5e5e5]/70">{article.authorName}</span>
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {formatDate(article.publishedAt)}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {article.readingTime} min
          </span>
        </div>
      </motion.article>
    </Link>
  );
}
