
import { performance } from 'perf_hooks';

export interface TestResult {
  method: string;
  responseText: string;
  accuracy: number;
  storyCoverage: number;
  satisfaction: number;
  executionTime: number;
}

export interface TestConfig {
  question: string;
  context: Record<string, unknown>;
  interviewType?: 'screening' | 'hr' | 'technical' | 'manager' | 'executive';
}

export class ABTestingFramework {
  private results: TestResult[] = [];
  private baselineMethod = 'standard';

  /**
   * Run A/B test comparing two response generation methods
   */
  public runTest(config: TestConfig): {
    methodA: TestResult;
    methodB: TestResult;
    winner: string;
    improvement: number;
  } {
    const startA = performance.now();
    const responseA = this.generateResponse(config.question, config.context);
    const timeA = performance.now() - startA;

    const evaluationA = this.evaluateResponse(responseA, config.question);
    const resultA: TestResult = {
      method: 'standard',
      responseText: responseA,
      accuracy: evaluationA.accuracy,
      storyCoverage: evaluationA.storyCoverage,
      satisfaction: evaluationA.satisfaction,
      executionTime: timeA,
    };

    const startB = performance.now();
    const responseB = this.generateConciseResponse(config.question, config.context);
    const timeB = performance.now() - startB;

    const evaluationB = this.evaluateResponse(responseB, config.question);
    const resultB: TestResult = {
      method: 'concise',
      responseText: responseB,
      accuracy: evaluationB.accuracy,
      storyCoverage: evaluationB.storyCoverage,
      satisfaction: evaluationB.satisfaction,
      executionTime: timeB,
    };

    this.results.push(resultA, resultB);

    // Determine winner based on weighted score
    const scoreA = evaluationA.accuracy * 0.3 + evaluationA.satisfaction * 0.7;
    const scoreB = evaluationB.accuracy * 0.3 + evaluationB.satisfaction * 0.7;

    const winner = scoreA > scoreB ? 'standard' : 'concise';
    const improvement = ((Math.max(scoreA, scoreB) - Math.min(scoreA, scoreB)) / Math.min(scoreA, scoreB)) * 100;

    return {
      methodA: resultA,
      methodB: resultB,
      winner,
      improvement,
    };
  }

  /**
   * Generate standard response with full coverage
   */
  private generateResponse(question: string, context: Record<string, unknown>): string {
    const response = `Thank you for the question about ${this._extractTopic(question)}. Let me provide a comprehensive answer.

**Situation**: In my previous role, I encountered a scenario where ${this.extractRelevantContext(context, question)}.

**Task**: The challenge was to deliver high-quality results while maintaining team efficiency and stakeholder satisfaction.

**Action**: I took the following steps:
1. Analyzed the problem systematically using data-driven methods
2. Collaborated with cross-functional teams to identify solutions
3. Implemented best practices and standards
4. Monitored outcomes and adjusted approach as needed

**Result**: This initiative resulted in measurable improvements and positive feedback from stakeholders.`;

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
    question: string
  ): { accuracy: number; storyCoverage: number; satisfaction: number } {
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
   * Extract main topic from question
   */
  private _extractTopic(question: string): string {
    const words = question.split(/\s+/).slice(0, 3);
    return words.join(' ').toLowerCase();
  }

  /**
   * Extract relevant context from context object
   */
  private extractRelevantContext(context: Record<string, unknown>, question: string): string {
    if (!context || Object.keys(context).length === 0) {
      return 'we needed to solve a complex business challenge';
    }

    const keys = Object.keys(context);
    const randomKey = keys[Math.floor(Math.random() * keys.length)];
    const value = context[randomKey];

    if (typeof value === 'string') {
      return value;
    } else if (typeof value === 'object') {
      return JSON.stringify(value).substring(0, 100);
    }

    return 'we encountered a significant opportunity for improvement';
  }

  /**
   * Get test results summary
   */
  public getResultsSummary(): {
    totalTests: number;
    averageAccuracy: number;
    bestMethod: string;
    recommendations: string[];
  } {
    if (this.results.length === 0) {
      return {
        totalTests: 0,
        averageAccuracy: 0,
        bestMethod: 'none',
        recommendations: ['Run tests first'],
      };
    }

    const averageAccuracy = this.results.reduce((sum, r) => sum + r.accuracy, 0) / this.results.length;
    const methodResults = this.results.reduce(
      (acc: Record<string, { count: number; totalScore: number }>, result) => {
        if (!acc[result.method]) {
          acc[result.method] = { count: 0, totalScore: 0 };
        }
        acc[result.method].count++;
        acc[result.method].totalScore += result.satisfaction;
        return acc;
      },
      {}
    );

    let bestMethod = this.baselineMethod;
    let bestScore = 0;
    for (const [method, stats] of Object.entries(methodResults)) {
      const avgScore = stats.totalScore / stats.count;
      if (avgScore > bestScore) {
        bestScore = avgScore;
        bestMethod = method;
      }
    }

    const recommendations = [
      `Best performing method: ${bestMethod} (avg satisfaction: ${bestScore.toFixed(2)})`,
      `Overall accuracy: ${(averageAccuracy * 100).toFixed(1)}%`,
      `Total tests run: ${this.results.length}`,
    ];

    return {
      totalTests: this.results.length,
      averageAccuracy,
      bestMethod,
      recommendations,
    };
  }
}
