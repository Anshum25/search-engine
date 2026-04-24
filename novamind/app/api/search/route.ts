import { NextRequest, NextResponse } from 'next/server';
import { executeSearch } from '@/services/ragPipeline';
import type { SearchTab } from '@/types/search';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const query = searchParams.get('q');
  const tab = (searchParams.get('tab') || 'all') as SearchTab;

  if (!query) {
    return NextResponse.json({ error: 'Query parameter "q" is required' }, { status: 400 });
  }

  // Try Python backend first, fall back to local TypeScript mock pipeline
  const backendUrl = process.env.PYTHON_BACKEND_URL || 'http://127.0.0.1:8000';

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);

    const fRes = await fetch(`${backendUrl}/api/search?q=${encodeURIComponent(query)}&tab=${tab}`, {
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!fRes.ok) {
      throw new Error(`Python backend returned ${fRes.status}`);
    }

    const data = await fRes.json();
    return NextResponse.json(data);
  } catch {
    // Python backend unavailable — fall back to TypeScript mock pipeline
    console.log('Python backend unavailable, using local mock pipeline');
    try {
      const data = await executeSearch(query, tab);
      return NextResponse.json(data);
    } catch (err: unknown) {
      console.error('Local pipeline also failed:', err);
      return NextResponse.json(
        { error: 'Search pipeline failed' },
        { status: 500 }
      );
    }
  }
}
