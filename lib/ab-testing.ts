import { generateAIResponse } from './llm';
import type { InterviewContext } from './llm';

export interface ABTestVariant {
  id: string;
  name: string;
  description: string;
  strategy: 'default' | 'concise' | 'story-focused' | 'metric-heavy';
  systemPromptModifier?: string;
}

export interface ABTestMetrics {
  variantId: string;
  totalTests: number;
  successRate: number;
  avgResponseTime: number;
  avgSatisfactionScore: number;
  avgAccuracyScore: number;
}

export interface ABTestSession {
  id: string;
  questionId: string;
  controlVariantId: string;
  testVariantId: string;
  controlResponse: string;
  testResponse: string;
  controlScore: number;
  testScore: number;
  winner: 'control' | 'test' | 'tie';
  confidenceLevel: number;
  timestamp: Date;
  userFeedback?: 'control' | 'test' | 'neither';
}

/**
 * A/B Testing Manager
 * Manages multiple response strategies and compares their effectiveness
 */
export class ABTestingManager {
  private variants: Map<string, ABTestVariant> = new Map();
  private metrics: Map<string, ABTestMetrics> = new Map();
  private sessions: ABTestSession[] = [];
  private controlVariantId: string;

  constructor(controlVariantId: string = 'default') {
    this.controlVariantId = controlVariantId;
    this.initializeDefaultVariants();
  }

  private initializeDefaultVariants(): void {
    // Control: Default STAR method response
    this.registerVariant({
      id: 'default',
      name: 'Default STAR',
      description: 'Standard STAR method responses',
      strategy: 'default',
    });

    // Test 1: Concise responses
    this.registerVariant({
      id: 'concise',
      name: 'Concise Response',
      description: 'Shorter, punchier answers focusing on key points',
      strategy: 'concise',
      systemPromptModifier:
        'Keep responses concise (150-200 words). Focus on the most impactful information.',
    });

    // Test 2: Story-focused
    this.registerVariant({
      id: 'story-focused',
      name: 'Story-Focused',
      description: 'Emphasize narrative and emotional elements',
      strategy: 'story-focused',
      systemPromptModifier:
        'Tell engaging stories. Focus on the journey, challenges, and human elements of each experience.',
    });

    // Test 3: Metric-heavy
    this.registerVariant({
      id: 'metric-heavy',
      name: 'Metric-Heavy',
      description: 'Data-driven responses with specific numbers and percentages',
      strategy: 'metric-heavy',
      systemPromptModifier:
        'Emphasize quantifiable results. Include specific numbers, percentages, and measurable outcomes whenever possible.',
    });
  }

  /**
   * Register a new variant
   */
  registerVariant(variant: ABTestVariant): void {
    this.variants.set(variant.id, variant);
    if (!this.metrics.has(variant.id)) {
      this.metrics.set(variant.id, {
        variantId: variant.id,
        totalTests: 0,
        successRate: 0,
        avgResponseTime: 0,
        avgSatisfactionScore: 0,
        avgAccuracyScore: 0,
      });
    }
  }

  /**
   * Get all registered variants
   */
  getVariants(): ABTestVariant[] {
    return Array.from(this.variants.values());
  }

  /**
   * Get metrics for a specific variant
   */
  getMetrics(variantId: string): ABTestMetrics | undefined {
    return this.metrics.get(variantId);
  }

  /**
   * Get all metrics
   */
  getAllMetrics(): ABTestMetrics[] {
    return Array.from(this.metrics.values());
  }

  /**
   * Generate response using a specific variant
   */
  async generateResponse(
    question: string,
    context: Record<string, unknown>,
    variantId: string
  ): Promise<string> {
    const variant = this.variants.get(variantId);
    if (!variant) {
      throw new Error(`Variant ${variantId} not found`);
    }

    // Generate response (simplified - in production would apply strategy)
    const interviewContext: InterviewContext = {
      type: 'hr',
      relevantContext: [],
      ...context,
    };

    const response = await generateAIResponse(question, interviewContext);

    return response;
  }

  /**
   * Run A/B test comparing two variants
   */
  async runTest(
    questionId: string,
    question: string,
    context: Record<string, unknown>,
    controlVariantId?: string,
    testVariantId?: string
  ): Promise<ABTestSession> {
    const controlId = controlVariantId || this.controlVariantId;
    const testId = testVariantId || 'concise'; // Default test variant

    const controlVariant = this.variants.get(controlId);
    const testVariant = this.variants.get(testId);

    if (!controlVariant || !testVariant) {
      throw new Error('Variant not found');
    }

    // Generate responses
    const controlResponse = await this.generateResponse(
      question,
      context,
      controlVariant.strategy
    );
    const testResponse = await this.generateResponse(
      question,
      context,
      testVariant.strategy
    );

    // Evaluate responses (simplified scoring)
    const controlMetrics = this.evaluateResponse(controlResponse, question);
    const testMetrics = this.evaluateResponse(testResponse, question);

    // Determine winner
    const controlScore = this.calculateCompositeScore(controlMetrics);
    const testScore = this.calculateCompositeScore(testMetrics);

    let winner: 'control' | 'test' | 'tie' = 'tie';
    if (controlScore > testScore * 1.05) {
      winner = 'control';
    } else if (testScore > controlScore * 1.05) {
      winner = 'test';
    }

    // Calculate confidence level
    const scoreDiff = Math.abs(controlScore - testScore);
    const confidenceLevel = Math.min(0.95, scoreDiff * 10); // Simplified

    const session: ABTestSession = {
      id: `test-${Date.now()}`,
      questionId,
      controlVariantId: controlId,
      testVariantId: testId,
      controlResponse,
      testResponse,
      controlScore,
      testScore,
      winner,
      confidenceLevel,
      timestamp: new Date(),
    };

    this.sessions.push(session);
    this.updateMetrics(controlId, controlMetrics);
    this.updateMetrics(testId, testMetrics);

    return session;
  }

  /**
   * Record user feedback for a test session
   */
  recordUserFeedback(
    sessionId: string,
    feedback: 'control' | 'test' | 'neither'
  ): void {
    const session = this.sessions.find((s) => s.id === sessionId);
    if (session) {
      session.userFeedback = feedback;

      // Update metrics based on user feedback
      if (feedback === 'control') {
        const metrics = this.metrics.get(session.controlVariantId);
        if (metrics) {
          metrics.successRate =
            (metrics.successRate * metrics.totalTests + 1) / (metrics.totalTests + 1);
        }
      } else if (feedback === 'test') {
        const metrics = this.metrics.get(session.testVariantId);
        if (metrics) {
          metrics.successRate =
            (metrics.successRate * metrics.totalTests + 1) / (metrics.totalTests + 1);
        }
      }
    }
  }

  /**
   * Get test sessions
   */
  getSessions(limit?: number): ABTestSession[] {
    const sorted = [...this.sessions].sort(
      (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
    );
    return limit ? sorted.slice(0, limit) : sorted;
  }

  /**
   * Get winner statistics
   */
  getWinnerStats(): {
    control: number;
    test: number;
    tie: number;
    totalTests: number;
  } {
    const stats = {
      control: 0,
      test: 0,
      tie: 0,
      totalTests: this.sessions.length,
    };

    this.sessions.forEach((session) => {
      stats[session.winner] += 1;
    });

    return stats;
  }

  /**
   * Get performance comparison between two variants
   */
  compareVariants(
    variant1Id: string,
    variant2Id: string
  ): {
    variant1: ABTestMetrics;
    variant2: ABTestMetrics;
    recommendation: string;
  } | null {
    const metrics1 = this.metrics.get(variant1Id);
    const metrics2 = this.metrics.get(variant2Id);

    if (!metrics1 || !metrics2) {
      return null;
    }

    let recommendation = 'Insufficient data for recommendation';
    if (metrics1.totalTests >= 10 && metrics2.totalTests >= 10) {
      if (metrics1.avgSatisfactionScore > metrics2.avgSatisfactionScore * 1.1) {
        recommendation = `Variant ${variant1Id} shows significantly better performance`;
      } else if (metrics2.avgSatisfactionScore > metrics1.avgSatisfactionScore * 1.1) {
        recommendation = `Variant ${variant2Id} shows significantly better performance`;
      } else {
        recommendation = 'Performance is comparable between variants';
      }
    }

    return {
      variant1: metrics1,
      variant2: metrics2,
      recommendation,
    };
  }

  /**
   * Get best performing variant
   */
  getBestVariant(): { variantId: string; metrics: ABTestMetrics } | null {
    let bestVariant: { variantId: string; metrics: ABTestMetrics } | null = null;
    let bestScore = 0;

    this.metrics.forEach((metrics, variantId) => {
      if (metrics.totalTests >= 5) {
        // Require minimum sample size
        const score =
          metrics.avgSatisfactionScore * 0.4 +
          metrics.avgAccuracyScore * 0.4 +
          metrics.successRate * 0.2;

        if (score > bestScore) {
          bestScore = score;
          bestVariant = { variantId, metrics };
        }
      }
    });

    return bestVariant;
  }

  /**
   * Export test results
   */
  exportResults(): {
    variants: ABTestVariant[];
    metrics: ABTestMetrics[];
    sessions: ABTestSession[];
    winnerStats: ReturnType<typeof this.getWinnerStats>;
    bestVariant: ReturnType<typeof this.getBestVariant>;
  } {
    return {
      variants: this.getVariants(),
      metrics: this.getAllMetrics(),
      sessions: this.getSessions(),
      winnerStats: this.getWinnerStats(),
      bestVariant: this.getBestVariant(),
    };
  }

  /**
   * Clear all test data
   */
  clearData(): void {
    this.sessions = [];
    this.metrics.forEach((metrics) => {
      metrics.totalTests = 0;
      metrics.successRate = 0;
      metrics.avgResponseTime = 0;
      metrics.avgSatisfactionScore = 0;
      metrics.avgAccuracyScore = 0;
    });
  }

  /**
   * Evaluate response quality
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private evaluateResponse(
    response: string,
    _question: string
  ): { accuracy: number; storyCoverage: number; satisfaction: number } {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const responseLower = response.toLowerCase();

    // Accuracy: Check for relevant technical terms
    const technicalTerms = ['sql', 'python', 'power bi', 'data', 'analysis', 'stakeholder', 'metrics'];
    const matchedTerms = technicalTerms.filter((term) => responseLower.includes(term)).length;
    const accuracy = Math.min(1, (matchedTerms / technicalTerms.length) * 0.8 + 0.2);

    // Story Coverage: Check for STAR components
    const hasSTAR = [
      responseLower.includes('situation'),
      responseLower.includes('task'),
      responseLower.includes('action'),
      responseLower.includes('result'),
    ].filter(Boolean).length;
    const storyCoverage = Math.min(1, (hasSTAR / 4) * 0.7 + (response.length / 1000) * 0.3);

    // Satisfaction: Based on length, structure, and specificity
    const hasExamples = responseLower.includes('example') || responseLower.includes('specific');
    const hasMetrics = /(\d+%|\$\d+|roi)/i.test(response);
    const starCount = [
      responseLower.includes('situation'),
      responseLower.includes('task'),
      responseLower.includes('action'),
      responseLower.includes('result'),
    ].filter(Boolean).length;

    const satisfaction = Math.min(
      1,
      (hasExamples ? 0.3 : 0) + (hasMetrics ? 0.3 : 0) + (starCount / 4) * 0.4
    );

    return { accuracy, storyCoverage, satisfaction };
  }

  /**
   * Calculate composite score from metrics
   */
  private calculateCompositeScore(metrics: {
    accuracy: number;
    storyCoverage: number;
    satisfaction: number;
  }): number {
    return metrics.accuracy * 0.3 + metrics.storyCoverage * 0.4 + metrics.satisfaction * 0.3;
  }

  /**
   * Update metrics for a variant
   */
  private updateMetrics(
    variantId: string,
    evaluationMetrics: {
      accuracy: number;
      storyCoverage: number;
      satisfaction: number;
    }
  ): void {
    const metrics = this.metrics.get(variantId);
    if (!metrics) return;

    const n = metrics.totalTests;
    metrics.totalTests += 1;

    // Update rolling averages
    metrics.avgAccuracyScore =
      (metrics.avgAccuracyScore * n + evaluationMetrics.accuracy) / (n + 1);
    metrics.avgSatisfactionScore =
      (metrics.avgSatisfactionScore * n + evaluationMetrics.satisfaction) / (n + 1);

    // Update success rate (simplified: based on composite score)
    const compositeScore = this.calculateCompositeScore(evaluationMetrics);
    const isSuccess = compositeScore >= 0.7;
    metrics.successRate = (metrics.successRate * n + (isSuccess ? 1 : 0)) / (n + 1);
  }
}

// Singleton instance
export const abTestingManager = new ABTestingManager();
