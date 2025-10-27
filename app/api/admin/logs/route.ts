import { NextRequest, NextResponse } from 'next/server';
import { getChatLogs, getSessionLogs, getVisitorSessions, searchLogs } from '@/lib/analytics';

// Simple authentication (replace with proper auth in production)
function isAuthenticated(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123'; // Change this!
  
  return authHeader === `Bearer ${adminPassword}`;
}

export async function GET(request: NextRequest) {
  // Check authentication
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');
  const sessionId = searchParams.get('sessionId');
  const keyword = searchParams.get('keyword');
  const limit = searchParams.get('limit');

  try {
    switch (action) {
      case 'sessions':
        return NextResponse.json({ sessions: getVisitorSessions() });
      
      case 'session-logs':
        if (!sessionId) {
          return NextResponse.json({ error: 'Session ID required' }, { status: 400 });
        }
        return NextResponse.json({ logs: getSessionLogs(sessionId) });
      
      case 'search':
        if (!keyword) {
          return NextResponse.json({ error: 'Keyword required' }, { status: 400 });
        }
        return NextResponse.json({ logs: searchLogs(keyword) });
      
      default:
        const logs = getChatLogs(limit ? parseInt(limit) : undefined);
        return NextResponse.json({ logs });
    }
  } catch (error) {
    console.error('Error fetching logs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch logs' },
      { status: 500 }
    );
  }
}
