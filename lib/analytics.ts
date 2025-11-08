// Analytics and logging utilities for admin dashboard

export interface ChatLog {
  id: string;
  timestamp: Date;
  userMessage: string;
  aiResponse: string;
  responseTime: number; // milliseconds
  interviewType: string;
  contextChunks: number;
  userAgent?: string;
  ipAddress?: string;
  sessionId?: string;
  success: boolean;
  error?: string;
}

export interface VisitorSession {
  sessionId: string;
  firstVisit: Date;
  lastVisit: Date;
  totalQuestions: number;
  averageResponseTime: number;
  userAgent?: string;
  ipAddress?: string;
  interviewTypes: string[];
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
    fast: number; // < 1s
    medium: number; // 1-3s
    slow: number; // > 3s
  };
}

// In-memory storage (replace with database in production)
// eslint-disable-next-line prefer-const
let chatLogs: ChatLog[] = [];
// eslint-disable-next-line prefer-const
let sessions: Map<string, VisitorSession> = new Map();

/**
 * Log a chat interaction
 */
export function logChatInteraction(log: Omit<ChatLog, 'id' | 'timestamp'>): void {
  const chatLog: ChatLog = {
    ...log,
    id: generateId(),
    timestamp: new Date(),
  };
  
  chatLogs.push(chatLog);
  
  console.log('📊 Chat logged:', {
    id: chatLog.id,
    userMessage: chatLog.userMessage.substring(0, 50),
    totalLogs: chatLogs.length
  });
  
  // Update session
  if (log.sessionId) {
    updateSession(log.sessionId, log);
  }
  
  // Keep only last 1000 logs in memory
  if (chatLogs.length > 1000) {
    chatLogs = chatLogs.slice(-1000);
  }
}

/**
 * Update visitor session
 */
function updateSession(sessionId: string, log: Omit<ChatLog, 'id' | 'timestamp'>): void {
  const existing = sessions.get(sessionId);
  
  if (existing) {
    existing.lastVisit = new Date();
    existing.totalQuestions += 1;
    existing.averageResponseTime = 
      (existing.averageResponseTime * (existing.totalQuestions - 1) + log.responseTime) / 
      existing.totalQuestions;
    
    if (!existing.interviewTypes.includes(log.interviewType)) {
      existing.interviewTypes.push(log.interviewType);
    }
  } else {
    sessions.set(sessionId, {
      sessionId,
      firstVisit: new Date(),
      lastVisit: new Date(),
      totalQuestions: 1,
      averageResponseTime: log.responseTime,
      userAgent: log.userAgent,
      ipAddress: log.ipAddress,
      interviewTypes: [log.interviewType],
    });
  }
}

/**
 * Get all chat logs
 */
export function getChatLogs(limit?: number): ChatLog[] {
  console.log('📊 Getting chat logs, total:', chatLogs.length);
  const sorted = [...chatLogs].sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
  
  return limit ? sorted.slice(0, limit) : sorted;
}

/**
 * Get logs for a specific session
 */
export function getSessionLogs(sessionId: string): ChatLog[] {
  return chatLogs
    .filter(log => log.sessionId === sessionId)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

/**
 * Get all visitor sessions
 */
export function getVisitorSessions(): VisitorSession[] {
  return Array.from(sessions.values())
    .sort((a, b) => new Date(b.lastVisit).getTime() - new Date(a.lastVisit).getTime());
}

/**
 * Get analytics metrics
 */
export function getAnalyticsMetrics(timeRange: 'day' | 'week' | 'month' | 'all' = 'all'): AnalyticsMetrics {
  console.log('📊 Getting analytics metrics, total logs:', chatLogs.length);
  
  const now = new Date();
  const filteredLogs = chatLogs.filter(log => {
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

  // Calculate metrics
  const totalQuestions = filteredLogs.length;
  const successfulLogs = filteredLogs.filter(log => log.success);
  const successRate = totalQuestions > 0 ? (successfulLogs.length / totalQuestions) * 100 : 0;
  
  const totalResponseTime = filteredLogs.reduce((sum, log) => sum + log.responseTime, 0);
  const averageResponseTime = totalQuestions > 0 ? totalResponseTime / totalQuestions : 0;

  // Top questions
  const questionCounts = new Map<string, number>();
  filteredLogs.forEach(log => {
    const count = questionCounts.get(log.userMessage) || 0;
    questionCounts.set(log.userMessage, count + 1);
  });
  
  const topQuestions = Array.from(questionCounts.entries())
    .map(([question, count]) => ({ question, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  // Interview type distribution
  const interviewTypeDistribution: Record<string, number> = {};
  filteredLogs.forEach(log => {
    interviewTypeDistribution[log.interviewType] = 
      (interviewTypeDistribution[log.interviewType] || 0) + 1;
  });

  // Hourly activity
  const hourlyActivity: Array<{ hour: number; count: number }> = Array.from({ length: 24 }, (_, hour) => ({
    hour,
    count: 0,
  }));
  
  filteredLogs.forEach(log => {
    const hour = new Date(log.timestamp).getHours();
    hourlyActivity[hour].count += 1;
  });

  // Response time distribution
  const responseTimeDistribution = {
    fast: filteredLogs.filter(log => log.responseTime < 1000).length,
    medium: filteredLogs.filter(log => log.responseTime >= 1000 && log.responseTime < 3000).length,
    slow: filteredLogs.filter(log => log.responseTime >= 3000).length,
  };

  // Unique visitors
  const uniqueSessions = new Set(filteredLogs.map(log => log.sessionId).filter(Boolean));

  return {
    totalVisitors: uniqueSessions.size,
    totalQuestions,
    averageResponseTime,
    successRate,
    topQuestions,
    interviewTypeDistribution,
    hourlyActivity,
    responseTimeDistribution,
  };
}

/**
 * Search logs by keyword
 */
export function searchLogs(keyword: string): ChatLog[] {
  const lowerKeyword = keyword.toLowerCase();
  return chatLogs.filter(log => 
    log.userMessage.toLowerCase().includes(lowerKeyword) ||
    log.aiResponse.toLowerCase().includes(lowerKeyword)
  );
}

/**
 * Clear old logs (older than specified days)
 */
export function clearOldLogs(daysToKeep: number = 30): number {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);
  
  const beforeCount = chatLogs.length;
  chatLogs = chatLogs.filter(log => new Date(log.timestamp) > cutoffDate);
  
  return beforeCount - chatLogs.length;
}

/**
 * Generate unique ID
 */
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Export logs as JSON
 */
export function exportLogs(): string {
  return JSON.stringify({
    logs: chatLogs,
    sessions: Array.from(sessions.values()),
    exportedAt: new Date().toISOString(),
  }, null, 2);
}
