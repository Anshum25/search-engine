'use client';

import type { Citation } from '@/types/search';
import { getFaviconUrl } from '@/lib/utils';
import { ExternalLink } from 'lucide-react';

interface SourceChipsProps {
  citations: Citation[];
  compact?: boolean;
}

export default function SourceChips({ citations, compact = false }: SourceChipsProps) {
  if (!citations.length) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {citations.map((c) => (
        <a
          key={c.index}
          href={c.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-zinc-200 hover:border-blue-300 hover:shadow-sm transition-all text-xs dark:bg-zinc-800 dark:border-zinc-700 dark:hover:border-blue-600"
          title={c.title}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={getFaviconUrl(c.domain)}
            alt=""
            className="w-4 h-4 rounded-sm"
            width={16}
            height={16}
          />
          {!compact && (
            <span className="text-zinc-600 dark:text-zinc-400 max-w-[140px] truncate">
              {c.domain}
            </span>
          )}
          <ExternalLink className="w-3 h-3 text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity" />
        </a>
      ))}
    </div>
  );
}
