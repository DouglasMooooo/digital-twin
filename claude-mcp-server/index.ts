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

// Global variable for digital twin data
let digitalTwinData: DigitalTwinData;

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
  
  const transport = new StdioServerTransport();
  await server.connect(transport);
  
  console.error('Douglas Mo Digital Twin MCP Server running on stdio');
  console.error('Available tools: 8');
  console.error('Available resources: 5');
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
