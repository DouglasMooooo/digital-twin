/**
 * Quality Improvement API
 * 
 * Endpoint for admin dashboard to trigger quality improvement analysis
 * and retrieve improvement recommendations.
 */

import { NextRequest, NextResponse } from 'next/server';
import { runQualityImprovement, analyzeFeedback } from '@/lib/quality-improvement';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const minRating = parseInt(searchParams.get('minRating') || '3');
    const format = searchParams.get('format') || 'json'; // 'json' or 'summary'
    
    // Run quality improvement analysis
    const report = await analyzeFeedback(minRating);
    
    if (format === 'summary') {
      // Return simplified summary for quick viewing
      return NextResponse.json({
        success: true,
        summary: {
          analysisDate: report.analysisDate,
          totalFeedback: report.totalFeedbackAnalyzed,
          lowScoringQueries: report.lowScoringQueries,
          averageRating: report.averageRating.toFixed(2),
          averageAccuracy: report.averageAccuracy.toFixed(1),
          totalGaps: report.identifiedGaps.length,
          highPriorityGaps: report.identifiedGaps.filter(g => g.priority === 'HIGH').length,
          mediumPriorityGaps: report.identifiedGaps.filter(g => g.priority === 'MEDIUM').length,
          topGaps: report.identifiedGaps.slice(0, 5).map(g => ({
            topic: g.topic,
            priority: g.priority,
            frequency: g.frequency,
            avgScore: g.avgScore.toFixed(2)
          })),
          topRecommendations: report.priorityRecommendations.slice(0, 5)
        }
      });
    }
    
    // Return full report
    return NextResponse.json({
      success: true,
      report
    });
    
  } catch (error) {
    console.error('Quality improvement analysis error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Analysis failed'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      minRating = 3,
      exportJSON = false,
      exportMarkdown = false
    } = body;
    
    // Run full quality improvement with optional file exports
    const report = await runQualityImprovement({
      minRating,
      exportJSON,
      exportMarkdown,
      outputDir: process.cwd()
    });
    
    return NextResponse.json({
      success: true,
      message: 'Quality improvement analysis completed',
      report,
      filesGenerated: {
        json: exportJSON,
        markdown: exportMarkdown
      }
    });
    
  } catch (error) {
    console.error('Quality improvement analysis error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Analysis failed'
      },
      { status: 500 }
    );
  }
}
