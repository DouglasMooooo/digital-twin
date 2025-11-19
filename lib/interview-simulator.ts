/**
 * Interview Simulator Engine
 * Generates comprehensive interview questions and evaluates responses using STAR methodology
 */

export interface InterviewQuestion {
  id: string;
  category: 'technical' | 'behavioral' | 'industry' | 'cultural' | 'salary';
  difficulty: 'junior' | 'mid' | 'senior';
  question: string;
  context?: string;
  expectedKeyPoints: string[];
  followUpQuestions?: string[];
}

export interface STARResponse {
  situation: string;
  task: string;
  action: string;
  result: string;
  quantifiedAchievement?: string;
}

export interface InterviewEvaluation {
  questionId: string;
  userResponse: string;
  category: string;
  score: number; // 0-100
  feedback: string;
  strengths: string[];
  improvementAreas: string[];
  starMethodologyScore?: number; // 0-100 for STAR compliance
}

export interface InterviewSession {
  sessionId: string;
  startTime: Date;
  endTime?: Date;
  targetRole: string;
  questions: InterviewQuestion[];
  responses: InterviewEvaluation[];
  overallScore?: number;
}

/**
 * Technical interview questions
 */
const technicalQuestions: InterviewQuestion[] = [
  {
    id: 'tech_001',
    category: 'technical',
    difficulty: 'mid',
    question: 'Explain the difference between SQL joins and when you would use each type',
    expectedKeyPoints: [
      'INNER JOIN - returns matching records',
      'LEFT/RIGHT JOIN - includes non-matching records',
      'FULL OUTER JOIN - combines all records',
      'CROSS JOIN - cartesian product',
      'Performance considerations',
    ],
    followUpQuestions: [
      'How would you optimize a slow JOIN query?',
      'Can you give a real-world example of FULL OUTER JOIN?',
    ],
  },
  {
    id: 'tech_002',
    category: 'technical',
    difficulty: 'senior',
    question: 'Design a system to handle 1 million concurrent users',
    expectedKeyPoints: [
      'Horizontal scaling',
      'Load balancing',
      'Database sharding/partitioning',
      'Caching strategy (Redis)',
      'CDN for static content',
      'Message queues',
      'Microservices architecture',
      'Monitoring and alerting',
    ],
    followUpQuestions: [
      'How would you handle database bottlenecks?',
      'Explain your backup and disaster recovery strategy',
    ],
  },
  {
    id: 'tech_003',
    category: 'technical',
    difficulty: 'junior',
    question: 'What is the time complexity of different sorting algorithms?',
    expectedKeyPoints: [
      'QuickSort - O(n log n) average, O(n²) worst',
      'MergeSort - O(n log n) always',
      'BubbleSort - O(n²)',
      'HeapSort - O(n log n)',
      'Space complexity tradeoffs',
    ],
    followUpQuestions: [
      'Why would you choose one over another?',
      'How does choosing in-place vs extra space affect performance?',
    ],
  },
  {
    id: 'tech_004',
    category: 'technical',
    difficulty: 'mid',
    question: 'Explain async/await and how it differs from Promises',
    expectedKeyPoints: [
      'async/await is syntactic sugar over Promises',
      'Improves readability',
      'Error handling with try/catch',
      'Sequential vs parallel execution',
      'Return values',
    ],
  },
  {
    id: 'tech_005',
    category: 'technical',
    difficulty: 'senior',
    question: 'How would you approach debugging a memory leak in production?',
    expectedKeyPoints: [
      'Use memory profiling tools',
      'Identify growing heap size',
      'Take heap snapshots',
      'Compare snapshots over time',
      'Identify retained objects',
      'Fix circular references',
      'Monitoring and alerting setup',
    ],
  },
];

/**
 * Behavioral interview questions
 */
const behavioralQuestions: InterviewQuestion[] = [
  {
    id: 'behav_001',
    category: 'behavioral',
    difficulty: 'mid',
    question: 'Tell me about a time when you had to meet a tight deadline. How did you manage it?',
    context: 'STAR Format: Situation → Task → Action → Result',
    expectedKeyPoints: [
      'Clear situation description',
      'Specific deadline mentioned',
      'Proactive steps taken',
      'Quantifiable results',
      'What you learned',
    ],
  },
  {
    id: 'behav_002',
    category: 'behavioral',
    difficulty: 'mid',
    question: 'Describe a situation where you had to work with a difficult team member',
    expectedKeyPoints: [
      'Specific example with details',
      'Empathy shown',
      'Communication approach',
      'Resolution achieved',
      'Positive outcome',
    ],
  },
  {
    id: 'behav_003',
    category: 'behavioral',
    difficulty: 'senior',
    question:
      'Tell me about a project where you had to take a leadership role. How did you handle it?',
    expectedKeyPoints: [
      'Clear leadership actions',
      'Team motivation',
      'Decision making',
      'Risk management',
      'Measurable success',
    ],
  },
  {
    id: 'behav_004',
    category: 'behavioral',
    difficulty: 'mid',
    question: 'Share an example of when you failed and what you learned from it',
    expectedKeyPoints: [
      'Honest failure description',
      'Personal responsibility',
      'Learning outcome',
      'Concrete improvements',
      'Humility and growth mindset',
    ],
  },
  {
    id: 'behav_005',
    category: 'behavioral',
    difficulty: 'mid',
    question: 'How do you handle receiving negative feedback?',
    expectedKeyPoints: [
      'Openness to feedback',
      'Specific example',
      'How you acted on it',
      'Improved outcome',
      'Growth mindset',
    ],
  },
];

/**
 * Industry knowledge questions
 */
const industryQuestions: InterviewQuestion[] = [
  {
    id: 'ind_001',
    category: 'industry',
    difficulty: 'mid',
    question: 'What are the current trends in software development?',
    expectedKeyPoints: [
      'AI/ML integration',
      'Cloud-native development',
      'DevOps practices',
      'Microservices',
      'Low-code/No-code',
      'Security (DevSecOps)',
    ],
  },
  {
    id: 'ind_002',
    category: 'industry',
    difficulty: 'senior',
    question: 'How would you approach digital transformation in a legacy organization?',
    expectedKeyPoints: [
      'Stakeholder management',
      'Phased approach',
      'Technology assessment',
      'Change management',
      'Risk mitigation',
      'ROI calculation',
    ],
  },
];

/**
 * Cultural fit questions
 */
const culturalQuestions: InterviewQuestion[] = [
  {
    id: 'cult_001',
    category: 'cultural',
    difficulty: 'mid',
    question: 'What type of work environment do you thrive in?',
    expectedKeyPoints: [
      'Alignment with company values',
      'Specific examples',
      'Growth opportunities',
      'Team collaboration',
      'Impact and purpose',
    ],
  },
  {
    id: 'cult_002',
    category: 'cultural',
    difficulty: 'mid',
    question: 'How do you stay updated with latest technologies?',
    expectedKeyPoints: [
      'Continuous learning',
      'Community involvement',
      'Reading/courses/blogs',
      'Side projects',
      'Passion for growth',
    ],
  },
];

/**
 * Salary negotiation questions
 */
const salaryQuestions: InterviewQuestion[] = [
  {
    id: 'sal_001',
    category: 'salary',
    difficulty: 'mid',
    question: 'What are your salary expectations?',
    expectedKeyPoints: [
      'Market research done',
      'Justified range',
      'Benefits considered',
      'Growth trajectory mentioned',
      'Flexibility shown',
    ],
  },
];

/**
 * Generate interview questions based on role and level
 */
export function generateInterviewQuestions(
  role: string,
  level: 'junior' | 'mid' | 'senior',
  count: number = 5
): InterviewQuestion[] {
  const allQuestions = [
    ...technicalQuestions,
    ...behavioralQuestions,
    ...industryQuestions,
    ...culturalQuestions,
    ...salaryQuestions,
  ];

  // Filter by difficulty level
  const filtered = allQuestions.filter((q) => q.difficulty === level);

  // Mix question types
  const technical = filtered.filter((q) => q.category === 'technical').slice(0, Math.ceil(count * 0.4));
  const behavioral = filtered.filter((q) => q.category === 'behavioral').slice(0, Math.ceil(count * 0.35));
  const industry = filtered.filter((q) => q.category === 'industry').slice(0, Math.ceil(count * 0.15));
  const cultural = filtered.filter((q) => q.category === 'cultural').slice(0, Math.ceil(count * 0.1));

  return [...technical, ...behavioral, ...industry, ...cultural];
}

/**
 * Evaluate STAR methodology compliance
 */
export function evaluateSTARCompliance(response: string): number {
  let score = 0;

  // Check for STAR components
  const hasSituation = /situation|context|background|was working|faced|encountered/i.test(response);
  const hasTask = /task|goal|objective|needed|required/i.test(response);
  const hasAction = /did|implemented|created|developed|built|took action|approach/i.test(response);
  const hasResult =
    /result|outcome|achieved|improved|delivered|succeeded|learned|impact|reduced|increased/i.test(
      response
    );

  score += hasSituation ? 25 : 0;
  score += hasTask ? 25 : 0;
  score += hasAction ? 25 : 0;
  score += hasResult ? 25 : 0;

  // Bonus for quantification
  if (/\d+(%|x|increase|decrease|reduced|saved|improved)/i.test(response)) {
    score = Math.min(100, score + 10);
  }

  return score;
}

/**
 * Evaluate a user's interview response
 */
export function evaluateResponse(
  question: InterviewQuestion,
  userResponse: string
): InterviewEvaluation {
  const baseScore = 50;
  let score = baseScore;

  // Check for key points
  let keyPointsHit = 0;
  question.expectedKeyPoints.forEach((point) => {
    if (new RegExp(point.split(' ')[0], 'i').test(userResponse)) {
      keyPointsHit++;
    }
  });

  score += (keyPointsHit / question.expectedKeyPoints.length) * 30;

  // Penalize short responses
  if (userResponse.split(' ').length < 50) {
    score -= 15;
  }

  // Bonus for detailed examples
  if (/example|specific|case|project|implemented/i.test(userResponse)) {
    score += 10;
  }

  // For behavioral questions, check STAR compliance
  let starScore = 0;
  if (question.category === 'behavioral') {
    starScore = evaluateSTARCompliance(userResponse);
    score = (score * 0.5 + starScore * 0.5) | 0; // Blend with base score
  }

  const strengths: string[] = [];
  const improvementAreas: string[] = [];

  if (keyPointsHit >= question.expectedKeyPoints.length * 0.8) {
    strengths.push('Covered most key points comprehensively');
  }
  if (userResponse.split(' ').length > 100) {
    strengths.push('Provided detailed explanation with examples');
  }
  if (/\d+(%|x|increase|decrease)/i.test(userResponse)) {
    strengths.push('Used quantifiable metrics to support claims');
  }

  if (keyPointsHit < question.expectedKeyPoints.length * 0.5) {
    improvementAreas.push(`Missing key concepts: ${question.expectedKeyPoints.slice(0, 2).join(', ')}`);
  }
  if (userResponse.split(' ').length < 50) {
    improvementAreas.push('Response could be more detailed with specific examples');
  }
  if (question.category === 'behavioral' && starScore < 60) {
    improvementAreas.push('Consider structuring answer with Situation → Task → Action → Result');
  }

  return {
    questionId: question.id,
    userResponse,
    category: question.category,
    score: Math.min(100, Math.max(0, Math.round(score))),
    feedback: `Solid response covering ${keyPointsHit} of ${question.expectedKeyPoints.length} key points.`,
    strengths,
    improvementAreas,
    starMethodologyScore: question.category === 'behavioral' ? starScore : undefined,
  };
}

/**
 * Create a new interview session
 */
export function createInterviewSession(
  targetRole: string,
  level: 'junior' | 'mid' | 'senior',
  questionsPerCategory: number = 1
): InterviewSession {
  const questions = generateInterviewQuestions(targetRole, level, questionsPerCategory * 5);

  return {
    sessionId: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    startTime: new Date(),
    targetRole,
    questions,
    responses: [],
  };
}

/**
 * Generate interview preparation guide
 */
export function generateInterviewPrep(role: string, level: 'junior' | 'mid' | 'senior'): string {
  const questions = generateInterviewQuestions(role, level, 3);

  let guide = `
📋 INTERVIEW PREPARATION GUIDE
==================================

Role: ${role}
Level: ${level.toUpperCase()}
Date: ${new Date().toLocaleDateString()}

🎯 INTERVIEW QUESTIONS & TIPS
`;

  questions.forEach((q, i) => {
    guide += `\n${i + 1}. [${q.category.toUpperCase()}] ${q.question}

   Key Points to Cover:
${q.expectedKeyPoints.map((p) => `   • ${p}`).join('\n')}
`;

    if (q.category === 'behavioral') {
      guide += `
   💡 TIP: Use STAR Method
   • Situation: Set the scene
   • Task: Your responsibility
   • Action: What you did
   • Result: Quantifiable outcome
`;
    }

    if (q.followUpQuestions) {
      guide += `
   Follow-up Questions:
${q.followUpQuestions.map((fq) => `   • ${fq}`).join('\n')}
`;
    }
  });

  guide += `\n\n✅ PREPARATION CHECKLIST
• Research company culture and values
• Prepare specific examples for behavioral questions
• Review job description and required skills
• Practice explaining technical concepts
• Prepare questions for interviewer
• Get good sleep before interview
• Arrive 10 minutes early (or log in early for video calls)
`;

  return guide;
}

export default {
  generateInterviewQuestions,
  evaluateSTARCompliance,
  evaluateResponse,
  createInterviewSession,
  generateInterviewPrep,
};
