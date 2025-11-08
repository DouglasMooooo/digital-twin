/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { getVectorIndex } from '@/lib/vectordb';
import digitalTwinData from '../../../digitaltwin.json';

interface VectorMetadata {
  id: string;
  type: 'experience' | 'skill' | 'project' | 'education' | 'personal';
  content: string;
  source: string;
  category?: string;
}

// Generate chunks from digital twin data
function generateChunks(): VectorMetadata[] {
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
  (digitalTwinData as any).experience.forEach((exp: any) => {
    // Company overview
    chunks.push({
      id: `exp-overview-${chunkId++}`,
      type: 'experience',
      content: `${exp.title} at ${exp.company} (${exp.duration}). ${exp.company_context}. Team: ${exp.team_structure}. Skills: ${exp.technical_skills_used.join(', ')}.`,
      source: `${exp.company} - ${exp.title}`,
      category: 'overview',
    });

    // Each STAR achievement
    if (exp.achievements_star && Array.isArray(exp.achievements_star)) {
      exp.achievements_star.forEach((achievement: any, idx: number) => {
        chunks.push({
          id: `exp-star-${chunkId++}`,
          type: 'experience',
          content: `STAR Example from ${exp.company}: Situation: ${achievement.situation}. Task: ${achievement.task}. Action: ${achievement.action}. Result: ${achievement.result}`,
          source: `${exp.company} - Achievement ${idx + 1}`,
          category: 'achievement',
        });
      });
    }

    // Leadership examples
    if (exp.leadership_examples && exp.leadership_examples.length > 0) {
      chunks.push({
        id: `exp-leadership-${chunkId++}`,
        type: 'experience',
        content: `Leadership at ${exp.company}: ${exp.leadership_examples.join('. ')}`,
        source: `${exp.company} - Leadership`,
        category: 'leadership',
      });
    }
  });

  // Technical skills
  const techSkills = (digitalTwinData as any).skills?.technical;
  if (techSkills?.programming_languages) {
    techSkills.programming_languages.forEach((lang: any) => {
      chunks.push({
        id: `skill-lang-${chunkId++}`,
        type: 'skill',
        content: `Programming Language: ${lang.language} with ${lang.years_experience} years experience. Proficiency: ${lang.proficiency}. Frameworks: ${lang.frameworks.join(', ')}. Use cases: ${lang.use_cases.join(', ')}.`,
        source: `Technical Skills - ${lang.language}`,
        category: 'programming',
      });
    });
  }

  // Projects
  const projects = (digitalTwinData as any).projects;
  if (projects && Array.isArray(projects)) {
    projects.forEach((project: any) => {
      chunks.push({
        id: `project-${chunkId++}`,
        type: 'project',
        content: `Project: ${project.name}. Description: ${project.description}. Technologies: ${project.technologies.join(', ')}. Results: ${project.results}`,
        source: `Projects - ${project.name}`,
        category: 'project',
      });
    });
  }

  return chunks;
}

// Generate deterministic embedding (1024 dimensions to match Upstash index)
function generateEmbedding(text: string): number[] {
  const vec: number[] = [];
  let hash = 0;

  for (let i = 0; i < text.length; i++) {
    const char = text.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }

  for (let i = 0; i < 1024; i++) {
    hash = (hash * 9301 + 49297) % 233280;
    vec.push((hash / 233280) * 2 - 1);
  }

  return vec;
}

export async function POST() {
  try {
    const vectorIndex = getVectorIndex();
    if (!vectorIndex) {
      return NextResponse.json({
        success: false,
        message: 'Vector DB credentials not configured. Skipping initialization.',
        stats: { total: 0, successful: 0, failed: 0 },
      }, { status: 503 });
    }

    const chunks = generateChunks();
    console.log(`📊 Generated ${chunks.length} chunks for vector DB`);

    let successCount = 0;
    // eslint-disable-next-line prefer-const
    let failedChunks: string[] = [];

    // Upload each chunk
    for (const chunk of chunks) {
      try {
        const embedding = generateEmbedding(chunk.content);

        await vectorIndex.upsert([
          {
            id: chunk.id,
            vector: embedding,
            metadata: {
              type: chunk.type,
              content: chunk.content,
              source: chunk.source,
              category: chunk.category || 'general',
            },
          },
        ]);

        successCount++;
      } catch (error) {
        failedChunks.push(`${chunk.id}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Vector DB initialized. ${successCount}/${chunks.length} chunks uploaded successfully`,
      stats: {
        total: chunks.length,
        successful: successCount,
        failed: failedChunks.length,
        failedChunks: failedChunks.slice(0, 5), // Show first 5 failures
      },
    });
  } catch (error) {
    console.error('❌ Vector DB initialization failed:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'POST to this endpoint to initialize vector database',
    method: 'POST',
    endpoint: '/api/init-vector',
  });
}
