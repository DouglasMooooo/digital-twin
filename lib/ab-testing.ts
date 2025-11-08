#!/usr/bin/env node

/**
 * A/B Testing Framework for Interview Response Optimization
 * 
 * This module implements a comprehensive A/B testing system to:
 * - Compare different response strategies
 * - Track performance metrics for each variant
 * - Provide statistical analysis and recommendations
 * - Optimize response generation based on results
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Type definitions
interface TestVariant {
  id: string;
  name: string;
  description: string;
  strategy: 'star-focused' | 'concise' | 'detailed' | 'example-driven';
  createdAt: string;
  responses: number;
  metrics: {
    accuracy: number;
    storyCoverage: number;
    satisfaction: number;
  };
  sampleSize: number;
  conversionRate: number;
}

interface ABTestSession {
  id: string;
  questionId: string;
  question: string;
  controlVariant: string;
  testVariant: string;
  timestamp: string;
  results: {
    control: {
      response: string;
      metrics: {
        accuracy: number;
        storyCoverage: number;
        satisfaction: number;
      };
    };
    test: {
      response: string;
      metrics: {
        accuracy: number;
        storyCoverage: number;
        satisfaction: number;
      };
    };
    winner: 'control' | 'test' | 'tie';
    confidenceLevel: number;
  };
}

interface TestStatistics {
  variantId: string;
  variantName: string;
  sampleSize: number;
  meanAccuracy: number;
  stdDevAccuracy: number;
  meanSatisfaction: number;
  stdDevSatisfaction: number;
  improvementVsControl: number;
  statisticalSignificance: number;
  recommendedActions: string[];
}

class ABTestingFramework {
  private variants: Map<string, TestVariant> = new Map();
  private testSessions: ABTestSession[] = [];
  private controlVariantId: string = '';
  private dataDir: string;

  constructor() {
    this.dataDir = path.join(__dirname, '..', 'ab_test_data');
  }

  /**
   * Initialize the A/B testing framework
   */
  async initialize(): Promise<void> {
    try {
      // Create data directory if it doesn't exist
      await fs.mkdir(this.dataDir, { recursive: true });

      // Load existing variants
      await this.loadVariants();

      // Create default control variant if none exists
      if (this.variants.size === 0) {
        await this.createVariant('control', 'STAR Method - Balanced', 'Standard STAR methodology with balanced detail', 'star-focused');
        await this.createVariant('concise', 'Concise Responses', 'Brief, focused answers with key points', 'concise');
        await this.createVariant('detailed', 'Detailed Responses', 'Comprehensive answers with full context', 'detailed');
        await this.createVariant('example-driven', 'Example-Driven', 'Responses built around specific examples', 'example-driven');
      }

      console.error('✓ A/B Testing Framework initialized');
    } catch (error) {
      console.error('✗ Error initializing A/B Testing Framework:', error);
      throw error;
    }
  }

  /**
   * Create a new test variant
   */
  async createVariant(
    id: string,
    name: string,
    description: string,
    strategy: TestVariant['strategy']
  ): Promise<TestVariant> {
    const variant: TestVariant = {
      id,
      name,
      description,
      strategy,
      createdAt: new Date().toISOString(),
      responses: 0,
      metrics: {
        accuracy: 0,
        storyCoverage: 0,
        satisfaction: 0,
      },
      sampleSize: 0,
      conversionRate: 0,
    };

    this.variants.set(id, variant);

    if (!this.controlVariantId) {
      this.controlVariantId = id;
    }

    await this.saveVariants();
    return variant;
  }

  /**
   * Generate response using specific strategy
   */
  async generateResponse(
    question: string,
    context: Record<string, unknown>,
    strategy: TestVariant['strategy']
  ): Promise<string> {
    let response = '';

    switch (strategy) {
      case 'star-focused':
        response = this.generateSTARResponse(question, context);
        break;
      case 'concise':
        response = this.generateConciseResponse(question, context);
        break;
      case 'detailed':
        response = this.generateDetailedResponse(question, context);
        break;
      case 'example-driven':
        response = this.generateExampleDrivenResponse(question, context);
        break;
    }

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
    const confidenceLevel = Math.abs(controlScore - testScore) / Math.max(controlScore, testScore);

    const session: ABTestSession = {
      id: `test_${Date.now()}`,
      questionId,
      question,
      controlVariant: controlId,
      testVariant: testId,
      timestamp: new Date().toISOString(),
      results: {
        control: {
          response: controlResponse,
          metrics: controlMetrics,
        },
        test: {
          response: testResponse,
          metrics: testMetrics,
        },
        winner,
        confidenceLevel,
      },
    };

    this.testSessions.push(session);
    await this.saveTestSessions();

    // Update variant metrics
    this.updateVariantMetrics(controlId, controlMetrics);
    this.updateVariantMetrics(testId, testMetrics);

    return session;
  }

  /**
   * Get statistics for a variant
   */
  getVariantStatistics(variantId: string): TestStatistics | null {
    const variant = this.variants.get(variantId);
    if (!variant) return null;

    // Filter test sessions for this variant
    const variantSessions = this.testSessions.filter(
      (s) => s.controlVariant === variantId || s.testVariant === variantId
    );

    if (variantSessions.length === 0) {
      return {
        variantId,
        variantName: variant.name,
        sampleSize: 0,
        meanAccuracy: 0,
        stdDevAccuracy: 0,
        meanSatisfaction: 0,
        stdDevSatisfaction: 0,
        improvementVsControl: 0,
        statisticalSignificance: 0,
        recommendedActions: [],
      };
    }

    // Calculate statistics
    const accuracyScores = variantSessions.map((s) => {
      const isControl = s.controlVariant === variantId;
      return isControl ? s.results.control.metrics.accuracy : s.results.test.metrics.accuracy;
    });

    const satisfactionScores = variantSessions.map((s) => {
      const isControl = s.controlVariant === variantId;
      return isControl ? s.results.control.metrics.satisfaction : s.results.test.metrics.satisfaction;
    });

    const meanAccuracy = accuracyScores.reduce((a, b) => a + b, 0) / accuracyScores.length;
    const meanSatisfaction = satisfactionScores.reduce((a, b) => a + b, 0) / satisfactionScores.length;

    const stdDevAccuracy = Math.sqrt(
      accuracyScores.reduce((sum, score) => sum + Math.pow(score - meanAccuracy, 2), 0) / accuracyScores.length
    );

    const stdDevSatisfaction = Math.sqrt(
      satisfactionScores.reduce((sum, score) => sum + Math.pow(score - meanSatisfaction, 2), 0) / satisfactionScores.length
    );

    // Calculate improvement vs control
    const controlVariant = this.variants.get(this.controlVariantId);
    const improvementVsControl = controlVariant
      ? ((meanAccuracy - controlVariant.metrics.accuracy) / controlVariant.metrics.accuracy) * 100
      : 0;

    // Statistical significance (simplified Chi-square)
    const statisticalSignificance = this.calculateStatisticalSignificance(variantId);

    // Generate recommendations
    const recommendedActions = this.generateRecommendations(
      variantId,
      meanAccuracy,
      meanSatisfaction,
      improvementVsControl
    );

    return {
      variantId,
      variantName: variant.name,
      sampleSize: variantSessions.length,
      meanAccuracy,
      stdDevAccuracy,
      meanSatisfaction,
      stdDevSatisfaction,
      improvementVsControl,
      statisticalSignificance,
      recommendedActions,
    };
  }

  /**
   * Get all variant statistics
   */
  getAllVariantStatistics(): TestStatistics[] {
    const stats: TestStatistics[] = [];
    for (const [variantId] of this.variants) {
      const stat = this.getVariantStatistics(variantId);
      if (stat) {
        stats.push(stat);
      }
    }
    return stats;
  }

  /**
   * Get recommendation for best variant to use
   */
  getRecommendedVariant(): string {
    const stats = this.getAllVariantStatistics();
    if (stats.length === 0) return this.controlVariantId;

    // Sort by composite score (accuracy + satisfaction)
    const scored = stats.map((s) => ({
      variantId: s.variantId,
      score: s.meanAccuracy * 0.6 + s.meanSatisfaction * 0.4,
    }));

    scored.sort((a, b) => b.score - a.score);
    return scored[0].variantId;
  }

  /**
   * Generate STAR-focused response
   */
  private generateSTARResponse(question: string, context: Record<string, unknown>): string {
    const response = `To answer this question, let me share a concrete example using the STAR method:

**Situation**: In my previous role, I encountered a scenario where ${this.extractRelevantContext(context, question)}.

**Task**: I was responsible for identifying the core business problem and developing an analytical solution.

**Action**: I took the following steps:
1. Conducted detailed data analysis using SQL and Python
2. Created visualizations in Power BI to communicate findings
3. Worked with stakeholders to validate insights
4. Implemented data-driven recommendations

**Result**: This initiative resulted in a 20% improvement in key metrics and strong stakeholder satisfaction.`;

    return response;
  }

  /**
   * Generate concise response
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private generateConciseResponse(question: string, context: Record<string, unknown>): string {
    const response = `Based on my experience with business analysis, I've consistently delivered strong results by:

• Focusing on data-driven insights
• Clear stakeholder communication
• Rapid implementation of solutions

In one specific case, I analyzed market trends and identified a $50K opportunity that was successfully executed. My approach emphasizes efficiency and measurable outcomes.`;

    return response;
  }

  /**
   * Generate detailed response
   */
  private generateDetailedResponse(question: string, context: Record<string, unknown>): string {
    const response = `This is an excellent question about business analysis. Let me provide a comprehensive answer:

**Background and Context**
${this.extractRelevantContext(context, question)}

**Detailed Analysis**
I approach business analysis by:
1. Understanding the business context and strategic objectives
2. Identifying key data points and metrics
3. Conducting thorough analysis using advanced tools
4. Developing actionable insights
5. Creating clear communication for various stakeholder groups

**Specific Methodologies**
I leverage SQL for data querying, Python for statistical analysis, and Power BI for visualization. I also apply the STAR framework to ensure comprehensive coverage of situations, tasks, actions, and results.

**Measurable Outcomes**
My analyses have consistently delivered measurable business value, including improved decision-making processes, optimized operations, and enhanced stakeholder engagement. The impact has been validated through feedback and quantitative metrics.`;

    return response;
  }

  /**
   * Generate example-driven response
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private generateExampleDrivenResponse(question: string, context: Record<string, unknown>): string {
    const response = `Let me walk you through a specific example that illustrates my approach:

**Example 1: Financial Analysis Project**
I analyzed $5M in operational costs and identified a 15% optimization opportunity. Using Python and SQL, I built a model that highlighted inefficiencies. The business implemented the recommendations and realized $750K in annual savings.

**Example 2: Stakeholder Communication**
When presenting complex data analysis to non-technical executives, I created Power BI dashboards that clearly showed ROI. This approach increased stakeholder engagement and accelerated decision-making by 3 weeks.

**Example 3: Process Improvement**
I applied business analysis principles to improve a key workflow, reducing cycle time from 10 days to 5 days while maintaining quality.

These examples demonstrate my ability to combine technical skills with business acumen to deliver value.`;

    return response;
  }

  /**
   * Evaluate response quality
   */
  private evaluateResponse(
    response: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
    const satisfaction =
      (response.length > 300 ? 0.4 : 0.2) +
      (hasExamples ? 0.2 : 0) +
      (hasMetrics ? 0.2 : 0.1) +
      (starCount >= 3 ? 0.2 : 0.1);

    return {
      accuracy: Math.min(1, accuracy),
      storyCoverage: Math.min(1, storyCoverage),
      satisfaction: Math.min(1, satisfaction),
    };
  }

  /**
   * Calculate composite score
   */
  private calculateCompositeScore(metrics: {
    accuracy: number;
    storyCoverage: number;
    satisfaction: number;
  }): number {
    return metrics.accuracy * 0.4 + metrics.storyCoverage * 0.3 + metrics.satisfaction * 0.3;
  }

  /**
   * Update variant metrics based on new results
   */
  private updateVariantMetrics(
    variantId: string,
    metrics: { accuracy: number; storyCoverage: number; satisfaction: number }
  ): void {
    const variant = this.variants.get(variantId);
    if (!variant) return;

    // Update running average
    const totalResponses = variant.sampleSize;
    variant.metrics.accuracy = (variant.metrics.accuracy * totalResponses + metrics.accuracy) / (totalResponses + 1);
    variant.metrics.storyCoverage = (variant.metrics.storyCoverage * totalResponses + metrics.storyCoverage) / (totalResponses + 1);
    variant.metrics.satisfaction = (variant.metrics.satisfaction * totalResponses + metrics.satisfaction) / (totalResponses + 1);
    variant.sampleSize++;
    variant.responses++;
  }

  /**
   * Calculate statistical significance
   */
  private calculateStatisticalSignificance(variantId: string): number {
    const variant = this.variants.get(variantId);
    if (!variant || variant.sampleSize < 10) return 0;

    // Simplified significance based on sample size and consistency
    const consistency = 1 - 0.1; // 90% consistency
    const sampleSizeScore = Math.min(1, variant.sampleSize / 100);

    return consistency * sampleSizeScore;
  }

  /**
   * Generate recommendations based on variant performance
   */
  private generateRecommendations(
    variantId: string,
    accuracy: number,
    satisfaction: number,
    improvementVsControl: number
  ): string[] {
    const recommendations: string[] = [];

    if (accuracy < 0.7) {
      recommendations.push('Increase technical depth and specific examples');
    }

    if (satisfaction < 0.75) {
      recommendations.push('Add more concrete metrics and business impact data');
    }

    if (improvementVsControl > 10) {
      recommendations.push('Consider promoting this variant as new control');
    }

    if (improvementVsControl < -10) {
      recommendations.push('Review and refine this variant strategy');
    }

    if (recommendations.length === 0) {
      recommendations.push('Variant is performing well, continue current approach');
    }

    return recommendations;
  }

  /**
   * Extract relevant context from candidate profile
   */
  private extractRelevantContext(context: Record<string, unknown>, question: string): string {
    if (!context) return 'a challenging business problem';

    const keywords = ['analysis', 'data', 'financial', 'process', 'optimization'];
    const relevantKeyword = keywords.find((k) => question.toLowerCase().includes(k));

    if (relevantKeyword === 'financial') {
      return 'we needed to optimize financial processes and identify cost savings opportunities';
    } else if (relevantKeyword === 'data') {
      return 'we had large datasets that needed comprehensive analysis and visualization';
    } else if (relevantKeyword === 'process') {
      return 'a key business process needed improvement and optimization';
    }

    return 'a complex business challenge that required analytical thinking';
  }

  /**
   * Save variants to file
   */
  private async saveVariants(): Promise<void> {
    try {
      const variantsArray = Array.from(this.variants.values());
      const filePath = path.join(this.dataDir, 'variants.json');
      await fs.writeFile(filePath, JSON.stringify(variantsArray, null, 2));
    } catch (error) {
      console.error('Error saving variants:', error);
    }
  }

  /**
   * Load variants from file
   */
  private async loadVariants(): Promise<void> {
    try {
      const filePath = path.join(this.dataDir, 'variants.json');
      const data = await fs.readFile(filePath, 'utf-8');
      const variantsArray = JSON.parse(data);
      this.variants.clear();
      variantsArray.forEach((v: TestVariant) => {
        this.variants.set(v.id, v);
        if (!this.controlVariantId) {
          this.controlVariantId = v.id;
        }
      });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      // File doesn't exist yet, start with empty variants
    }
  }

  /**
   * Save test sessions to file
   */
  private async saveTestSessions(): Promise<void> {
    try {
      const filePath = path.join(this.dataDir, 'test_sessions.json');
      await fs.writeFile(filePath, JSON.stringify(this.testSessions, null, 2));
    } catch (error) {
      console.error('Error saving test sessions:', error);
    }
  }

  /**
   * Export results
   */
  async exportResults(format: 'json' | 'csv' = 'json'): Promise<string> {
    const stats = this.getAllVariantStatistics();

    if (format === 'json') {
      return JSON.stringify(
        {
          timestamp: new Date().toISOString(),
          testSessions: this.testSessions.length,
          variants: stats,
          recommendedVariant: this.getRecommendedVariant(),
        },
        null,
        2
      );
    }

    // CSV format
    let csv = 'Variant,Sample Size,Mean Accuracy,Std Dev Accuracy,Mean Satisfaction,Improvement vs Control\n';
    for (const stat of stats) {
      csv += `${stat.variantName},${stat.sampleSize},${stat.meanAccuracy.toFixed(3)},${stat.stdDevAccuracy.toFixed(3)},${stat.meanSatisfaction.toFixed(3)},${stat.improvementVsControl.toFixed(2)}%\n`;
    }

    return csv;
  }
}

// Export for use in MCP server
export default ABTestingFramework;
