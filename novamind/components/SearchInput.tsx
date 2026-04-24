'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Mic, Camera, Sparkles, X, TrendingUp, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { SearchSuggestion } from '@/types/search';

interface SearchInputProps {
  defaultValue?: string;
  variant?: 'home' | 'header';
  autoFocus?: boolean;
  onSearch?: (query: string) => void;
}

export default function SearchInput({
  defaultValue = '',
  variant = 'home',
  autoFocus = false,
  onSearch,
}: SearchInputProps) {
  const [query, setQuery] = useState(defaultValue);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  const fetchSuggestions = useCallback(async (q: string) => {
    if (q.length < 2) {
      setSuggestions([]);
      return;
    }
    try {
      const res = await fetch(`/api/suggest?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      setSuggestions(data.suggestions || []);
    } catch {
      setSuggestions([]);
    }
  }, []);

  useEffect(() => {
    setQuery(defaultValue);
  }, [defaultValue]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (value: string) => {
    setQuery(value);
    setSelectedIdx(-1);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchSuggestions(value), 200);
  };

  const performSearch = (searchQuery: string, aiMode = false) => {
    const q = searchQuery.trim();
    if (!q) return;
    setShowSuggestions(false);
    if (onSearch) {
      onSearch(q);
    } else {
      const params = new URLSearchParams({ q });
      if (aiMode) params.set('tab', 'ai');
      router.push(`/search?${params.toString()}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIdx(prev => Math.min(prev + 1, suggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIdx(prev => Math.max(prev - 1, -1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIdx >= 0 && suggestions[selectedIdx]) {
        performSearch(suggestions[selectedIdx].text);
      } else {
        performSearch(query);
      }
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  const isHome = variant === 'home';

  return (
    <div ref={wrapperRef} className="relative w-full">
      <div
        className={cn(
          'flex items-center gap-3 rounded-full border bg-white shadow-sm transition-all duration-200',
          'dark:bg-zinc-900 dark:border-zinc-700',
          isHome
            ? 'px-6 py-4 text-lg hover:shadow-md focus-within:shadow-lg focus-within:border-blue-400 dark:focus-within:border-blue-500 max-w-[680px] mx-auto'
            : 'px-4 py-2.5 text-sm hover:shadow-sm focus-within:shadow-md focus-within:border-blue-400 dark:focus-within:border-blue-500',
          showSuggestions && suggestions.length > 0 && 'rounded-b-none shadow-lg border-b-0'
        )}
      >
        <Search className={cn('shrink-0 text-blue-500', isHome ? 'w-5 h-5' : 'w-4 h-4')} />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={e => handleInputChange(e.target.value)}
          onFocus={() => setShowSuggestions(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search anything..."
          autoFocus={autoFocus}
          className={cn(
            'flex-1 bg-transparent outline-none text-zinc-900 placeholder:text-zinc-400',
            'dark:text-zinc-100 dark:placeholder:text-zinc-500',
            isHome ? 'text-lg' : 'text-sm'
          )}
          id="search-input"
          autoComplete="off"
        />
        {query && (
          <button
            onClick={() => { setQuery(''); inputRef.current?.focus(); }}
            className="shrink-0 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
            aria-label="Clear search"
          >
            <X className={cn(isHome ? 'w-5 h-5' : 'w-4 h-4')} />
          </button>
        )}
        <div className="shrink-0 flex items-center gap-2 border-l border-zinc-200 dark:border-zinc-700 pl-3">
          <button className="text-zinc-400 hover:text-blue-500 transition-colors" aria-label="Voice search">
            <Mic className={cn(isHome ? 'w-5 h-5' : 'w-4 h-4')} />
          </button>
          <button className="text-zinc-400 hover:text-blue-500 transition-colors" aria-label="Image search">
            <Camera className={cn(isHome ? 'w-5 h-5' : 'w-4 h-4')} />
          </button>
        </div>
      </div>

      {/* Suggestions dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className={cn(
          'absolute left-0 right-0 top-full z-50 bg-white border border-t-0 border-zinc-200 rounded-b-2xl shadow-lg overflow-hidden',
          'dark:bg-zinc-900 dark:border-zinc-700',
          isHome ? 'max-w-[680px] mx-auto' : ''
        )}>
          {suggestions.map((suggestion, i) => (
            <button
              key={i}
              className={cn(
                'flex items-center gap-3 w-full px-6 py-2.5 text-left transition-colors',
                'hover:bg-zinc-50 dark:hover:bg-zinc-800',
                selectedIdx === i && 'bg-zinc-50 dark:bg-zinc-800'
              )}
              onClick={() => performSearch(suggestion.text)}
              onMouseEnter={() => setSelectedIdx(i)}
            >
              {suggestion.type === 'trending' ? (
                <TrendingUp className="w-4 h-4 text-blue-400 shrink-0" />
              ) : suggestion.type === 'history' ? (
                <Clock className="w-4 h-4 text-zinc-400 shrink-0" />
              ) : (
                <Search className="w-4 h-4 text-zinc-400 shrink-0" />
              )}
              <span className={cn(
                'text-sm text-zinc-700 dark:text-zinc-300',
                selectedIdx === i && 'text-zinc-900 dark:text-zinc-100'
              )}>
                {suggestion.text}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Action buttons (home only) */}
      {isHome && (
        <div className="flex items-center justify-center gap-3 mt-6">
          <button
            onClick={() => performSearch(query)}
            className="px-6 py-2.5 rounded-full bg-zinc-100 text-sm font-medium text-zinc-700 hover:bg-zinc-200 border border-zinc-200 transition-all dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700 dark:hover:bg-zinc-700"
            id="search-button"
          >
            NovaMind Search
          </button>
          <button
            onClick={() => performSearch(query, true)}
            className="px-6 py-2.5 rounded-full bg-gradient-to-r from-violet-500 to-blue-500 text-sm font-medium text-white hover:from-violet-600 hover:to-blue-600 transition-all shadow-md hover:shadow-lg flex items-center gap-2"
            id="ai-mode-button"
          >
            <Sparkles className="w-4 h-4" />
            AI Mode
          </button>
        </div>
      )}
    </div>
  );
}
