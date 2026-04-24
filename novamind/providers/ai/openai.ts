/* ──────────────────────────────────────────────
   NovaMind — OpenAI Provider
   RAG-grounded AI answers using OpenAI API.
   ────────────────────────────────────────────── */

import type { Citation } from '@/types/search';
import type { IAIProvider, AIGenerateOptions, AIGenerateResult } from './index';
import { extractDomain } from '@/lib/utils';

export class OpenAIProvider implements IAIProvider {
  name = 'openai';
  private apiKey: string;
  private model: string;

  constructor() {
    this.apiKey = process.env.OPENAI_API_KEY || '';
    this.model = process.env.OPENAI_MODEL || 'gpt-4o-mini';
    if (!this.apiKey) throw new Error('OPENAI_API_KEY is required');
  }

  private async chat(messages: { role: string; content: string }[], temperature = 0.3): Promise<string> {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({ model: this.model, messages, temperature, max_tokens: 2048 }),
    });
    if (!res.ok) throw new Error(`OpenAI error: ${res.status}`);
    const data = await res.json();
    return data.choices?.[0]?.message?.content || '';
  }

  async generate(options: AIGenerateOptions): Promise<AIGenerateResult> {
    const { query, sources, mode, conversationHistory } = options;

    const sourcesBlock = sources
      .slice(0, 8)
      .map((s, i) => `[${i + 1}] Title: ${s.title}\nURL: ${s.url}\nContent: ${s.content.slice(0, 600)}`)
      .join('\n\n');

    const citations: Citation[] = sources.slice(0, 8).map((s, i) => ({
      index: i + 1,
      url: s.url,
      title: s.title,
      domain: extractDomain(s.url),
      snippet: s.content.slice(0, 120),
    }));

    const systemPrompt = mode === 'overview'
      ? `You are an AI search assistant. Provide a concise 2-4 sentence overview answering the user's query using ONLY the provided sources. Include inline citations like [1], [2]. Do NOT make up information. If sources are insufficient, say so.`
      : `You are an AI search assistant. Provide a comprehensive, well-structured answer using ONLY the provided sources. Use markdown formatting with ## headings. Include inline citations [1], [2], etc. Structure: Overview, Key Points, Detailed Analysis, Conclusion. Do NOT hallucinate. If data is insufficient, explicitly state so.`;

    const messages: { role: string; content: string }[] = [
      { role: 'system', content: systemPrompt },
    ];

    if (conversationHistory) {
      for (const msg of conversationHistory.slice(-4)) {
        messages.push({ role: msg.role, content: msg.content });
      }
    }

    messages.push({
      role: 'user',
      content: `Query: ${query}\n\nSources:\n${sourcesBlock}\n\nProvide your answer with citations:`,
    });

    const content = await this.chat(messages);

    // Extract follow-up questions
    let followUpQuestions: string[] | undefined;
    if (mode === 'full') {
      const fqRes = await this.chat([
        { role: 'system', content: 'Generate 4 follow-up questions a user might ask. Return as JSON array of strings.' },
        { role: 'user', content: `Original query: ${query}\nAnswer provided: ${content.slice(0, 500)}` },
      ], 0.5);
      try {
        const match = fqRes.match(/\[[\s\S]*\]/);
        if (match) followUpQuestions = JSON.parse(match[0]);
      } catch { /* skip */ }
    }

    return { content, citations, followUpQuestions };
  }

  async generateRelatedSearches(query: string, sources: { title: string; content: string }[]): Promise<string[]> {
    const context = sources.slice(0, 3).map(s => s.title).join(', ');
    const res = await this.chat([
      { role: 'system', content: 'Generate 8 related search queries. Return as JSON array of strings only.' },
      { role: 'user', content: `Query: ${query}\nRelated topics: ${context}` },
    ], 0.6);
    try {
      const match = res.match(/\[[\s\S]*\]/);
      if (match) return JSON.parse(match[0]);
    } catch { /* fallback */ }
    return [`${query} explained`, `${query} examples`, `${query} alternatives`];
  }

  async generateFAQ(query: string, sources: { title: string; url: string; content: string }[]): Promise<{ question: string; answer: string; citations: Citation[] }[]> {
    const sourcesBlock = sources.slice(0, 5).map((s, i) =>
      `[${i + 1}] ${s.title}: ${s.content.slice(0, 300)}`
    ).join('\n');

    const res = await this.chat([
      { role: 'system', content: 'Generate 4 FAQ items from the sources. Return JSON array: [{"question":"...","answer":"...","citationIndices":[1,2]}]. Use ONLY source data.' },
      { role: 'user', content: `Query: ${query}\nSources:\n${sourcesBlock}` },
    ]);

    try {
      const match = res.match(/\[[\s\S]*\]/);
      if (match) {
        const items = JSON.parse(match[0]);
        return items.map((item: { question: string; answer: string; citationIndices?: number[] }) => ({
          question: item.question,
          answer: item.answer,
          citations: (item.citationIndices || []).map((idx: number) => ({
            index: idx,
            url: sources[idx - 1]?.url || '#',
            title: sources[idx - 1]?.title || '',
            domain: sources[idx - 1]?.url ? extractDomain(sources[idx - 1].url) : '',
          })),
        }));
      }
    } catch { /* fallback */ }
    return [];
  }

  async extractEntity(query: string, sources: { title: string; content: string }[]): Promise<{
    title: string; subtitle?: string; category?: string; description: string;
    facts: { label: string; value: string }[]; sourceUrl?: string; sourceName?: string;
  } | null> {
    const context = sources.slice(0, 3).map(s => `${s.title}: ${s.content.slice(0, 300)}`).join('\n');
    const res = await this.chat([
      { role: 'system', content: 'Determine if the query is about a specific entity (person, company, technology, place). If yes return JSON: {"title":"...","subtitle":"...","category":"...","description":"...","facts":[{"label":"...","value":"..."}]}. If not an entity, return null.' },
      { role: 'user', content: `Query: ${query}\nContext:\n${context}` },
    ]);

    try {
      if (res.includes('null')) return null;
      const match = res.match(/\{[\s\S]*\}/);
      if (match) return JSON.parse(match[0]);
    } catch { /* not an entity */ }
    return null;
  }
}
