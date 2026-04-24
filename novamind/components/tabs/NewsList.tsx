'use client';

import type { NewsResult } from '@/types/search';
import { formatTimeAgo } from '@/lib/utils';
import { Newspaper } from 'lucide-react';

interface NewsListProps {
  news: NewsResult[];
}

export default function NewsList({ news }: NewsListProps) {
  if (!news.length) {
    return <div className="py-12 text-center text-zinc-500">No news found.</div>;
  }

  return (
    <div className="space-y-6" id="news-list">
      {news.map(item => (
        <a
          key={item.id}
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group block"
        >
          <div className="flex flex-col sm:flex-row gap-4 p-4 rounded-2xl hover:bg-zinc-50 border border-transparent hover:border-zinc-200 transition-all dark:hover:bg-zinc-900 dark:hover:border-zinc-800">
            {/* Content */}
            <div className="flex-1 order-2 sm:order-1">
              <div className="flex items-center gap-2 mb-2">
                {item.publisherLogo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.publisherLogo} alt="" className="w-5 h-5 rounded" />
                ) : (
                  <div className="w-5 h-5 rounded bg-blue-100 flex items-center justify-center dark:bg-blue-900/50">
                    <Newspaper className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                  </div>
                )}
                <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  {item.publisher}
                </span>
                <span className="text-zinc-300 dark:text-zinc-700">•</span>
                <span className="text-xs text-zinc-500">
                  {formatTimeAgo(item.publishedAt)}
                </span>
              </div>
              
              <h3 className="text-xl font-medium text-blue-600 group-hover:underline mb-2 leading-snug dark:text-blue-400">
                {item.title}
              </h3>
              
              <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-3 leading-relaxed">
                {item.snippet}
              </p>
            </div>
            
            {/* Thumbnail */}
            {item.thumbnailUrl && (
              <div className="w-full sm:w-32 h-40 sm:h-32 rounded-xl overflow-hidden shrink-0 order-1 sm:order-2 bg-zinc-100 dark:bg-zinc-900">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.thumbnailUrl}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>
        </a>
      ))}
    </div>
  );
}
