'use client';

import { Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import type { AIOverview } from '@/types/search';
import SourceChips from './SourceChips';

interface AIOverviewCardProps {
  overview: AIOverview;
}

export default function AIOverviewCard({ overview }: AIOverviewCardProps) {
  const [expanded, setExpanded] = useState(false);

  if (overview.error) {
    return null;
  }

  // Split content, show partial initially
  const lines = overview.content.split('\n').filter(Boolean);
  const previewLines = lines.slice(0, 2).join('\n');
  const hasMore = lines.length > 2;
  const displayContent = expanded ? overview.content : previewLines;

  return (
    <div className="relative mb-6 rounded-2xl overflow-hidden" id="ai-overview">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-violet-50 to-indigo-50 dark:from-blue-950/40 dark:via-violet-950/40 dark:to-indigo-950/40" />
      <div className="absolute inset-0 bg-gradient-to-t from-white/60 to-transparent dark:from-zinc-900/60" />

      <div className="relative p-6">
        {/* Header */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-blue-500 shadow-sm">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="text-sm font-semibold bg-gradient-to-r from-violet-600 to-blue-600 bg-clip-text text-transparent">
            AI Overview
          </span>
        </div>

        {/* Content */}
        <div className="prose prose-sm max-w-none dark:prose-invert prose-p:text-zinc-700 dark:prose-p:text-zinc-300 prose-p:leading-relaxed">
          {displayContent.split('\n').map((paragraph, i) => {
            // Replace [n] citations with styled spans
            const parts = paragraph.split(/(\[\d+\])/g);
            return (
              <p key={i} className="mb-2 last:mb-0">
                {parts.map((part, j) => {
                  const citationMatch = part.match(/^\[(\d+)\]$/);
                  if (citationMatch) {
                    const idx = parseInt(citationMatch[1]) - 1;
                    const citation = overview.citations[idx];
                    return (
                      <a
                        key={j}
                        href={citation?.url || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center w-5 h-5 text-[10px] font-bold text-blue-600 bg-blue-100 rounded-full hover:bg-blue-200 no-underline transition-colors mx-0.5 align-super dark:text-blue-400 dark:bg-blue-900/50 dark:hover:bg-blue-900"
                        title={citation?.title}
                      >
                        {citationMatch[1]}
                      </a>
                    );
                  }
                  // Handle **bold**
                  const boldParts = part.split(/(\*\*.*?\*\*)/g);
                  return boldParts.map((bp, k) => {
                    if (bp.startsWith('**') && bp.endsWith('**')) {
                      return <strong key={`${j}-${k}`}>{bp.slice(2, -2)}</strong>;
                    }
                    return <span key={`${j}-${k}`}>{bp}</span>;
                  });
                })}
              </p>
            );
          })}
        </div>

        {/* Show more/less */}
        {hasMore && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1 mt-3 text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
          >
            {expanded ? (
              <>Show less <ChevronUp className="w-4 h-4" /></>
            ) : (
              <>Show more <ChevronDown className="w-4 h-4" /></>
            )}
          </button>
        )}

        {/* Source chips */}
        {overview.citations.length > 0 && (
          <div className="mt-4 pt-4 border-t border-zinc-200/60 dark:border-zinc-700/60">
            <SourceChips citations={overview.citations} />
          </div>
        )}
      </div>
    </div>
  );
}
