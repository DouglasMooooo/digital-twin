'use client';

import { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Users, 
  MessageSquare, 
  Clock, 
  TrendingUp, 
  Download,
  Search,
  RefreshCw,
  Trash2,
  Eye,
  Activity
} from 'lucide-react';

interface ChatLog {
  id: string;
  timestamp: string;
  userMessage: string;
  aiResponse: string;
  responseTime: number;
  interviewType: string;
  contextChunks: number;
  sessionId?: string;
  success: boolean;
  error?: string;
}

interface AnalyticsMetrics {
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

export default function AdminDashboard() {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [metrics, setMetrics] = useState<AnalyticsMetrics | null>(null);
  const [logs, setLogs] = useState<ChatLog[]>([]);
  const [timeRange, setTimeRange] = useState<'day' | 'week' | 'month' | 'all'>('all');
  const [searchKeyword, setSearchKeyword] = useState('');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [loading, setLoading] = useState(false);
  const [selectedLog, setSelectedLog] = useState<ChatLog | null>(null);

  const fetchMetrics = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/analytics?timeRange=${timeRange}`, {
        headers: {
          'Authorization': `Bearer ${password}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setMetrics(data.metrics);
      }
    } catch {
      // Handle fetch error silently
    }
    setLoading(false);
  };

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const url = searchKeyword 
        ? `/api/admin/logs?action=search&keyword=${encodeURIComponent(searchKeyword)}`
        : '/api/admin/logs?limit=50';
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${password}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setLogs(data.logs);
      }
    } catch {
      // Handle fetch error silently
    }
    setLoading(false);
  };

  const handleLogin = () => {
    if (password) {
      setIsAuthenticated(true);
      fetchMetrics();
      fetchLogs();
    }
  };

  const handleExport = async () => {
    try {
      const response = await fetch('/api/admin/analytics?action=export', {
        headers: {
          'Authorization': `Bearer ${password}`,
        },
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `chat-logs-${new Date().toISOString()}.json`;
        a.click();
      }
    } catch {
      // Handle export error silently
    }
  };

  const handleClearOldLogs = async () => {
    if (confirm('Are you sure you want to delete logs older than 30 days?')) {
      try {
        const response = await fetch('/api/admin/analytics?days=30', {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${password}`,
          },
        });
        
        if (response.ok) {
          const data = await response.json();
          alert(data.message);
          fetchLogs();
        }
      } catch {
        // Handle clear logs error silently
      }
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchMetrics();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeRange, isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <BarChart3 className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
            <p className="text-gray-600">Enter password to access analytics</p>
          </div>
          
          <div className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
              placeholder="Enter admin password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={handleLogin}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Login
            </button>
            <p className="text-sm text-gray-500 text-center">
              Default password: admin123 (change in .env)
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <BarChart3 className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-sm text-gray-600">Digital Twin Analytics</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Time Range Selector */}
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value as 'day' | 'week' | 'month' | 'all')}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="day">Last 24 Hours</option>
                <option value="week">Last Week</option>
                <option value="month">Last Month</option>
                <option value="all">All Time</option>
              </select>
              
              <button
                onClick={() => { fetchMetrics(); fetchLogs(); }}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
              
              <button
                onClick={handleExport}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Metrics Overview */}
        {metrics && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-blue-600" />
                    <h3 className="font-semibold text-gray-700">Visitors</h3>
                  </div>
                </div>
                <p className="text-3xl font-bold text-gray-900">{metrics.totalVisitors}</p>
                <p className="text-sm text-gray-500 mt-1">Unique sessions</p>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-green-600" />
                    <h3 className="font-semibold text-gray-700">Questions</h3>
                  </div>
                </div>
                <p className="text-3xl font-bold text-gray-900">{metrics.totalQuestions}</p>
                <p className="text-sm text-gray-500 mt-1">Total interactions</p>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-orange-600" />
                    <h3 className="font-semibold text-gray-700">Avg Response</h3>
                  </div>
                </div>
                <p className="text-3xl font-bold text-gray-900">
                  {(metrics.averageResponseTime / 1000).toFixed(2)}s
                </p>
                <p className="text-sm text-gray-500 mt-1">Response time</p>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-purple-600" />
                    <h3 className="font-semibold text-gray-700">Success Rate</h3>
                  </div>
                </div>
                <p className="text-3xl font-bold text-gray-900">{metrics.successRate.toFixed(1)}%</p>
                <p className="text-sm text-gray-500 mt-1">Successful responses</p>
              </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Interview Types Distribution */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-blue-600" />
                  Interview Types
                </h3>
                <div className="space-y-3">
                  {Object.entries(metrics.interviewTypeDistribution).map(([type, count]) => (
                    <div key={type} className="flex items-center justify-between">
                      <span className="text-gray-700 capitalize">{type}</span>
                      <div className="flex items-center gap-3">
                        <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-600 rounded-full"
                            style={{ width: `${(count / metrics.totalQuestions) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-semibold text-gray-900 w-12 text-right">
                          {count}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Response Time Distribution */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Response Time Distribution</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Fast (&lt;1s)</span>
                    <div className="flex items-center gap-3">
                      <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-green-600 rounded-full"
                          style={{ width: `${(metrics.responseTimeDistribution.fast / metrics.totalQuestions) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-semibold text-gray-900 w-12 text-right">
                        {metrics.responseTimeDistribution.fast}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Medium (1-3s)</span>
                    <div className="flex items-center gap-3">
                      <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-yellow-600 rounded-full"
                          style={{ width: `${(metrics.responseTimeDistribution.medium / metrics.totalQuestions) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-semibold text-gray-900 w-12 text-right">
                        {metrics.responseTimeDistribution.medium}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Slow (&gt;3s)</span>
                    <div className="flex items-center gap-3">
                      <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-red-600 rounded-full"
                          style={{ width: `${(metrics.responseTimeDistribution.slow / metrics.totalQuestions) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-semibold text-gray-900 w-12 text-right">
                        {metrics.responseTimeDistribution.slow}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Top Questions */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-8">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Top Questions</h3>
              <div className="space-y-2">
                {metrics.topQuestions.slice(0, 5).map((item, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg">
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold">
                      {index + 1}
                    </span>
                    <p className="flex-1 text-gray-700">{item.question}</p>
                    <span className="flex-shrink-0 px-3 py-1 bg-gray-100 rounded-full text-sm font-semibold text-gray-700">
                      {item.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Chat Logs */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">Recent Chat Logs</h3>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  placeholder="Search logs..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                onClick={fetchLogs}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Search
              </button>
              <button
                onClick={handleClearOldLogs}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                <Trash2 className="w-4 h-4" />
                Clear Old
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Time</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Question</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Type</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Response Time</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 max-w-xs truncate">
                      {log.userMessage}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                        {log.interviewType}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {(log.responseTime / 1000).toFixed(2)}s
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {log.success ? (
                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                          Success
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                          Error
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <button
                        onClick={() => setSelectedLog(log)}
                        className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                      >
                        <Eye className="w-4 h-4" />
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Log Detail Modal */}
      {selectedLog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">Log Details</h3>
                <button
                  onClick={() => setSelectedLog(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Timestamp</label>
                <p className="text-gray-900">{new Date(selectedLog.timestamp).toLocaleString()}</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Session ID</label>
                <p className="text-gray-900 font-mono text-sm">{selectedLog.sessionId || 'N/A'}</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">User Question</label>
                <p className="text-gray-900 bg-gray-50 p-4 rounded-lg">{selectedLog.userMessage}</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">AI Response</label>
                <p className="text-gray-900 bg-gray-50 p-4 rounded-lg whitespace-pre-wrap">{selectedLog.aiResponse}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Interview Type</label>
                  <p className="text-gray-900 capitalize">{selectedLog.interviewType}</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Response Time</label>
                  <p className="text-gray-900">{(selectedLog.responseTime / 1000).toFixed(2)}s</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Context Chunks</label>
                  <p className="text-gray-900">{selectedLog.contextChunks}</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Status</label>
                  <p className="text-gray-900">{selectedLog.success ? '✅ Success' : '❌ Error'}</p>
                </div>
              </div>
              {selectedLog.error && (
                <div>
                  <label className="block text-sm font-semibold text-red-700 mb-1">Error Message</label>
                  <p className="text-red-900 bg-red-50 p-4 rounded-lg">{selectedLog.error}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
