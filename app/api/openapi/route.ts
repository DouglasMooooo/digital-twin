import { NextResponse } from 'next/server';

/**
 * 简单直接的 OpenAPI 规范响应
 * 绕过导入路径问题
 */
export async function GET() {
  const openapiSpec = {
    "openapi": "3.1.0",
    "info": {
      "title": "Douglas Mo Digital Twin API",
      "description": "Query Douglas Mo's professional background, skills, projects, and experience through his AI-powered digital twin.",
      "version": "2.0.0",
      "contact": {
        "name": "Douglas Mo",
        "url": "https://douglasmo.vercel.app"
      }
    },
    "servers": [
      {
        "url": "https://douglasmo.vercel.app",
        "description": "Production API"
      }
    ],
    "paths": {
      "/api/chat": {
        "post": {
          "operationId": "queryDigitalTwin",
          "summary": "Chat with Douglas Mo's digital twin",
          "description": "Send a question to get information about Douglas's experience, skills, and projects",
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "required": ["message"],
                  "properties": {
                    "message": {
                      "type": "string",
                      "description": "Your question",
                      "minLength": 1,
                      "maxLength": 1000
                    }
                  }
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Successful response",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "answer": {
                        "type": "string",
                        "description": "AI-generated response"
                      },
                      "sources": {
                        "type": "array",
                        "items": {
                          "type": "string"
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  };

  return NextResponse.json(openapiSpec, {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Cache-Control': 'public, s-maxage=3600',
    },
  });
}

export async function OPTIONS() {
  return NextResponse.json(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
    },
  });
}
