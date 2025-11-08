#!/usr/bin/env node

/**
 * Advanced Analytics System for Interview Performance
 * 
 * Provides real-time tracking and visualization of:
 * - Performance metrics over time
 * - Success rate trends
 * - User engagement patterns
 * - Improvement recommendations
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Type definitions
interface PerformanceSnapshot {
  timestamp: string;
  accuracy: number;
  storyCoverage: number;
  satisfaction: number;
  responseTime: number;
  questionCategory: string;
}

interface UserEngagement {
  totalSessions: number;
  completedSessions: number;
  averageSessionDuration: number;
  returnUserRate: number;
  questionsAnswered: number;
  favoriteQuestionType: string;
}

interface AnalyticsReport {
  period: string;
  metrics: {
    accuracy: {
      mean: number;
      trend: 'improving' | 'stable' | 'declining';
      percentileRank: number;
    };
    storyCoverage: {
      mean: number;
      trend: 'improving' | 'stable' | 'declining';
      percentileRank: number;
    };
    satisfaction: {
      mean: number;
      trend: 'improving' | 'stable' | 'declining';
      percentileRank: number;
    };
  };
  engagement: UserEngagement;
  recommendations: string[];
  nextMilestones: string[];
}

class AdvancedAnalytics {
  private snapshots: PerformanceSnapshot[] = [];
  private dataDir: string;

  constructor() {
    this.dataDir = path.join(__dirname, '..', 'analytics_data');
  }

  /**
   * Initialize analytics system
   */
  async initialize(): Promise<void> {
    try {
      await fs.mkdir(this.dataDir, { recursive: true });
      await this.loadSnapshots();
      console.error('✓ Advanced Analytics initialized');
    } catch (error) {
      console.error('✗ Error initializing Advanced Analytics:', error);
      throw error;
    }
  }

  /**
   * Record a performance snapshot
   */
  async recordSnapshot(
    accuracy: number,
    storyCoverage: number,
    satisfaction: number,
    responseTime: number,
    questionCategory: string
  ): Promise<void> {
    const snapshot: PerformanceSnapshot = {
      timestamp: new Date().toISOString(),
      accuracy,
      storyCoverage,
      satisfaction,
      responseTime,
      questionCategory,
    };

    this.snapshots.push(snapshot);
    await this.saveSnapshots();
  }

  /**
   * Get performance over a time period
   */
  getPerformanceTrend(hours: number = 24): PerformanceSnapshot[] {
    const cutoffTime = new Date(Date.now() - hours * 60 * 60 * 1000);
    return this.snapshots.filter((s) => new Date(s.timestamp) > cutoffTime);
  }

  /**
   * Calculate trend direction
   */
  private calculateTrend(values: number[]): 'improving' | 'stable' | 'declining' {
    if (values.length < 2) return 'stable';

    const firstHalf = values.slice(0, Math.floor(values.length / 2));
    const secondHalf = values.slice(Math.floor(values.length / 2));

    const firstMean = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
    const secondMean = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;

    const change = (secondMean - firstMean) / firstMean;

    if (change > 0.05) return 'improving';
    if (change < -0.05) return 'declining';
    return 'stable';
  }

  /**
   * Generate comprehensive analytics report
   */
  generateReport(period: 'daily' | 'weekly' | 'monthly' = 'daily'): AnalyticsReport {
    const hoursMap = { daily: 24, weekly: 168, monthly: 720 };
    const periodHours = hoursMap[period];

    const trend = this.getPerformanceTrend(periodHours);

    if (trend.length === 0) {
      return this.getEmptyReport(period);
    }

    // Calculate metrics
    const accuracyValues = trend.map((s) => s.accuracy);
    const storyCoverageValues = trend.map((s) => s.storyCoverage);
    const satisfactionValues = trend.map((s) => s.satisfaction);

    const report: AnalyticsReport = {
      period,
      metrics: {
        accuracy: {
          mean: accuracyValues.reduce((a, b) => a + b, 0) / accuracyValues.length,
          trend: this.calculateTrend(accuracyValues),
          percentileRank: this.calculatePercentileRank(accuracyValues),
        },
        storyCoverage: {
          mean: storyCoverageValues.reduce((a, b) => a + b, 0) / storyCoverageValues.length,
          trend: this.calculateTrend(storyCoverageValues),
          percentileRank: this.calculatePercentileRank(storyCoverageValues),
        },
        satisfaction: {
          mean: satisfactionValues.reduce((a, b) => a + b, 0) / satisfactionValues.length,
          trend: this.calculateTrend(satisfactionValues),
          percentileRank: this.calculatePercentileRank(satisfactionValues),
        },
      },
      engagement: this.calculateEngagement(trend),
      recommendations: this.generateRecommendations(trend),
      nextMilestones: this.generateMilestones(trend),
    };

    return report;
  }

  /**
   * Calculate percentile rank
   */
  private calculatePercentileRank(values: number[]): number {
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const stdDev = Math.sqrt(values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length);

    // Simple z-score to percentile conversion
    const zScore = (mean - 0.5) / (stdDev || 0.1); // Assuming 0.5 is baseline
    const percentile = (1 / (1 + Math.exp(-zScore))) * 100;

    return Math.min(100, Math.max(0, percentile));
  }

  /**
   * Calculate user engagement metrics
   */
  private calculateEngagement(snapshots: PerformanceSnapshot[]): UserEngagement {
    const uniqueDays = new Set(
      snapshots.map((s) => new Date(s.timestamp).toDateString())
    ).size;

    const avgResponseTime =
      snapshots.reduce((sum, s) => sum + s.responseTime, 0) / snapshots.length;

    const questionCategories = snapshots.reduce(
      (acc, s) => {
        acc[s.questionCategory] = (acc[s.questionCategory] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    const favoriteCategory = Object.entries(questionCategories).sort(
      ([, a], [, b]) => b - a
    )[0][0];

    return {
      totalSessions: snapshots.length,
      completedSessions: Math.floor(snapshots.length * 0.9), // Assume 90% completion
      averageSessionDuration: Math.round(avgResponseTime),
      returnUserRate: Math.min(100, (uniqueDays / 7) * 100),
      questionsAnswered: snapshots.length,
      favoriteQuestionType: favoriteCategory,
    };
  }

  /**
   * Generate personalized recommendations
   */
  private generateRecommendations(snapshots: PerformanceSnapshot[]): string[] {
    const recommendations: string[] = [];

    if (snapshots.length === 0) {
      return ['Start practicing with interview simulations to build confidence'];
    }

    const accuracyValues = snapshots.map((s) => s.accuracy);
    const avgAccuracy = accuracyValues.reduce((a, b) => a + b, 0) / accuracyValues.length;

    if (avgAccuracy < 0.65) {
      recommendations.push('Focus on technical depth - review Business Analyst fundamentals');
    } else if (avgAccuracy < 0.75) {
      recommendations.push('Good progress! Practice more complex scenarios to increase confidence');
    } else if (avgAccuracy >= 0.85) {
      recommendations.push('Excellent performance! Ready for real interviews');
    }

    // Story coverage analysis
    const storyCoverageValues = snapshots.map((s) => s.storyCoverage);
    const avgCoverage = storyCoverageValues.reduce((a, b) => a + b, 0) / storyCoverageValues.length;

    if (avgCoverage < 0.6) {
      recommendations.push('Strengthen STAR method structure - emphasize Situation and Task more');
    }

    // Response time analysis
    const responseTimeValues = snapshots.map((s) => s.responseTime);
    const avgTime = responseTimeValues.reduce((a, b) => a + b, 0) / responseTimeValues.length;

    if (avgTime > 5000) {
      recommendations.push('Practice thinking on your feet - aim to respond within 30-60 seconds');
    }

    // Category performance
    const categoryScores: Record<string, number[]> = {};
    snapshots.forEach((s) => {
      if (!categoryScores[s.questionCategory]) {
        categoryScores[s.questionCategory] = [];
      }
      categoryScores[s.questionCategory].push(s.accuracy);
    });

    const weakCategory = Object.entries(categoryScores).sort(
      ([, a], [, b]) =>
        (a.reduce((x, y) => x + y, 0) / a.length) - (b.reduce((x, y) => x + y, 0) / b.length)
    )[0];

    if (weakCategory && weakCategory[1].length > 0) {
      const avgScore = weakCategory[1].reduce((a, b) => a + b, 0) / weakCategory[1].length;
      if (avgScore < 0.75) {
        recommendations.push(`Improve ${weakCategory[0]} question responses - practice more in this category`);
      }
    }

    return recommendations.slice(0, 5);
  }

  /**
   * Generate next milestones
   */
  private generateMilestones(snapshots: PerformanceSnapshot[]): string[] {
    const milestones: string[] = [];

    if (snapshots.length === 0) {
      return [
        'Complete first interview simulation',
        'Achieve 70% average accuracy',
        'Maintain consistency across 10 sessions',
      ];
    }

    const avgAccuracy = snapshots.reduce((sum, s) => sum + s.accuracy, 0) / snapshots.length;

    if (avgAccuracy < 0.7) {
      milestones.push(`Reach 70% accuracy (currently ${(avgAccuracy * 100).toFixed(1)}%)`);
    } else if (avgAccuracy < 0.8) {
      milestones.push(`Reach 80% accuracy (currently ${(avgAccuracy * 100).toFixed(1)}%)`);
    } else if (avgAccuracy < 0.85) {
      milestones.push(`Reach 85% accuracy (currently ${(avgAccuracy * 100).toFixed(1)}%)`);
    } else {
      milestones.push('Maintain 85%+ accuracy consistently');
    }

    if (snapshots.length < 10) {
      milestones.push(`Complete ${10 - snapshots.length} more sessions for statistical significance`);
    } else if (snapshots.length < 20) {
      milestones.push(`Complete ${20 - snapshots.length} more sessions for advanced analytics`);
    }

    // Category-specific milestones
    const categoryDistribution: Record<string, number> = {};
    snapshots.forEach((s) => {
      categoryDistribution[s.questionCategory] =
        (categoryDistribution[s.questionCategory] || 0) + 1;
    });

    const underrepresentedCategory = Object.entries(categoryDistribution).sort(
      ([, a], [, b]) => a - b
    )[0];

    if (underrepresentedCategory && underrepresentedCategory[1] < 3) {
      milestones.push(`Practice ${underrepresentedCategory[0]} questions more (complete 3+ sessions)`);
    }

    return milestones;
  }

  /**
   * Get empty report
   */
  private getEmptyReport(period: string): AnalyticsReport {
    return {
      period,
      metrics: {
        accuracy: { mean: 0, trend: 'stable', percentileRank: 0 },
        storyCoverage: { mean: 0, trend: 'stable', percentileRank: 0 },
        satisfaction: { mean: 0, trend: 'stable', percentileRank: 0 },
      },
      engagement: {
        totalSessions: 0,
        completedSessions: 0,
        averageSessionDuration: 0,
        returnUserRate: 0,
        questionsAnswered: 0,
        favoriteQuestionType: 'N/A',
      },
      recommendations: ['Start your first interview simulation to begin tracking progress'],
      nextMilestones: ['Complete first interview simulation'],
    };
  }

  /**
   * Export analytics data
   */
  async exportAnalytics(format: 'json' | 'csv' = 'json'): Promise<string> {
    if (format === 'json') {
      return JSON.stringify(
        {
          exportDate: new Date().toISOString(),
          totalSnapshots: this.snapshots.length,
          dailyReport: this.generateReport('daily'),
          weeklyReport: this.generateReport('weekly'),
          monthlyReport: this.generateReport('monthly'),
          allSnapshots: this.snapshots,
        },
        null,
        2
      );
    }

    // CSV format
    let csv =
      'Timestamp,Accuracy,StoryCoverage,Satisfaction,ResponseTime,QuestionCategory\n';
    for (const snapshot of this.snapshots) {
      csv += `${snapshot.timestamp},${snapshot.accuracy.toFixed(3)},${snapshot.storyCoverage.toFixed(3)},${snapshot.satisfaction.toFixed(3)},${snapshot.responseTime},${snapshot.questionCategory}\n`;
    }

    return csv;
  }

  /**
   * Get performance statistics
   */
  getPerformanceStats(): {
    totalSnapshots: number;
    averageAccuracy: number;
    averageStoryCoverage: number;
    averageSatisfaction: number;
    averageResponseTime: number;
  } {
    if (this.snapshots.length === 0) {
      return {
        totalSnapshots: 0,
        averageAccuracy: 0,
        averageStoryCoverage: 0,
        averageSatisfaction: 0,
        averageResponseTime: 0,
      };
    }

    return {
      totalSnapshots: this.snapshots.length,
      averageAccuracy:
        this.snapshots.reduce((sum, s) => sum + s.accuracy, 0) / this.snapshots.length,
      averageStoryCoverage:
        this.snapshots.reduce((sum, s) => sum + s.storyCoverage, 0) / this.snapshots.length,
      averageSatisfaction:
        this.snapshots.reduce((sum, s) => sum + s.satisfaction, 0) / this.snapshots.length,
      averageResponseTime:
        this.snapshots.reduce((sum, s) => sum + s.responseTime, 0) / this.snapshots.length,
    };
  }

  /**
   * Save snapshots to file
   */
  private async saveSnapshots(): Promise<void> {
    try {
      const filePath = path.join(this.dataDir, 'snapshots.json');
      await fs.writeFile(filePath, JSON.stringify(this.snapshots, null, 2));
    } catch (error) {
      console.error('Error saving snapshots:', error);
    }
  }

  /**
   * Load snapshots from file
   */
  private async loadSnapshots(): Promise<void> {
    try {
      const filePath = path.join(this.dataDir, 'snapshots.json');
      const data = await fs.readFile(filePath, 'utf-8');
      this.snapshots = JSON.parse(data);
    } catch (error) {
      // File doesn't exist yet
    }
  }
}

export default AdvancedAnalytics;