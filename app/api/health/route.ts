// Health Check API Endpoint

import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  uptime: number;
  version: string;
  services: {
    database: 'up' | 'down';
    redis: 'up' | 'down';
    llm: 'up' | 'down';
  };
  metrics: {
    totalRequests: number;
    averageResponseTime: number;
    errorRate: number;
  };
}

export async function GET(request: NextRequest) {
  try {
    const startTime = Date.now();

    // Check Upstash Vector DB
    const vectorStatus = await checkVectorDB();

    // Check Upstash Redis
    const redisStatus = await checkRedis();

    // Check Groq LLM
    const llmStatus = await checkLLM();

    // Determine overall status
    const allServicesUp = vectorStatus && redisStatus && llmStatus;
    const someServicesUp = vectorStatus || redisStatus || llmStatus;

    const healthStatus: HealthStatus = {
      status: allServicesUp ? 'healthy' : someServicesUp ? 'degraded' : 'unhealthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime ? process.uptime() : 0,
      version: process.env.npm_package_version || '2.0.0',
      services: {
        database: vectorStatus ? 'up' : 'down',
        redis: redisStatus ? 'up' : 'down',
        llm: llmStatus ? 'up' : 'down',
      },
      metrics: {
        totalRequests: 0, // Would come from Redis analytics
        averageResponseTime: Date.now() - startTime,
        errorRate: 0, // Would come from Redis analytics
      },
    };

    const statusCode = healthStatus.status === 'healthy' ? 200 : healthStatus.status === 'degraded' ? 200 : 503;

    return NextResponse.json(healthStatus, { status: statusCode });
  } catch (error) {
    console.error('Health check failed:', error);

    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 503 }
    );
  }
}

async function checkVectorDB(): Promise<boolean> {
  try {
    if (!process.env.UPSTASH_VECTOR_REST_URL || !process.env.UPSTASH_VECTOR_REST_TOKEN) {
      return false;
    }

    const response = await fetch(`${process.env.UPSTASH_VECTOR_REST_URL}/info`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${process.env.UPSTASH_VECTOR_REST_TOKEN}`,
      },
      signal: AbortSignal.timeout(5000), // 5s timeout
    });

    return response.ok;
  } catch (error) {
    console.error('Vector DB health check failed:', error);
    return false;
  }
}

async function checkRedis(): Promise<boolean> {
  try {
    if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
      return false;
    }

    const response = await fetch(`${process.env.UPSTASH_REDIS_REST_URL}/ping`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`,
      },
      signal: AbortSignal.timeout(5000), // 5s timeout
    });

    return response.ok;
  } catch (error) {
    console.error('Redis health check failed:', error);
    return false;
  }
}

async function checkLLM(): Promise<boolean> {
  try {
    if (!process.env.GROQ_API_KEY) {
      return false;
    }

    const response = await fetch('https://api.groq.com/openai/v1/models', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      signal: AbortSignal.timeout(5000), // 5s timeout
    });

    return response.ok;
  } catch (error) {
    console.error('LLM health check failed:', error);
    return false;
  }
}
