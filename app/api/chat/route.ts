import { NextRequest, NextResponse } from 'next/server';
import { searchRelevantContext } from '@/lib/vectordb';
import { generateAIResponse, analyzeQuestionType, ChatMessage } from '@/lib/llm';
import { logChatInteraction } from '@/lib/analytics';
import { responseCache, generateCacheKey } from '@/lib/cache';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  const startTime = Date.now();
  let success = false;
  let errorMessage: string | undefined;
  let responseText = '';
  let contextType: 'screening' | 'hr' | 'technical' | 'manager' | 'executive' = 'hr';
  let contextChunks = 0;
  let fromCache = false;

  try {
    const { message, conversationHistory, interviewType } = await req.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Check cache for common questions (only if no conversation history)
    if (!conversationHistory || conversationHistory.length === 0) {
      const cacheKey = generateCacheKey(message, interviewType);
      const cachedResponse = responseCache.get(cacheKey);
      
      if (cachedResponse) {
        fromCache = true;
        success = true;
        responseText = cachedResponse;
        
        const responseTime = Date.now() - startTime;
        
        // Log cached response
        await logChatInteraction({
          message,
          response: cachedResponse,
          type: interviewType || 'hr',
          responseTime,
          success: true,
          fromCache: true,
        });

        return NextResponse.json({
          response: cachedResponse,
          fromCache: true,
          responseTime,
        });
      }
    }

    // Get session info from headers
    const sessionId = req.headers.get('x-session-id') || undefined;
    const userAgent = req.headers.get('user-agent') || undefined;
    const ipAddress = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || undefined;

    // Determine interview type if not provided
    contextType = interviewType || analyzeQuestionType(message);

    // Search for relevant context from vector database
    const relevantContext = await searchRelevantContext(message, 5);
    const contextStrings = relevantContext.map((ctx) => ctx.content);
    contextChunks = relevantContext.length;

    // Generate AI response
    responseText = await generateAIResponse(
      message,
      {
        type: contextType,
        relevantContext: contextStrings,
      },
      conversationHistory || []
    );

    success = true;

    // Cache response for common questions (only if no conversation history)
    if (!conversationHistory || conversationHistory.length === 0) {
      const cacheKey = generateCacheKey(message, interviewType);
      responseCache.set(cacheKey, responseText, 3600); // 1 hour TTL
    }

    // Log the interaction
    const responseTime = Date.now() - startTime;
    logChatInteraction({
      userMessage: message,
      aiResponse: responseText,
      responseTime,
      interviewType: contextType,
      contextChunks,
      sessionId,
      userAgent,
      ipAddress,
      success: true,
    });

    return NextResponse.json({
      response: responseText,
      interviewType: contextType,
      sourcesUsed: relevantContext.map((ctx) => ctx.source),
    });
  } catch (error) {
    console.error('Error in chat API:', error);
    errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    // Log failed interaction
    const responseTime = Date.now() - startTime;
    const sessionId = req.headers.get('x-session-id') || undefined;
    const userAgent = req.headers.get('user-agent') || undefined;
    const ipAddress = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || undefined;

    try {
      const { message } = await req.json();
      logChatInteraction({
        userMessage: message || 'Parse error',
        aiResponse: '',
        responseTime,
        interviewType: contextType,
        contextChunks,
        sessionId,
        userAgent,
        ipAddress,
        success: false,
        error: errorMessage,
      });
    } catch (e) {
      // Ignore logging errors
    }

    return NextResponse.json(
      { error: 'Failed to generate response' },
      { status: 500 }
    );
  }
}
