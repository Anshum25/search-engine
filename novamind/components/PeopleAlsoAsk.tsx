'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import type { FAQItem } from '@/types/search';
import { cn } from '@/lib/utils';

interface PeopleAlsoAskProps {
  items: FAQItem[];
}

export default function PeopleAlsoAsk({ items }: PeopleAlsoAskProps) {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  if (!items.length) return null;

  return (
    <div className="mb-8" id="people-also-ask">
      <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-3">
        People also ask
      </h2>
      <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden divide-y divide-zinc-200 dark:divide-zinc-800">
        {items.map((item, idx) => (
          <div key={idx}>
            <button
              onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
              className="flex items-center justify-between w-full px-5 py-4 text-left hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
              aria-expanded={openIdx === idx}
            >
              <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200 pr-4">
                {item.question}
              </span>
              <ChevronDown
                className={cn(
                  'w-4 h-4 text-zinc-400 shrink-0 transition-transform duration-200',
                  openIdx === idx && 'rotate-180'
                )}
              />
            </button>
            <div
              className={cn(
                'overflow-hidden transition-all duration-300 ease-in-out',
                openIdx === idx ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
              )}
            >
              <div className="px-5 pb-4 pt-1">
                <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  {item.answer}
                </p>
                {item.citations && item.citations.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {item.citations.map((c) => (
                      <a
                        key={c.index}
                        href={c.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 hover:underline dark:text-blue-400"
                      >
                        {c.domain}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
