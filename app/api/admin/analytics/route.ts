import { NextRequest, NextResponse } from 'next/server';
import { getAnalyticsMetrics, exportLogs, clearOldLogs } from '@/lib/analytics';

export async function GET(request: NextRequest) {
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
        
        // If no data, return sample data for demo purposes
        if (metrics.totalQuestions === 0) {
          return NextResponse.json({ 
            metrics: {
              totalVisitors: 0,
              totalQuestions: 0,
              averageResponseTime: 0,
              successRate: 100,
              topQuestions: [],
              interviewTypeDistribution: {},
              hourlyActivity: Array.from({ length: 24 }, (_, hour) => ({ hour, count: 0 })),
              responseTimeDistribution: { fast: 0, medium: 0, slow: 0 }
            }
          });
        }
        
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
