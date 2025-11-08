"use strict";
/**
 * Interview Preparation Panel for VS Code
 *
 * Provides real-time analytics, A/B testing, and performance metrics
 * for interview preparation using the MCP server.
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.InterviewPanel = void 0;
const vscode = __importStar(require("vscode"));
class InterviewPanel {
    panel;
    mcpClient;
    extensionUri;
    constructor(extensionUri, mcpClient) {
        this.extensionUri = extensionUri;
        this.mcpClient = mcpClient;
    }
    /**
     * Create or show the interview preparation panel
     */
    async show() {
        if (this.panel) {
            this.panel.reveal(vscode.ViewColumn.Beside);
            return;
        }
        // Create new panel
        this.panel = vscode.window.createWebviewPanel('interviewPrep', 'Interview Preparation', vscode.ViewColumn.Beside, {
            enableScripts: true,
            retainContextWhenHidden: true,
        });
        // Set initial HTML content
        this.panel.webview.html = this.getWebviewContent();
        // Handle panel disposal
        this.panel.onDidDispose(() => {
            this.panel = undefined;
        });
        // Handle messages from webview
        this.panel.webview.onDidReceiveMessage(async (message) => {
            switch (message.command) {
                case 'refreshMetrics':
                    await this.updateMetrics(message.period || 'daily');
                    break;
                case 'runABTest':
                    await this.runABTest(message.questionId, message.question);
                    break;
                case 'recordPerformance':
                    await this.recordPerformance(message.data);
                    break;
                case 'getRecommendations':
                    await this.getRecommendations(message.userId);
                    break;
            }
        });
        // Load initial metrics
        await this.updateMetrics('daily');
    }
    /**
     * Update performance metrics in the panel
     */
    async updateMetrics(period = 'daily') {
        if (!this.panel || !this.mcpClient) {
            return;
        }
        try {
            // Fetch analytics report from MCP server
            const response = await this.mcpClient.callTool({
                name: 'get_analytics_report',
                arguments: { period }
            });
            const reportText = response.content?.[0]?.text;
            const report = reportText ? JSON.parse(reportText) : {};
            // Send to webview
            this.panel.webview.postMessage({
                type: 'updateMetrics',
                data: report
            });
        }
        catch (error) {
            console.error('Failed to fetch analytics report:', error);
            vscode.window.showErrorMessage('Failed to load performance metrics');
        }
    }
    /**
     * Run A/B test
     */
    async runABTest(questionId, question) {
        if (!this.panel || !this.mcpClient) {
            return;
        }
        try {
            const response = await this.mcpClient.callTool({
                name: 'run_ab_test',
                arguments: {
                    questionId,
                    question,
                    context: {},
                    controlVariantId: 'control',
                    testVariantId: 'detailed'
                }
            });
            const sessionText = response.content?.[0]?.text;
            const session = sessionText ? JSON.parse(sessionText) : {};
            this.panel.webview.postMessage({
                type: 'abTestResult',
                data: session
            });
            vscode.window.showInformationMessage(`A/B Test Complete: ${session.results?.winner || 'Unknown'} variant won`);
        }
        catch (error) {
            console.error('Failed to run A/B test:', error);
            vscode.window.showErrorMessage('Failed to run A/B test');
        }
    }
    /**
     * Record performance snapshot
     */
    async recordPerformance(data) {
        if (!this.mcpClient) {
            return;
        }
        try {
            await this.mcpClient.callTool({
                name: 'record_performance',
                arguments: data
            });
            vscode.window.showInformationMessage('Performance recorded successfully');
            // Refresh metrics after recording
            await this.updateMetrics('daily');
        }
        catch (error) {
            console.error('Failed to record performance:', error);
            vscode.window.showErrorMessage('Failed to record performance');
        }
    }
    /**
     * Get personalized recommendations
     */
    async getRecommendations(userId = 'default') {
        if (!this.panel || !this.mcpClient) {
            return;
        }
        try {
            const response = await this.mcpClient.callTool({
                name: 'get_personalized_recommendations',
                arguments: {
                    userId,
                    period: 'weekly',
                    includeAnalytics: true
                }
            });
            const recommendationsText = response.content?.[0]?.text;
            const recommendations = recommendationsText ? JSON.parse(recommendationsText) : {};
            this.panel.webview.postMessage({
                type: 'updateRecommendations',
                data: recommendations
            });
        }
        catch (error) {
            console.error('Failed to fetch recommendations:', error);
        }
    }
    /**
     * Generate webview HTML content
     */
    getWebviewContent() {
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Interview Preparation</title>
    <style>
        body {
            font-family: var(--vscode-font-family);
            color: var(--vscode-foreground);
            background-color: var(--vscode-editor-background);
            padding: 20px;
            line-height: 1.6;
        }
        h1, h2, h3 {
            color: var(--vscode-foreground);
        }
        .metric-card {
            background: var(--vscode-editor-inactiveSelectionBackground);
            border: 1px solid var(--vscode-panel-border);
            border-radius: 8px;
            padding: 16px;
            margin: 12px 0;
        }
        .metric-title {
            font-weight: 600;
            margin-bottom: 8px;
            color: var(--vscode-textLink-foreground);
        }
        .metric-value {
            font-size: 28px;
            font-weight: bold;
            margin: 8px 0;
        }
        .metric-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 16px;
            margin: 20px 0;
        }
        button {
            background-color: var(--vscode-button-background);
            color: var(--vscode-button-foreground);
            border: none;
            padding: 10px 20px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            margin: 4px;
        }
        button:hover {
            background-color: var(--vscode-button-hoverBackground);
        }
        .recommendation {
            background: var(--vscode-textBlockQuote-background);
            border-left: 4px solid var(--vscode-textLink-foreground);
            padding: 12px;
            margin: 8px 0;
        }
        .milestone {
            background: var(--vscode-editor-selectionBackground);
            padding: 10px;
            margin: 6px 0;
            border-radius: 4px;
        }
        .period-selector {
            margin: 20px 0;
        }
        .loading {
            text-align: center;
            padding: 40px;
            color: var(--vscode-descriptionForeground);
        }
    </style>
</head>
<body>
    <h1>📊 Interview Preparation Dashboard</h1>
    
    <div class="period-selector">
        <button onclick="refreshMetrics('daily')">Daily</button>
        <button onclick="refreshMetrics('weekly')">Weekly</button>
        <button onclick="refreshMetrics('monthly')">Monthly</button>
        <button onclick="runABTest()">Run A/B Test</button>
    </div>

    <h2>Performance Metrics</h2>
    <div class="metric-grid" id="metrics-grid">
        <div class="loading">Loading metrics...</div>
    </div>

    <h2>📈 Recommendations</h2>
    <div id="recommendations-list">
        <div class="loading">Loading recommendations...</div>
    </div>

    <h2>🎯 Next Milestones</h2>
    <div id="milestones-list">
        <div class="loading">Loading milestones...</div>
    </div>

    <script>
        const vscode = acquireVsCodeApi();

        // Refresh metrics
        function refreshMetrics(period) {
            vscode.postMessage({
                command: 'refreshMetrics',
                period: period
            });
        }

        // Run A/B test
        function runABTest() {
            const questionId = 'test_' + Date.now();
            const question = 'Tell me about a time you solved a challenging technical problem';
            vscode.postMessage({
                command: 'runABTest',
                questionId: questionId,
                question: question
            });
        }

        // Record performance
        function recordPerformance() {
            vscode.postMessage({
                command: 'recordPerformance',
                data: {
                    accuracy: 0.85,
                    storyCoverage: 0.75,
                    satisfaction: 0.90,
                    responseTime: 120,
                    category: 'behavioral'
                }
            });
        }

        // Request recommendations
        function getRecommendations() {
            vscode.postMessage({
                command: 'getRecommendations',
                userId: 'default'
            });
        }

        // Handle messages from extension
        window.addEventListener('message', event => {
            const message = event.data;
            
            switch (message.type) {
                case 'updateMetrics':
                    updateMetricsDisplay(message.data);
                    break;
                case 'abTestResult':
                    displayABTestResult(message.data);
                    break;
                case 'updateRecommendations':
                    updateRecommendationsDisplay(message.data);
                    break;
            }
        });

        // Update metrics display
        function updateMetricsDisplay(data) {
            const grid = document.getElementById('metrics-grid');
            grid.innerHTML = '';

            if (!data.metrics) {
                grid.innerHTML = '<div class="loading">No metrics available</div>';
                return;
            }

            const metrics = [
                { title: 'Accuracy', value: (data.metrics.averageAccuracy * 100).toFixed(1) + '%' },
                { title: 'Story Coverage', value: (data.metrics.averageCoverage * 100).toFixed(1) + '%' },
                { title: 'Satisfaction', value: (data.metrics.averageSatisfaction * 100).toFixed(1) + '%' },
                { title: 'Total Snapshots', value: data.totalSnapshots || 0 }
            ];

            metrics.forEach(metric => {
                const card = document.createElement('div');
                card.className = 'metric-card';
                card.innerHTML = \`
                    <div class="metric-title">\${metric.title}</div>
                    <div class="metric-value">\${metric.value}</div>
                \`;
                grid.appendChild(card);
            });

            // Update recommendations
            if (data.recommendations) {
                updateRecommendationsDisplay({ recommendations: data.recommendations });
            }

            // Update milestones
            if (data.nextMilestones) {
                const milestonesList = document.getElementById('milestones-list');
                milestonesList.innerHTML = data.nextMilestones.map(m => 
                    \`<div class="milestone">🎯 \${m}</div>\`
                ).join('');
            }
        }

        // Display A/B test result
        function displayABTestResult(session) {
            const grid = document.getElementById('metrics-grid');
            const resultCard = document.createElement('div');
            resultCard.className = 'metric-card';
            resultCard.innerHTML = \`
                <div class="metric-title">A/B Test Result</div>
                <div>Winner: <strong>\${session.results?.winner || 'Unknown'}</strong></div>
                <div>Confidence: \${((session.results?.confidenceLevel || 0) * 100).toFixed(1)}%</div>
            \`;
            grid.prepend(resultCard);

            // Auto-remove after 5 seconds
            setTimeout(() => resultCard.remove(), 5000);
        }

        // Update recommendations display
        function updateRecommendationsDisplay(data) {
            const list = document.getElementById('recommendations-list');
            
            if (!data.recommendations || data.recommendations.length === 0) {
                list.innerHTML = '<div class="loading">No recommendations available</div>';
                return;
            }

            list.innerHTML = data.recommendations.map(rec => 
                \`<div class="recommendation">💡 \${rec}</div>\`
            ).join('');
        }

        // Initial load
        refreshMetrics('daily');
        getRecommendations();
    </script>
</body>
</html>`;
    }
}
exports.InterviewPanel = InterviewPanel;
//# sourceMappingURL=InterviewPanel.js.map