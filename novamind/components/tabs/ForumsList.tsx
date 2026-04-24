'use client';

import type { ForumResult } from '@/types/search';
import { formatTimeAgo } from '@/lib/utils';
import { MessageSquare, ThumbsUp, User } from 'lucide-react';

interface ForumsListProps {
  forums: ForumResult[];
}

export default function ForumsList({ forums }: ForumsListProps) {
  if (!forums.length) {
    return <div className="py-12 text-center text-zinc-500">No discussions found.</div>;
  }

  return (
    <div className="space-y-4" id="forums-list">
      {forums.map(forum => (
        <a
          key={forum.id}
          href={forum.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group block p-5 rounded-2xl border border-zinc-200 bg-white hover:border-zinc-300 hover:shadow-sm transition-all dark:bg-zinc-950 dark:border-zinc-800 dark:hover:border-zinc-700"
        >
          {/* Header */}
          <div className="flex items-center gap-3 mb-3">
            <div className="px-2.5 py-1 rounded-md bg-zinc-100 text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
              {forum.platform}
            </div>
            {forum.subreddit && (
              <div className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                {forum.subreddit}
              </div>
            )}
            {forum.publishedAt && (
              <div className="text-xs text-zinc-500 flex items-center before:content-['•'] before:mr-3 dark:before:text-zinc-700">
                {formatTimeAgo(forum.publishedAt)}
              </div>
            )}
          </div>

          <h3 className="text-lg font-medium text-blue-600 group-hover:underline mb-2 leading-snug dark:text-blue-400">
            {forum.title}
          </h3>
          
          <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2 leading-relaxed mb-4">
            {forum.snippet}
          </p>

          {/* Footer metrics */}
          <div className="flex items-center gap-4 text-xs font-medium text-zinc-500">
            {forum.author && (
              <div className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" />
                {forum.author}
              </div>
            )}
            {forum.upvotes !== undefined && (
              <div className="flex items-center gap-1.5">
                <ThumbsUp className="w-3.5 h-3.5" />
                {forum.upvotes}
              </div>
            )}
            {forum.replies !== undefined && (
              <div className="flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5" />
                {forum.replies} {forum.replies === 1 ? 'reply' : 'replies'}
              </div>
            )}
          </div>
        </a>
      ))}
    </div>
  );
}
