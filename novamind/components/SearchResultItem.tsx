'use client';

import type { SearchResult } from '@/types/search';
import { getFaviconUrl } from '@/lib/utils';

interface SearchResultItemProps {
  result: SearchResult;
  query: string;
}

function highlightText(text: string, query: string) {
  if (!query) return text;
  const words = query.split(/\s+/).filter(w => w.length > 2);
  const regex = new RegExp(`(${words.map(w => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'gi');
  const parts = text.split(regex);
  return parts.map((part, i) => {
    if (words.some(w => w.toLowerCase() === part.toLowerCase())) {
      return <strong key={i} className="text-zinc-900 dark:text-zinc-100 font-semibold">{part}</strong>;
    }
    return <span key={i}>{part}</span>;
  });
}

export default function SearchResultItem({ result, query }: SearchResultItemProps) {
  return (
    <article className="group mb-6" id={`result-${result.id}`}>
      {/* URL / breadcrumb line */}
      <div className="flex items-center gap-2 mb-1">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={getFaviconUrl(result.domain)}
          alt=""
          className="w-5 h-5 rounded-sm"
          width={20}
          height={20}
        />
        <div className="min-w-0">
          <p className="text-sm text-zinc-700 dark:text-zinc-400 truncate">{result.domain}</p>
          <p className="text-xs text-zinc-500 dark:text-zinc-500 truncate">{result.url}</p>
        </div>
      </div>

      {/* Title */}
      <a
        href={result.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block text-xl text-blue-600 hover:underline font-medium leading-snug mb-1 dark:text-blue-400"
      >
        {result.title}
      </a>

      {/* Snippet */}
      <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed line-clamp-3">
        {result.publishedDate && (
          <span className="text-zinc-500 dark:text-zinc-500 mr-1">
            {new Date(result.publishedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} —
          </span>
        )}
        {highlightText(result.snippet, query)}
      </p>

      {/* Sitelinks */}
      {result.sitelinks && result.sitelinks.length > 0 && (
        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
          {result.sitelinks.map((link, i) => (
            <a
              key={i}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:underline dark:text-blue-400"
            >
              {link.title}
            </a>
          ))}
        </div>
      )}
    </article>
  );
}
