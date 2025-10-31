/**
 * API Route Tests for /api/chat
 * Tests the chat endpoint functionality
 */

import { describe, it, expect, beforeAll } from '@jest/globals';

// Mock environment variables for testing
process.env.UPSTASH_VECTOR_REST_URL = process.env.UPSTASH_VECTOR_REST_URL || 'mock-url';
process.env.UPSTASH_VECTOR_REST_TOKEN = process.env.UPSTASH_VECTOR_REST_TOKEN || 'mock-token';
process.env.GROQ_API_KEY = process.env.GROQ_API_KEY || 'mock-key';

describe('Chat API Route', () => {
  const baseURL = process.env.TEST_URL || 'http://localhost:3000';

  describe('POST /api/chat', () => {
    it('should return 400 if message is missing', async () => {
      const response = await fetch(`${baseURL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.error).toBeDefined();
    });

    it('should return 400 if message is empty', async () => {
      const response = await fetch(`${baseURL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: '' }),
      });

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.error).toBeDefined();
    });

    it('should successfully process a valid technical question', async () => {
      const response = await fetch(`${baseURL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: 'What is your experience with Python?',
          conversationHistory: [],
        }),
      });

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.response).toBeDefined();
      expect(typeof data.response).toBe('string');
      expect(data.response.length).toBeGreaterThan(0);
    }, 15000); // 15s timeout for LLM response

    it('should successfully process a behavioral question', async () => {
      const response = await fetch(`${baseURL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: 'Tell me about a time you faced a challenge',
          conversationHistory: [],
        }),
      });

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.response).toBeDefined();
      expect(data.response).toContain('Situation');
    }, 15000);

    it('should handle conversation history correctly', async () => {
      const conversationHistory = [
        { role: 'user' as const, content: 'What is your experience with Python?' },
        { role: 'assistant' as const, content: 'I have 1.5 years of Python experience...' },
      ];

      const response = await fetch(`${baseURL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: 'Can you tell me more about your projects?',
          conversationHistory,
        }),
      });

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.response).toBeDefined();
    }, 15000);

    it('should respond within acceptable time limit', async () => {
      const startTime = Date.now();
      
      const response = await fetch(`${baseURL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: 'What are your skills?',
        }),
      });

      const endTime = Date.now();
      const responseTime = (endTime - startTime) / 1000;

      expect(response.status).toBe(200);
      expect(responseTime).toBeLessThan(5); // Should respond within 5 seconds
    }, 15000);
  });

  describe('Error Handling', () => {
    it('should handle malformed JSON gracefully', async () => {
      const response = await fetch(`${baseURL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: 'invalid json',
      });

      expect(response.status).toBeGreaterThanOrEqual(400);
    });

    it('should return GET 405 Method Not Allowed', async () => {
      const response = await fetch(`${baseURL}/api/chat`, {
        method: 'GET',
      });

      expect(response.status).toBe(405);
    });
  });
});
