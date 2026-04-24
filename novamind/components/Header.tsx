'use client';

import Link from 'next/link';
import { UserCircle, Settings, Menu } from 'lucide-react';
import SearchInput from './SearchInput';

interface HeaderProps {
  query: string;
}

export default function Header({ query }: HeaderProps) {
  return (
    <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-transparent dark:bg-zinc-950/80">
      <div className="flex items-center gap-4 px-4 py-3 md:px-6 md:gap-8 justify-between lg:justify-start">
        {/* Logo */}
        <Link href="/" className="shrink-0 flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-violet-600 to-blue-500 flex items-center justify-center text-white font-bold text-sm shadow-md group-hover:shadow-lg transition-all scale-100 group-hover:scale-105">
            N
          </div>
          <span className="text-xl font-bold tracking-tight text-zinc-900 hidden md:block dark:text-zinc-100">
            NovaMind
          </span>
        </Link>

        {/* Search Input */}
        <div className="flex-1 max-w-[680px]">
          <SearchInput defaultValue={query} variant="header" />
        </div>

        {/* Actions */}
        <div className="shrink-0 flex items-center gap-1 sm:gap-2">
          <button className="p-2 text-zinc-500 hover:text-zinc-800 hover:bg-zinc-100 rounded-full transition-colors hidden sm:block dark:text-zinc-400 dark:hover:text-zinc-100 dark:hover:bg-zinc-800">
            <Settings className="w-5 h-5" />
          </button>
          <button className="p-2 text-zinc-500 hover:text-zinc-800 hover:bg-zinc-100 rounded-full transition-colors hidden sm:block dark:text-zinc-400 dark:hover:text-zinc-100 dark:hover:bg-zinc-800">
            <Menu className="w-5 h-5" />
          </button>
          <button className="p-1 pl-2 sm:pl-1">
            <UserCircle className="w-8 h-8 text-zinc-400 hover:text-zinc-600 transition-colors dark:text-zinc-500 dark:hover:text-zinc-300" />
          </button>
        </div>
      </div>
    </div>
  );
}
