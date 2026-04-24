'use client';

import { Sparkles, BookOpen } from 'lucide-react';
import type { AIFullAnswer } from '@/types/search';
import SourceChips from './SourceChips';

interface AIModeFullProps {
  answer: AIFullAnswer;
  onFollowUp?: (query: string) => void;
}

export default function AIModeFull({ answer, onFollowUp }: AIModeFullProps) {
  if (answer.error) {
    return (
      <div className="p-6 rounded-2xl border border-red-200 bg-red-50 dark:bg-red-950/30 dark:border-red-800">
        <p className="text-red-600 dark:text-red-400">Failed to generate AI answer. Please try again.</p>
      </div>
    );
  }

  const renderContent = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, i) => {
      // Headings
      if (line.startsWith('## ')) {
        return (
          <h2 key={i} className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mt-6 mb-3 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-violet-500" />
            {line.replace('## ', '')}
          </h2>
        );
      }

      // Bullet points
      if (line.startsWith('- **')) {
        const match = line.match(/^- \*\*(.*?)\*\*:?\s*(.*)/);
        if (match) {
          const label = match[1];
          const rest = match[2];
          return (
            <div key={i} className="flex gap-3 mb-3 ml-1">
              <div className="w-1.5 h-1.5 rounded-full bg-violet-400 mt-2.5 shrink-0" />
              <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed">
                <strong className="text-zinc-900 dark:text-zinc-100">{label}</strong>
                {rest ? `: ${renderInlineCitations(rest)}` : ''}
              </p>
            </div>
          );
        }
      }

      if (line.startsWith('- ')) {
        return (
          <div key={i} className="flex gap-3 mb-2 ml-1">
            <div className="w-1.5 h-1.5 rounded-full bg-zinc-400 mt-2.5 shrink-0" />
            <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed">
              {renderInlineCitations(line.replace('- ', ''))}
            </p>
          </div>
        );
      }

      // Empty line
      if (!line.trim()) return <div key={i} className="h-2" />;

      // Regular paragraph
      return (
        <p key={i} className="text-zinc-700 dark:text-zinc-300 leading-relaxed mb-3">
          {renderInlineCitations(line)}
        </p>
      );
    });
  };

  const renderInlineCitations = (text: string) => {
    const parts = text.split(/(\[\d+\])/g);
    return parts.map((part, j) => {
      const match = part.match(/^\[(\d+)\]$/);
      if (match) {
        const idx = parseInt(match[1]) - 1;
        const citation = answer.citations[idx];
        return (
          <a
            key={j}
            href={citation?.url || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center w-5 h-5 text-[10px] font-bold text-violet-600 bg-violet-100 rounded-full hover:bg-violet-200 no-underline transition-colors mx-0.5 align-super dark:text-violet-400 dark:bg-violet-900/50"
            title={citation?.title}
          >
            {match[1]}
          </a>
        );
      }
      // Handle **bold**
      const boldParts = part.split(/(\*\*.*?\*\*)/g);
      return boldParts.map((bp, k) => {
        if (bp.startsWith('**') && bp.endsWith('**')) {
          return <strong key={`${j}-${k}`} className="text-zinc-900 dark:text-zinc-100">{bp.slice(2, -2)}</strong>;
        }
        return <span key={`${j}-${k}`}>{bp}</span>;
      });
    });
  };

  return (
    <div className="max-w-3xl" id="ai-mode-full">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-blue-500 shadow-md">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">AI Answer</h1>
          <p className="text-xs text-zinc-500">Powered by NovaMind • Grounded in search results</p>
        </div>
      </div>

      {/* Answer content */}
      <div className="mb-6">
        {renderContent(answer.content)}
      </div>

      {/* Sources */}
      {answer.citations.length > 0 && (
        <div className="mb-6 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
          <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-3">Sources</h3>
          <div className="space-y-2">
            {answer.citations.map((c) => (
              <a
                key={c.index}
                href={c.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors group"
              >
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-violet-100 text-violet-600 text-xs font-bold shrink-0 dark:bg-violet-900/50 dark:text-violet-400">
                  {c.index}
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-blue-600 group-hover:underline truncate dark:text-blue-400">
                    {c.title}
                  </p>
                  <p className="text-xs text-zinc-500 truncate">{c.domain}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Follow-up questions */}
      {answer.followUpQuestions && answer.followUpQuestions.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-3">Follow-up questions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {answer.followUpQuestions.map((q, i) => (
              <button
                key={i}
                onClick={() => onFollowUp?.(q)}
                className="text-left px-4 py-3 rounded-xl border border-zinc-200 text-sm text-zinc-700 hover:bg-violet-50 hover:border-violet-300 hover:text-violet-700 transition-all dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-violet-950/30 dark:hover:border-violet-600"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
