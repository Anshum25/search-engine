/* ──────────────────────────────────────────────
   NovaMind — Mock Search Provider
   Realistic fake data for offline development.
   ────────────────────────────────────────────── */

import type {
  SearchResult,
  ImageResult,
  NewsResult,
  VideoResult,
  ProductResult,
  ForumResult,
} from '@/types/search';
import type { ISearchProvider, SearchProviderResults, SearchOptions } from './index';
import { generateId } from '@/lib/utils';

export class MockSearchProvider implements ISearchProvider {
  name = 'mock';

  async search(query: string, _options?: SearchOptions): Promise<SearchProviderResults> {
    // Simulate network delay
    await new Promise(r => setTimeout(r, 300 + Math.random() * 400));

    const q = query.toLowerCase();
    return {
      web: this.getWebResults(q),
      images: this.getImageResults(q),
      news: this.getNewsResults(q),
      videos: this.getVideoResults(q),
      products: this.getProductResults(q),
      forums: this.getForumResults(q),
    };
  }

  private getWebResults(query: string): SearchResult[] {
    const templates: SearchResult[] = [
      {
        id: generateId(),
        title: `${this.capitalize(query)} - Comprehensive Guide & Overview`,
        url: `https://en.wikipedia.org/wiki/${encodeURIComponent(query)}`,
        domain: 'en.wikipedia.org',
        snippet: `${this.capitalize(query)} refers to a broad topic encompassing various aspects of technology, science, and innovation. This article provides a comprehensive overview of the subject, including history, current developments, and future perspectives.`,
        publishedDate: '2025-03-15',
      },
      {
        id: generateId(),
        title: `What is ${this.capitalize(query)}? Definition, Examples & More`,
        url: `https://www.techcrunch.com/article/${query.replace(/\s+/g, '-')}`,
        domain: 'techcrunch.com',
        snippet: `Learn everything you need to know about ${query}. This guide covers definitions, real-world examples, use cases, and expert analysis to help you understand the topic thoroughly.`,
        publishedDate: '2025-04-01',
      },
      {
        id: generateId(),
        title: `${this.capitalize(query)} — The Complete 2025 Guide | Forbes`,
        url: `https://www.forbes.com/advisor/${query.replace(/\s+/g, '-')}/`,
        domain: 'forbes.com',
        snippet: `Our experts have thoroughly researched ${query} to bring you the most up-to-date information. Compare options, read reviews, and find the best solutions for your needs.`,
        publishedDate: '2025-02-20',
      },
      {
        id: generateId(),
        title: `Understanding ${this.capitalize(query)}: A Deep Dive - MIT Technology Review`,
        url: `https://www.technologyreview.com/${query.replace(/\s+/g, '-')}/`,
        domain: 'technologyreview.com',
        snippet: `A deep technical analysis of ${query}, exploring the underlying mechanisms, cutting-edge research, and implications for various industries and society at large.`,
        publishedDate: '2025-01-10',
      },
      {
        id: generateId(),
        title: `${this.capitalize(query)} Explained Simply | HowStuffWorks`,
        url: `https://www.howstuffworks.com/${query.replace(/\s+/g, '-')}`,
        domain: 'howstuffworks.com',
        snippet: `Wondering how ${query} actually works? We break it down in simple, easy-to-understand terms with diagrams, examples, and step-by-step explanations for beginners and experts alike.`,
      },
      {
        id: generateId(),
        title: `Top 10 ${this.capitalize(query)} Resources & Tools for 2025`,
        url: `https://www.producthunt.com/stories/${query.replace(/\s+/g, '-')}`,
        domain: 'producthunt.com',
        snippet: `Discover the best tools and resources related to ${query}. Our curated list includes free and premium options, with detailed comparisons and user ratings.`,
        publishedDate: '2025-03-28',
      },
      {
        id: generateId(),
        title: `${this.capitalize(query)} vs Alternatives: Which is Better? - CNET`,
        url: `https://www.cnet.com/tech/${query.replace(/\s+/g, '-')}-comparison/`,
        domain: 'cnet.com',
        snippet: `Compare ${query} with its top alternatives. We've tested and reviewed each option to help you make an informed decision based on features, pricing, and performance.`,
        publishedDate: '2025-04-10',
      },
      {
        id: generateId(),
        title: `The Future of ${this.capitalize(query)} — Harvard Business Review`,
        url: `https://hbr.org/article/${query.replace(/\s+/g, '-')}-future`,
        domain: 'hbr.org',
        snippet: `Industry experts analyze the future trajectory of ${query}, examining trends, challenges, market dynamics, and strategic opportunities for organizations of all sizes.`,
        publishedDate: '2025-02-05',
      },
    ];
    return templates;
  }

  private getImageResults(query: string): ImageResult[] {
    const sizes = [
      { w: 800, h: 600 }, { w: 1200, h: 800 }, { w: 640, h: 480 },
      { w: 1920, h: 1080 }, { w: 500, h: 500 }, { w: 1024, h: 768 },
    ];
    return Array.from({ length: 12 }, (_, i) => {
      const size = sizes[i % sizes.length];
      return {
        id: generateId(),
        url: `https://picsum.photos/seed/${query.replace(/\s+/g, '')}${i}/${size.w}/${size.h}`,
        thumbnailUrl: `https://picsum.photos/seed/${query.replace(/\s+/g, '')}${i}/300/200`,
        title: `${this.capitalize(query)} — Image ${i + 1}`,
        sourceUrl: `https://unsplash.com/photos/${query.replace(/\s+/g, '-')}-${i}`,
        sourceDomain: i % 3 === 0 ? 'unsplash.com' : i % 3 === 1 ? 'pexels.com' : 'shutterstock.com',
        width: size.w,
        height: size.h,
      };
    });
  }

  private getNewsResults(query: string): NewsResult[] {
    const publishers = ['Reuters', 'BBC News', 'The Verge', 'TechCrunch', 'Wired', 'Ars Technica'];
    const hours = [1, 3, 5, 8, 12, 24];
    return publishers.map((pub, i) => ({
      id: generateId(),
      title: `${pub}: Latest developments in ${this.capitalize(query)} — what you need to know`,
      url: `https://www.${pub.toLowerCase().replace(/\s+/g, '')}.com/article/${query.replace(/\s+/g, '-')}`,
      snippet: `Breaking coverage of ${query} from ${pub}. Our reporters provide in-depth analysis of the latest trends, market movements, and expert opinions.`,
      publisher: pub,
      thumbnailUrl: `https://picsum.photos/seed/news${query.replace(/\s+/g, '')}${i}/400/250`,
      publishedAt: new Date(Date.now() - hours[i] * 3600000).toISOString(),
    }));
  }

  private getVideoResults(query: string): VideoResult[] {
    const channels = [
      { name: 'TechExplained', platform: 'YouTube' },
      { name: 'Fireship', platform: 'YouTube' },
      { name: 'Marques Brownlee', platform: 'YouTube' },
      { name: 'Linus Tech Tips', platform: 'YouTube' },
      { name: 'The Verge', platform: 'YouTube' },
      { name: 'Vox', platform: 'YouTube' },
    ];
    const durations = ['5:42', '12:18', '8:03', '15:47', '22:31', '3:55'];
    const views = ['1.2M views', '856K views', '3.4M views', '420K views', '2.1M views', '678K views'];

    return channels.map((ch, i) => ({
      id: generateId(),
      title: `${this.capitalize(query)} — ${i === 0 ? 'Everything You Need to Know' : i === 1 ? 'in 100 Seconds' : i === 2 ? 'Full Review' : i === 3 ? 'Ultimate Guide' : i === 4 ? 'Deep Dive' : 'Explained Simply'}`,
      url: `https://www.youtube.com/watch?v=${generateId()}`,
      thumbnailUrl: `https://picsum.photos/seed/vid${query.replace(/\s+/g, '')}${i}/480/270`,
      duration: durations[i],
      platform: ch.platform,
      channelName: ch.name,
      views: views[i],
      publishedAt: new Date(Date.now() - (i + 1) * 86400000 * 7).toISOString(),
      snippet: `${ch.name} covers ${query} in this ${i === 1 ? 'quick' : 'comprehensive'} video.`,
    }));
  }

  private getProductResults(query: string): ProductResult[] {
    const products = [
      { seller: 'Amazon', price: '$29.99', rating: 4.5 },
      { seller: 'Best Buy', price: '$34.99', rating: 4.3 },
      { seller: 'Walmart', price: '$24.99', rating: 4.1 },
      { seller: 'Target', price: '$32.99', rating: 4.6 },
      { seller: 'Newegg', price: '$27.49', rating: 4.4 },
      { seller: 'B&H Photo', price: '$31.00', rating: 4.7 },
    ];
    return products.map((p, i) => ({
      id: generateId(),
      title: `${this.capitalize(query)} — ${i === 0 ? 'Premium Edition' : i === 1 ? 'Pro Model' : i === 2 ? 'Essential Pack' : i === 3 ? 'Starter Kit' : i === 4 ? 'Advanced Bundle' : 'Complete Set'}`,
      price: p.price,
      currency: 'USD',
      imageUrl: `https://picsum.photos/seed/prod${query.replace(/\s+/g, '')}${i}/300/300`,
      seller: p.seller,
      sellerUrl: `https://www.${p.seller.toLowerCase().replace(/\s+/g, '')}.com`,
      rating: p.rating,
      reviewCount: Math.floor(Math.random() * 5000) + 100,
      inStock: Math.random() > 0.2,
    }));
  }

  private getForumResults(query: string): ForumResult[] {
    const forums = [
      { platform: 'reddit', sub: 'r/technology' },
      { platform: 'stackoverflow', sub: undefined },
      { platform: 'reddit', sub: 'r/askscience' },
      { platform: 'hackernews', sub: undefined },
      { platform: 'quora', sub: undefined },
      { platform: 'reddit', sub: 'r/explainlikeimfive' },
    ];
    return forums.map((f, i) => ({
      id: generateId(),
      title: `${i === 0 ? 'Discussion: ' : i === 1 ? 'How to ' : i === 2 ? 'ELI5: ' : i === 3 ? 'Show HN: ' : i === 4 ? 'What is ' : ''}${this.capitalize(query)}${i === 1 ? ' — best practices?' : i === 4 ? ' and why does it matter?' : ''}`,
      url: `https://www.${f.platform}.com/${f.sub || 'questions'}/${query.replace(/\s+/g, '-')}`,
      platform: f.platform,
      snippet: `Community discussion about ${query}. Members share experiences, insights, and recommendations based on real-world usage and expertise.`,
      author: `user_${generateId().slice(0, 5)}`,
      replies: Math.floor(Math.random() * 200) + 5,
      upvotes: Math.floor(Math.random() * 2000) + 10,
      publishedAt: new Date(Date.now() - (i + 1) * 86400000 * 3).toISOString(),
      subreddit: f.sub,
    }));
  }

  private capitalize(str: string): string {
    return str
      .split(' ')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
  }
}
