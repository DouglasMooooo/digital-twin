import { NextRequest, NextResponse } from 'next/server';
import { getAnalyticsMetrics, exportLogs, clearOldLogs } from '@/lib/analytics';

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
  const timeRange = searchParams.get('timeRange') as 'day' | 'week' | 'month' | 'all' || 'all';
  const action = searchParams.get('action');

  try {
    switch (action) {
      case 'export':
        const exportData = exportLogs();
        return new NextResponse(exportData, {
          headers: {
            'Content-Type': 'application/json',
            'Content-Disposition': `attachment; filename="chat-logs-${new Date().toISOString()}.json"`,
          },
        });
      
      default:
        const metrics = getAnalyticsMetrics(timeRange);
        return NextResponse.json({ metrics });
    }
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  // Check authentication
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const daysToKeep = parseInt(searchParams.get('days') || '30');
    
    const deletedCount = clearOldLogs(daysToKeep);
    
    return NextResponse.json({ 
      success: true, 
      deletedCount,
      message: `Deleted ${deletedCount} old logs` 
    });
  } catch (error) {
    console.error('Error clearing logs:', error);
    return NextResponse.json(
      { error: 'Failed to clear logs' },
      { status: 500 }
    );
  }
}
