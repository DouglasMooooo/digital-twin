/**
 * Recruiter Queries Test Suite
 * Tests 20 professional queries covering 6 categories as per Week 7 requirements
 */

import { describe, it, expect } from 'vitest';

// Base URL for API testing
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
const describeIfNotCI = process.env.CI ? describe.skip : describe;

interface QueryTest {
  category: string;
  query: string;
  expectedKeywords: string[];
  mustIncludeSTAR?: boolean;
}

// 20 Professional Queries covering 6 categories
const recruiterQueries: QueryTest[] = [
  // 1. Technical Skills Assessment (4 queries)
  {
    category: 'technical',
    query: 'Tell me about your Python and AI experience',
    expectedKeywords: ['Python', 'AI', 'machine learning', 'data', 'project'],
    mustIncludeSTAR: true
  },
  {
    category: 'technical',
    query: 'What machine learning projects have you worked on?',
    expectedKeywords: ['machine learning', 'model', 'data', 'algorithm', 'prediction'],
    mustIncludeSTAR: true
  },
  {
    category: 'technical',
    query: 'How proficient are you with SQL and databases?',
    expectedKeywords: ['SQL', 'database', 'query', 'data', 'management'],
    mustIncludeSTAR: true
  },
  {
    category: 'technical',
    query: 'Describe your experience with data visualization tools like Tableau or Power BI',
    expectedKeywords: ['visualization', 'dashboard', 'Tableau', 'Power BI', 'data'],
    mustIncludeSTAR: true
  },

  // 2. Leadership and Collaboration (3 queries)
  {
    category: 'leadership',
    query: 'Tell me about a time you led a team project',
    expectedKeywords: ['team', 'project', 'led', 'collaboration', 'management'],
    mustIncludeSTAR: true
  },
  {
    category: 'leadership',
    query: 'How do you handle conflicts in a team setting?',
    expectedKeywords: ['conflict', 'team', 'resolution', 'communication', 'collaboration'],
    mustIncludeSTAR: true
  },
  {
    category: 'leadership',
    query: 'Give an example of cross-functional collaboration',
    expectedKeywords: ['cross-functional', 'collaboration', 'team', 'departments', 'project'],
    mustIncludeSTAR: true
  },

  // 3. Problem-Solving Demonstration (3 queries)
  {
    category: 'problem-solving',
    query: 'Describe a challenging project and how you solved it',
    expectedKeywords: ['challenge', 'solution', 'problem', 'approach', 'result'],
    mustIncludeSTAR: true
  },
  {
    category: 'problem-solving',
    query: 'Tell me about a time you had to learn a new technology quickly',
    expectedKeywords: ['learn', 'technology', 'quickly', 'adapt', 'skill'],
    mustIncludeSTAR: true
  },
  {
    category: 'problem-solving',
    query: 'How do you approach debugging complex technical issues?',
    expectedKeywords: ['debug', 'approach', 'troubleshoot', 'analysis', 'solution'],
    mustIncludeSTAR: false
  },

  // 4. Career Development (3 queries)
  {
    category: 'career',
    query: 'How has your career grown over the years?',
    expectedKeywords: ['career', 'growth', 'development', 'progression', 'experience'],
    mustIncludeSTAR: false
  },
  {
    category: 'career',
    query: 'What are your future career goals?',
    expectedKeywords: ['goals', 'future', 'aspiration', 'career', 'development'],
    mustIncludeSTAR: false
  },
  {
    category: 'career',
    query: 'Why did you transition from finance to data analytics?',
    expectedKeywords: ['transition', 'finance', 'data', 'analytics', 'career'],
    mustIncludeSTAR: true
  },

  // 5. Industry Knowledge (4 queries)
  {
    category: 'industry',
    query: "What's your understanding of AI/ML in business applications?",
    expectedKeywords: ['AI', 'machine learning', 'business', 'application', 'data'],
    mustIncludeSTAR: false
  },
  {
    category: 'industry',
    query: 'How do you stay updated with data science trends?',
    expectedKeywords: ['trends', 'learning', 'update', 'technology', 'data science'],
    mustIncludeSTAR: false
  },
  {
    category: 'industry',
    query: 'What do you think about the future of RAG systems and AI agents?',
    expectedKeywords: ['RAG', 'AI', 'future', 'technology', 'system'],
    mustIncludeSTAR: false
  },
  {
    category: 'industry',
    query: 'How would you explain embedding models to non-technical stakeholders?',
    expectedKeywords: ['embedding', 'explain', 'stakeholder', 'simple', 'understand'],
    mustIncludeSTAR: false
  },

  // 6. Culture Fit Assessment (3 queries)
  {
    category: 'culture',
    query: "What's your working style and preferred work environment?",
    expectedKeywords: ['working style', 'environment', 'collaborate', 'team', 'preference'],
    mustIncludeSTAR: false
  },
  {
    category: 'culture',
    query: 'How do you balance technical excellence with business needs?',
    expectedKeywords: ['balance', 'technical', 'business', 'value', 'impact'],
    mustIncludeSTAR: true
  },
  {
    category: 'culture',
    query: 'What motivates you in your work as a data analyst?',
    expectedKeywords: ['motivate', 'passion', 'work', 'data', 'impact'],
    mustIncludeSTAR: false
  },
];

describeIfNotCI('Recruiter Queries - Professional Interview Questions', () => {
  describe('Technical Skills Assessment', () => {
    const technicalQueries = recruiterQueries.filter(q => q.category === 'technical');

    technicalQueries.forEach((test, index) => {
      it(`should answer technical question ${index + 1}: "${test.query.substring(0, 50)}..."`, async () => {
        const response = await fetch(`${BASE_URL}/api/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: test.query }),
        });

        expect(response.status).toBe(200);
        const data = await response.json();
        
        expect(data).toHaveProperty('answer');
        expect(data.answer).toBeTruthy();
        expect(data.answer.length).toBeGreaterThan(100);

        // Check for expected keywords (case-insensitive)
        const answerLower = data.answer.toLowerCase();
        const keywordMatches = test.expectedKeywords.filter(keyword => 
          answerLower.includes(keyword.toLowerCase())
        );
        
        // At least 60% of keywords should be present
        expect(keywordMatches.length).toBeGreaterThanOrEqual(
          Math.ceil(test.expectedKeywords.length * 0.6)
        );

        // If STAR method required, check for STAR keywords
        if (test.mustIncludeSTAR) {
          const hasSTARIndicators = 
            answerLower.includes('situation') || 
            answerLower.includes('task') || 
            answerLower.includes('action') || 
            answerLower.includes('result');
          
          expect(hasSTARIndicators).toBe(true);
        }
      }, 15000); // 15s timeout for API calls
    });
  });

  describe('Leadership and Collaboration', () => {
    const leadershipQueries = recruiterQueries.filter(q => q.category === 'leadership');

    leadershipQueries.forEach((test, index) => {
      it(`should answer leadership question ${index + 1}: "${test.query.substring(0, 50)}..."`, async () => {
        const response = await fetch(`${BASE_URL}/api/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: test.query }),
        });

        expect(response.status).toBe(200);
        const data = await response.json();
        
        expect(data).toHaveProperty('answer');
        expect(data.answer).toBeTruthy();
        expect(data.answer.length).toBeGreaterThan(100);

        // Check for STAR method structure
        const answerLower = data.answer.toLowerCase();
        const hasSTARIndicators = 
          answerLower.includes('situation') || 
          answerLower.includes('task') || 
          answerLower.includes('action') || 
          answerLower.includes('result');
        
        expect(hasSTARIndicators).toBe(true);

        // Check for leadership-related keywords
        const hasLeadershipKeywords = 
          answerLower.includes('team') || 
          answerLower.includes('led') || 
          answerLower.includes('collaboration') ||
          answerLower.includes('manage');
        
        expect(hasLeadershipKeywords).toBe(true);
      }, 15000);
    });
  });

  describe('Problem-Solving Demonstration', () => {
    const problemSolvingQueries = recruiterQueries.filter(q => q.category === 'problem-solving');

    problemSolvingQueries.forEach((test, index) => {
      it(`should answer problem-solving question ${index + 1}: "${test.query.substring(0, 50)}..."`, async () => {
        const response = await fetch(`${BASE_URL}/api/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: test.query }),
        });

        expect(response.status).toBe(200);
        const data = await response.json();
        
        expect(data).toHaveProperty('answer');
        expect(data.answer).toBeTruthy();
        expect(data.answer.length).toBeGreaterThan(100);

        // Check for problem-solving approach
        const answerLower = data.answer.toLowerCase();
        const hasProblemSolvingKeywords = 
          answerLower.includes('approach') || 
          answerLower.includes('solution') || 
          answerLower.includes('challenge') ||
          answerLower.includes('resolve');
        
        expect(hasProblemSolvingKeywords).toBe(true);
      }, 15000);
    });
  });

  describe('Career Development', () => {
    const careerQueries = recruiterQueries.filter(q => q.category === 'career');

    careerQueries.forEach((test, index) => {
      it(`should answer career question ${index + 1}: "${test.query.substring(0, 50)}..."`, async () => {
        const response = await fetch(`${BASE_URL}/api/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: test.query }),
        });

        expect(response.status).toBe(200);
        const data = await response.json();
        
        expect(data).toHaveProperty('answer');
        expect(data.answer).toBeTruthy();
        expect(data.answer.length).toBeGreaterThan(50);

        // Check for career-related content
        const answerLower = data.answer.toLowerCase();
        const hasCareerKeywords = 
          answerLower.includes('career') || 
          answerLower.includes('experience') || 
          answerLower.includes('growth') ||
          answerLower.includes('development');
        
        expect(hasCareerKeywords).toBe(true);
      }, 15000);
    });
  });

  describe('Industry Knowledge', () => {
    const industryQueries = recruiterQueries.filter(q => q.category === 'industry');

    industryQueries.forEach((test, index) => {
      it(`should answer industry question ${index + 1}: "${test.query.substring(0, 50)}..."`, async () => {
        const response = await fetch(`${BASE_URL}/api/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: test.query }),
        });

        expect(response.status).toBe(200);
        const data = await response.json();
        
        expect(data).toHaveProperty('answer');
        expect(data.answer).toBeTruthy();
        expect(data.answer.length).toBeGreaterThan(50);

        // Check for technical/industry knowledge
        const answerLower = data.answer.toLowerCase();
        const hasIndustryKeywords = 
          answerLower.includes('data') || 
          answerLower.includes('ai') || 
          answerLower.includes('machine learning') ||
          answerLower.includes('technology');
        
        expect(hasIndustryKeywords).toBe(true);
      }, 15000);
    });
  });

  describe('Culture Fit Assessment', () => {
    const cultureQueries = recruiterQueries.filter(q => q.category === 'culture');

    cultureQueries.forEach((test, index) => {
      it(`should answer culture fit question ${index + 1}: "${test.query.substring(0, 50)}..."`, async () => {
        const response = await fetch(`${BASE_URL}/api/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: test.query }),
        });

        expect(response.status).toBe(200);
        const data = await response.json();
        
        expect(data).toHaveProperty('answer');
        expect(data.answer).toBeTruthy();
        expect(data.answer.length).toBeGreaterThan(50);

        // Check for culture/values content
        const answerLower = data.answer.toLowerCase();
        const hasCultureKeywords = 
          answerLower.includes('work') || 
          answerLower.includes('team') || 
          answerLower.includes('collaborate') ||
          answerLower.includes('value');
        
        expect(hasCultureKeywords).toBe(true);
      }, 15000);
    });
  });

  describe('Overall Query Quality Metrics', () => {
    it('should have professional tone in all responses', async () => {
      const sampleQuery = recruiterQueries[0];
      const response = await fetch(`${BASE_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: sampleQuery.query }),
      });

      const data = await response.json();
      const answer = data.answer;

      // Check for professional language (no slang, proper grammar indicators)
      expect(answer).not.toMatch(/\b(gonna|wanna|yeah|nah|dunno)\b/i);
      
      // Should have complete sentences
      expect(answer).toMatch(/[.!?]$/);
      
      // Should be substantive
      expect(answer.length).toBeGreaterThan(100);
    }, 15000);

    it('should respond within acceptable time frame', async () => {
      const startTime = Date.now();
      
      const response = await fetch(`${BASE_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: 'What are your Python skills?' }),
      });

      const endTime = Date.now();
      const responseTime = endTime - startTime;

      expect(response.status).toBe(200);
      
      // Target: < 2 seconds (2000ms)
      // Allow up to 5 seconds for API testing
      expect(responseTime).toBeLessThan(5000);
    }, 15000);

    it('should provide consistent answer quality across categories', async () => {
      const sampleQueries = [
        recruiterQueries.find(q => q.category === 'technical'),
        recruiterQueries.find(q => q.category === 'leadership'),
        recruiterQueries.find(q => q.category === 'career'),
      ];

      const responses = await Promise.all(
        sampleQueries.map(async (test) => {
          const response = await fetch(`${BASE_URL}/api/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: test!.query }),
          });
          return response.json();
        })
      );

      // All responses should be substantial
      responses.forEach(data => {
        expect(data.answer.length).toBeGreaterThan(100);
      });

      // Variance in length should not be too extreme
      const lengths = responses.map(r => r.answer.length);
      const avgLength = lengths.reduce((a, b) => a + b, 0) / lengths.length;
      
      lengths.forEach(length => {
        // Each response should be within 50% of average
        expect(length).toBeGreaterThan(avgLength * 0.5);
        expect(length).toBeLessThan(avgLength * 2);
      });
    }, 30000);
  });
});
