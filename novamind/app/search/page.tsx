'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/Header';
import TabsBar from '@/components/TabsBar';
import AIOverviewCard from '@/components/AIOverviewCard';
import AIModeFull from '@/components/AIModeFull';
import SearchResultsList from '@/components/SearchResultsList';
import PeopleAlsoAsk from '@/components/PeopleAlsoAsk';
import RelatedSearches from '@/components/RelatedSearches';
import KnowledgePanel from '@/components/KnowledgePanel';
import ImageGrid from '@/components/tabs/ImageGrid';
import VideoList from '@/components/tabs/VideoList';
import NewsList from '@/components/tabs/NewsList';
import ShoppingGrid from '@/components/tabs/ShoppingGrid';
import ForumsList from '@/components/tabs/ForumsList';
import { LoadingSkeleton } from '@/components/LoadingSkeleton';
import type { SearchResponse, SearchTab } from '@/types/search';

function SearchPageContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const tab = (searchParams.get('tab') || 'all') as SearchTab;
  
  const [results, setResults] = useState<SearchResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function performSearch() {
      if (!query) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}&tab=${tab}`);
        if (!res.ok) throw new Error('Search failed');
        const data = await res.json();
        setResults(data);
      } catch (err) {
        setError('An error occurred while fetching your search results. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    performSearch();
    // Scroll to top on new search
    window.scrollTo(0, 0);
  }, [query, tab]);

  if (!query) {
    return null; // Will redirect or show empty state if navigated manually without query
  }

  // Helper to render correct active tab content
  const renderTabContent = () => {
    if (loading) {
      const typeMap: Record<string, 'grid' | 'images' | 'all' | 'ai'> = {
        images: 'images',
        ai: 'ai',
        shopping: 'grid',
      };
      return <LoadingSkeleton type={typeMap[tab] || 'all'} />;
    }

    if (error) {
      return (
        <div className="p-8 text-center text-red-600 bg-red-50 rounded-2xl dark:bg-red-950/20 dark:text-red-400">
          <p>{error}</p>
        </div>
      );
    }

    if (!results) return null;

    switch (tab) {
      case 'ai':
        return results.aiFullAnswer ? (
          <div className="w-full max-w-3xl">
            <AIModeFull answer={results.aiFullAnswer} />
          </div>
        ) : (
          <p>No AI answer available.</p>
        );
      
      case 'images':
        return <ImageGrid images={results.images || []} />;
        
      case 'videos':
        return <div className="max-w-4xl"><VideoList videos={results.videos || []} /></div>;
        
      case 'news':
        return <div className="max-w-3xl"><NewsList news={results.news || []} /></div>;
        
      case 'shopping':
        return <ShoppingGrid products={results.products || []} />;
        
      case 'forums':
        return <div className="max-w-3xl"><ForumsList forums={results.forums || []} /></div>;

      case 'all':
      default:
        return (
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 w-full">
            {/* Main Content Column */}
            <div className="flex-1 w-full max-w-3xl">
              {results.aiOverview && (
                <AIOverviewCard overview={results.aiOverview} />
              )}
              
              {results.knowledgePanel && (
                <div className="lg:hidden mb-6">
                  <KnowledgePanel entity={results.knowledgePanel} />
                </div>
              )}
              
              <SearchResultsList results={results.webResults} query={query} />
              
              {results.faqItems?.length > 0 && (
                <div className="mt-8 border-t border-zinc-200 dark:border-zinc-800 pt-8">
                  <PeopleAlsoAsk items={results.faqItems} />
                </div>
              )}
              
              {results.relatedSearches?.length > 0 && (
                <div className="mt-8 border-t border-zinc-200 dark:border-zinc-800 pt-8">
                  <RelatedSearches searches={results.relatedSearches} />
                </div>
              )}
            </div>

            {/* Sidebar Column */}
            <div className="hidden lg:block w-[350px] shrink-0">
              {results.knowledgePanel && (
                <div className="sticky top-24">
                  <KnowledgePanel entity={results.knowledgePanel} />
                </div>
              )}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-zinc-950">
      <Header query={query} />
      <TabsBar activeTab={tab} query={query} />
      
      <main className="flex-1 w-full relative">
        {/* Results Info Stats */}
        {results?.totalResults !== undefined && !loading && tab === 'all' && (
          <div className="max-w-[1200px] mx-auto px-4 py-3 text-sm text-zinc-500 dark:text-zinc-500">
            About {results.totalResults.toLocaleString()} results ({results.searchTimeMs ? (results.searchTimeMs / 1000).toFixed(2) : '0.45'} seconds)
          </div>
        )}
        
        {/* Main padding wrapper */}
        <div className="max-w-[1200px] mx-auto px-4 py-6 md:py-8 animate-in fade-in duration-500">
          {renderTabContent()}
        </div>
      </main>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col min-h-screen bg-white dark:bg-zinc-950">
        <div className="h-16 border-b border-zinc-200 dark:border-zinc-800"></div>
        <div className="max-w-[1200px] mx-auto px-4 py-8 w-full">
          <LoadingSkeleton />
        </div>
      </div>
    }>
      <SearchPageContent />
    </Suspense>
  );
}
