'use client';

import type { SearchResult } from '@/types/search';
import SearchResultItem from './SearchResultItem';

interface SearchResultsListProps {
  results: SearchResult[];
  query: string;
}

export default function SearchResultsList({ results, query }: SearchResultsListProps) {
  if (!results.length) {
    return (
      <div className="py-12 text-center">
        <p className="text-zinc-500 dark:text-zinc-400">No results found for &quot;{query}&quot;</p>
        <p className="text-sm text-zinc-400 dark:text-zinc-500 mt-1">Try different keywords or check your spelling.</p>
      </div>
    );
  }

  return (
    <div className="space-y-1" id="search-results-list">
      {results.map(result => (
        <SearchResultItem key={result.id} result={result} query={query} />
      ))}
    </div>
  );
}
