/**
 * Feedback Collection API
 * Stores user feedback for quality improvement
 */

import { NextRequest, NextResponse } from 'next/server';
import { redis } from '@/lib/redis-analytics';

export const runtime = 'edge';

interface FeedbackData {
  questionId: string;
  question: string;
  answer: string;
  rating: number; // 1-5 stars
  comment?: string;
  category?: string;
  timestamp: string;
  sessionId?: string;
  helpful: boolean;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      questionId,
      question,
      answer,
      rating,
      comment,
      category,
      sessionId
    } = body;

    // Validate input
    if (!questionId || !question || !answer || typeof rating !== 'number') {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    const feedback: FeedbackData = {
      questionId,
      question,
      answer,
      rating,
      comment: comment || '',
      category: category || 'general',
      timestamp: new Date().toISOString(),
      sessionId: sessionId || 'anonymous',
      helpful: rating >= 4
    };

    // Store feedback in Redis
    const feedbackKey = 'digital_twin:feedback';
    await redis.lpush(feedbackKey, JSON.stringify(feedback));

    // Keep only last 1000 feedbacks
    await redis.ltrim(feedbackKey, 0, 999);

    // Update feedback stats
    await updateFeedbackStats(rating, feedback.helpful);

    return NextResponse.json({
      success: true,
      message: 'Feedback received',
      feedbackId: questionId
    });

  } catch (error) {
    console.error('Feedback API error:', error);
    return NextResponse.json(
      { error: 'Failed to save feedback' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const minRating = parseInt(searchParams.get('minRating') || '1');

    // Get feedback from Redis
    const feedbackKey = 'digital_twin:feedback';
    const feedbackList = await redis.lrange(feedbackKey, 0, limit - 1);

    const feedbacks = feedbackList
      .map((item: string) => {
        try {
          return JSON.parse(item);
        } catch {
          return null;
        }
      })
      .filter(Boolean)
      .filter((fb: FeedbackData) => fb.rating >= minRating);

    // Get stats
    const stats = await getFeedbackStats();

    return NextResponse.json({
      feedbacks,
      stats,
      total: feedbacks.length
    });

  } catch (error) {
    console.error('Get feedback error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve feedback' },
      { status: 500 }
    );
  }
}

async function updateFeedbackStats(rating: number, helpful: boolean) {
  try {
    const statsKey = 'digital_twin:feedback_stats';
    
    // Increment total count
    await redis.hincrby(statsKey, 'total_count', 1);
    
    // Update rating sum
    await redis.hincrby(statsKey, 'rating_sum', rating);
    
    // Increment helpful count if applicable
    if (helpful) {
      await redis.hincrby(statsKey, 'helpful_count', 1);
    }
    
    // Increment rating bucket
    await redis.hincrby(statsKey, `rating_${rating}_count`, 1);
    
  } catch (error) {
    console.error('Error updating feedback stats:', error);
  }
}

async function getFeedbackStats() {
  try {
    const statsKey = 'digital_twin:feedback_stats';
    const stats = await redis.hgetall(statsKey);
    
    const totalCount = parseInt(stats.total_count || '0');
    const ratingSum = parseInt(stats.rating_sum || '0');
    const helpfulCount = parseInt(stats.helpful_count || '0');
    
    return {
      totalFeedback: totalCount,
      averageRating: totalCount > 0 ? (ratingSum / totalCount).toFixed(2) : '0',
      helpfulRate: totalCount > 0 ? ((helpfulCount / totalCount) * 100).toFixed(1) : '0',
      ratingDistribution: {
        5: parseInt(stats.rating_5_count || '0'),
        4: parseInt(stats.rating_4_count || '0'),
        3: parseInt(stats.rating_3_count || '0'),
        2: parseInt(stats.rating_2_count || '0'),
        1: parseInt(stats.rating_1_count || '0'),
      }
    };
    
  } catch (error) {
    console.error('Error getting feedback stats:', error);
    return {
      totalFeedback: 0,
      averageRating: '0',
      helpfulRate: '0',
      ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    };
  }
}
