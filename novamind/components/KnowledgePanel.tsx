'use client';

import { ExternalLink, Globe } from 'lucide-react';
import type { KnowledgeEntity } from '@/types/search';

interface KnowledgePanelProps {
  entity: KnowledgeEntity;
}

export default function KnowledgePanel({ entity }: KnowledgePanelProps) {
  return (
    <div className="border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden bg-white dark:bg-zinc-950 shadow-sm" id="knowledge-panel">
      {/* Optional image header */}
      {entity.imageUrl && (
        <div className="h-48 w-full bg-zinc-100 dark:bg-zinc-900 relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={entity.imageUrl}
            alt={entity.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="p-5">
        {/* Title area */}
        <div className="mb-4">
          <h2 className="text-2xl font-normal text-zinc-900 dark:text-zinc-100">{entity.title}</h2>
          {(entity.subtitle || entity.category) && (
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
              {entity.subtitle || entity.category}
            </p>
          )}
        </div>

        {/* Description */}
        <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed mb-4">
          {entity.description}
        </p>

        {/* Source link */}
        {entity.sourceUrl && (
          <a
            href={entity.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-xs font-medium text-zinc-700 transition-colors mb-5 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-zinc-300"
          >
            <Globe className="w-3 h-3" />
            {entity.sourceName || 'Source'}
            <ExternalLink className="w-3 h-3 ml-0.5 opacity-50" />
          </a>
        )}

        {/* Facts grid */}
        {entity.facts && entity.facts.length > 0 && (
          <div className="space-y-3 pt-4 border-t border-zinc-200 dark:border-zinc-800">
            {entity.facts.map((fact, i) => (
              <div key={i} className="flex flex-col sm:flex-row sm:gap-4">
                <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100 sm:w-1/3">
                  {fact.label}
                </span>
                <span className="text-sm text-zinc-600 dark:text-zinc-400 sm:w-2/3">
                  {fact.value}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
