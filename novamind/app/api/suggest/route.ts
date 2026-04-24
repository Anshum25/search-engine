import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const query = searchParams.get('q');

  if (!query) {
    return NextResponse.json({ suggestions: [] });
  }

  try {
    // Proxy request to the Real-Time Python FastAPI Backend
    const backendUrl = process.env.PYTHON_BACKEND_URL || 'http://127.0.0.1:8000';
    const fRes = await fetch(`${backendUrl}/api/suggest?q=${encodeURIComponent(query)}`);
    
    if (!fRes.ok) {
        return NextResponse.json({ suggestions: [] });
    }
    
    const data = await fRes.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ suggestions: [] });
  }
}
