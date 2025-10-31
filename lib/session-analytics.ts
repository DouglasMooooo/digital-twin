/**
 * Session-based Analytics (Browser-side storage)
 * Works without backend persistence - perfect for demos
 */

export interface SessionAnalytics {
  questions: Array<{
    question: string;
    timestamp: number;
    responseTime: number;
  }>;
  startTime: number;
}

const STORAGE_KEY = 'digital_twin_analytics';

/**
 * Get analytics from browser session
 */
export function getSessionAnalytics(): SessionAnalytics {
  if (typeof window === 'undefined') {
    return { questions: [], startTime: Date.now() };
  }

  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Failed to parse session analytics:', e);
  }

  const newSession: SessionAnalytics = {
    questions: [],
    startTime: Date.now(),
  };
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(newSession));
  return newSession;
}

/**
 * Log a question in current session
 */
export function logSessionQuestion(question: string, responseTime: number) {
  if (typeof window === 'undefined') return;

  const analytics = getSessionAnalytics();
  analytics.questions.push({
    question,
    timestamp: Date.now(),
    responseTime,
  });

  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(analytics));
}

/**
 * Get session metrics
 */
export function getSessionMetrics() {
  const analytics = getSessionAnalytics();
  const totalQuestions = analytics.questions.length;

  if (totalQuestions === 0) {
    return {
      totalQuestions: 0,
      avgResponseTime: 0,
      sessionDuration: 0,
      questionsPerMinute: 0,
      topQuestions: [],
    };
  }

  const avgResponseTime =
    analytics.questions.reduce((sum, q) => sum + q.responseTime, 0) /
    totalQuestions;

  const sessionDuration = (Date.now() - analytics.startTime) / 1000 / 60; // minutes
  const questionsPerMinute = totalQuestions / Math.max(sessionDuration, 1);

  // Count question frequencies
  const questionCounts = new Map<string, number>();
  analytics.questions.forEach((q) => {
    const count = questionCounts.get(q.question) || 0;
    questionCounts.set(q.question, count + 1);
  });

  const topQuestions = Array.from(questionCounts.entries())
    .map(([question, count]) => ({ question, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return {
    totalQuestions,
    avgResponseTime: avgResponseTime / 1000, // convert to seconds
    sessionDuration,
    questionsPerMinute,
    topQuestions,
  };
}

/**
 * Clear session analytics
 */
export function clearSessionAnalytics() {
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem(STORAGE_KEY);
}
