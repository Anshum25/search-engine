/* ──────────────────────────────────────────────
   NovaMind — Tavily Search Provider
   Real search API integration.
   ────────────────────────────────────────────── */

import type { SearchResult } from '@/types/search';
import type { ISearchProvider, SearchProviderResults, SearchOptions } from './index';
import { generateId, extractDomain } from '@/lib/utils';

interface TavilyResult {
  title: string;
  url: string;
  content: string;
  score: number;
  published_date?: string;
}

interface TavilyResponse {
  results: TavilyResult[];
  images?: { url: string }[];
  query: string;
  response_time: number;
}

export class TavilySearchProvider implements ISearchProvider {
  name = 'tavily';
  private apiKey: string;

  constructor() {
    this.apiKey = process.env.TAVILY_API_KEY || '';
    if (!this.apiKey) {
      throw new Error('TAVILY_API_KEY is required for Tavily provider');
    }
  }

  async search(query: string, options?: SearchOptions): Promise<SearchProviderResults> {
    const maxResults = options?.maxResults || 10;

    const response = await fetch('https://api.tavily.com/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_key: this.apiKey,
        query,
        max_results: maxResults,
        include_images: true,
        include_answer: false,
        search_depth: 'advanced',
      }),
    });

    if (!response.ok) {
      throw new Error(`Tavily API error: ${response.status} ${response.statusText}`);
    }

    const data: TavilyResponse = await response.json();

    const web: SearchResult[] = data.results.map((r) => ({
      id: generateId(),
      title: r.title,
      url: r.url,
      domain: extractDomain(r.url),
      snippet: r.content.slice(0, 300),
      publishedDate: r.published_date,
    }));

    return { web };
  }
}
