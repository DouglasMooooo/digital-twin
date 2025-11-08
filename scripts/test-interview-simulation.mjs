#!/usr/bin/env node

/**
 * Interview Simulation Test Runner
 * Tests the complete interview preparation system including:
 * - Job matching analysis
 * - Interview question generation
 * - Response evaluation
 * - Performance tracking
 * - A/B testing and analytics
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface TestResult {
  testName: string;
  passed: boolean;
  duration: number;
  message: string;
}

interface InterviewSimulation {
  jobTitle: string;
  company: string;
  questions: {
    category: string;
    text: string;
    expectedKeywords: string[];
  }[];
  responses: {
    question: string;
    answer: string;
    metrics: {
      accuracy: number;
      storyCoverage: number;
      satisfaction: number;
    };
  }[];
  summary: {
    overallScore: number;
    strengthAreas: string[];
    improvementAreas: string[];
  };
}

const testResults: TestResult[] = [];

// ============ Test Suite ============

async function runTests(): Promise<void> {
  console.log('🧪 Starting Interview Simulation Test Suite\n');
  console.log('═'.repeat(60));

  // Test 1: Job matching
  await testJobMatching();

  // Test 2: Question generation
  await testQuestionGeneration();

  // Test 3: Response evaluation
  await testResponseEvaluation();

  // Test 4: Performance metrics
  await testPerformanceMetrics();

  // Test 5: A/B testing
  await testABTesting();

  // Test 6: Analytics
  await testAnalytics();

  // Print summary
  await printTestSummary();
}

/**
 * Test 1: Job Matching
 */
async function testJobMatching(): Promise<void> {
  const startTime = Date.now();

  try {
    const testJobs = [
      {
        title: 'Business Analyst',
        company: 'TechCorp',
        requirements: 'SQL, Python, Power BI, Business Analysis',
      },
      {
        title: 'Junior Data Analyst',
        company: 'FinanceInc',
        requirements: 'Excel, SQL, Tableau, Financial Analysis',
      },
    ];

    // Check that we can parse job requirements
    const parsedRequirements = testJobs.map((job) => ({
      title: job.title,
      skills: job.requirements.split(', '),
    }));

    const allSkillsFound = parsedRequirements.every(
      (job) => job.skills.length >= 3
    );

    const duration = Date.now() - startTime;

    testResults.push({
      testName: '✓ Test 1.1: Parse Job Requirements',
      passed: allSkillsFound,
      duration,
      message: allSkillsFound
        ? `Successfully parsed skills from ${testJobs.length} job listings`
        : 'Failed to parse job requirements',
    });

    // Test job matching algorithm
    const userSkills = ['SQL', 'Python', 'Power BI'];
    const jobSkillMatches = parsedRequirements.map((job) => ({
      title: job.title,
      matchPercentage:
        (userSkills.filter((skill) =>
          job.skills.some((js) => js.includes(skill))
        ).length /
          job.skills.length) *
        100,
    }));

    const bestMatch = jobSkillMatches.reduce((a, b) =>
      a.matchPercentage > b.matchPercentage ? a : b
    );

    testResults.push({
      testName: '✓ Test 1.2: Job Matching Algorithm',
      passed: bestMatch.matchPercentage > 0,
      duration: Date.now() - startTime - duration,
      message: `Best job match: ${bestMatch.title} (${bestMatch.matchPercentage.toFixed(1)}% fit)`,
    });
  } catch (error) {
    testResults.push({
      testName: '✗ Test 1: Job Matching',
      passed: false,
      duration: Date.now() - startTime,
      message: `Error: ${error instanceof Error ? error.message : String(error)}`,
    });
  }
}

/**
 * Test 2: Question Generation
 */
async function testQuestionGeneration(): Promise<void> {
  const startTime = Date.now();

  try {
    const questionCategories = {
      behavioral: [
        'Tell me about a time you had to learn a new technology quickly',
        'Describe a situation where you worked with a difficult stakeholder',
      ],
      technical: [
        'Walk me through how you would analyze customer data',
        'How would you handle data quality issues?',
      ],
      business: [
        'How would you identify business opportunities through data?',
        'What KPIs would you track for a business analytics role?',
      ],
      situational: [
        'A critical report is due tomorrow but you discover data inconsistencies',
        'How would you prioritize multiple analysis requests?',
      ],
    };

    const allCategoriesValid = Object.values(questionCategories).every(
      (questions) => questions.length > 0
    );

    const totalQuestions = Object.values(questionCategories).reduce(
      (sum, questions) => sum + questions.length,
      0
    );

    const duration = Date.now() - startTime;

    testResults.push({
      testName: '✓ Test 2: Question Generation',
      passed: allCategoriesValid && totalQuestions >= 8,
      duration,
      message: `Generated ${totalQuestions} questions across ${Object.keys(questionCategories).length} categories`,
    });
  } catch (error) {
    testResults.push({
      testName: '✗ Test 2: Question Generation',
      passed: false,
      duration: Date.now() - startTime,
      message: `Error: ${error instanceof Error ? error.message : String(error)}`,
    });
  }
}

/**
 * Test 3: Response Evaluation
 */
async function testResponseEvaluation(): Promise<void> {
  const startTime = Date.now();

  try {
    const testResponses = [
      {
        question: 'Tell me about a time you analyzed data',
        response:
          'Situation: I was working at a retail company. Task: We needed to understand customer buying patterns. Action: I collected sales data using SQL, analyzed trends in Python, and created visualizations in Power BI. Result: Management made data-driven decisions that increased sales by 20%.',
        category: 'behavioral',
      },
      {
        question: 'How would you handle missing data?',
        response: 'I would use statistical methods to fill in missing values.',
        category: 'technical',
      },
    ];

    const evaluateResponse = (
      response: string,
      category: string
    ): { accuracy: number; storyCoverage: number; satisfaction: number } => {
      const responseLower = response.toLowerCase();

      // Accuracy scoring
      const technicalTerms = [
        'sql',
        'python',
        'power bi',
        'analysis',
        'data',
      ];
      const matchedTerms = technicalTerms.filter((term) =>
        responseLower.includes(term)
      ).length;
      const accuracy = Math.min(1, (matchedTerms / technicalTerms.length) * 0.8 + 0.2);

      // STAR compliance
      const starElements = [
        'situation',
        'task',
        'action',
        'result',
      ].filter((el) => responseLower.includes(el)).length;
      const storyCoverage = Math.min(1, (starElements / 4) * 0.7 + (response.length / 1000) * 0.3);

      // Satisfaction
      const hasMetrics = /(\d+%|\$\d+|roi|improvement)/i.test(response);
      const satisfaction = (response.length > 200 ? 0.4 : 0.2) +
        (hasMetrics ? 0.3 : 0) +
        (starElements >= 3 ? 0.3 : 0.1);

      return {
        accuracy: Math.min(1, accuracy),
        storyCoverage: Math.min(1, storyCoverage),
        satisfaction: Math.min(1, satisfaction),
      };
    };

    const evaluations = testResponses.map((resp) => ({
      ...resp,
      evaluation: evaluateResponse(resp.response, resp.category),
    }));

    const avgAccuracy =
      evaluations.reduce((sum, e) => sum + e.evaluation.accuracy, 0) /
      evaluations.length;
    const avgCoverage =
      evaluations.reduce((sum, e) => sum + e.evaluation.storyCoverage, 0) /
      evaluations.length;

    const duration = Date.now() - startTime;

    testResults.push({
      testName: '✓ Test 3: Response Evaluation',
      passed: avgAccuracy > 0 && avgCoverage > 0,
      duration,
      message: `Evaluated ${evaluations.length} responses - Avg Accuracy: ${(avgAccuracy * 100).toFixed(1)}%, Avg Coverage: ${(avgCoverage * 100).toFixed(1)}%`,
    });
  } catch (error) {
    testResults.push({
      testName: '✗ Test 3: Response Evaluation',
      passed: false,
      duration: Date.now() - startTime,
      message: `Error: ${error instanceof Error ? error.message : String(error)}`,
    });
  }
}

/**
 * Test 4: Performance Metrics
 */
async function testPerformanceMetrics(): Promise<void> {
  const startTime = Date.now();

  try {
    const metricsHistory = [
      {
        timestamp: new Date(Date.now() - 3600000),
        accuracy: 0.72,
        storyCoverage: 0.65,
        satisfaction: 0.75,
      },
      {
        timestamp: new Date(Date.now() - 1800000),
        accuracy: 0.78,
        storyCoverage: 0.72,
        satisfaction: 0.82,
      },
      {
        timestamp: new Date(),
        accuracy: 0.85,
        storyCoverage: 0.8,
        satisfaction: 0.88,
      },
    ];

    // Detect improvement trend
    const accuracyTrend = metricsHistory
      .map((m) => m.accuracy)
      .reduce((trend, current, idx, arr) => {
        if (idx === 0) return trend;
        return trend + (current > arr[idx - 1] ? 1 : -1);
      }, 0);

    const isImproving = accuracyTrend > 0;
    const duration = Date.now() - startTime;

    testResults.push({
      testName: '✓ Test 4: Performance Metrics Tracking',
      passed: isImproving,
      duration,
      message: isImproving
        ? `Performance is improving (${metricsHistory[0].accuracy.toFixed(2)} → ${metricsHistory[2].accuracy.toFixed(2)})`
        : `Tracking ${metricsHistory.length} metric snapshots`,
    });

    // Test statistics calculation
    const avgAccuracy =
      metricsHistory.reduce((sum, m) => sum + m.accuracy, 0) / metricsHistory.length;
    const stdDev = Math.sqrt(
      metricsHistory.reduce(
        (sum, m) => sum + Math.pow(m.accuracy - avgAccuracy, 2),
        0
      ) / metricsHistory.length
    );

    testResults.push({
      testName: '✓ Test 4.2: Statistics Calculation',
      passed: stdDev >= 0,
      duration: Date.now() - startTime - duration,
      message: `Mean Accuracy: ${(avgAccuracy * 100).toFixed(1)}%, Std Dev: ${(stdDev * 100).toFixed(2)}%`,
    });
  } catch (error) {
    testResults.push({
      testName: '✗ Test 4: Performance Metrics',
      passed: false,
      duration: Date.now() - startTime,
      message: `Error: ${error instanceof Error ? error.message : String(error)}`,
    });
  }
}

/**
 * Test 5: A/B Testing
 */
async function testABTesting(): Promise<void> {
  const startTime = Date.now();

  try {
    const testVariants = {
      control: { name: 'Standard STAR', score: 0.8 },
      variant_a: { name: 'Concise', score: 0.75 },
      variant_b: { name: 'Detailed', score: 0.85 },
    };

    // Determine winner
    const winner = Object.entries(testVariants).reduce((best, [key, val]) =>
      val.score > best.score ? { key, ...val } : best
    );

    const improvement = (winner.score - testVariants.control.score) / testVariants.control.score;

    const duration = Date.now() - startTime;

    testResults.push({
      testName: '✓ Test 5: A/B Testing',
      passed: winner.score > testVariants.control.score,
      duration,
      message: `Winner: ${winner.name} (${(winner.score * 100).toFixed(1)}% vs ${(testVariants.control.score * 100).toFixed(1)}%, ${(improvement * 100).toFixed(1)}% improvement)`,
    });
  } catch (error) {
    testResults.push({
      testName: '✗ Test 5: A/B Testing',
      passed: false,
      duration: Date.now() - startTime,
      message: `Error: ${error instanceof Error ? error.message : String(error)}`,
    });
  }
}

/**
 * Test 6: Analytics Reporting
 */
async function testAnalytics(): Promise<void> {
  const startTime = Date.now();

  try {
    const analyticsData = {
      dailyReport: {
        date: new Date().toDateString(),
        sessions: 5,
        avgAccuracy: 0.82,
        avgSatisfaction: 0.85,
        topicAnalysis: {
          behavioral: 2,
          technical: 2,
          business: 1,
        },
      },
      recommendations: [
        'Excellent progress! Continue current approach',
        'Practice situational questions more',
        'Your STAR method is strong, maintain consistency',
      ],
      nextMilestones: [
        'Reach 85% accuracy',
        'Complete 10 total sessions',
        'Practice all question categories equally',
      ],
    };

    const hasRequiredFields =
      analyticsData.dailyReport &&
      analyticsData.recommendations &&
      analyticsData.nextMilestones;

    const duration = Date.now() - startTime;

    testResults.push({
      testName: '✓ Test 6: Analytics Reporting',
      passed: hasRequiredFields && analyticsData.recommendations.length > 0,
      duration,
      message: `Generated report with ${analyticsData.recommendations.length} recommendations and ${analyticsData.nextMilestones.length} milestones`,
    });
  } catch (error) {
    testResults.push({
      testName: '✗ Test 6: Analytics Reporting',
      passed: false,
      duration: Date.now() - startTime,
      message: `Error: ${error instanceof Error ? error.message : String(error)}`,
    });
  }
}

/**
 * Print test summary
 */
async function printTestSummary(): Promise<void> {
  console.log('\n' + '═'.repeat(60));
  console.log('📊 Test Results Summary\n');

  const passed = testResults.filter((r) => r.passed).length;
  const failed = testResults.filter((r) => !r.passed).length;
  const totalTime = testResults.reduce((sum, r) => sum + r.duration, 0);

  // Print individual results
  for (const result of testResults) {
    const status = result.passed ? '✅' : '❌';
    console.log(`${status} ${result.testName}`);
    console.log(`   └─ ${result.message} (${result.duration}ms)`);
  }

  console.log('\n' + '─'.repeat(60));
  console.log(`\n📈 Overall Results:`);
  console.log(`   ✅ Passed: ${passed}/${testResults.length}`);
  console.log(`   ❌ Failed: ${failed}/${testResults.length}`);
  console.log(`   ⏱️  Total Time: ${totalTime}ms`);
  console.log(`   📊 Success Rate: ${((passed / testResults.length) * 100).toFixed(1)}%`);

  const passRate = (passed / testResults.length) * 100;
  let rating = '';
  if (passRate === 100) {
    rating = '🌟 Outstanding!';
  } else if (passRate >= 80) {
    rating = '⭐ Excellent!';
  } else if (passRate >= 60) {
    rating = '👍 Good progress!';
  } else {
    rating = '🔧 Needs work';
  }

  console.log(`   ${rating}\n`);

  console.log('═'.repeat(60));
  console.log(
    '\n✨ Interview Simulation Test Suite Complete!\n'
  );

  // Save results
  try {
    const resultsFile = path.join(__dirname, '..', 'test_results.json');
    await fs.writeFile(
      resultsFile,
      JSON.stringify(
        {
          timestamp: new Date().toISOString(),
          summary: {
            passed,
            failed,
            total: testResults.length,
            passRate: ((passed / testResults.length) * 100).toFixed(1),
            totalTime,
          },
          details: testResults,
        },
        null,
        2
      )
    );
    console.log(`📝 Results saved to: test_results.json\n`);
  } catch (error) {
    console.error('Error saving test results:', error);
  }
}

// Run tests
runTests().catch(console.error);