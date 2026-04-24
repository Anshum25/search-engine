/* ──────────────────────────────────────────────
   NovaMind — RAG Pipeline
   Core orchestrator: query → search → rank → AI
   ────────────────────────────────────────────── */

import type { SearchResponse, SearchTab } from '@/types/search';
import { getSearchProvider } from '@/providers/search';
import { getAIProvider } from '@/providers/ai';

export async function executeSearch(query: string, tab: SearchTab = 'all'): Promise<SearchResponse> {
  const startTime = Date.now();

  const searchProvider = await getSearchProvider();
  const aiProvider = await getAIProvider();

  // Step 1: Fetch search results
  const searchResults = await searchProvider.search(query, {
    maxResults: 10,
    searchType: tab === 'all' ? 'web' : tab === 'ai' ? 'web' : tab as 'images' | 'news' | 'videos' | 'shopping' | 'forums',
  });

  // Step 2: Prepare sources for AI
  const sources = searchResults.web.slice(0, 8).map(r => ({
    title: r.title,
    url: r.url,
    content: r.snippet,
  }));

  // Step 3: Run AI tasks in parallel (for "all" and "ai" tabs)
  const needsAI = tab === 'all' || tab === 'ai';

  const [aiResult, relatedSearches, faqItems, entity] = await Promise.all([
    needsAI
      ? aiProvider.generate({
          query,
          sources,
          mode: tab === 'ai' ? 'full' : 'overview',
        })
      : Promise.resolve(null),
    needsAI ? aiProvider.generateRelatedSearches(query, sources) : Promise.resolve([]),
    needsAI ? aiProvider.generateFAQ(query, sources) : Promise.resolve([]),
    tab === 'all' ? aiProvider.extractEntity(query, sources) : Promise.resolve(null),
  ]);

  const searchTimeMs = Date.now() - startTime;

  return {
    query,
    tab,
    webResults: searchResults.web,
    aiOverview: tab === 'all' && aiResult
      ? { content: aiResult.content, citations: aiResult.citations }
      : undefined,
    aiFullAnswer: tab === 'ai' && aiResult
      ? {
          content: aiResult.content,
          citations: aiResult.citations,
          followUpQuestions: aiResult.followUpQuestions,
        }
      : undefined,
    faqItems: faqItems.map(f => ({
      question: f.question,
      answer: f.answer,
      citations: f.citations,
    })),
    relatedSearches: relatedSearches.map(q => ({ query: q })),
    knowledgePanel: entity
      ? {
          title: entity.title,
          subtitle: entity.subtitle,
          category: entity.category,
          description: entity.description,
          facts: entity.facts,
          sourceUrl: entity.sourceUrl,
          sourceName: entity.sourceName,
        }
      : undefined,
    images: searchResults.images,
    products: searchResults.products,
    news: searchResults.news,
    videos: searchResults.videos,
    forums: searchResults.forums,
    totalResults: searchResults.web.length * 1000 + Math.floor(Math.random() * 9000),
    searchTimeMs,
  };
}
