/* ──────────────────────────────────────────────
   NovaMind — Mock AI Provider
   ────────────────────────────────────────────── */

import type { Citation } from '@/types/search';
import type { IAIProvider, AIGenerateOptions, AIGenerateResult } from './index';
import { extractDomain } from '@/lib/utils';

export class MockAIProvider implements IAIProvider {
  name = 'mock';

  async generate(options: AIGenerateOptions): Promise<AIGenerateResult> {
    await new Promise(r => setTimeout(r, 500 + Math.random() * 500));

    const { query, sources, mode } = options;
    const q = this.capitalize(query);

    const citations: Citation[] = sources.slice(0, 5).map((s, i) => ({
      index: i + 1,
      url: s.url,
      title: s.title,
      domain: extractDomain(s.url),
      snippet: s.content.slice(0, 120),
    }));

    if (mode === 'overview') {
      return {
        content: `**${q}** is a widely discussed topic that spans multiple domains and applications. According to recent sources, it encompasses key developments in technology, research, and practical implementation [1][2].\n\nExperts highlight that understanding ${query} requires considering both its theoretical foundations and real-world impact. Recent analyses suggest significant growth and evolution in this area, with notable contributions from leading organizations and researchers [3][4].`,
        citations,
      };
    }

    // Full AI Mode
    return {
      content: `## Overview\n\n${q} represents a significant area of interest in modern technology and science. Based on comprehensive analysis of multiple authoritative sources, this topic involves several interconnected aspects that are important to understand [1].\n\n## Key Points\n\n- **Definition & Scope**: ${q} broadly refers to the concepts, practices, and technologies associated with this domain. It has evolved significantly over recent years, driven by advances in related fields [2].\n\n- **Current State**: The current landscape of ${query} is characterized by rapid innovation and growing adoption across industries. Major organizations are investing heavily in related research and development [3].\n\n- **Practical Applications**: Real-world applications include use cases across enterprise, consumer, and research domains. Implementation approaches vary based on specific requirements and constraints [4].\n\n## Detailed Analysis\n\nAccording to leading experts and publications, ${query} continues to evolve with new frameworks, tools, and methodologies emerging regularly. The ecosystem supports a diverse range of approaches, from foundational concepts to advanced implementations [1][2].\n\nRecent developments indicate a trend toward greater accessibility and standardization, making it easier for organizations of all sizes to leverage ${query} effectively. However, challenges remain in areas such as scalability, security, and integration with existing systems [3][5].\n\n## Future Outlook\n\nThe trajectory of ${query} suggests continued growth and maturation. Key trends to watch include improved tooling, enhanced interoperability, and broader adoption across new sectors. Industry analysts predict that the next few years will see significant milestones in this space [4][5].\n\n## Important Considerations\n\nWhile ${query} offers substantial benefits, it's important to approach it with a clear understanding of both its capabilities and limitations. Successful implementation typically requires careful planning, appropriate expertise, and ongoing optimization [2][3].`,
      citations,
      followUpQuestions: [
        `What are the best tools for ${query}?`,
        `How does ${query} compare to alternatives?`,
        `What are the latest trends in ${query} for 2025?`,
        `What are common challenges with ${query}?`,
      ],
    };
  }

  async generateRelatedSearches(query: string): Promise<string[]> {
    await new Promise(r => setTimeout(r, 200));
    return [
      `${query} explained`,
      `${query} vs alternatives`,
      `best ${query} tools 2025`,
      `${query} tutorial`,
      `${query} examples`,
      `how to use ${query}`,
      `${query} benefits and drawbacks`,
      `${query} for beginners`,
    ];
  }

  async generateFAQ(query: string, sources: { title: string; url: string; content: string }[]): Promise<{ question: string; answer: string; citations: Citation[] }[]> {
    await new Promise(r => setTimeout(r, 300));
    const q = this.capitalize(query);
    const cite = (i: number): Citation => ({
      index: i + 1,
      url: sources[i]?.url || '#',
      title: sources[i]?.title || '',
      domain: sources[i]?.url ? extractDomain(sources[i].url) : '',
    });

    return [
      {
        question: `What is ${q}?`,
        answer: `${q} is a broad concept that encompasses various technologies, methodologies, and practices. It has gained significant attention in recent years due to its wide-ranging applications and impact across industries [1].`,
        citations: [cite(0)],
      },
      {
        question: `How does ${q} work?`,
        answer: `${q} works by leveraging a combination of foundational principles and modern techniques. The core mechanism involves processing, analyzing, and applying information in structured ways to achieve specific outcomes [2].`,
        citations: [cite(1)],
      },
      {
        question: `What are the benefits of ${q}?`,
        answer: `Key benefits include improved efficiency, better decision-making capabilities, enhanced scalability, and reduced operational costs. Organizations report significant ROI when implementing ${query} effectively [3].`,
        citations: [cite(2)],
      },
      {
        question: `Is ${q} suitable for beginners?`,
        answer: `Yes, there are many resources and tools designed to make ${query} accessible to beginners. Starting with foundational concepts and gradually building expertise is the recommended approach [4].`,
        citations: [cite(3)],
      },
    ];
  }

  async extractEntity(query: string): Promise<{
    title: string; subtitle?: string; category?: string; description: string;
    facts: { label: string; value: string }[]; sourceUrl?: string; sourceName?: string;
  } | null> {
    await new Promise(r => setTimeout(r, 200));

    // Only return entities for certain query patterns
    const entityKeywords = ['python', 'javascript', 'react', 'google', 'apple', 'microsoft', 'openai', 'tesla', 'ai', 'machine learning', 'elon musk', 'blockchain', 'bitcoin'];
    const q = query.toLowerCase();
    const isEntity = entityKeywords.some(k => q.includes(k));

    if (!isEntity && q.length < 15) {
      return {
        title: this.capitalize(query),
        subtitle: 'Technology / Concept',
        category: 'Technology',
        description: `${this.capitalize(query)} is a notable topic in the technology and innovation space. It encompasses various aspects including research, development, and practical applications across multiple industries.`,
        facts: [
          { label: 'Category', value: 'Technology' },
          { label: 'Relevance', value: 'High' },
          { label: 'Trending', value: 'Yes' },
          { label: 'First Mentioned', value: '2020' },
        ],
        sourceUrl: `https://en.wikipedia.org/wiki/${encodeURIComponent(query)}`,
        sourceName: 'Wikipedia',
      };
    }

    if (!isEntity) return null;

    return {
      title: this.capitalize(query),
      subtitle: 'Technology / Organization',
      category: 'Technology',
      description: `${this.capitalize(query)} is a prominent entity in the technology sector. It has played a significant role in shaping modern innovation, with influence spanning research, commercial products, and industry standards.`,
      facts: [
        { label: 'Type', value: 'Technology' },
        { label: 'Industry', value: 'Information Technology' },
        { label: 'Status', value: 'Active' },
        { label: 'Global Reach', value: 'Worldwide' },
        { label: 'Year', value: '2020+' },
      ],
      sourceUrl: `https://en.wikipedia.org/wiki/${encodeURIComponent(query)}`,
      sourceName: 'Wikipedia',
    };
  }

  private capitalize(str: string): string {
    return str.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  }
}
