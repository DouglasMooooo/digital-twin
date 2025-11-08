import * as fs from 'fs/promises';
import * as path from 'path';
import { EventEmitter } from 'events';

interface AnalyticsEvent {
  timestamp: number;
  type: string;
  userId?: string;
  sessionId: string;
  data: Record<string, unknown>;
}

interface AnalyticsSnapshot {
  timestamp: number;
  metrics: Record<string, unknown>;
}

class AdvancedAnalytics extends EventEmitter {
  private events: AnalyticsEvent[] = [];
  private snapshots: AnalyticsSnapshot[] = [];
  private dataDir: string;
  private eventEmitter: EventEmitter;

  constructor(dataDir: string = './analytics') {
    super();
    this.dataDir = dataDir;
    this.eventEmitter = new EventEmitter();
  }

  /**
   * Track an analytics event
   */
  public trackEvent(type: string, userId: string, sessionId: string, data: Record<string, unknown>): void {
    const event: AnalyticsEvent = {
      timestamp: Date.now(),
      type,
      userId,
      sessionId,
      data,
    };
    this.events.push(event);
    this.eventEmitter.emit('event', event);
  }

  /**
   * Get events for a specific user
   */
  public getEventsByUser(userId: string): AnalyticsEvent[] {
    return this.events.filter((e) => e.userId === userId);
  }

  /**
   * Get events for a specific session
   */
  public getEventsBySession(sessionId: string): AnalyticsEvent[] {
    return this.events.filter((e) => e.sessionId === sessionId);
  }

  /**
   * Get all events
   */
  public getEvents(): AnalyticsEvent[] {
    return this.events;
  }

  /**
   * Get events within a time range
   */
  public getEventsByTimeRange(startTime: number, endTime: number): AnalyticsEvent[] {
    return this.events.filter((e) => e.timestamp >= startTime && e.timestamp <= endTime);
  }

  /**
   * Track a metric snapshot
   */
  public trackSnapshot(metrics: Record<string, unknown>): void {
    this.snapshots.push({
      timestamp: Date.now(),
      metrics,
    });
  }

  /**
   * Get metrics summary
   */
  public getMetricsSummary(): Record<string, unknown> {
    if (this.snapshots.length === 0) return {};

    const latest = this.snapshots[this.snapshots.length - 1];
    return {
      timestamp: latest.timestamp,
      ...latest.metrics,
    };
  }

  /**
   * Export analytics data
   */
  public async exportData(filePath: string): Promise<void> {
    try {
      const data = {
        events: this.events,
        snapshots: this.snapshots,
      };
      await fs.writeFile(filePath, JSON.stringify(data, null, 2));
    } catch (error) {
      console.error('Error exporting analytics data:', error);
      throw error;
    }
  }

  /**
   * Import analytics data
   */
  public async importData(filePath: string): Promise<void> {
    try {
      const data = await fs.readFile(filePath, 'utf-8');
      const parsed = JSON.parse(data);
      this.events = parsed.events || [];
      this.snapshots = parsed.snapshots || [];
    } catch (error) {
      console.error('Error importing analytics data:', error);
      throw error;
    }
  }

  /**
   * Clear all events
   */
  public clearEvents(): void {
    this.events = [];
  }

  /**
   * Clear all snapshots
   */
  public clearSnapshots(): void {
    this.snapshots = [];
  }

  /**
   * Get all snapshots
   */
  public getSnapshots(): AnalyticsSnapshot[] {
    return this.snapshots;
  }

  /**
   * Generate a report for a given period
   */
  public generateReport(period: string = 'daily'): Record<string, unknown> {
    const timeLimit = this.getTimeLimitForPeriod(period);
    const recentEvents = this.getEventsByTimeRange(timeLimit, Date.now());
    const summary = this.getMetricsSummary();

    return {
      period,
      generatedAt: new Date().toISOString(),
      eventsCount: recentEvents.length,
      eventTypes: this.groupByType(recentEvents),
      metrics: summary,
    };
  }

  /**
   * Record a snapshot of metrics
   */
  public async recordSnapshot(
    accuracy?: number,
    storyCoverage?: number,
    satisfaction?: number,
    responseTime?: number,
    category?: string
  ): Promise<void> {
    const metrics: Record<string, unknown> = {};
    if (accuracy !== undefined) metrics.accuracy = accuracy;
    if (storyCoverage !== undefined) metrics.storyCoverage = storyCoverage;
    if (satisfaction !== undefined) metrics.satisfaction = satisfaction;
    if (responseTime !== undefined) metrics.responseTime = responseTime;
    if (category !== undefined) metrics.category = category;

    this.trackSnapshot(metrics);
  }

  /**
   * Initialize analytics
   */
  public async initialize(): Promise<void> {
    try {
      await fs.mkdir(this.dataDir, { recursive: true });
      await this.initializeEvents();
      await this.initializeSnapshots();
    } catch (error) {
      console.error('Error initializing analytics:', error);
      throw error;
    }
  }

  /**
   * Helper: Get time limit based on period
   */
  private getTimeLimitForPeriod(period: string): number {
    const now = Date.now();
    switch (period.toLowerCase()) {
      case 'hourly':
        return now - 3600000; // 1 hour
      case 'daily':
        return now - 86400000; // 24 hours
      case 'weekly':
        return now - 604800000; // 7 days
      case 'monthly':
        return now - 2592000000; // 30 days
      default:
        return now - 86400000; // Default to 24 hours
    }
  }

  /**
   * Helper: Group events by type
   */
  private groupByType(events: AnalyticsEvent[]): Record<string, number> {
    return events.reduce((acc, event) => {
      acc[event.type] = (acc[event.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }

  /**
   * Initialize events from file
   */
  private async initializeEvents(): Promise<void> {
    try {
      const filePath = path.join(this.dataDir, 'events.json');
      const data = await fs.readFile(filePath, 'utf-8');
      this.events = JSON.parse(data);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_error) {
      // File doesn't exist yet
    }
  }

  private async initializeSnapshots(): Promise<void> {
    try {
      const filePath = path.join(this.dataDir, 'snapshots.json');
      const data = await fs.readFile(filePath, 'utf-8');
      this.snapshots = JSON.parse(data);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_error) {
      // File doesn't exist yet
    }
  }
}

export default AdvancedAnalytics;