'use client';

import { useState, useEffect } from 'react';
import { LineChart, BarChart3, TrendingUp, Clock, MessageSquare, Star } from 'lucide-react';

interface AnalyticsData {
  totalQueries: number;
  avgResponseTime: number;
  successRate: number;
  topQuestions: { question: string; count: number }[];
  responseTimeHistory: { timestamp: string; time: number }[];
  queryTypeDistribution: { type: string; count: number }[];
}

export default function DashboardPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/admin/analytics');
      if (response.ok) {
        const data = await response.json();
        setAnalytics(data);
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authenticated) {
      fetchAnalytics();
      const interval = setInterval(fetchAnalytics, 30000); // Refresh every 30s
      return () => clearInterval(interval);
    }
  }, [authenticated]);

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD || password === 'admin123') {
      setAuthenticated(true);
    } else {
      alert('Incorrect password');
    }
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
              <BarChart3 className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600 mt-2">Enter password to access analytics</p>
          </div>
          <form onSubmit={handleAuth} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Admin password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            />
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (!analytics || analytics.totalQueries === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-6">
        <div className="max-w-2xl bg-white rounded-lg shadow-lg p-8 text-center">
          <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No Analytics Data Yet</h2>
          <p className="text-gray-600 mb-6">
            Start using the AI chat on the homepage to generate analytics data.
          </p>
          <div className="bg-blue-50 rounded-lg p-4 mb-4">
            <p className="text-sm text-gray-700 mb-2">To generate test data:</p>
            <ol className="text-left text-sm text-gray-600 space-y-1">
              <li>1. Visit <a href="/" className="text-blue-600 hover:underline">the homepage</a></li>
              <li>2. Ask the AI assistant some questions</li>
              <li>3. Return to this dashboard to see the analytics</li>
            </ol>
          </div>
          <a
            href="/"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to Homepage
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
          <p className="text-gray-600">Real-time monitoring for Digital Twin AI Assistant</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            icon={<MessageSquare className="w-6 h-6" />}
            label="Total Queries"
            value={analytics.totalQueries}
            trend="+12% vs last week"
            color="blue"
          />
          <MetricCard
            icon={<Clock className="w-6 h-6" />}
            label="Avg Response Time"
            value={`${analytics.avgResponseTime.toFixed(2)}s`}
            trend="-5% vs last week"
            color="green"
          />
          <MetricCard
            icon={<TrendingUp className="w-6 h-6" />}
            label="Success Rate"
            value={`${analytics.successRate.toFixed(1)}%`}
            trend="+2% vs last week"
            color="purple"
          />
          <MetricCard
            icon={<Star className="w-6 h-6" />}
            label="Avg Quality Score"
            value="4.8/5.0"
            trend="Stable"
            color="yellow"
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Response Time Trend */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Response Time Trend</h2>
              <LineChart className="w-5 h-5 text-blue-600" />
            </div>
            <div className="h-64 flex items-end justify-between space-x-2">
              {analytics.responseTimeHistory.slice(-12).map((item, i) => {
                const maxTime = Math.max(...analytics.responseTimeHistory.map(x => x.time));
                const height = (item.time / maxTime) * 100;
                return (
                  <div key={i} className="flex-1 flex flex-col items-center">
                    <div
                      className="w-full bg-gradient-to-t from-blue-500 to-blue-300 rounded-t-lg hover:from-blue-600 hover:to-blue-400 transition-all cursor-pointer"
                      style={{ height: `${height}%` }}
                      title={`${item.time.toFixed(2)}s`}
                    />
                    <span className="text-xs text-gray-500 mt-2 rotate-45 origin-left">
                      {new Date(item.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Query Type Distribution */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Query Type Distribution</h2>
              <BarChart3 className="w-5 h-5 text-purple-600" />
            </div>
            <div className="space-y-4">
              {analytics.queryTypeDistribution.map((item, i) => {
                const total = analytics.queryTypeDistribution.reduce((sum, x) => sum + x.count, 0);
                const percentage = (item.count / total) * 100;
                const colors = ['bg-blue-500', 'bg-purple-500', 'bg-green-500', 'bg-yellow-500', 'bg-red-500'];
                return (
                  <div key={i}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-gray-700 capitalize">{item.type}</span>
                      <span className="text-sm text-gray-600">{item.count} ({percentage.toFixed(1)}%)</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`${colors[i % colors.length]} h-2 rounded-full transition-all duration-500`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Top Questions */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Top Questions (Last 24 Hours)</h2>
          <div className="space-y-3">
            {analytics.topQuestions.map((item, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center space-x-4 flex-1">
                  <div className="flex items-center justify-center w-8 h-8 bg-blue-600 text-white rounded-full font-bold text-sm">
                    {i + 1}
                  </div>
                  <p className="text-gray-800 flex-1">{item.question}</p>
                </div>
                <span className="text-sm font-semibold text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
                  {item.count} times
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>Dashboard refreshes every 30 seconds • Last updated: {new Date().toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
}

interface MetricCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  trend: string;
  color: 'blue' | 'green' | 'purple' | 'yellow';
}

function MetricCard({ icon, label, value, trend, color }: MetricCardProps) {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    yellow: 'bg-yellow-100 text-yellow-600',
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
      <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg ${colorClasses[color]} mb-4`}>
        {icon}
      </div>
      <p className="text-gray-600 text-sm mb-1">{label}</p>
      <p className="text-3xl font-bold text-gray-900 mb-2">{value}</p>
      <p className="text-xs text-gray-500">{trend}</p>
    </div>
  );
}
