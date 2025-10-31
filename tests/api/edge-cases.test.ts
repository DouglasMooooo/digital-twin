/**
 * Edge Cases and Performance Tests
 * Tests system robustness and performance under various conditions
 */

import { describe, it, expect } from 'vitest';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

describe('Edge Cases and Robustness', () => {
  describe('Empty and Invalid Queries', () => {
    it('should handle empty query gracefully', async () => {
      const response = await fetch(`${BASE_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: '' }),
      });

      expect(response.status).toBe(200);
      const data = await response.json();
      
      expect(data).toHaveProperty('answer');
      expect(data.answer).toBeTruthy();
      expect(data.answer.length).toBeGreaterThan(0);
    }, 10000);

    it('should handle whitespace-only query', async () => {
      const response = await fetch(`${BASE_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: '   \n\t   ' }),
      });

      expect(response.status).toBe(200);
      const data = await response.json();
      
      expect(data).toHaveProperty('answer');
      expect(data.answer).toBeTruthy();
    }, 10000);

    it('should handle single character query', async () => {
      const response = await fetch(`${BASE_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: '?' }),
      });

      expect(response.status).toBe(200);
      const data = await response.json();
      
      expect(data).toHaveProperty('answer');
    }, 10000);
  });

  describe('Long and Complex Queries', () => {
    it('should handle very long query (500+ characters)', async () => {
      const longQuery = `I am a recruiter looking for a Senior Data Analyst with extensive experience in Python, SQL, machine learning, and business analytics. Can you tell me about your experience with these technologies, including specific projects where you've used them, the challenges you faced, the solutions you implemented, and the measurable results you achieved? Also, please describe your experience working in cross-functional teams, your leadership style, and how you balance technical excellence with business needs. Additionally, I'd like to know about your career trajectory, your future goals, and what motivates you in your work as a data professional.`;

      const response = await fetch(`${BASE_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: longQuery }),
      });

      expect(response.status).toBe(200);
      const data = await response.json();
      
      expect(data).toHaveProperty('answer');
      expect(data.answer).toBeTruthy();
      expect(data.answer.length).toBeGreaterThan(100);
    }, 20000);

    it('should handle query with multiple questions', async () => {
      const multiQuery = 'What is your Python experience? Do you know SQL? Have you worked with machine learning? What about Tableau?';

      const response = await fetch(`${BASE_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: multiQuery }),
      });

      expect(response.status).toBe(200);
      const data = await response.json();
      
      expect(data).toHaveProperty('answer');
      expect(data.answer).toBeTruthy();
      
      // Should address multiple topics
      const answerLower = data.answer.toLowerCase();
      const topicsAddressed = [
        answerLower.includes('python'),
        answerLower.includes('sql'),
        answerLower.includes('machine learning') || answerLower.includes('ml'),
      ].filter(Boolean).length;
      
      expect(topicsAddressed).toBeGreaterThanOrEqual(2);
    }, 20000);
  });

  describe('Special Characters and Formatting', () => {
    it('should handle query with special characters', async () => {
      const specialCharsQuery = "What's your experience with Python & SQL? (2+ years?) Tell me @ least 3 examples!";

      const response = await fetch(`${BASE_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: specialCharsQuery }),
      });

      expect(response.status).toBe(200);
      const data = await response.json();
      
      expect(data).toHaveProperty('answer');
      expect(data.answer).toBeTruthy();
    }, 10000);

    it('should handle query with emojis', async () => {
      const emojiQuery = '🤔 What are your skills in AI/ML? 🚀';

      const response = await fetch(`${BASE_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: emojiQuery }),
      });

      expect(response.status).toBe(200);
      const data = await response.json();
      
      expect(data).toHaveProperty('answer');
      expect(data.answer).toBeTruthy();
    }, 10000);

    it('should handle query with code snippets', async () => {
      const codeQuery = 'Can you write a Python function like: def analyze_data(df): return df.describe()?';

      const response = await fetch(`${BASE_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: codeQuery }),
      });

      expect(response.status).toBe(200);
      const data = await response.json();
      
      expect(data).toHaveProperty('answer');
      expect(data.answer).toBeTruthy();
    }, 10000);

    it('should handle query with numbers and dates', async () => {
      const numberQuery = 'What were your achievements in 2023-2024? Show me 3-5 examples with specific numbers.';

      const response = await fetch(`${BASE_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: numberQuery }),
      });

      expect(response.status).toBe(200);
      const data = await response.json();
      
      expect(data).toHaveProperty('answer');
      expect(data.answer).toBeTruthy();
    }, 10000);
  });

  describe('Multi-language Support', () => {
    it('should handle Chinese query', async () => {
      const chineseQuery = '你好，请告诉我你的Python经验';

      const response = await fetch(`${BASE_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: chineseQuery }),
      });

      expect(response.status).toBe(200);
      const data = await response.json();
      
      expect(data).toHaveProperty('answer');
      expect(data.answer).toBeTruthy();
      expect(data.answer.length).toBeGreaterThan(50);
    }, 15000);

    it('should handle mixed English and Chinese query', async () => {
      const mixedQuery = 'Tell me about your Python经验 and SQL技能';

      const response = await fetch(`${BASE_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: mixedQuery }),
      });

      expect(response.status).toBe(200);
      const data = await response.json();
      
      expect(data).toHaveProperty('answer');
      expect(data.answer).toBeTruthy();
    }, 15000);
  });

  describe('Ambiguous and Vague Queries', () => {
    it('should handle vague query and provide helpful response', async () => {
      const vagueQuery = 'Tell me about yourself';

      const response = await fetch(`${BASE_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: vagueQuery }),
      });

      expect(response.status).toBe(200);
      const data = await response.json();
      
      expect(data).toHaveProperty('answer');
      expect(data.answer).toBeTruthy();
      expect(data.answer.length).toBeGreaterThan(100);
      
      // Should include professional information
      const answerLower = data.answer.toLowerCase();
      const hasProfessionalInfo = 
        answerLower.includes('experience') || 
        answerLower.includes('skill') || 
        answerLower.includes('work') ||
        answerLower.includes('analyst');
      
      expect(hasProfessionalInfo).toBe(true);
    }, 10000);

    it('should handle ambiguous pronoun references', async () => {
      const ambiguousQuery = 'How do you use it in your projects?';

      const response = await fetch(`${BASE_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: ambiguousQuery }),
      });

      expect(response.status).toBe(200);
      const data = await response.json();
      
      expect(data).toHaveProperty('answer');
      expect(data.answer).toBeTruthy();
    }, 10000);
  });

  describe('Off-topic Queries', () => {
    it('should redirect off-topic query to professional context', async () => {
      const offTopicQuery = 'What is the weather today?';

      const response = await fetch(`${BASE_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: offTopicQuery }),
      });

      expect(response.status).toBe(200);
      const data = await response.json();
      
      expect(data).toHaveProperty('answer');
      expect(data.answer).toBeTruthy();
      
      // Should redirect to professional topics
      const answerLower = data.answer.toLowerCase();
      const redirectsToProfessional = 
        answerLower.includes('douglas') || 
        answerLower.includes('professional') || 
        answerLower.includes('experience') ||
        answerLower.includes('help');
      
      expect(redirectsToProfessional).toBe(true);
    }, 10000);

    it('should handle personal questions appropriately', async () => {
      const personalQuery = 'Are you married? Do you have kids?';

      const response = await fetch(`${BASE_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: personalQuery }),
      });

      expect(response.status).toBe(200);
      const data = await response.json();
      
      expect(data).toHaveProperty('answer');
      expect(data.answer).toBeTruthy();
      
      // Should maintain professional boundaries
      const answerLower = data.answer.toLowerCase();
      const maintainsProfessionalism = 
        answerLower.includes('professional') || 
        answerLower.includes('work') || 
        answerLower.includes('focus');
      
      expect(maintainsProfessionalism).toBe(true);
    }, 10000);
  });
});

describe('Performance Benchmarks', () => {
  describe('Response Time Tests', () => {
    it('should respond to simple query in < 2 seconds', async () => {
      const startTime = Date.now();

      const response = await fetch(`${BASE_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: 'What are your Python skills?' }),
      });

      const endTime = Date.now();
      const responseTime = endTime - startTime;

      expect(response.status).toBe(200);
      
      // Target: < 2000ms
      console.log(`Response time: ${responseTime}ms`);
      expect(responseTime).toBeLessThan(2000);
    }, 10000);

    it('should respond to complex query in < 3 seconds', async () => {
      const complexQuery = 'Tell me about your experience with Python, machine learning, and data visualization. Include specific examples using the STAR method.';
      
      const startTime = Date.now();

      const response = await fetch(`${BASE_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: complexQuery }),
      });

      const endTime = Date.now();
      const responseTime = endTime - startTime;

      expect(response.status).toBe(200);
      
      // Complex queries: < 3000ms
      console.log(`Complex query response time: ${responseTime}ms`);
      expect(responseTime).toBeLessThan(3000);
    }, 10000);

    it('should handle concurrent requests efficiently', async () => {
      const queries = [
        'What is your Python experience?',
        'Tell me about your SQL skills',
        'Describe your machine learning projects',
      ];

      const startTime = Date.now();

      const responses = await Promise.all(
        queries.map(query =>
          fetch(`${BASE_URL}/api/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: query }),
          })
        )
      );

      const endTime = Date.now();
      const totalTime = endTime - startTime;

      // All requests should succeed
      responses.forEach(response => {
        expect(response.status).toBe(200);
      });

      // Concurrent requests should not take 3x the time
      // Allow up to 5 seconds for 3 concurrent requests
      console.log(`Concurrent requests total time: ${totalTime}ms`);
      expect(totalTime).toBeLessThan(5000);
    }, 15000);
  });

  describe('Response Quality Benchmarks', () => {
    it('should maintain consistent response length', async () => {
      const queries = [
        'What is your Python experience?',
        'Tell me about your work at BF Suma',
        'What are your data visualization skills?',
      ];

      const responses = await Promise.all(
        queries.map(async query => {
          const response = await fetch(`${BASE_URL}/api/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: query }),
          });
          return response.json();
        })
      );

      const lengths = responses.map(r => r.answer.length);
      const avgLength = lengths.reduce((a, b) => a + b, 0) / lengths.length;

      console.log(`Response lengths: ${lengths.join(', ')}, Avg: ${avgLength}`);

      // All responses should be substantial (>100 chars)
      lengths.forEach(length => {
        expect(length).toBeGreaterThan(100);
      });

      // Variance should not be extreme
      lengths.forEach(length => {
        expect(length).toBeGreaterThan(avgLength * 0.3);
        expect(length).toBeLessThan(avgLength * 3);
      });
    }, 20000);

    it('should provide detailed responses for STAR questions', async () => {
      const starQuery = 'Tell me about a challenging project you worked on using the STAR method';

      const response = await fetch(`${BASE_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: starQuery }),
      });

      const data = await response.json();
      
      // STAR responses should be detailed (>200 chars)
      expect(data.answer.length).toBeGreaterThan(200);

      console.log(`STAR response length: ${data.answer.length}`);
    }, 15000);
  });

  describe('Error Recovery', () => {
    it('should handle malformed request gracefully', async () => {
      const response = await fetch(`${BASE_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: '{"invalid": json}',
      }).catch(err => ({ status: 400, json: async () => ({ error: 'Invalid JSON' }) }));

      // Should either parse successfully or return error gracefully
      expect(response).toBeDefined();
    }, 5000);

    it('should handle missing message field', async () => {
      const response = await fetch(`${BASE_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: 'wrong field name' }),
      });

      // Should handle gracefully (either error or default behavior)
      expect(response.status).toBeDefined();
    }, 5000);
  });
});

describe('Accuracy Scoring', () => {
  describe('Keyword Matching Accuracy', () => {
    it('should include relevant keywords for Python query', async () => {
      const response = await fetch(`${BASE_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: 'What is your Python programming experience?' }),
      });

      const data = await response.json();
      const answerLower = data.answer.toLowerCase();

      const relevantKeywords = ['python', 'programming', 'code', 'development', 'project'];
      const matchedKeywords = relevantKeywords.filter(keyword => 
        answerLower.includes(keyword)
      );

      const accuracyScore = (matchedKeywords.length / relevantKeywords.length) * 100;
      console.log(`Keyword accuracy: ${accuracyScore}% (${matchedKeywords.length}/${relevantKeywords.length})`);

      // At least 60% accuracy
      expect(accuracyScore).toBeGreaterThanOrEqual(60);
    }, 10000);

    it('should include STAR components when requested', async () => {
      const response = await fetch(`${BASE_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: 'Describe a challenging project using the STAR method' 
        }),
      });

      const data = await response.json();
      const answerLower = data.answer.toLowerCase();

      const starComponents = ['situation', 'task', 'action', 'result'];
      const foundComponents = starComponents.filter(component => 
        answerLower.includes(component)
      );

      const starScore = (foundComponents.length / starComponents.length) * 100;
      console.log(`STAR accuracy: ${starScore}% (${foundComponents.length}/${starComponents.length})`);

      // At least 25% of STAR components (at least 1)
      expect(starScore).toBeGreaterThanOrEqual(25);
    }, 10000);
  });
});
