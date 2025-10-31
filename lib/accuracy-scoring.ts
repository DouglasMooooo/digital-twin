/**
 * Accuracy Scoring System
 * Evaluates response quality, relevance, and STAR method compliance
 */

export interface AccuracyScore {
  overall: number;
  keywordMatch: number;
  starCompliance: number;
  relevance: number;
  professionalism: number;
  details: {
    matchedKeywords: string[];
    missingKeywords: string[];
    starComponents: string[];
    issues: string[];
    suggestions: string[];
  };
}

export interface ScoringCriteria {
  expectedKeywords: string[];
  requireSTAR?: boolean;
  category?: 'technical' | 'leadership' | 'problem-solving' | 'career' | 'industry' | 'culture';
  minLength?: number;
}

/**
 * Evaluate response accuracy based on query and criteria
 */
export function evaluateResponseAccuracy(
  query: string,
  response: string,
  criteria: ScoringCriteria
): AccuracyScore {
  const responseLower = response.toLowerCase();
  const queryLower = query.toLowerCase();

  // 1. Keyword Matching Score (0-100)
  const keywordScore = calculateKeywordScore(responseLower, criteria.expectedKeywords);

  // 2. STAR Method Compliance Score (0-100)
  const starScore = criteria.requireSTAR 
    ? calculateSTARScore(responseLower) 
    : { score: 100, components: [], issues: [], suggestions: [] }; // N/A = perfect score

  // 3. Relevance Score (0-100)
  const relevanceScore = calculateRelevanceScore(queryLower, responseLower);

  // 4. Professionalism Score (0-100)
  const professionalismScore = calculateProfessionalismScore(responseLower);

  // Calculate overall score (weighted average)
  const weights = {
    keyword: 0.3,
    star: criteria.requireSTAR ? 0.3 : 0,
    relevance: 0.25,
    professionalism: 0.15,
  };

  // Adjust weights if STAR not required
  if (!criteria.requireSTAR) {
    weights.keyword = 0.4;
    weights.relevance = 0.35;
    weights.professionalism = 0.25;
  }

  const overallScore = 
    keywordScore.score * weights.keyword +
    starScore.score * weights.star +
    relevanceScore.score * weights.relevance +
    professionalismScore.score * weights.professionalism;

  return {
    overall: Math.round(overallScore),
    keywordMatch: Math.round(keywordScore.score),
    starCompliance: Math.round(starScore.score),
    relevance: Math.round(relevanceScore.score),
    professionalism: Math.round(professionalismScore.score),
    details: {
      matchedKeywords: keywordScore.matched,
      missingKeywords: keywordScore.missing,
      starComponents: starScore.components,
      issues: [
        ...keywordScore.issues,
        ...starScore.issues,
        ...relevanceScore.issues,
        ...professionalismScore.issues,
      ],
      suggestions: [
        ...keywordScore.suggestions,
        ...starScore.suggestions,
        ...relevanceScore.suggestions,
        ...professionalismScore.suggestions,
      ],
    },
  };
}

/**
 * Calculate keyword matching score
 */
function calculateKeywordScore(response: string, expectedKeywords: string[]) {
  const matched: string[] = [];
  const missing: string[] = [];

  expectedKeywords.forEach(keyword => {
    if (response.includes(keyword.toLowerCase())) {
      matched.push(keyword);
    } else {
      missing.push(keyword);
    }
  });

  const score = expectedKeywords.length > 0 
    ? (matched.length / expectedKeywords.length) * 100 
    : 100;

  const issues: string[] = [];
  const suggestions: string[] = [];

  if (score < 60) {
    issues.push(`Low keyword coverage: ${matched.length}/${expectedKeywords.length}`);
    suggestions.push(`Include more relevant keywords: ${missing.slice(0, 3).join(', ')}`);
  }

  return { score, matched, missing, issues, suggestions };
}

/**
 * Calculate STAR method compliance score
 */
function calculateSTARScore(response: string) {
  const starKeywords = {
    situation: ['situation', 'context', 'background', 'when', 'where'],
    task: ['task', 'goal', 'objective', 'challenge', 'responsibility'],
    action: ['action', 'did', 'implemented', 'developed', 'created', 'led', 'managed'],
    result: ['result', 'outcome', 'achieved', 'improved', 'increased', 'reduced', 'impact'],
  };

  const components: string[] = [];
  let totalScore = 0;

  Object.entries(starKeywords).forEach(([component, keywords]) => {
    const found = keywords.some(keyword => response.includes(keyword));
    if (found) {
      components.push(component);
      totalScore += 25; // Each component worth 25 points
    }
  });

  const issues: string[] = [];
  const suggestions: string[] = [];

  if (components.length === 0) {
    issues.push('No STAR components detected');
    suggestions.push('Use STAR method: Situation, Task, Action, Result');
  } else if (components.length < 4) {
    const missing = Object.keys(starKeywords).filter(c => !components.includes(c));
    suggestions.push(`Add missing STAR components: ${missing.join(', ')}`);
  }

  return { score: totalScore, components, issues, suggestions };
}

/**
 * Calculate relevance score based on query-response alignment
 */
function calculateRelevanceScore(query: string, response: string) {
  const queryWords = query
    .split(/\s+/)
    .filter(word => word.length > 3)
    .filter(word => !['what', 'how', 'tell', 'describe', 'your', 'about', 'with'].includes(word));

  const matchedWords = queryWords.filter(word => response.includes(word));
  
  const score = queryWords.length > 0 
    ? (matchedWords.length / queryWords.length) * 100 
    : 100;

  const issues: string[] = [];
  const suggestions: string[] = [];

  if (score < 50) {
    issues.push('Response may not be directly relevant to question');
    suggestions.push('Ensure response addresses the specific question asked');
  }

  if (response.length < 100) {
    issues.push('Response is too brief');
    suggestions.push('Provide more detailed explanation and examples');
  }

  return { score, issues, suggestions };
}

/**
 * Calculate professionalism score
 */
function calculateProfessionalismScore(response: string) {
  let score = 100;
  const issues: string[] = [];
  const suggestions: string[] = [];

  // Check for informal language
  const informalWords = ['gonna', 'wanna', 'yeah', 'nah', 'dunno', 'kinda', 'sorta', 'lol', 'omg'];
  const foundInformal = informalWords.filter(word => response.includes(word));
  
  if (foundInformal.length > 0) {
    score -= 20 * foundInformal.length;
    issues.push(`Informal language detected: ${foundInformal.join(', ')}`);
    suggestions.push('Use professional business language');
  }

  // Check for proper sentence structure
  const sentences = response.split(/[.!?]+/).filter(s => s.trim().length > 0);
  if (sentences.length < 2) {
    score -= 10;
    issues.push('Response lacks proper sentence structure');
    suggestions.push('Use complete sentences with proper punctuation');
  }

  // Check for substantive content
  if (response.length < 50) {
    score -= 20;
    issues.push('Response is too short');
    suggestions.push('Provide more detailed and substantive response');
  }

  // Check for first-person perspective (should have "I", "my", etc.)
  const hasFirstPerson = /\b(i|my|me|i'm|i've)\b/i.test(response);
  if (!hasFirstPerson) {
    score -= 15;
    issues.push('Response lacks personal perspective');
    suggestions.push('Use first-person to describe your experiences');
  }

  return { score: Math.max(0, score), issues, suggestions };
}

/**
 * Evaluate multiple responses and calculate average scores
 */
export function evaluateBatchResponses(
  testCases: Array<{ query: string; response: string; criteria: ScoringCriteria }>
): {
  averageScores: {
    overall: number;
    keywordMatch: number;
    starCompliance: number;
    relevance: number;
    professionalism: number;
  };
  individualScores: AccuracyScore[];
  totalTests: number;
  passedTests: number;
  failedTests: number;
} {
  const individualScores = testCases.map(test =>
    evaluateResponseAccuracy(test.query, test.response, test.criteria)
  );

  const averages = {
    overall: average(individualScores.map(s => s.overall)),
    keywordMatch: average(individualScores.map(s => s.keywordMatch)),
    starCompliance: average(individualScores.map(s => s.starCompliance)),
    relevance: average(individualScores.map(s => s.relevance)),
    professionalism: average(individualScores.map(s => s.professionalism)),
  };

  const passedTests = individualScores.filter(s => s.overall >= 70).length;
  const failedTests = individualScores.length - passedTests;

  return {
    averageScores: averages,
    individualScores,
    totalTests: testCases.length,
    passedTests,
    failedTests,
  };
}

/**
 * Generate improvement suggestions based on low scores
 */
export function generateImprovementSuggestions(scores: AccuracyScore[]): string[] {
  const suggestions: string[] = [];
  const averageOverall = average(scores.map(s => s.overall));

  if (averageOverall < 70) {
    suggestions.push('Overall quality needs improvement. Focus on addressing specific issues below.');
  }

  const avgKeyword = average(scores.map(s => s.keywordMatch));
  if (avgKeyword < 60) {
    suggestions.push('Improve keyword coverage by updating digitaltwin.json with more relevant content.');
  }

  const avgSTAR = average(scores.map(s => s.starCompliance));
  if (avgSTAR < 70) {
    suggestions.push('Strengthen STAR method responses by adding more structured achievements.');
  }

  const avgRelevance = average(scores.map(s => s.relevance));
  if (avgRelevance < 60) {
    suggestions.push('Improve response relevance by better query understanding and context retrieval.');
  }

  const avgProfessionalism = average(scores.map(s => s.professionalism));
  if (avgProfessionalism < 80) {
    suggestions.push('Enhance professionalism by refining the LLM prompt and response formatting.');
  }

  return suggestions;
}

/**
 * Calculate average of numbers
 */
function average(numbers: number[]): number {
  if (numbers.length === 0) return 0;
  return Math.round(numbers.reduce((a, b) => a + b, 0) / numbers.length);
}

/**
 * Export scores to JSON for analysis
 */
export function exportScoresToJSON(
  results: ReturnType<typeof evaluateBatchResponses>
): string {
  return JSON.stringify(results, null, 2);
}

/**
 * Generate markdown report
 */
export function generateMarkdownReport(
  results: ReturnType<typeof evaluateBatchResponses>
): string {
  const { averageScores, totalTests, passedTests, failedTests } = results;

  let report = '# Accuracy Scoring Report\n\n';
  report += `**Total Tests:** ${totalTests}\n`;
  report += `**Passed (≥70%):** ${passedTests}\n`;
  report += `**Failed (<70%):** ${failedTests}\n`;
  report += `**Pass Rate:** ${((passedTests / totalTests) * 100).toFixed(1)}%\n\n`;

  report += '## Average Scores\n\n';
  report += `- **Overall:** ${averageScores.overall}%\n`;
  report += `- **Keyword Match:** ${averageScores.keywordMatch}%\n`;
  report += `- **STAR Compliance:** ${averageScores.starCompliance}%\n`;
  report += `- **Relevance:** ${averageScores.relevance}%\n`;
  report += `- **Professionalism:** ${averageScores.professionalism}%\n\n`;

  report += '## Performance Rating\n\n';
  const rating = averageScores.overall >= 90 ? 'Excellent ⭐⭐⭐⭐⭐' :
                 averageScores.overall >= 80 ? 'Very Good ⭐⭐⭐⭐' :
                 averageScores.overall >= 70 ? 'Good ⭐⭐⭐' :
                 averageScores.overall >= 60 ? 'Fair ⭐⭐' :
                 'Needs Improvement ⭐';
  
  report += `**${rating}**\n\n`;

  const suggestions = generateImprovementSuggestions(results.individualScores);
  if (suggestions.length > 0) {
    report += '## Improvement Suggestions\n\n';
    suggestions.forEach((suggestion, i) => {
      report += `${i + 1}. ${suggestion}\n`;
    });
  }

  return report;
}
