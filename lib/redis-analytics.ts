/**
 * Redis-based Analytics using Upstash
 * Persistent storage for production analytics
 */

import { Redis } from '@upstash/redis';

// Initialize Redis client
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// Export redis client for other modules
export { redis };

export interface ChatLog {
  id: string;
  timestamp: string;
  userMessage: string;
  aiResponse: string;
  responseTime: number;
  interviewType: string;
  contextChunks: number;
  userAgent?: string;
  ipAddress?: string;
  sessionId?: string;
  success: boolean;
  error?: string;
}

export interface AnalyticsMetrics {
  totalVisitors: number;
  totalQuestions: number;
  averageResponseTime: number;
  successRate: number;
  topQuestions: Array<{ question: string; count: number }>;
  interviewTypeDistribution: Record<string, number>;
  hourlyActivity: Array<{ hour: number; count: number }>;
  responseTimeDistribution: {
    fast: number;
    medium: number;
    slow: number;
  };
}

const CHAT_LOGS_KEY = 'digital_twin:chat_logs';
const SESSIONS_KEY = 'digital_twin:sessions';
const MAX_LOGS = 1000;

/**
 * Log a chat interaction to Redis
 */
export async function logChatInteraction(
  log: Omit<ChatLog, 'id' | 'timestamp'>
): Promise<void> {
  try {
    const chatLog: ChatLog = {
      ...log,
      id: generateId(),
      timestamp: new Date().toISOString(),
    };

    console.log('📊 Logging to Redis:', {
      id: chatLog.id,
      message: chatLog.userMessage.substring(0, 50),
    });

    // Add to Redis list (newest first)
    await redis.lpush(CHAT_LOGS_KEY, JSON.stringify(chatLog));

    // Trim to keep only last MAX_LOGS entries
    await redis.ltrim(CHAT_LOGS_KEY, 0, MAX_LOGS - 1);

    // Update session info if sessionId provided
    if (log.sessionId) {
      await updateSession(log.sessionId, log);
    }

    console.log('✅ Successfully logged to Redis');
  } catch (error) {
    console.error('❌ Failed to log to Redis:', error);
    // Don't throw - analytics failure shouldn't break chat
  }
}

/**
 * Update session information
 */
async function updateSession(
  sessionId: string,
  log: Omit<ChatLog, 'id' | 'timestamp'>
): Promise<void> {
  try {
    const sessionKey = `${SESSIONS_KEY}:${sessionId}`;
    const existing = await redis.get(sessionKey);

    let session: any;
    if (existing) {
      session = typeof existing === 'string' ? JSON.parse(existing) : existing;
      session.lastVisit = new Date().toISOString();
      session.totalQuestions += 1;
      session.averageResponseTime =
        (session.averageResponseTime * (session.totalQuestions - 1) +
          log.responseTime) /
        session.totalQuestions;

      if (!session.interviewTypes.includes(log.interviewType)) {
        session.interviewTypes.push(log.interviewType);
      }
    } else {
      session = {
        sessionId,
        firstVisit: new Date().toISOString(),
        lastVisit: new Date().toISOString(),
        totalQuestions: 1,
        averageResponseTime: log.responseTime,
        userAgent: log.userAgent,
        ipAddress: log.ipAddress,
        interviewTypes: [log.interviewType],
      };
    }

    // Store session with 30 day expiry
    await redis.set(sessionKey, JSON.stringify(session), { ex: 30 * 24 * 60 * 60 });
  } catch (error) {
    console.error('Failed to update session:', error);
  }
}

/**
 * Get all chat logs from Redis
 */
export async function getChatLogs(limit?: number): Promise<ChatLog[]> {
  try {
    console.log('📊 Fetching logs from Redis, limit:', limit || 'all');

    const count = limit || MAX_LOGS;
    const logs = await redis.lrange(CHAT_LOGS_KEY, 0, count - 1);

    console.log('📊 Retrieved logs:', logs.length);

    return logs.map((log) => {
      if (typeof log === 'string') {
        return JSON.parse(log);
      }
      return log as ChatLog;
    });
  } catch (error) {
    console.error('❌ Failed to get logs from Redis:', error);
    return [];
  }
}

/**
 * Get analytics metrics from Redis
 */
export async function getAnalyticsMetrics(
  timeRange: 'day' | 'week' | 'month' | 'all' = 'all'
): Promise<AnalyticsMetrics> {
  try {
    console.log('📊 Getting analytics metrics from Redis, range:', timeRange);

    const allLogs = await getChatLogs(MAX_LOGS);
    const now = new Date();

    // Filter by time range
    const filteredLogs = allLogs.filter((log) => {
      const logDate = new Date(log.timestamp);

      switch (timeRange) {
        case 'day':
          return now.getTime() - logDate.getTime() < 24 * 60 * 60 * 1000;
        case 'week':
          return now.getTime() - logDate.getTime() < 7 * 24 * 60 * 60 * 1000;
        case 'month':
          return now.getTime() - logDate.getTime() < 30 * 24 * 60 * 60 * 1000;
        default:
          return true;
      }
    });

    console.log('📊 Filtered logs:', filteredLogs.length);

    // Calculate metrics
    const totalQuestions = filteredLogs.length;
    const successfulLogs = filteredLogs.filter((log) => log.success);
    const successRate =
      totalQuestions > 0 ? (successfulLogs.length / totalQuestions) * 100 : 0;

    const totalResponseTime = filteredLogs.reduce(
      (sum, log) => sum + log.responseTime,
      0
    );
    const averageResponseTime =
      totalQuestions > 0 ? totalResponseTime / totalQuestions : 0;

    // Top questions
    const questionCounts = new Map<string, number>();
    filteredLogs.forEach((log) => {
      const count = questionCounts.get(log.userMessage) || 0;
      questionCounts.set(log.userMessage, count + 1);
    });

    const topQuestions = Array.from(questionCounts.entries())
      .map(([question, count]) => ({ question, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Interview type distribution
    const interviewTypeDistribution: Record<string, number> = {};
    filteredLogs.forEach((log) => {
      interviewTypeDistribution[log.interviewType] =
        (interviewTypeDistribution[log.interviewType] || 0) + 1;
    });

    // Hourly activity
    const hourlyActivity: Array<{ hour: number; count: number }> = Array.from(
      { length: 24 },
      (_, hour) => ({
        hour,
        count: 0,
      })
    );

    filteredLogs.forEach((log) => {
      const hour = new Date(log.timestamp).getHours();
      hourlyActivity[hour].count += 1;
    });

    // Response time distribution
    const responseTimeDistribution = {
      fast: filteredLogs.filter((log) => log.responseTime < 1000).length,
      medium: filteredLogs.filter(
        (log) => log.responseTime >= 1000 && log.responseTime < 3000
      ).length,
      slow: filteredLogs.filter((log) => log.responseTime >= 3000).length,
    };

    // Unique visitors (unique sessionIds)
    const uniqueSessions = new Set(
      filteredLogs.map((log) => log.sessionId).filter(Boolean)
    );

    const metrics = {
      totalVisitors: uniqueSessions.size,
      totalQuestions,
      averageResponseTime,
      successRate,
      topQuestions,
      interviewTypeDistribution,
      hourlyActivity,
      responseTimeDistribution,
    };

    console.log('📊 Calculated metrics:', {
      totalQuestions: metrics.totalQuestions,
      totalVisitors: metrics.totalVisitors,
    });

    return metrics;
  } catch (error) {
    console.error('❌ Failed to get analytics from Redis:', error);
    // Return empty metrics on error
    return {
      totalVisitors: 0,
      totalQuestions: 0,
      averageResponseTime: 0,
      successRate: 0,
      topQuestions: [],
      interviewTypeDistribution: {},
      hourlyActivity: Array.from({ length: 24 }, (_, hour) => ({ hour, count: 0 })),
      responseTimeDistribution: { fast: 0, medium: 0, slow: 0 },
    };
  }
}

/**
 * Clear old logs (older than specified days)
 */
export async function clearOldLogs(daysToKeep: number = 30): Promise<number> {
  try {
    const allLogs = await getChatLogs(MAX_LOGS);
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

    const beforeCount = allLogs.length;
    const logsToKeep = allLogs.filter(
      (log) => new Date(log.timestamp) > cutoffDate
    );

    // Clear and rebuild the list
    await redis.del(CHAT_LOGS_KEY);
    if (logsToKeep.length > 0) {
      await redis.lpush(
        CHAT_LOGS_KEY,
        ...logsToKeep.map((log) => JSON.stringify(log))
      );
    }

    return beforeCount - logsToKeep.length;
  } catch (error) {
    console.error('Failed to clear old logs:', error);
    return 0;
  }
}

/**
 * Export logs as JSON
 */
export async function exportLogs(): Promise<string> {
  try {
    const logs = await getChatLogs(MAX_LOGS);
    return JSON.stringify(
      {
        logs,
        exportedAt: new Date().toISOString(),
      },
      null,
      2
    );
  } catch (error) {
    console.error('Failed to export logs:', error);
    return JSON.stringify({ logs: [], exportedAt: new Date().toISOString() });
  }
}

/**
 * Generate unique ID
 */
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
