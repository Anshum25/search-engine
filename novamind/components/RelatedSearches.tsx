'use client';

import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import type { RelatedSearch } from '@/types/search';

interface RelatedSearchesProps {
  searches: RelatedSearch[];
}

export default function RelatedSearches({ searches }: RelatedSearchesProps) {
  const router = useRouter();

  if (!searches.length) return null;

  return (
    <div className="mb-8" id="related-searches">
      <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-3">
        Related searches
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {searches.map((item, i) => (
          <button
            key={i}
            onClick={() => router.push(`/search?q=${encodeURIComponent(item.query)}`)}
            className="flex items-center gap-3 px-4 py-3 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 hover:border-zinc-300 transition-all text-left dark:bg-zinc-900 dark:border-zinc-800 dark:hover:bg-zinc-800 dark:hover:border-zinc-700 group"
          >
            <Search className="w-4 h-4 text-blue-500 shrink-0 group-hover:text-blue-600" />
            <span className="text-sm text-blue-600 dark:text-blue-400 group-hover:underline truncate">
              {item.query}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
