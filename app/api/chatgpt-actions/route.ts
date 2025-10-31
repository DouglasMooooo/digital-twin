import { NextResponse } from 'next/server';
import openapiSchema from '@/chatgpt-actions/openapi.json';

/**
 * GET /api/chatgpt-actions
 * 
 * 返回 OpenAPI 3.1.0 规范，供 ChatGPT Actions 使用
 * 
 * 使用场景：
 * - ChatGPT 自定义 GPT 导入 Schema
 * - 第三方工具集成
 * - 自动化测试
 * 
 * 返回: OpenAPI 规范 JSON
 * 状态码: 200 (成功) | 500 (错误)
 */
export async function GET() {
  try {
    return NextResponse.json(openapiSchema, {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    console.error('[ChatGPT Actions] Failed to load OpenAPI schema:', error);
    return NextResponse.json(
      {
        error: 'Failed to load OpenAPI schema',
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      { 
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  }
}

/**
 * OPTIONS /api/chatgpt-actions
 * 
 * CORS 预检请求处理
 */
export async function OPTIONS() {
  return NextResponse.json(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400',
    },
  });
}
