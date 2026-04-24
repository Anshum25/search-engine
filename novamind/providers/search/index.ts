/* ──────────────────────────────────────────────
   NovaMind — Search Provider Interface
   ────────────────────────────────────────────── */

import type {
  SearchResult,
  ImageResult,
  NewsResult,
  VideoResult,
  ProductResult,
  ForumResult,
} from '@/types/search';

export interface SearchProviderResults {
  web: SearchResult[];
  images?: ImageResult[];
  news?: NewsResult[];
  videos?: VideoResult[];
  products?: ProductResult[];
  forums?: ForumResult[];
}

export interface ISearchProvider {
  name: string;
  search(query: string, options?: SearchOptions): Promise<SearchProviderResults>;
}

export interface SearchOptions {
  maxResults?: number;
  searchType?: 'web' | 'images' | 'news' | 'videos' | 'shopping' | 'forums';
  freshness?: 'day' | 'week' | 'month' | 'year';
}

// Factory — import dynamically based on env
export async function getSearchProvider(): Promise<ISearchProvider> {
  const provider = process.env.SEARCH_PROVIDER || 'mock';

  switch (provider) {
    case 'tavily': {
      const { TavilySearchProvider } = await import('./tavily');
      return new TavilySearchProvider();
    }
    case 'mock':
    default: {
      const { MockSearchProvider } = await import('./mock');
      return new MockSearchProvider();
    }
  }
}
