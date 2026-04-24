/* ──────────────────────────────────────────────
   NovaMind — Core Search Types
   ────────────────────────────────────────────── */

// ── Web Search ──────────────────────────────────

export interface SearchResult {
  id: string;
  title: string;
  url: string;
  domain: string;
  snippet: string;
  favicon?: string;
  publishedDate?: string;
  sitelinks?: { title: string; url: string }[];
}

// ── AI ──────────────────────────────────────────

export interface Citation {
  index: number;
  url: string;
  title: string;
  domain: string;
  snippet?: string;
}

export interface AIOverview {
  content: string;          // markdown
  citations: Citation[];
  isLoading?: boolean;
  error?: string;
}

export interface AIFullAnswer {
  content: string;          // markdown with inline [1] citations
  citations: Citation[];
  sections?: {
    title: string;
    content: string;
  }[];
  followUpQuestions?: string[];
  isLoading?: boolean;
  error?: string;
}

// ── FAQ / PAA ───────────────────────────────────

export interface FAQItem {
  question: string;
  answer: string;           // markdown
  citations?: Citation[];
}

// ── Related Search ──────────────────────────────

export interface RelatedSearch {
  query: string;
  type?: 'related' | 'refinement' | 'broadening';
}

// ── Knowledge Panel ─────────────────────────────

export interface KnowledgeEntity {
  title: string;
  subtitle?: string;
  category?: string;
  description: string;
  imageUrl?: string;
  facts: { label: string; value: string }[];
  sourceUrl?: string;
  sourceName?: string;
}

// ── Images ──────────────────────────────────────

export interface ImageResult {
  id: string;
  url: string;
  thumbnailUrl: string;
  title: string;
  sourceUrl: string;
  sourceDomain: string;
  width?: number;
  height?: number;
}

// ── Shopping ────────────────────────────────────

export interface ProductResult {
  id: string;
  title: string;
  price: string;
  currency?: string;
  imageUrl: string;
  seller: string;
  sellerUrl: string;
  rating?: number;
  reviewCount?: number;
  inStock?: boolean;
}

// ── News ────────────────────────────────────────

export interface NewsResult {
  id: string;
  title: string;
  url: string;
  snippet: string;
  publisher: string;
  publisherLogo?: string;
  thumbnailUrl?: string;
  publishedAt: string;
}

// ── Videos ──────────────────────────────────────

export interface VideoResult {
  id: string;
  title: string;
  url: string;
  thumbnailUrl: string;
  duration?: string;
  platform: string;
  channelName?: string;
  views?: string;
  publishedAt?: string;
  snippet?: string;
}

// ── Forums / Discussions ────────────────────────

export interface ForumResult {
  id: string;
  title: string;
  url: string;
  platform: string;          // reddit, quora, stackoverflow, hackernews
  snippet: string;
  author?: string;
  replies?: number;
  upvotes?: number;
  publishedAt?: string;
  subreddit?: string;
}

// ── Chat / Follow-up ───────────────────────────

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  citations?: Citation[];
  timestamp: number;
}

// ── Search Tabs ─────────────────────────────────

export type SearchTab = 
  | 'all'
  | 'ai'
  | 'images'
  | 'videos'
  | 'news'
  | 'shopping'
  | 'forums';

// ── Unified Search Response ─────────────────────

export interface SearchResponse {
  query: string;
  tab: SearchTab;
  webResults: SearchResult[];
  aiOverview?: AIOverview;
  aiFullAnswer?: AIFullAnswer;
  faqItems: FAQItem[];
  relatedSearches: RelatedSearch[];
  knowledgePanel?: KnowledgeEntity;
  images?: ImageResult[];
  products?: ProductResult[];
  news?: NewsResult[];
  videos?: VideoResult[];
  forums?: ForumResult[];
  totalResults?: number;
  searchTimeMs?: number;
}

// ── Provider Interfaces ─────────────────────────

export interface SearchProviderConfig {
  provider: 'mock' | 'tavily' | 'serpapi' | 'brave';
  apiKey?: string;
}

export interface AIProviderConfig {
  provider: 'mock' | 'openai' | 'anthropic' | 'gemini';
  apiKey?: string;
  model?: string;
}

// ── Suggestion ──────────────────────────────────

export interface SearchSuggestion {
  text: string;
  type: 'suggestion' | 'history' | 'trending';
}
