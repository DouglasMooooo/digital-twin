#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListResourcesRequestSchema,
  ListToolsRequestSchema,
  ReadResourceRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';
import ABTestingFramework from '../lib/ab-testing.js';
import AdvancedAnalytics from '../lib/advanced-analytics.js';

// Type definitions for Digital Twin data structure
interface PersonalInfo {
  name: string;
  title: string;
  location: string;
  email: string;
  phone: string;
  linkedin: string;
  github: string;
  summary: string;
  elevator_pitch: string;
}

interface STARItem {
  situation: string;
  task: string;
  action: string;
  result: string;
}

interface WorkExperience {
  company: string;
  position: string;
  duration: string;
  location: string;
  responsibilities: string[];
  achievements: STARItem[];
}

interface Education {
  institution: string;
  degree: string;
  field_of_study: string;
  duration: string;
  grade: string;
  relevant_coursework: string[];
}

interface Skills {
  programming_languages: string[];
  ai_ml_skills: string[];
  business_skills: string[];
  financial_accounting: string[];
  data_visualization: string[];
  databases: string[];
  cloud_platforms: string[];
  tools: string[];
}

interface Project {
  name: string;
  description: string;
  technologies: string[];
  achievements: string[];
  link?: string;
}

interface InterviewPrep {
  self_introduction: string;
  strengths: string[];
  why_hire_me: string[];
  career_goals: string;
}

interface DigitalTwinData {
  personal: PersonalInfo;
  experience: WorkExperience[];
  education: Education[];
  skills: Skills;
  projects: Project[];
  interview_prep: InterviewPrep;
}

// Job data structure
interface JobData {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  job_type: string;
  posted_date: string;
  url: string;
  description: string;
  requirements: string;
  scraped_at: string;
  source: string;
}

// Interview session structure
interface InterviewSession {
  id: string;
  jobId: string;
  startTime: string;
  duration: number;
  questions: {
    behavioral: string[];
    technical: string[];
    business: string[];
    situational: string[];
  };
  responses: Array<{
    question: string;
    response: string;
    type: string;
    evaluation: {
      accuracy: number;
      storyCoverage: number;
      userSatisfaction: number;
    };
    timestamp: string;
  }>;
  metrics: {
    accuracy: number;
    storyCoverage: number;
    userSatisfaction: number;
  };
}

// Performance metrics
interface PerformanceMetrics {
  accuracy: number;
  storyCoverage: number;
  userSatisfaction: number;
  totalResponses: number;
}

// Tool argument types
interface GetWorkExperienceArgs {
  company?: string;
}

interface GetSkillsArgs {
  category?: 'programming_languages' | 'ai_ml_skills' | 'business_skills' | 'financial_accounting' | 'data_visualization' | 'databases' | 'cloud_platforms' | 'tools';
}

interface GetInterviewPrepArgs {
  section?: 'self_introduction' | 'strengths' | 'why_hire_me' | 'career_goals';
}

interface SearchExperienceArgs {
  keyword: string;
}

interface GenerateResumeSummaryArgs {
  job_title: string;
  focus_areas?: string[];
}

interface ScrapeJobsArgs {
  max_jobs?: number;
}

interface GetJobAnalysisArgs {
  job_id: string;
}

interface StartInterviewSimulationArgs {
  job_id: string;
}

interface EvaluateResponseArgs {
  question: string;
  response: string;
  question_type: 'behavioral' | 'technical' | 'business' | 'situational';
}

interface GetPersonalizedResponseArgs {
  query: string;
  context?: any;
}

// Global variables
let digitalTwinData: DigitalTwinData;
let jobData: JobData[] = [];
let interviewSessions: InterviewSession[] = [];
let performanceMetrics: PerformanceMetrics = {
  accuracy: 0,
  storyCoverage: 0,
  userSatisfaction: 0,
  totalResponses: 0
};

// Integration modules (initialized in main)
const abFramework = new ABTestingFramework();
const analytics = new AdvancedAnalytics();

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load digital twin data from JSON file
async function loadData(): Promise<void> {
  try {
    const dataPath = path.join(__dirname, '..', 'digitaltwin.json');
    const data = await fs.readFile(dataPath, 'utf-8');
    digitalTwinData = JSON.parse(data) as DigitalTwinData;
    console.error('✓ Digital twin data loaded successfully');
  } catch (error) {
    console.error('✗ Error loading digital twin data:', error);
    throw error;
  }
}

// Load job data
async function loadJobData(): Promise<void> {
  try {
    const dataPath = path.join(__dirname, '..', 'job_data.json');
    const data = await fs.readFile(dataPath, 'utf-8');
    jobData = JSON.parse(data) as JobData[];
    console.error(`✓ Loaded ${jobData.length} job listings`);
  } catch (error) {
    console.error('✗ No existing job data found, starting with empty array');
    jobData = [];
  }
}

// Load interview sessions
async function loadInterviewSessions(): Promise<void> {
  try {
    const dataPath = path.join(__dirname, '..', 'interview_sessions.json');
    const data = await fs.readFile(dataPath, 'utf-8');
    interviewSessions = JSON.parse(data) as InterviewSession[];
    console.error(`✓ Loaded ${interviewSessions.length} interview sessions`);
  } catch (error) {
    console.error('✗ No existing interview sessions found');
    interviewSessions = [];
  }
}

// Load performance metrics
async function loadPerformanceMetrics(): Promise<void> {
  try {
    const dataPath = path.join(__dirname, '..', 'response_metrics.json');
    const data = await fs.readFile(dataPath, 'utf-8');
    performanceMetrics = JSON.parse(data) as PerformanceMetrics;
    console.error('✓ Performance metrics loaded');
  } catch (error) {
    console.error('✗ No existing metrics found, using defaults');
  }
}

// Save functions
async function saveJobData(): Promise<void> {
  try {
    const dataPath = path.join(__dirname, '..', 'job_data.json');
    await fs.writeFile(dataPath, JSON.stringify(jobData, null, 2));
    console.error(`✓ Saved ${jobData.length} job listings`);
  } catch (error) {
    console.error('✗ Error saving job data:', error);
  }
}

async function saveInterviewSession(session: InterviewSession): Promise<void> {
  try {
    interviewSessions.push(session);
    const dataPath = path.join(__dirname, '..', 'interview_sessions.json');
    await fs.writeFile(dataPath, JSON.stringify(interviewSessions, null, 2));
    console.error('✓ Interview session saved');
  } catch (error) {
    console.error('✗ Error saving interview session:', error);
  }
}

async function savePerformanceMetrics(): Promise<void> {
  try {
    const dataPath = path.join(__dirname, '..', 'response_metrics.json');
    await fs.writeFile(dataPath, JSON.stringify(performanceMetrics, null, 2));
  } catch (error) {
    console.error('✗ Error saving metrics:', error);
  }
}

// Run Python scraper
async function runSeekScraper(maxJobs: number = 50): Promise<JobData[]> {
  return new Promise((resolve, reject) => {
    const pythonProcess = spawn('python', ['scripts/scrape_seek_jobs.py'], {
      cwd: path.dirname(__dirname),
      stdio: ['pipe', 'pipe', 'pipe']
    });

    let stdout = '';
    let stderr = '';

    pythonProcess.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    pythonProcess.on('close', (code) => {
      if (code === 0) {
        // Reload job data after scraping
        loadJobData().then(() => {
          resolve(jobData);
        }).catch(reject);
      } else {
        reject(new Error(`Scraper failed: ${stderr}`));
      }
    });

    pythonProcess.on('error', (error) => {
      reject(error);
    });
  });
}

// Generate interview questions
function generateInterviewQuestions(jobData: JobData, level: string = 'junior'): InterviewSession['questions'] {
  const questions: InterviewSession['questions'] = {
    behavioral: [],
    technical: [],
    business: [],
    situational: []
  };

  // Behavioral questions based on STAR stories
  if (digitalTwinData?.experience) {
    questions.behavioral = [
      "Tell me about a time you had to learn a completely new technology quickly",
      "Describe a situation where you had to work with a difficult stakeholder",
      "How do you handle conflicting priorities and tight deadlines?",
      "Tell me about a time you made a mistake and how you handled it",
      "Describe a time when you had to adapt to a significant change"
    ];
  }

  // Technical questions based on job requirements
  if (jobData?.requirements) {
    questions.technical = [
      "Walk me through how you would approach analyzing customer data for insights",
      "How would you handle data quality issues in a business analytics project?",
      "Explain your experience with SQL and data querying",
      "How do you ensure your analysis is accurate and reliable?",
      "Describe your experience with data visualization tools"
    ];
  }

  // Business questions
  questions.business = [
    "How would you approach identifying business opportunities through data?",
    "Tell me about a time you used data to influence business decisions",
    "How do you communicate complex data insights to non-technical stakeholders?",
    "What KPIs would you track for a business analytics role?",
    "How do you balance speed and accuracy in business analysis?"
  ];

  // Situational questions
  questions.situational = [
    "A critical report is due tomorrow but you discover data inconsistencies. What do you do?",
    "How would you approach mentoring a junior team member?",
    "Your analysis shows different results from what management expected. How do you handle this?",
    "How would you prioritize multiple analysis requests from different departments?",
    "Describe how you'd handle a situation where data is incomplete"
  ];

  return questions;
}

// Evaluate response
function evaluateResponse(question: string, response: string, questionType: string): { accuracy: number; storyCoverage: number; userSatisfaction: number } {
  let accuracy = 0.7; // Base accuracy
  let storyCoverage = 0.6; // Base story coverage
  let userSatisfaction = 0.8; // Base satisfaction

  // Check for STAR structure in behavioral questions
  if (questionType === 'behavioral') {
    const hasSituation = response.toLowerCase().includes('situation') || response.length > 100;
    const hasTask = response.toLowerCase().includes('task') || response.toLowerCase().includes('responsible');
    const hasAction = response.toLowerCase().includes('action') || response.length > 200;
    const hasResult = response.toLowerCase().includes('result') || response.toLowerCase().includes('outcome');

    storyCoverage = [hasSituation, hasTask, hasAction, hasResult].filter(Boolean).length / 4;
    accuracy = storyCoverage > 0.5 ? 0.8 : 0.6;
  }

  // Technical questions evaluation
  if (questionType === 'technical') {
    const hasTechnicalTerms = /\b(sql|python|tableau|power bi|excel|data|analysis|visualization)\b/i.test(response);
    const hasStructure = response.length > 150;
    accuracy = (hasTechnicalTerms && hasStructure) ? 0.85 : 0.65;
    storyCoverage = hasTechnicalTerms ? 0.7 : 0.5;
  }

  return { accuracy, storyCoverage, userSatisfaction };
}

// Update performance metrics
function updateMetrics(accuracy: number, storyCoverage: number, userSatisfaction: number): void {
  performanceMetrics.totalResponses++;
  performanceMetrics.accuracy = (performanceMetrics.accuracy * (performanceMetrics.totalResponses - 1) + accuracy) / performanceMetrics.totalResponses;
  performanceMetrics.storyCoverage = (performanceMetrics.storyCoverage * (performanceMetrics.totalResponses - 1) + storyCoverage) / performanceMetrics.totalResponses;
  performanceMetrics.userSatisfaction = (performanceMetrics.userSatisfaction * (performanceMetrics.totalResponses - 1) + userSatisfaction) / performanceMetrics.totalResponses;

  savePerformanceMetrics();
}

// Analyze job fit
function analyzeJobFit(job: JobData): string {
  if (!digitalTwinData) {
    return "Digital twin data not available for analysis";
  }

  const skills = digitalTwinData.skills || {};
  const experience = digitalTwinData.experience || [];

  let fitScore = 0;
  const matches = [];
  const gaps = [];

  // Check technical skills match
  const jobRequirements = (job.description + job.requirements).toLowerCase();

  if (skills.programming_languages) {
    for (const lang of skills.programming_languages) {
      const langName = typeof lang === 'string' ? lang : (lang as any).language || '';
      if (jobRequirements.includes(langName.toLowerCase())) {
        fitScore += 20;
        matches.push(`Technical skill: ${langName}`);
      }
    }
  }

  // Check business analysis experience
  if (experience.some(exp => exp.position.toLowerCase().includes('analyst') || exp.position.toLowerCase().includes('analytics'))) {
    fitScore += 30;
    matches.push('Business analysis experience');
  }

  // Check for data tools
  if (skills.data_visualization && jobRequirements.includes('power bi')) {
    fitScore += 15;
    matches.push('Power BI proficiency');
  }

  // Identify gaps
  if (!jobRequirements.includes('python') && !skills.programming_languages?.some((l: any) => (l.language || l) === 'Python')) {
    gaps.push('Python programming skills');
  }

  if (fitScore < 50) {
    gaps.push('More business analysis experience needed');
  }

  return `Fit Score: ${fitScore}%\n\nStrengths:\n${matches.map(m => `- ${m}`).join('\n')}\n\nAreas for Development:\n${gaps.map(g => `- ${g}`).join('\n')}`;
}

// Get personalized response
function getPersonalizedResponse(query: string, context: any = {}): string {
  if (!digitalTwinData) {
    return "Digital twin data not available";
  }

  // Simple RAG-like retrieval from digital twin data
  const relevantInfo = findRelevantExperience(query);

  // Generate response using available context
  const response = generateContextualResponse(query, relevantInfo, context);

  return response;
}

function findRelevantExperience(query: string): WorkExperience | null {
  const experiences = digitalTwinData.experience || [];
  const skills = digitalTwinData.skills || {};

  // Simple keyword matching - in production would use vector similarity
  const queryLower = query.toLowerCase();

  let relevantExp = null;
  let maxScore = 0;

  for (const exp of experiences) {
    let score = 0;
    const expText = JSON.stringify(exp).toLowerCase();

    // Check for technical skills match
    if (skills.programming_languages) {
      for (const lang of skills.programming_languages) {
        const langName = typeof lang === 'string' ? lang : (lang as any).language || '';
        if (expText.includes(langName.toLowerCase())) {
          score += 0.3;
        }
      }
    }

    // Check for keyword matches
    const keywords = ['business', 'analysis', 'data', 'ai', 'machine learning', 'python', 'sql'];
    for (const keyword of keywords) {
      if (queryLower.includes(keyword) && expText.includes(keyword)) {
        score += 0.2;
      }
    }

    if (score > maxScore) {
      maxScore = score;
      relevantExp = exp;
    }
  }

  return relevantExp;
}

function generateContextualResponse(query: string, relevantExp: WorkExperience | null, context: any): string {
  if (!relevantExp) {
    return "Based on my experience, I can help analyze this from a business analytics perspective.";
  }

  const response = `From my experience at ${relevantExp.company} as ${relevantExp.position}, I've developed strong skills in business analysis and data-driven decision making. ${relevantExp.achievements?.[0]?.result || "I've successfully delivered multiple analytics projects that drove business value."}`;

  return response;
}

// Create MCP server
const server = new Server(
  {
    name: 'digital-twin-server',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
      resources: {},
    },
  }
);

// Define available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      // Original digital twin tools
      {
        name: 'get_personal_info',
        description: 'Get personal information including name, title, contact details, and professional summary',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
      {
        name: 'get_work_experience',
        description: 'Get work experience with STAR-method achievements. Optionally filter by company name.',
        inputSchema: {
          type: 'object',
          properties: {
            company: {
              type: 'string',
              description: 'Optional: filter by company name (case-insensitive partial match)',
            },
          },
        },
      },
      {
        name: 'get_education',
        description: 'Get education background including degrees, institutions, and relevant coursework',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
      {
        name: 'get_skills',
        description: 'Get all skills or filter by category (programming_languages, ai_ml_skills, business_skills, etc.)',
        inputSchema: {
          type: 'object',
          properties: {
            category: {
              type: 'string',
              description: 'Optional: specific skill category',
              enum: ['programming_languages', 'ai_ml_skills', 'business_skills', 'financial_accounting', 'data_visualization', 'databases', 'cloud_platforms', 'tools'],
            },
          },
        },
      },
      {
        name: 'get_projects',
        description: 'Get all projects with descriptions, technologies used, and achievements',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
      {
        name: 'get_interview_prep',
        description: 'Get interview preparation materials including self-introduction, strengths, and career goals',
        inputSchema: {
          type: 'object',
          properties: {
            section: {
              type: 'string',
              description: 'Optional: specific section (self_introduction, strengths, why_hire_me, career_goals)',
              enum: ['self_introduction', 'strengths', 'why_hire_me', 'career_goals'],
            },
          },
        },
      },
      {
        name: 'search_experience',
        description: 'Search work experience by keyword (e.g., "financial", "team management", "Kenya")',
        inputSchema: {
          type: 'object',
          properties: {
            keyword: {
              type: 'string',
              description: 'Search keyword to find relevant experience',
            },
          },
          required: ['keyword'],
        },
      },
      {
        name: 'generate_resume_summary',
        description: 'Generate a customized resume summary based on job requirements',
        inputSchema: {
          type: 'object',
          properties: {
            job_title: {
              type: 'string',
              description: 'Target job title (e.g., "Data Analyst", "Business Analyst")',
            },
            focus_areas: {
              type: 'array',
              items: { type: 'string' },
              description: 'Key skills or areas to emphasize (e.g., ["Python", "SQL", "Financial Analysis"])',
            },
          },
          required: ['job_title'],
        },
      },
      // New interview preparation tools
      {
        name: 'scrape_seek_jobs',
        description: 'Scrape Business Analyst job listings from Seek.com.au across Australia',
        inputSchema: {
          type: 'object',
          properties: {
            max_jobs: {
              type: 'number',
              description: 'Maximum number of jobs to scrape (default: 50)',
              default: 50,
            },
          },
        },
      },
      {
        name: 'get_job_analysis',
        description: 'Analyze job requirements and match with personal profile',
        inputSchema: {
          type: 'object',
          properties: {
            job_id: {
              type: 'string',
              description: 'Job ID to analyze',
            },
          },
          required: ['job_id'],
        },
      },
      {
        name: 'start_interview_simulation',
        description: 'Start a 30-minute junior Business Analyst interview simulation',
        inputSchema: {
          type: 'object',
          properties: {
            job_id: {
              type: 'string',
              description: 'Job ID for the simulation',
            },
          },
          required: ['job_id'],
        },
      },
      {
        name: 'evaluate_response',
        description: 'Evaluate interview response and provide feedback',
        inputSchema: {
          type: 'object',
          properties: {
            question: {
              type: 'string',
              description: 'The interview question',
            },
            response: {
              type: 'string',
              description: 'The candidate\'s response',
            },
            question_type: {
              type: 'string',
              enum: ['behavioral', 'technical', 'business', 'situational'],
              description: 'Type of question',
            },
          },
          required: ['question', 'response', 'question_type'],
        },
      },
      {
        name: 'get_personalized_response',
        description: 'Get personalized response based on digital twin profile',
        inputSchema: {
          type: 'object',
          properties: {
            query: {
              type: 'string',
              description: 'The query to respond to',
            },
            context: {
              type: 'object',
              description: 'Additional context information',
            },
          },
          required: ['query'],
        },
      },
      {
        name: 'get_performance_metrics',
        description: 'Get current performance metrics and improvement tracking',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
      // Phase 3 integration tools
      {
        name: 'run_ab_test',
        description: 'Run an A/B test comparing two response strategies',
        inputSchema: {
          type: 'object',
          properties: {
            questionId: { type: 'string' },
            question: { type: 'string' },
            context: { type: 'object' },
            controlVariantId: { type: 'string' },
            testVariantId: { type: 'string' }
          },
          required: ['questionId', 'question']
        }
      },
      {
        name: 'get_analytics_report',
        description: 'Generate performance analytics report for a given period',
        inputSchema: {
          type: 'object',
          properties: {
            period: { type: 'string', enum: ['daily', 'weekly', 'monthly'] }
          }
        }
      },
      {
        name: 'get_variant_performance',
        description: 'Get detailed performance statistics for a specific A/B test variant',
        inputSchema: {
          type: 'object',
          properties: {
            variantId: { type: 'string' }
          },
          required: ['variantId']
        }
      },
      {
        name: 'record_performance',
        description: 'Record user performance metrics for analytics',
        inputSchema: {
          type: 'object',
          properties: {
            accuracy: { type: 'number' },
            storyCoverage: { type: 'number' },
            satisfaction: { type: 'number' },
            responseTime: { type: 'number' },
            category: { type: 'string' }
          },
          required: ['accuracy','storyCoverage','satisfaction','responseTime','category']
        }
      },
      {
        name: 'get_personalized_recommendations',
        description: 'Get personalized recommendations for a user',
        inputSchema: {
          type: 'object',
          properties: {
            userId: { type: 'string' },
            period: { type: 'string', enum: ['daily','weekly','monthly'] },
            includeAnalytics: { type: 'boolean' }
          }
        }
      },
      {
        name: 'get_next_milestones',
        description: 'Get suggested next milestones based on performance',
        inputSchema: {
          type: 'object',
          properties: {
            userId: { type: 'string' },
            numberOfMilestones: { type: 'number' }
          }
        }
      },
    ],
  };
});

// Define available resources
server.setRequestHandler(ListResourcesRequestSchema, async () => {
  return {
    resources: [
      {
        uri: 'digitaltwin://personal',
        name: 'Personal Information',
        description: 'Complete personal profile including contact details',
        mimeType: 'application/json',
      },
      {
        uri: 'digitaltwin://experience',
        name: 'Work Experience',
        description: 'All work experience with STAR achievements',
        mimeType: 'application/json',
      },
      {
        uri: 'digitaltwin://education',
        name: 'Education Background',
        description: 'Academic qualifications and coursework',
        mimeType: 'application/json',
      },
      {
        uri: 'digitaltwin://skills',
        name: 'Skills Portfolio',
        description: 'All technical and business skills',
        mimeType: 'application/json',
      },
      {
        uri: 'digitaltwin://full-profile',
        name: 'Complete Profile',
        description: 'Full digital twin data including all sections',
        mimeType: 'application/json',
      },
    ],
  };
});

// Handle resource reads
server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const uri = request.params.uri;
  
  let content: PersonalInfo | WorkExperience[] | Education[] | Skills | DigitalTwinData;
  switch (uri) {
    case 'digitaltwin://personal':
      content = digitalTwinData.personal;
      break;
    case 'digitaltwin://experience':
      content = digitalTwinData.experience;
      break;
    case 'digitaltwin://education':
      content = digitalTwinData.education;
      break;
    case 'digitaltwin://skills':
      content = digitalTwinData.skills;
      break;
    case 'digitaltwin://full-profile':
      content = digitalTwinData;
      break;
    default:
      throw new Error(`Unknown resource: ${uri}`);
  }
  
  return {
    contents: [
      {
        uri,
        mimeType: 'application/json',
        text: JSON.stringify(content, null, 2),
      },
    ],
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      // Original digital twin tools
      case 'get_personal_info':
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(digitalTwinData.personal, null, 2),
            },
          ],
        };

      case 'get_work_experience': {
        const { company } = args as GetWorkExperienceArgs;
        let experience = digitalTwinData.experience;
        if (company) {
          experience = experience.filter(exp =>
            exp.company.toLowerCase().includes(company.toLowerCase())
          );
        }
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(experience, null, 2),
            },
          ],
        };
      }

      case 'get_education':
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(digitalTwinData.education, null, 2),
            },
          ],
        };

      case 'get_skills': {
        const { category } = args as GetSkillsArgs;
        let skills: Skills | Partial<Skills> = digitalTwinData.skills;
        if (category) {
          skills = { [category]: digitalTwinData.skills[category] };
        }
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(skills, null, 2),
            },
          ],
        };
      }

      case 'get_projects':
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(digitalTwinData.projects, null, 2),
            },
          ],
        };

      case 'get_interview_prep': {
        const { section } = args as GetInterviewPrepArgs;
        let prep: InterviewPrep | Partial<InterviewPrep> = digitalTwinData.interview_prep;
        if (section) {
          prep = { [section]: digitalTwinData.interview_prep[section] };
        }
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(prep, null, 2),
            },
          ],
        };
      }

      case 'search_experience': {
        const typedArgs = args as unknown as SearchExperienceArgs;
        const keywordLower = typedArgs.keyword.toLowerCase();
        const matchedExperience = digitalTwinData.experience.filter(exp => {
          const searchText = JSON.stringify(exp).toLowerCase();
          return searchText.includes(keywordLower);
        });
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(matchedExperience, null, 2),
            },
          ],
        };
      }

      case 'generate_resume_summary': {
        const typedArgs = args as unknown as GenerateResumeSummaryArgs;
        const { job_title, focus_areas = [] } = typedArgs;

        // Extract relevant experience and skills
        const allSkills = [
          ...digitalTwinData.skills.programming_languages,
          ...digitalTwinData.skills.ai_ml_skills,
          ...digitalTwinData.skills.business_skills,
          ...digitalTwinData.skills.financial_accounting,
        ];

        const relevantSkills = focus_areas.length > 0
          ? allSkills.filter(skill =>
              focus_areas.some(area =>
                skill.toLowerCase().includes(area.toLowerCase())
              )
            )
          : allSkills.slice(0, 10);

        const summary = {
          job_title,
          candidate: digitalTwinData.personal.name,
          title: digitalTwinData.personal.title,
          summary: digitalTwinData.personal.summary,
          elevator_pitch: digitalTwinData.personal.elevator_pitch,
          key_skills: relevantSkills,
          total_experience_years: 2,
          education_highlight: `${digitalTwinData.education[0].degree} in ${digitalTwinData.education[0].field_of_study} (${digitalTwinData.education[0].grade})`,
          recent_company: digitalTwinData.experience[0].company,
          recent_role: digitalTwinData.experience[0].position,
        };

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(summary, null, 2),
            },
          ],
        };
      }

      // New interview preparation tools
      case 'scrape_seek_jobs': {
        const typedArgs = args as unknown as ScrapeJobsArgs;
        const maxJobs = typedArgs.max_jobs || 50;
        console.error(`Starting job scrape for ${maxJobs} Business Analyst positions...`);
        const results = await runSeekScraper(maxJobs);
        return {
          content: [
            {
              type: 'text',
              text: `Successfully scraped ${results.length} Business Analyst job listings from Seek.com.au across Australia.`,
            },
          ],
        };
      }

      case 'get_job_analysis': {
        const typedArgs = args as unknown as GetJobAnalysisArgs;
        const job = jobData.find(j => j.id === typedArgs.job_id);
        if (!job) {
          throw new Error('Job not found');
        }

        const analysis = analyzeJobFit(job);
        return {
          content: [
            {
              type: 'text',
              text: `Job Analysis for ${job.title} at ${job.company}:\n\n${analysis}`,
            },
          ],
        };
      }

      case 'start_interview_simulation': {
        const typedArgs = args as unknown as StartInterviewSimulationArgs;
        const job = jobData.find(j => j.id === typedArgs.job_id);
        if (!job) {
          throw new Error('Job not found');
        }

        const questions = generateInterviewQuestions(job, 'junior');
        const session: InterviewSession = {
          id: Date.now().toString(),
          jobId: typedArgs.job_id,
          startTime: new Date().toISOString(),
          duration: 30,
          questions,
          responses: [],
          metrics: {
            accuracy: 0,
            storyCoverage: 0,
            userSatisfaction: 0,
          },
        };

        await saveInterviewSession(session);
        return {
          content: [
            {
              type: 'text',
              text: `Started 30-minute Junior Business Analyst interview simulation for job ${typedArgs.job_id}.\n\nSession ID: ${session.id}\n\nReady to begin with ${Object.keys(session.questions).length} question categories.`,
            },
          ],
        };
      }

      case 'evaluate_response': {
        const typedArgs = args as unknown as EvaluateResponseArgs;
        const evaluation = evaluateResponse(
          typedArgs.question,
          typedArgs.response,
          typedArgs.question_type
        );

        updateMetrics(
          evaluation.accuracy,
          evaluation.storyCoverage,
          evaluation.userSatisfaction
        );

        return {
          content: [
            {
              type: 'text',
              text: `Response Evaluation:\n- Accuracy: ${(evaluation.accuracy * 100).toFixed(1)}%\n- Story Coverage: ${(evaluation.storyCoverage * 100).toFixed(1)}%\n- User Satisfaction: ${(evaluation.userSatisfaction * 100).toFixed(1)}%`,
            },
          ],
        };
      }

      case 'get_personalized_response': {
        const typedArgs = args as unknown as GetPersonalizedResponseArgs;
        const response = getPersonalizedResponse(typedArgs.query, typedArgs.context);
        return {
          content: [
            {
              type: 'text',
              text: response,
            },
          ],
        };
      }

      case 'get_performance_metrics':
        return {
          content: [
            {
              type: 'text',
              text: `Current Performance Metrics:\n- Overall Accuracy: ${(performanceMetrics.accuracy * 100).toFixed(1)}%\n- Story Coverage: ${(performanceMetrics.storyCoverage * 100).toFixed(1)}%\n- User Satisfaction: ${(performanceMetrics.userSatisfaction * 100).toFixed(1)}%\n- Total Responses: ${performanceMetrics.totalResponses}`,
            },
          ],
        };

      // Phase 3 tool handlers
      case 'run_ab_test': {
        const typedArgs = args as any;
        const questionId = typedArgs.questionId;
        const question = typedArgs.question;
        const contextObj = typedArgs.context || {};
        const controlVariantId = typedArgs.controlVariantId;
        const testVariantId = typedArgs.testVariantId;

        const session = await abFramework.runTest(questionId, question, contextObj, controlVariantId, testVariantId);

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(session, null, 2),
            },
          ],
        };
      }

      case 'get_analytics_report': {
        const typedArgs = args as any;
        const period = (typedArgs && typedArgs.period) || 'daily';
        const report = analytics.generateReport(period as any);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(report, null, 2),
            },
          ],
        };
      }

      case 'get_variant_performance': {
        const typedArgs = args as any;
        const variantId = typedArgs.variantId;
        const stats = abFramework.getVariantStatistics(variantId);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(stats, null, 2),
            },
          ],
        };
      }

      case 'record_performance': {
        const typedArgs = args as any;
        const accuracy = Number(typedArgs.accuracy) || 0;
        const storyCoverage = Number(typedArgs.storyCoverage) || 0;
        const satisfaction = Number(typedArgs.satisfaction) || 0;
        const responseTime = Number(typedArgs.responseTime) || 0;
        const category = typedArgs.category || 'unknown';

        await analytics.recordSnapshot(accuracy, storyCoverage, satisfaction, responseTime, category);
        updateMetrics(accuracy, storyCoverage, satisfaction);

        return {
          content: [
            {
              type: 'text',
              text: `Recorded performance snapshot: accuracy=${accuracy}, storyCoverage=${storyCoverage}, satisfaction=${satisfaction}, responseTime=${responseTime}, category=${category}`,
            },
          ],
        };
      }

      case 'get_personalized_recommendations': {
        const typedArgs = args as any;
        const period = (typedArgs && typedArgs.period) || 'weekly';
        const includeAnalytics = typedArgs && typedArgs.includeAnalytics;
        const report = analytics.generateReport(period as any);
        const recommendations = report.recommendations || [];

        const payload: any = { recommendations };
        if (includeAnalytics) payload.report = report;

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(payload, null, 2),
            },
          ],
        };
      }

      case 'get_next_milestones': {
        const typedArgs = args as any;
        const numberOfMilestones = Number(typedArgs?.numberOfMilestones) || 5;
        const period = (typedArgs && typedArgs.period) || 'weekly';
        const report = analytics.generateReport(period as any);
        const milestones = (report.nextMilestones || []).slice(0, numberOfMilestones);

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ milestones }, null, 2),
            },
          ],
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return {
      content: [
        {
          type: 'text',
          text: `Error: ${errorMessage}`,
        },
      ],
      isError: true,
    };
  }
});

// Start server
async function main(): Promise<void> {
  await loadData();
  await loadJobData();
  await loadInterviewSessions();
  await loadPerformanceMetrics();

  // Initialize A/B testing framework and analytics system
  try {
    await abFramework.initialize();
  } catch (err) {
    console.error('✗ Failed to initialize A/B testing framework:', err);
  }

  try {
    await analytics.initialize();
  } catch (err) {
    console.error('✗ Failed to initialize analytics system:', err);
  }

  const transport = new StdioServerTransport();
  await server.connect(transport);

  console.error('Douglas Mo Digital Twin MCP Server running on stdio');
  console.error('Available tools: 14 (8 original + 6 interview prep)');
  console.error('Available resources: 5');
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
