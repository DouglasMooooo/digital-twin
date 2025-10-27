import { Index } from '@upstash/vector';
import digitalTwinData from '../digitaltwin.json' assert { type: 'json' };

// Initialize Upstash Vector client
export const vectorIndex = new Index({
  url: process.env.UPSTASH_VECTOR_REST_URL || '',
  token: process.env.UPSTASH_VECTOR_REST_TOKEN || '',
});

// Types for vector data
export interface VectorMetadata {
  id: string;
  type: 'experience' | 'skill' | 'project' | 'education' | 'interview_prep' | 'personal';
  content: string;
  source: string;
  category?: string;
}

/**
 * Generate text chunks from digital twin data for vector storage
 */
export function generateChunks(): VectorMetadata[] {
  const chunks: VectorMetadata[] = [];
  let chunkId = 0;

  // Personal information
  chunks.push({
    id: `personal-${chunkId++}`,
    type: 'personal',
    content: `Name: ${digitalTwinData.personal.name}. Title: ${digitalTwinData.personal.title}. Location: ${digitalTwinData.personal.location}. Summary: ${digitalTwinData.personal.summary}. Elevator Pitch: ${digitalTwinData.personal.elevator_pitch}`,
    source: 'Personal Information',
  });

  // Experience - STAR format
  digitalTwinData.experience.forEach((exp) => {
    // Company overview
    chunks.push({
      id: `exp-overview-${chunkId++}`,
      type: 'experience',
      content: `${exp.title} at ${exp.company} (${exp.duration}). ${exp.company_context}. Team: ${exp.team_structure}. Skills: ${exp.technical_skills_used.join(', ')}.`,
      source: `${exp.company} - ${exp.title}`,
      category: 'overview',
    });

    // Each STAR achievement
    exp.achievements_star.forEach((achievement, idx) => {
      chunks.push({
        id: `exp-star-${exp.company}-${chunkId++}`,
        type: 'experience',
        content: `STAR Example from ${exp.company}: Situation: ${achievement.situation}. Task: ${achievement.task}. Action: ${achievement.action}. Result: ${achievement.result}`,
        source: `${exp.company} - Achievement ${idx + 1}`,
        category: 'achievement',
      });
    });

    // Leadership examples
    if (exp.leadership_examples && exp.leadership_examples.length > 0) {
      chunks.push({
        id: `exp-leadership-${exp.company}-${chunkId++}`,
        type: 'experience',
        content: `Leadership at ${exp.company}: ${exp.leadership_examples.join('. ')}`,
        source: `${exp.company} - Leadership`,
        category: 'leadership',
      });
    }
  });

  // Technical skills
  const techSkills = digitalTwinData.skills.technical;
  techSkills.programming_languages.forEach((lang) => {
    chunks.push({
      id: `skill-lang-${chunkId++}`,
      type: 'skill',
      content: `Programming Language: ${lang.language} with ${lang.years} years experience. Proficiency: ${lang.proficiency}. Frameworks: ${lang.frameworks.join(', ')}. Use cases: ${lang.use_cases.join(', ')}.`,
      source: `Technical Skills - ${lang.language}`,
      category: 'programming',
    });
  });

  // AI/ML skills
  chunks.push({
    id: `skill-ai-${chunkId++}`,
    type: 'skill',
    content: `AI/ML Skills: ${techSkills.ai_ml.join('. ')}`,
    source: 'Technical Skills - AI/ML',
    category: 'ai_ml',
  });

  // Databases
  chunks.push({
    id: `skill-db-${chunkId++}`,
    type: 'skill',
    content: `Database Experience: ${techSkills.databases.join('. ')}`,
    source: 'Technical Skills - Databases',
    category: 'databases',
  });

  // Cloud platforms
  chunks.push({
    id: `skill-cloud-${chunkId++}`,
    type: 'skill',
    content: `Cloud Platforms: ${techSkills.cloud_platforms.join('. ')}`,
    source: 'Technical Skills - Cloud',
    category: 'cloud',
  });

  // Soft skills
  chunks.push({
    id: `skill-soft-${chunkId++}`,
    type: 'skill',
    content: `Soft Skills: ${digitalTwinData.skills.soft_skills.join(', ')}`,
    source: 'Soft Skills',
    category: 'soft_skills',
  });

  // Projects
  digitalTwinData.projects_portfolio.forEach((project) => {
    chunks.push({
      id: `project-${chunkId++}`,
      type: 'project',
      content: `Project: ${project.name}. Description: ${project.description}. Technologies: ${project.technologies.join(', ')}. Impact: ${project.impact}. ${project.key_features ? 'Features: ' + project.key_features.join('. ') : ''}`,
      source: `Project - ${project.name}`,
    });
  });

  // Education
  chunks.push({
    id: `edu-current-${chunkId++}`,
    type: 'education',
    content: `Current Education: ${digitalTwinData.education.current.degree} at ${digitalTwinData.education.current.university}. Expected graduation: ${digitalTwinData.education.current.expected_graduation}. Courses: ${digitalTwinData.education.current.relevant_coursework.join(', ')}.`,
    source: 'Education - Current',
  });

  chunks.push({
    id: `edu-undergrad-${chunkId++}`,
    type: 'education',
    content: `Undergraduate: ${digitalTwinData.education.undergraduate.degree} from ${digitalTwinData.education.undergraduate.university}, graduated ${digitalTwinData.education.undergraduate.graduation_year}. Courses: ${digitalTwinData.education.undergraduate.relevant_coursework.join(', ')}.`,
    source: 'Education - Undergraduate',
  });

  // Interview prep - Behavioral questions
  digitalTwinData.interview_prep.common_questions.behavioral.forEach((q, idx) => {
    chunks.push({
      id: `interview-behavioral-${chunkId++}`,
      type: 'interview_prep',
      content: `Behavioral Interview Question: ${q.question}. STAR Answer - Situation: ${q.star_answer.situation}. Task: ${q.star_answer.task}. Action: ${q.star_answer.action}. Result: ${q.star_answer.result}`,
      source: `Interview Prep - Behavioral ${idx + 1}`,
      category: 'behavioral',
    });
  });

  // Interview prep - Technical questions
  digitalTwinData.interview_prep.common_questions.technical.forEach((q, idx) => {
    chunks.push({
      id: `interview-technical-${chunkId++}`,
      type: 'interview_prep',
      content: `Technical Interview Question: ${q.question}. Answer: ${q.answer}`,
      source: `Interview Prep - Technical ${idx + 1}`,
      category: 'technical',
    });
  });

  // Career goals
  chunks.push({
    id: `career-goals-${chunkId++}`,
    type: 'personal',
    content: `Career Goals - Short term: ${digitalTwinData.career_goals.short_term}. Long term: ${digitalTwinData.career_goals.long_term}. Learning focus: ${digitalTwinData.career_goals.learning_focus.join(', ')}. Interested industries: ${digitalTwinData.career_goals.industries_interested.join(', ')}.`,
    source: 'Career Goals',
  });

  // Unique value propositions
  chunks.push({
    id: `uvp-${chunkId++}`,
    type: 'personal',
    content: `Unique Value Propositions: ${digitalTwinData.unique_value_propositions.join('. ')}`,
    source: 'Value Propositions',
  });

  return chunks;
}

/**
 * Search vector database for relevant context
 */
export async function searchRelevantContext(
  query: string,
  topK: number = 5,
  filter?: { type?: string; category?: string }
): Promise<VectorMetadata[]> {
  try {
    // In production, you would query the actual vector database
    // For now, we'll use the Upstash Vector query method
    const results = await vectorIndex.query({
      data: query,
      topK,
      includeMetadata: true,
      filter: filter ? JSON.stringify(filter) : undefined,
    });

    return results.map((result) => result.metadata as VectorMetadata);
  } catch (error) {
    console.error('Error searching vector database:', error);
    return [];
  }
}

/**
 * Initialize vector database with chunks (run once during setup)
 */
export async function initializeVectorDB() {
  const chunks = generateChunks();
  
  console.log(`Generated ${chunks.length} chunks for vector storage`);

  // Upsert chunks to Upstash Vector
  // Note: In production, you'd batch this and use proper embedding generation
  for (const chunk of chunks) {
    try {
      await vectorIndex.upsert({
        id: chunk.id,
        data: chunk.content, // Upstash will auto-generate embeddings
        metadata: {
          type: chunk.type,
          source: chunk.source,
          category: chunk.category || '',
        },
      });
    } catch (error) {
      console.error(`Error upserting chunk ${chunk.id}:`, error);
    }
  }

  console.log('Vector database initialized successfully');
}
