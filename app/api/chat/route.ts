import { NextRequest, NextResponse } from 'next/server';
import { generateAIResponse } from '@/lib/llm';
import { searchRelevantContext } from '@/lib/vectordb';
import { logChatInteraction } from '@/lib/analytics';
import { Redis } from '@upstash/redis';

// Initialize Redis client
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || '',
  token: process.env.UPSTASH_REDIS_REST_TOKEN || '',
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
let successResponse = false;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
let isFromCache = false;

/**
 * POST /api/chat
 * Handles user interview questions
 */
export async function POST(request: NextRequest) {
  const startTime = Date.now();
  let sessionId = '';
  let question = '';
  let ipAddress = '';

  try {
    // Parse request body
    const body = await request.json();
    question = body.question || '';
    sessionId = body.sessionId || `session-${Date.now()}`;

    // Get IP address
    ipAddress =
      request.headers.get('x-forwarded-for')?.split(',')[0] ||
      request.headers.get('x-real-ip') ||
      'unknown';

    // Validate input
    if (!question || question.trim().length === 0) {
      return NextResponse.json({ error: 'Question is required' }, { status: 400 });
    }

    // Check cache first
    const cacheKey = `chat:${question.toLowerCase().trim()}`;
    const cached = await redis.get(cacheKey);

    if (cached && typeof cached === 'string') {
      const responseTime = Date.now() - startTime;

      // Log analytics
      await logChatInteraction({
        sessionId,
        question,
        response: cached,
        responseTime,
        ipAddress,
        success: true,
        fromCache: true,
      });

      isFromCache = true;
      return NextResponse.json({
        response: cached,
        sessionId,
        fromCache: true,
        responseTime,
      });
    }

    // Search relevant context from vector database
    const context = await searchRelevantContext(question);

    // Generate AI response
    const response = await generateAIResponse(question, context);

    // Cache the response (expire after 1 hour)
    await redis.set(cacheKey, response, { ex: 3600 });

    const responseTime = Date.now() - startTime;

    // Log analytics
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    successResponse = true;
    await logChatInteraction({
      sessionId,
      question,
      response,
      responseTime,
      ipAddress,
      success: true,
      fromCache: false,
    });

    return NextResponse.json({
      response,
      sessionId,
      fromCache: false,
      responseTime,
    });
  } catch (error: unknown) {
    const responseTime = Date.now() - startTime;
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';

    console.error('Error processing chat request:', error);

    // Log error to analytics
    try {
      await logChatInteraction({
        sessionId,
        question,
        response: '',
        responseTime,
        ipAddress,
        success: false,
        error: errorMessage,
      });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_e) {
      // Ignore logging errors
    }

    return NextResponse.json(
      { error: 'Failed to generate response' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/chat
 * Returns API status
 */
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    message: 'Chat API is running',
    endpoints: {
      POST: '/api/chat - Send interview questions',
    },
  });
}
