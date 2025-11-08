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
   * Clear all data
   */
  public clearAll(): void {
    this.clearEvents();
    this.clearSnapshots();
  }

  /**
   * Get event count
   */
  public getEventCount(): number {
    return this.events.length;
  }

  /**
   * Get snapshot count
   */
  public getSnapshotCount(): number {
    return this.snapshots.length;
  }

  /**
   * Set up event listener
   */
  public onEvent(callback: (event: AnalyticsEvent) => void): void {
    this.eventEmitter.on('event', callback);
  }

  /**
   * Remove event listener
   */
  public offEvent(callback: (event: AnalyticsEvent) => void): void {
    this.eventEmitter.off('event', callback);
  }

  /**
   * Initialize snapshots from file
   */
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
