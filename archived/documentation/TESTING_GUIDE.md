# Testing Guide - Douglas Digital Twin

**Comprehensive testing documentation for the Digital Twin system**

## 📋 Table of Contents

1. [Overview](#overview)
2. [Test Suite Structure](#test-suite-structure)
3. [Running Tests](#running-tests)
4. [Test Categories](#test-categories)
5. [Accuracy Scoring](#accuracy-scoring)
6. [Quality Improvement](#quality-improvement)
7. [Performance Benchmarks](#performance-benchmarks)
8. [Troubleshooting](#troubleshooting)

---

## Overview

The Digital Twin system includes **60 comprehensive tests** covering:
- 20 professional recruiter interview questions
- 22 edge cases and robustness scenarios
- 18 API functionality tests

**Test Framework:** Vitest 2.0  
**Coverage:** 100% pass rate (when server running)  
**Execution Time:** ~60-90 seconds for full suite

---

## Test Suite Structure

```
tests/
├── api/
│   ├── chat.test.ts                # Core API functionality (18 tests)
│   ├── recruiter-queries.test.ts   # Professional queries (20 tests)
│   └── edge-cases.test.ts          # Edge cases & performance (22 tests)
├── lib/
│   └── vectordb.test.ts            # Vector database tests
└── setup.ts                        # Test configuration
```

---

## Running Tests

### Run All Tests

```bash
npm test
```

### Run Specific Test File

```bash
npm test tests/api/recruiter-queries.test.ts
npm test tests/api/edge-cases.test.ts
npm test tests/api/chat.test.ts
```

### Run Tests in Watch Mode

```bash
npm test -- --watch
```

### Run with Coverage Report

```bash
npm test -- --coverage
```

### Run Tests in CI Mode

```bash
npm test -- --run
```

---

## Test Categories

### 1. Professional Recruiter Queries (20 Tests)

**File:** `tests/api/recruiter-queries.test.ts`

Simulates real interview questions from recruiters across 6 categories:

#### Technical Skills Assessment (4 tests)
- Python and AI/ML experience
- Machine learning project portfolio
- SQL and database proficiency
- Data visualization tools

**Example:**
```typescript
describe('Technical Skills Assessment', () => {
  test('should answer Python and AI experience question', async () => {
    const response = await fetch('http://localhost:3000/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'Tell me about your Python and AI experience. What projects have you worked on?'
      })
    });
    
    const data = await response.json();
    expect(data.response).toBeDefined();
    expect(data.response.length).toBeGreaterThan(100);
    
    // Keyword validation
    const keywords = ['python', 'ai', 'machine learning', 'project'];
    const matchedKeywords = keywords.filter(kw => 
      data.response.toLowerCase().includes(kw)
    );
    expect(matchedKeywords.length).toBeGreaterThan(keywords.length * 0.6);
  });
});
```

#### Leadership and Collaboration (3 tests)
- Team leadership experience
- Conflict resolution
- Cross-functional collaboration

#### Problem-Solving Demonstration (3 tests)
- Challenging project handling
- Learning agility
- Debugging approaches

#### Career Development (3 tests)
- Career growth trajectory
- Future goals
- Career transition rationale

#### Industry Knowledge (4 tests)
- AI/ML understanding
- Industry trends awareness
- RAG systems knowledge
- Technical concept explanation

#### Culture Fit Assessment (3 tests)
- Working style preferences
- Technical-business balance
- Motivation factors

### 2. Edge Cases & Robustness (22 Tests)

**File:** `tests/api/edge-cases.test.ts`

Tests system resilience under unusual conditions:

#### Empty and Invalid Queries (3 tests)
```typescript
test('should handle empty query gracefully', async () => {
  const response = await fetch('http://localhost:3000/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: '' })
  });
  
  const data = await response.json();
  expect(data.response).toBeDefined();
  expect(data.response.length).toBeGreaterThan(20); // Should provide helpful message
});
```

#### Long and Complex Queries (2 tests)
- 500+ character queries
- Multiple questions in one query

#### Special Characters and Formatting (4 tests)
- Symbols and punctuation
- Emojis
- Code snippets
- Numbers and dates

#### Multi-language Support (2 tests)
- Chinese queries
- Mixed English/Chinese

#### Ambiguous and Vague Queries (2 tests)
- Unclear questions
- Pronoun references

#### Off-topic Queries (2 tests)
- Non-professional questions
- Personal inquiries

#### Performance Benchmarks (3 tests)
```typescript
test('should respond to simple query in < 2 seconds', async () => {
  const startTime = Date.now();
  
  const response = await fetch('http://localhost:3000/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: 'What are your main skills?' })
  });
  
  const endTime = Date.now();
  const responseTime = endTime - startTime;
  
  expect(responseTime).toBeLessThan(2000); // 2 seconds
});
```

#### Error Recovery (1 test)
- Malformed requests

#### Accuracy Scoring (3 tests)
- Keyword matching validation
- STAR component detection

### 3. Core API Tests (18 Tests)

**File:** `tests/api/chat.test.ts`

Tests fundamental API functionality:
- Chat endpoint availability
- Response format validation
- Error handling
- Vector search integration
- STAR format compliance

---

## Accuracy Scoring

### 4-Dimension Evaluation System

**File:** `lib/accuracy-scoring.ts`

Evaluates response quality across 4 dimensions:

```typescript
import { evaluateResponseAccuracy } from '@/lib/accuracy-scoring';

const score = evaluateResponseAccuracy(
  'Tell me about your Python experience',
  'I have 3 years of Python experience...',
  {
    expectedKeywords: ['python', 'experience', 'project'],
    requireSTAR: true,
    category: 'technical',
    minLength: 100
  }
);

console.log(score);
// {
//   overall: 92,
//   keywordMatch: 88,
//   starCompliance: { score: 95, components: [...] },
//   relevance: 94,
//   professionalism: 96
// }
```

### Scoring Dimensions

#### 1. Keyword Match (30-40% weight)
- Checks for expected keywords in response
- Identifies missing keywords
- Calculates coverage percentage

#### 2. STAR Compliance (0-30% weight)
- Detects Situation, Task, Action, Result components
- Each component worth 25 points
- Only applied when `requireSTAR: true`

#### 3. Relevance (25-35% weight)
- Query-response word alignment
- Length validation
- Topic consistency

#### 4. Professionalism (15-25% weight)
- Tone analysis
- Structure quality
- First-person usage
- Specific details

### Rating Thresholds

- **Excellent**: ≥90%
- **Very Good**: ≥80%
- **Good**: ≥70%
- **Fair**: ≥60%
- **Needs Improvement**: <60%

### Batch Evaluation

```typescript
import { evaluateBatchResponses } from '@/lib/accuracy-scoring';

const testCases = [
  {
    query: 'What are your Python skills?',
    response: 'I am proficient in Python...',
    criteria: {
      expectedKeywords: ['python', 'programming'],
      requireSTAR: false,
      category: 'technical',
      minLength: 50
    }
  },
  // More test cases...
];

const results = evaluateBatchResponses(testCases);
console.log(results.averageScores);
// {
//   overall: 89.5,
//   keywordMatch: 85.2,
//   starCompliance: 92.0,
//   relevance: 90.1,
//   professionalism: 93.5
// }
```

### Generate Reports

```typescript
import { generateMarkdownReport, exportScoresToJSON } from '@/lib/accuracy-scoring';

// Markdown report
const markdown = generateMarkdownReport(results);
console.log(markdown);

// JSON export
const json = exportScoresToJSON(results);
fs.writeFileSync('accuracy-report.json', json);
```

---

## Quality Improvement

### Automated Gap Analysis

**File:** `lib/quality-improvement.ts`

Analyzes user feedback to identify improvement opportunities:

```typescript
import { runQualityImprovement } from '@/lib/quality-improvement';

// Run analysis
const report = await runQualityImprovement({
  minRating: 3,           // Analyze feedback with rating < 3
  exportJSON: true,       // Export JSON report
  exportMarkdown: true,   // Export Markdown report
  outputDir: process.cwd()
});

console.log(report);
// {
//   analysisDate: '2025-01-09T...',
//   totalFeedbackAnalyzed: 150,
//   lowScoringQueries: 23,
//   averageRating: 4.2,
//   averageAccuracy: 87.5,
//   identifiedGaps: [...],
//   priorityRecommendations: [...],
//   digitalTwinUpdateSuggestions: [...]
// }
```

### Data Gap Structure

```typescript
interface DataGap {
  topic: string;                    // e.g., "Python & FastAPI"
  frequency: number;                // How many low-scoring queries
  avgScore: number;                 // Average rating (1-5)
  avgAccuracy: number;              // Average accuracy (0-100)
  missingKeywords: string[];        // Keywords in queries but not responses
  sampleQuestions: string[];        // Example questions
  suggestions: string[];            // Actionable recommendations
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
}
```

### Priority Levels

- **HIGH**: ≥5 queries with avg score <2.5 or accuracy <60%
- **MEDIUM**: ≥3 queries with avg score <3.5 or accuracy <75%
- **LOW**: Everything else

### Update Suggestions

System generates specific digitaltwin.json update recommendations:

```json
{
  "section": "projects",
  "updateType": "add",
  "description": "Add new project related to Python & FastAPI",
  "suggestedContent": {
    "name": "[Suggested] Python & FastAPI Project",
    "description": "Based on 8 user queries, add a project demonstrating FastAPI, REST API, async patterns",
    "technologies": ["FastAPI", "Python", "async", "REST", "Pydantic"],
    "achievements": [
      "Add quantitative metrics (performance, users, impact)",
      "Include technical challenges and solutions",
      "Describe business value delivered"
    ]
  },
  "reasoning": "8 queries with avg accuracy 65.0% indicate missing project examples"
}
```

### API Endpoint

```bash
# Get quality improvement summary
GET /api/quality-improvement?minRating=3&format=summary

# Run full analysis
POST /api/quality-improvement
{
  "minRating": 3,
  "exportJSON": true,
  "exportMarkdown": true
}
```

---

## Performance Benchmarks

### Target Metrics

| Metric | Target | Current | Status |
|--------|--------|---------|--------|
| P50 Response Time | <1.5s | 1.2s | ✅ |
| P90 Response Time | <2.0s | 1.8s | ✅ |
| P99 Response Time | <3.0s | 2.5s | ✅ |
| Overall Accuracy | >85% | 92% | ✅ |
| STAR Compliance | >80% | 95% | ✅ |
| Keyword Match | >75% | 88% | ✅ |
| Professionalism | >90% | 96% | ✅ |

### Measuring Response Time

```typescript
test('should meet performance benchmarks', async () => {
  const responseTimes: number[] = [];
  
  // Run 10 queries
  for (let i = 0; i < 10; i++) {
    const start = Date.now();
    await fetch('http://localhost:3000/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'What are your skills?' })
    });
    const end = Date.now();
    responseTimes.push(end - start);
  }
  
  // Calculate percentiles
  responseTimes.sort((a, b) => a - b);
  const p50 = responseTimes[Math.floor(responseTimes.length * 0.5)];
  const p90 = responseTimes[Math.floor(responseTimes.length * 0.9)];
  const p99 = responseTimes[Math.floor(responseTimes.length * 0.99)];
  
  expect(p50).toBeLessThan(1500);
  expect(p90).toBeLessThan(2000);
  expect(p99).toBeLessThan(3000);
});
```

---

## Troubleshooting

### Common Issues

#### 1. Tests Fail with "fetch failed"

**Problem:** Server not running

**Solution:**
```bash
# Terminal 1: Start dev server
npm run dev

# Terminal 2: Run tests
npm test
```

#### 2. Timeout Errors

**Problem:** LLM responses taking too long

**Solution:** Increase timeout in test files:
```typescript
test('should answer query', async () => {
  // ... test code
}, 20000); // 20 second timeout
```

#### 3. Redis Connection Errors

**Problem:** Redis/Upstash not accessible

**Solution:** Check environment variables:
```bash
# .env
UPSTASH_REDIS_REST_URL=https://...
UPSTASH_REDIS_REST_TOKEN=...
```

#### 4. Vector Search Returns No Results

**Problem:** Vector database not initialized

**Solution:**
```bash
npm run setup-vector-db
```

#### 5. TypeScript Errors

**Problem:** Type definitions missing

**Solution:**
```bash
npm install
npm run build
```

### Debug Mode

Enable verbose logging:

```typescript
// In test file
beforeAll(() => {
  process.env.DEBUG = 'true';
});
```

### Skip Slow Tests

```typescript
test.skip('slow test that times out', async () => {
  // This test will be skipped
});
```

---

## Best Practices

### 1. Run Tests Before Committing

```bash
npm test
```

### 2. Monitor Performance Regularly

```bash
npm test tests/api/edge-cases.test.ts
# Check P50/P90/P99 metrics
```

### 3. Review Quality Improvement Reports Weekly

```bash
curl http://localhost:3000/api/quality-improvement?format=summary
```

### 4. Update digitaltwin.json Based on Feedback

- Review identified data gaps
- Prioritize HIGH priority issues
- Apply suggested content updates
- Re-run tests to verify improvements

### 5. Maintain Test Coverage

- Add new tests for new features
- Update tests when digitaltwin.json changes
- Keep accuracy thresholds realistic

---

## Continuous Integration

### GitHub Actions Example

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm install
      
      - name: Run tests
        run: npm test
        env:
          UPSTASH_VECTOR_REST_URL: ${{ secrets.UPSTASH_VECTOR_REST_URL }}
          UPSTASH_VECTOR_REST_TOKEN: ${{ secrets.UPSTASH_VECTOR_REST_TOKEN }}
          GROQ_API_KEY: ${{ secrets.GROQ_API_KEY }}
```

---

## Resources

- **Performance Report**: [PERFORMANCE_REPORT.md](./PERFORMANCE_REPORT.md)
- **Main README**: [README.md](./README.md)
- **Admin Guide**: [ADMIN_GUIDE.md](./ADMIN_GUIDE.md)
- **Vitest Documentation**: https://vitest.dev/

---

**Questions or Issues?**  
Contact: d157156@gmail.com or open a GitHub issue
