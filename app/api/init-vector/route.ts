/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { Index } from '@upstash/vector';
import digitalTwinData from '../../../digitaltwin.json';

// Initialize Upstash Vector client
const client = new Index({
  url: process.env.UPSTASH_VECTOR_REST_URL!,
  token: process.env.UPSTASH_VECTOR_REST_TOKEN!,
});

export async function POST() {
  try {
    console.log('Starting vector database initialization...');

    // Get all experience, skills, and projects from digitaltwin.json
    const { experience = [], skills = [], projects = [], education = [] } = digitalTwinData as any;

    // Prepare documents to upsert (combine all text data)
    const documents: Array<{ id: string; data: string; metadata?: Record<string, any> }> = [];

    // Add experience to documents
    experience.forEach((exp: any, index: number) => {
      const expText = `
        Experience: ${exp.title} at ${exp.company}
        Duration: ${exp.duration}
        Description: ${exp.description || ''}
        Responsibilities: ${exp.key_responsibilities?.join(', ') || ''}
        Achievements: ${exp.achievements?.join(', ') || ''}
        Skills: ${exp.skills?.join(', ') || ''}
      `;

      documents.push({
        id: `exp-${index}`,
        data: expText,
        metadata: {
          type: 'experience',
          company: exp.company,
          title: exp.title,
          duration: exp.duration,
        },
      });
    });

    // Add skills to documents
    skills.forEach((skill: any, index: number) => {
      const skillText = `
        Skill Category: ${skill.category}
        Skills: ${skill.names?.join(', ') || ''}
      `;

      documents.push({
        id: `skill-${index}`,
        data: skillText,
        metadata: {
          type: 'skills',
          category: skill.category,
        },
      });
    });

    // Add projects to documents
    projects.forEach((project: any, index: number) => {
      const projectText = `
        Project: ${project.name}
        Description: ${project.description || ''}
        Technologies: ${project.technologies?.join(', ') || ''}
        Outcomes: ${project.outcomes?.join(', ') || ''}
      `;

      documents.push({
        id: `proj-${index}`,
        data: projectText,
        metadata: {
          type: 'project',
          name: project.name,
          technologies: project.technologies,
        },
      });
    });

    // Add education to documents
    education.forEach((edu: any, index: number) => {
      const eduText = `
        Education: ${edu.degree} in ${edu.field}
        Institution: ${edu.institution}
        Graduation: ${edu.graduation_date}
        Highlights: ${edu.highlights?.join(', ') || ''}
      `;

      documents.push({
        id: `edu-${index}`,
        data: eduText,
        metadata: {
          type: 'education',
          institution: edu.institution,
          degree: edu.degree,
        },
      });
    });

    // Upsert documents to Upstash Vector
    console.log(`Upserting ${documents.length} documents...`);

    // Process in batches to avoid rate limiting
    const batchSize = 10;
    for (let i = 0; i < documents.length; i += batchSize) {
      const batch = documents.slice(i, i + batchSize);
      try {
        await client.upsert(
          batch.map((doc) => ({
            id: doc.id,
            data: doc.data,
            metadata: doc.metadata,
          }))
        );
        console.log(`Processed batch ${Math.floor(i / batchSize) + 1}`);
      } catch (error) {
        console.error(`Error upserting batch ${Math.floor(i / batchSize) + 1}:`, error);
      }
    }

    console.log('Vector database initialization completed');

    return NextResponse.json({
      success: true,
      message: `Successfully initialized vector database with ${documents.length} documents`,
    });
  } catch (error) {
    console.error('Error initializing vector database:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      },
      { status: 500 }
    );
  }
}
