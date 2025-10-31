/**
 * Quality Improvement System
 * 
 * Analyzes user feedback and response accuracy scores to identify gaps
 * in digitaltwin.json and generate specific improvement suggestions.
 * 
 * Features:
 * - Analyze low-scoring feedback (<3 stars)
 * - Identify missing topics and keywords
 * - Generate actionable improvement recommendations
 * - Export analysis reports in JSON/Markdown
 * - Optional: Auto-suggest digitaltwin.json updates
 */

import { redis } from './redis-analytics';
import { evaluateResponseAccuracy, type AccuracyScore } from './accuracy-scoring';
import fs from 'fs/promises';
import path from 'path';

// Type definitions
interface FeedbackEntry {
  questionId: string;
  question: string;
  answer: string;
  rating: number;
  comment?: string;
  category?: string;
  timestamp: string;
  sessionId?: string;
  helpful: boolean;
}

interface DataGap {
  topic: string;
  frequency: number; // How many times this topic appeared in low-scoring queries
  avgScore: number; // Average rating for queries about this topic
  avgAccuracy: number; // Average accuracy score (0-100)
  missingKeywords: string[]; // Keywords in queries but not in responses
  sampleQuestions: string[]; // Example questions that scored low
  suggestions: string[]; // Specific actionable recommendations
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
}

interface ImprovementReport {
  analysisDate: string;
  totalFeedbackAnalyzed: number;
  lowScoringQueries: number;
  averageRating: number;
  averageAccuracy: number;
  identifiedGaps: DataGap[];
  priorityRecommendations: string[];
  digitalTwinUpdateSuggestions: DigitalTwinUpdate[];
}

interface DigitalTwinUpdate {
  section: 'experience' | 'skills' | 'projects' | 'interview_prep' | 'personal';
  updateType: 'add' | 'expand' | 'modify';
  description: string;
  suggestedContent: Record<string, unknown>;
  reasoning: string;
}

interface TopicCluster {
  keywords: string[];
  questions: string[];
  ratings: number[];
  accuracyScores: number[];
}

/**
 * Load all feedback from Redis
 */
async function loadFeedback(): Promise<FeedbackEntry[]> {
  try {
    const feedbackData = await redis.lrange('digital_twin:feedback', 0, -1);
    return feedbackData.map(item => JSON.parse(item) as FeedbackEntry);
  } catch (error) {
    console.error('Error loading feedback:', error);
    return [];
  }
}

/**
 * Analyze feedback to identify patterns in low-scoring queries
 */
export async function analyzeFeedback(minRating: number = 3): Promise<ImprovementReport> {
  const allFeedback = await loadFeedback();
  const lowScoringFeedback = allFeedback.filter(f => f.rating < minRating);
  
  // Calculate overall statistics
  const totalFeedback = allFeedback.length;
  const averageRating = allFeedback.reduce((sum, f) => sum + f.rating, 0) / totalFeedback || 0;
  
  // Evaluate accuracy for low-scoring queries
  const accuracyScores: AccuracyScore[] = [];
  for (const feedback of lowScoringFeedback) {
    const validCategories = ['technical', 'leadership', 'problem-solving', 'career', 'industry', 'culture'] as const;
    const category = feedback.category && validCategories.includes(feedback.category as typeof validCategories[number])
      ? (feedback.category as typeof validCategories[number])
      : undefined;
    
    const score = evaluateResponseAccuracy(
      feedback.question,
      feedback.answer,
      {
        expectedKeywords: extractKeywords(feedback.question),
        requireSTAR: isSTARQuestion(feedback.question),
        category,
        minLength: 100
      }
    );
    accuracyScores.push(score);
  }
  
  const averageAccuracy = accuracyScores.reduce((sum, s) => sum + s.overall, 0) / accuracyScores.length || 0;
  
  // Identify data gaps by clustering topics
  const dataGaps = await identifyDataGaps(lowScoringFeedback, accuracyScores);
  
  // Generate priority recommendations
  const priorityRecommendations = generatePriorityRecommendations(dataGaps);
  
  // Generate digital twin update suggestions
  const updateSuggestions = generateDigitalTwinUpdates(dataGaps);
  
  return {
    analysisDate: new Date().toISOString(),
    totalFeedbackAnalyzed: totalFeedback,
    lowScoringQueries: lowScoringFeedback.length,
    averageRating,
    averageAccuracy,
    identifiedGaps: dataGaps,
    priorityRecommendations,
    digitalTwinUpdateSuggestions: updateSuggestions
  };
}

/**
 * Identify data gaps by analyzing low-scoring queries
 */
async function identifyDataGaps(
  lowScoringFeedback: FeedbackEntry[],
  accuracyScores: AccuracyScore[]
): Promise<DataGap[]> {
  // Cluster queries by topic/keywords
  const topicClusters = clusterByTopic(lowScoringFeedback);
  
  const dataGaps: DataGap[] = [];
  
  for (const [topic, cluster] of Object.entries(topicClusters)) {
    const avgScore = cluster.ratings.reduce((a, b) => a + b, 0) / cluster.ratings.length;
    const avgAccuracy = cluster.accuracyScores.reduce((a, b) => a + b, 0) / cluster.accuracyScores.length;
    
    // Identify missing keywords (keywords in questions but likely missing from responses)
    const missingKeywords = identifyMissingKeywords(cluster.questions);
    
    // Generate specific suggestions for this topic
    const suggestions = generateTopicSuggestions(topic, cluster, missingKeywords);
    
    // Determine priority based on frequency and impact
    const priority = determinePriority(cluster.questions.length, avgScore, avgAccuracy);
    
    dataGaps.push({
      topic,
      frequency: cluster.questions.length,
      avgScore,
      avgAccuracy,
      missingKeywords,
      sampleQuestions: cluster.questions.slice(0, 3), // First 3 examples
      suggestions,
      priority
    });
  }
  
  // Sort by priority (HIGH > MEDIUM > LOW) and frequency
  return dataGaps.sort((a, b) => {
    const priorityOrder = { HIGH: 3, MEDIUM: 2, LOW: 1 };
    if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    }
    return b.frequency - a.frequency;
  });
}

/**
 * Cluster feedback by topic based on keywords
 */
function clusterByTopic(feedback: FeedbackEntry[]): Record<string, TopicCluster> {
  const clusters: Record<string, TopicCluster> = {};
  
  // Define topic keywords for clustering
  const topicDefinitions: Record<string, string[]> = {
    'Python & FastAPI': ['python', 'fastapi', 'flask', 'django', 'api', 'rest', 'async'],
    'Machine Learning': ['machine learning', 'ml', 'model', 'training', 'neural', 'deep learning', 'tensorflow', 'pytorch'],
    'Data Visualization': ['visualization', 'chart', 'dashboard', 'plotly', 'matplotlib', 'tableau', 'd3'],
    'SQL & Databases': ['sql', 'database', 'query', 'postgresql', 'mysql', 'nosql', 'mongodb'],
    'Leadership & Management': ['lead', 'manage', 'team', 'mentor', 'supervise', 'coordinate'],
    'Financial Analysis': ['financial', 'accounting', 'budget', 'forecast', 'revenue', 'cost'],
    'Cloud & DevOps': ['aws', 'azure', 'gcp', 'cloud', 'docker', 'kubernetes', 'ci/cd', 'deployment'],
    'AI/RAG Systems': ['rag', 'retrieval', 'embedding', 'vector', 'llm', 'gpt', 'ai assistant'],
    'Project Experience': ['project', 'built', 'developed', 'implemented', 'created'],
    'Soft Skills': ['communication', 'collaboration', 'problem solving', 'conflict', 'work style']
  };
  
  for (const entry of feedback) {
    const questionLower = entry.question.toLowerCase();
    let matched = false;
    
    // Try to match to a topic
    for (const [topic, keywords] of Object.entries(topicDefinitions)) {
      if (keywords.some(kw => questionLower.includes(kw))) {
        if (!clusters[topic]) {
          clusters[topic] = { keywords: [], questions: [], ratings: [], accuracyScores: [] };
        }
        clusters[topic].questions.push(entry.question);
        clusters[topic].ratings.push(entry.rating);
        clusters[topic].accuracyScores.push(0); // Will be filled by caller
        matched = true;
        break;
      }
    }
    
    // If no match, create "Other" category
    if (!matched) {
      const topic = 'Other/General';
      if (!clusters[topic]) {
        clusters[topic] = { keywords: [], questions: [], ratings: [], accuracyScores: [] };
      }
      clusters[topic].questions.push(entry.question);
      clusters[topic].ratings.push(entry.rating);
      clusters[topic].accuracyScores.push(0);
    }
  }
  
  return clusters;
}

/**
 * Extract keywords from a question
 */
function extractKeywords(question: string): string[] {
  const commonWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from', 'what', 'how', 'why', 'when', 'where', 'who', 'tell', 'me', 'about', 'your', 'you', 'have', 'do', 'did', 'can', 'could', 'would', 'should']);
  
  const words = question.toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 3 && !commonWords.has(word));
  
  return [...new Set(words)];
}

/**
 * Determine if a question requires STAR method
 */
function isSTARQuestion(question: string): boolean {
  const starIndicators = [
    'tell me about a time',
    'give an example',
    'describe a situation',
    'how did you handle',
    'what did you do when',
    'experience with',
    'worked on'
  ];
  
  const questionLower = question.toLowerCase();
  return starIndicators.some(indicator => questionLower.includes(indicator));
}

/**
 * Identify keywords that are missing from responses
 */
function identifyMissingKeywords(questions: string[]): string[] {
  const allKeywords = questions.flatMap(q => extractKeywords(q));
  const keywordFrequency: Record<string, number> = {};
  
  allKeywords.forEach(kw => {
    keywordFrequency[kw] = (keywordFrequency[kw] || 0) + 1;
  });
  
  // Return keywords that appear in multiple questions (likely important)
  return Object.entries(keywordFrequency)
    .filter(([, freq]) => freq >= 2)
    .map(([kw]) => kw)
    .slice(0, 10); // Top 10 missing keywords
}

/**
 * Generate specific suggestions for a topic
 */
function generateTopicSuggestions(
  topic: string,
  cluster: TopicCluster,
  missingKeywords: string[]
): string[] {
  const suggestions: string[] = [];
  
  // Topic-specific suggestions
  const topicSuggestionMap: Record<string, string[]> = {
    'Python & FastAPI': [
      'Add FastAPI project to projects array with async endpoints and Pydantic models',
      'Include STAR story about building REST API with performance optimization',
      'Expand Python skills to include FastAPI, Uvicorn, async/await patterns'
    ],
    'Machine Learning': [
      'Add machine learning project with model training metrics (accuracy, F1 score)',
      'Include specific ML frameworks used (scikit-learn, TensorFlow, PyTorch)',
      'Add STAR achievement about model deployment or improvement'
    ],
    'Data Visualization': [
      'Add data visualization project using Plotly/Matplotlib/Tableau',
      'Include specific dashboard examples with business impact metrics',
      'Expand visualization skills with modern libraries (Plotly, D3.js, Streamlit)'
    ],
    'SQL & Databases': [
      'Add SQL optimization achievements (query performance improvements)',
      'Include specific database technologies (PostgreSQL, MySQL, MongoDB)',
      'Add STAR story about complex query or database migration'
    ],
    'Leadership & Management': [
      'Add quantitative metrics to leadership STAR stories (team size: 5 people)',
      'Include budget management examples ($X managed)',
      'Add timeline achievements (delivered 2 weeks early, coordinated 10+ stakeholders)'
    ],
    'Financial Analysis': [
      'Expand financial modeling achievements with specific methodologies',
      'Include budget/revenue impact with numbers ($X saved, Y% increase)',
      'Add more accounting technical skills (GAAP, financial reporting)'
    ],
    'Cloud & DevOps': [
      'Add cloud deployment projects (AWS Lambda, Azure Functions)',
      'Include CI/CD pipeline achievements with deployment frequency metrics',
      'Expand cloud skills (AWS, Docker, Kubernetes, Terraform)'
    ],
    'AI/RAG Systems': [
      'Add detailed RAG system project with architecture explanation',
      'Include embedding model details (text-embedding-ada-002, performance metrics)',
      'Expand AI/ML skills with vector databases (Pinecone, Qdrant, ChromaDB)'
    ],
    'Project Experience': [
      'Add more recent projects with technical depth and business impact',
      'Include GitHub links or live demos where applicable',
      'Add quantitative results for each project (users, performance, ROI)'
    ],
    'Soft Skills': [
      'Add more behavioral STAR stories for communication and collaboration',
      'Include cross-functional project examples',
      'Add conflict resolution or stakeholder management stories'
    ]
  };
  
  // Get predefined suggestions for this topic
  if (topicSuggestionMap[topic]) {
    suggestions.push(...topicSuggestionMap[topic]);
  }
  
  // Add keyword-based suggestions
  if (missingKeywords.length > 0) {
    suggestions.push(
      `Include these missing keywords in relevant sections: ${missingKeywords.slice(0, 5).join(', ')}`
    );
  }
  
  // Generic suggestion if nothing specific
  if (suggestions.length === 0) {
    suggestions.push(
      `Review questions about "${topic}" and ensure digitaltwin.json has comprehensive coverage`,
      `Add specific examples and STAR stories related to ${topic}`
    );
  }
  
  return suggestions;
}

/**
 * Determine priority level based on frequency and impact
 */
function determinePriority(
  frequency: number,
  avgScore: number,
  avgAccuracy: number
): 'HIGH' | 'MEDIUM' | 'LOW' {
  // High priority: Many queries (≥5) with very low scores (<2.5) or accuracy (<60%)
  if (frequency >= 5 && (avgScore < 2.5 || avgAccuracy < 60)) {
    return 'HIGH';
  }
  
  // Medium priority: Multiple queries (≥3) with moderate issues
  if (frequency >= 3 && (avgScore < 3.5 || avgAccuracy < 75)) {
    return 'MEDIUM';
  }
  
  // Low priority: Everything else
  return 'LOW';
}

/**
 * Generate overall priority recommendations
 */
function generatePriorityRecommendations(dataGaps: DataGap[]): string[] {
  const recommendations: string[] = [];
  
  // Group by priority
  const highPriority = dataGaps.filter(g => g.priority === 'HIGH');
  const mediumPriority = dataGaps.filter(g => g.priority === 'MEDIUM');
  
  if (highPriority.length > 0) {
    recommendations.push(
      `🔴 HIGH PRIORITY (${highPriority.length} gaps): Focus on ${highPriority.map(g => g.topic).join(', ')}`
    );
    highPriority.forEach(gap => {
      recommendations.push(`  - ${gap.topic}: ${gap.suggestions[0]}`);
    });
  }
  
  if (mediumPriority.length > 0) {
    recommendations.push(
      `🟡 MEDIUM PRIORITY (${mediumPriority.length} gaps): Address ${mediumPriority.map(g => g.topic).join(', ')}`
    );
  }
  
  // Overall recommendations
  if (dataGaps.length > 0) {
    const avgGapScore = dataGaps.reduce((sum, g) => sum + g.avgAccuracy, 0) / dataGaps.length;
    if (avgGapScore < 70) {
      recommendations.push('⚠️ URGENT: Multiple critical gaps detected. Prioritize digitaltwin.json updates.');
    }
  }
  
  return recommendations;
}

/**
 * Generate specific digitaltwin.json update suggestions
 */
function generateDigitalTwinUpdates(dataGaps: DataGap[]): DigitalTwinUpdate[] {
  const updates: DigitalTwinUpdate[] = [];
  
  for (const gap of dataGaps) {
    if (gap.priority === 'HIGH' || gap.priority === 'MEDIUM') {
      // Generate section-specific updates
      if (gap.topic.includes('Project') || gap.topic.includes('Python') || gap.topic.includes('ML') || gap.topic.includes('RAG')) {
        updates.push({
          section: 'projects',
          updateType: 'add',
          description: `Add new project related to ${gap.topic}`,
          suggestedContent: {
            name: `[Suggested] ${gap.topic} Project`,
            description: `Based on ${gap.frequency} user queries, add a project demonstrating ${gap.missingKeywords.slice(0, 3).join(', ')}`,
            technologies: gap.missingKeywords.slice(0, 5),
            achievements: [
              'Add quantitative metrics (performance, users, impact)',
              'Include technical challenges and solutions',
              'Describe business value delivered'
            ]
          },
          reasoning: `${gap.frequency} queries with avg accuracy ${gap.avgAccuracy.toFixed(1)}% indicate missing project examples`
        });
      }
      
      if (gap.topic.includes('Leadership') || gap.topic.includes('Soft Skills')) {
        updates.push({
          section: 'experience',
          updateType: 'expand',
          description: `Add leadership STAR stories with quantitative metrics`,
          suggestedContent: {
            achievements: [
              {
                situation: '[Add context with team size, timeline, budget]',
                task: '[Define specific challenge or goal]',
                action: '[Describe leadership actions taken]',
                result: '[Quantify impact: X% improvement, $Y saved, Z people managed]'
              }
            ]
          },
          reasoning: `${gap.frequency} queries about leadership lacking quantitative details`
        });
      }
      
      if (gap.topic.includes('Skills') || gap.topic.includes('Cloud') || gap.topic.includes('Visualization')) {
        updates.push({
          section: 'skills',
          updateType: 'expand',
          description: `Add missing technical skills for ${gap.topic}`,
          suggestedContent: {
            new_skills: gap.missingKeywords.filter(kw => 
              !['experience', 'project', 'work', 'team'].includes(kw)
            ).slice(0, 10)
          },
          reasoning: `Keywords appearing in queries but missing from skills: ${gap.missingKeywords.join(', ')}`
        });
      }
    }
  }
  
  return updates;
}

/**
 * Export improvement report to JSON file
 */
export async function exportReportJSON(
  report: ImprovementReport,
  outputPath?: string
): Promise<string> {
  const filepath = outputPath || path.join(process.cwd(), 'quality-improvement-report.json');
  await fs.writeFile(filepath, JSON.stringify(report, null, 2), 'utf-8');
  return filepath;
}

/**
 * Generate Markdown report
 */
export async function generateMarkdownReport(report: ImprovementReport): Promise<string> {
  const markdown = `# Quality Improvement Report

**Generated:** ${new Date(report.analysisDate).toLocaleString()}

## 📊 Executive Summary

- **Total Feedback Analyzed:** ${report.totalFeedbackAnalyzed}
- **Low-Scoring Queries (<3 stars):** ${report.lowScoringQueries} (${((report.lowScoringQueries / report.totalFeedbackAnalyzed) * 100).toFixed(1)}%)
- **Average User Rating:** ${report.averageRating.toFixed(2)}/5.0 ⭐
- **Average Accuracy Score:** ${report.averageAccuracy.toFixed(1)}%
- **Identified Data Gaps:** ${report.identifiedGaps.length}

${report.averageAccuracy < 80 ? '⚠️ **ATTENTION NEEDED:** Accuracy below 80% indicates significant improvement opportunities.\n' : '✅ Overall system performing well, but gaps identified below.\n'}

---

## 🎯 Priority Recommendations

${report.priorityRecommendations.map(rec => `${rec}`).join('\n\n')}

---

## 🔍 Identified Data Gaps

${report.identifiedGaps.map((gap, index) => `
### ${index + 1}. ${gap.topic} ${gap.priority === 'HIGH' ? '🔴' : gap.priority === 'MEDIUM' ? '🟡' : '🟢'}

**Priority:** ${gap.priority}  
**Frequency:** ${gap.frequency} low-scoring queries  
**Avg Rating:** ${gap.avgScore.toFixed(2)}/5.0  
**Avg Accuracy:** ${gap.avgAccuracy.toFixed(1)}%  

**Missing Keywords:** ${gap.missingKeywords.join(', ') || 'None identified'}

**Sample Questions:**
${gap.sampleQuestions.map(q => `- "${q}"`).join('\n')}

**Recommended Actions:**
${gap.suggestions.map(s => `- ${s}`).join('\n')}

---
`).join('\n')}

## 🔧 Suggested digitaltwin.json Updates

${report.digitalTwinUpdateSuggestions.length > 0 ? report.digitalTwinUpdateSuggestions.map((update, index) => `
### Update ${index + 1}: ${update.section} - ${update.updateType}

**Description:** ${update.description}

**Reasoning:** ${update.reasoning}

**Suggested Content:**
\`\`\`json
${JSON.stringify(update.suggestedContent, null, 2)}
\`\`\`

---
`).join('\n') : '_No specific updates suggested at this time._'}

## 📈 Next Steps

1. **Review High Priority Gaps** - Address the ${report.identifiedGaps.filter(g => g.priority === 'HIGH').length} high-priority issues first
2. **Update digitaltwin.json** - Apply suggested content additions from above
3. **Re-test Queries** - Verify improvements by testing sample questions
4. **Monitor Feedback** - Continue collecting user ratings to measure impact
5. **Iterate** - Re-run this analysis monthly or after significant updates

---

**Report Generated by Digital Twin Quality Improvement System**
`;

  return markdown;
}

/**
 * Save Markdown report to file
 */
export async function exportReportMarkdown(
  report: ImprovementReport,
  outputPath?: string
): Promise<string> {
  const markdown = await generateMarkdownReport(report);
  const filepath = outputPath || path.join(process.cwd(), 'quality-improvement-report.md');
  await fs.writeFile(filepath, markdown, 'utf-8');
  return filepath;
}

/**
 * Main function to run complete quality improvement analysis
 */
export async function runQualityImprovement(
  options: {
    minRating?: number;
    exportJSON?: boolean;
    exportMarkdown?: boolean;
    outputDir?: string;
  } = {}
): Promise<ImprovementReport> {
  const {
    minRating = 3,
    exportJSON = true,
    exportMarkdown = true,
    outputDir = process.cwd()
  } = options;
  
  console.log('🔍 Starting quality improvement analysis...');
  
  // Run analysis
  const report = await analyzeFeedback(minRating);
  
  console.log(`✅ Analysis complete. Found ${report.identifiedGaps.length} data gaps.`);
  
  // Export reports
  if (exportJSON) {
    const jsonPath = await exportReportJSON(report, path.join(outputDir, 'quality-improvement-report.json'));
    console.log(`📄 JSON report saved: ${jsonPath}`);
  }
  
  if (exportMarkdown) {
    const mdPath = await exportReportMarkdown(report, path.join(outputDir, 'quality-improvement-report.md'));
    console.log(`📝 Markdown report saved: ${mdPath}`);
  }
  
  return report;
}
