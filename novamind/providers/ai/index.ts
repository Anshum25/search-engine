/* ──────────────────────────────────────────────
   NovaMind — AI Provider Interface
   ────────────────────────────────────────────── */

import type { Citation } from '@/types/search';

export interface AIGenerateOptions {
  query: string;
  sources: { title: string; url: string; content: string }[];
  mode: 'overview' | 'full';
  conversationHistory?: { role: 'user' | 'assistant'; content: string }[];
}

export interface AIGenerateResult {
  content: string;
  citations: Citation[];
  followUpQuestions?: string[];
}

export interface IAIProvider {
  name: string;
  generate(options: AIGenerateOptions): Promise<AIGenerateResult>;
  generateRelatedSearches(query: string, sources: { title: string; content: string }[]): Promise<string[]>;
  generateFAQ(query: string, sources: { title: string; url: string; content: string }[]): Promise<{ question: string; answer: string; citations: Citation[] }[]>;
  extractEntity(query: string, sources: { title: string; content: string }[]): Promise<{
    title: string; subtitle?: string; category?: string; description: string;
    facts: { label: string; value: string }[]; sourceUrl?: string; sourceName?: string;
  } | null>;
}

export async function getAIProvider(): Promise<IAIProvider> {
  const provider = process.env.AI_PROVIDER || 'mock';

  switch (provider) {
    case 'openai': {
      const { OpenAIProvider } = await import('./openai');
      return new OpenAIProvider();
    }
    case 'mock':
    default: {
      const { MockAIProvider } = await import('./mock');
      return new MockAIProvider();
    }
  }
}
