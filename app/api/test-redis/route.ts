import { NextRequest, NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';

export async function GET(request: NextRequest) {
  try {
    // Check if environment variables are set
    if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
      return NextResponse.json({
        success: false,
        error: 'Redis credentials not configured',
        env: {
          hasUrl: !!process.env.UPSTASH_REDIS_REST_URL,
          hasToken: !!process.env.UPSTASH_REDIS_REST_TOKEN,
        }
      }, { status: 500 });
    }

    const redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });

    // Test ping
    const pong = await redis.ping();

    // Test set/get
    await redis.set('test_connection', Date.now());
    const value = await redis.get('test_connection');

    // Get current log count
    const logCount = await redis.llen('digital_twin:chat_logs');

    return NextResponse.json({
      success: true,
      message: 'Redis connection working!',
      tests: {
        ping: pong,
        setGet: value,
        chatLogsCount: logCount,
      },
      config: {
        url: process.env.UPSTASH_REDIS_REST_URL.substring(0, 30) + '...',
        tokenLength: process.env.UPSTASH_REDIS_REST_TOKEN.length,
      }
    });

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    }, { status: 500 });
  }
}
