'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Search, Sparkles, ImageIcon, Film, Newspaper, ShoppingBag, MessageSquare, MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { SearchTab } from '@/types/search';

const TABS: { id: SearchTab; label: string; icon: React.ReactNode }[] = [
  { id: 'all', label: 'All', icon: <Search className="w-4 h-4" /> },
  { id: 'ai', label: 'AI Mode', icon: <Sparkles className="w-4 h-4" /> },
  { id: 'images', label: 'Images', icon: <ImageIcon className="w-4 h-4" /> },
  { id: 'videos', label: 'Videos', icon: <Film className="w-4 h-4" /> },
  { id: 'news', label: 'News', icon: <Newspaper className="w-4 h-4" /> },
  { id: 'shopping', label: 'Shopping', icon: <ShoppingBag className="w-4 h-4" /> },
  { id: 'forums', label: 'Forums', icon: <MessageSquare className="w-4 h-4" /> },
];

interface TabsBarProps {
  activeTab: SearchTab;
  query: string;
}

export default function TabsBar({ activeTab, query }: TabsBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleTabClick = (tab: SearchTab) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('q', query);
    if (tab === 'all') {
      params.delete('tab');
    } else {
      params.set('tab', tab);
    }
    router.push(`/search?${params.toString()}`);
  };

  return (
    <div className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
      <div className="max-w-[1200px] mx-auto px-4">
        <nav className="flex items-center gap-1 overflow-x-auto scrollbar-hide -mb-px" aria-label="Search tabs">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={cn(
                'flex items-center gap-1.5 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-[3px] transition-all duration-200',
                activeTab === tab.id
                  ? tab.id === 'ai'
                    ? 'border-violet-500 text-violet-600 dark:text-violet-400'
                    : 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-300 hover:border-zinc-300 dark:hover:border-zinc-600'
              )}
              id={`tab-${tab.id}`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
          <button
            className="flex items-center gap-1.5 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-[3px] border-transparent text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-300"
          >
            <MoreHorizontal className="w-4 h-4" />
            More
          </button>
        </nav>
      </div>
    </div>
  );
}
