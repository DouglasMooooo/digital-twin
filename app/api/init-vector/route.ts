/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { Index } from '@upstash/vector';
import digitalTwinData from '../../../digitaltwin.json';

// Initialize Upstash Vector client
const vectorIndex = new Index({
  url: process.env.UPSTASH_VECTOR_REST_URL || '',
  token: process.env.UPSTASH_VECTOR_REST_TOKEN || '',
});

interface VectorRecord {
  id: string;
  vector: number[];
  metadata: {
    type: string;
    category?: string;
    content: string;
    [key: string]: unknown;
  };
}

// Simple embedding function (returns normalized character-based vector)
function simpleEmbed(text: string): number[] {
  const vector = new Array(384).fill(0);
  for (let i = 0; i < Math.min(text.length, 384); i++) {
    vector[i] = text.charCodeAt(i) / 255; // Normalize to [0,1]
  }
  return vector;
}

/**
 * Initialize Vector Database
 * Populates Upstash Vector with digital twin data
 */
export async function POST() {
  try {
    const records: VectorRecord[] = [];

    // Add personal info
    if (digitalTwinData.personal) {
      const personalText = `Name: ${digitalTwinData.personal.name}. Email: ${digitalTwinData.personal.email}. Location: ${digitalTwinData.personal.location}. Phone: ${digitalTwinData.personal.phone}`;
      records.push({
        id: 'personal-info',
        vector: simpleEmbed(personalText),
        metadata: {
          type: 'personal',
          content: personalText,
        },
      });
    }

    // Add summary
    if (digitalTwinData.summary) {
      records.push({
        id: 'summary',
        vector: simpleEmbed(digitalTwinData.summary),
        metadata: {
          type: 'summary',
          content: digitalTwinData.summary,
        },
      });
    }

    // Add experiences
    digitalTwinData.experience?.forEach((exp, index) => {
      const expText = `${exp.position} at ${exp.company} (${exp.duration}). ${exp.description}. Key achievements: ${exp.achievements?.join(', ')}`;
      records.push({
        id: `experience-${index}`,
        vector: simpleEmbed(expText),
        metadata: {
          type: 'experience',
          category: exp.position,
          content: expText,
          company: exp.company,
          position: exp.position,
        },
      });
    });

    // Add education
    digitalTwinData.education?.forEach((edu, index) => {
      const eduText = `${edu.degree} in ${edu.field} from ${edu.institution} (${edu.duration}). GPA: ${edu.gpa}`;
      records.push({
        id: `education-${index}`,
        vector: simpleEmbed(eduText),
        metadata: {
          type: 'education',
          category: edu.degree,
          content: eduText,
        },
      });
    });

    // Add skills
    digitalTwinData.skills?.technical?.forEach((skill, index) => {
      records.push({
        id: `skill-technical-${index}`,
        vector: simpleEmbed(skill),
        metadata: {
          type: 'skill',
          category: 'technical',
          content: skill,
        },
      });
    });

    digitalTwinData.skills?.soft?.forEach((skill, index) => {
      records.push({
        id: `skill-soft-${index}`,
        vector: simpleEmbed(skill),
        metadata: {
          type: 'skill',
          category: 'soft',
          content: skill,
        },
      });
    });

    // Add certifications
    digitalTwinData.certifications?.forEach((cert, index) => {
      const certText = `${cert.name} by ${cert.issuer} (${cert.date})`;
      records.push({
        id: `certification-${index}`,
        vector: simpleEmbed(certText),
        metadata: {
          type: 'certification',
          content: certText,
        },
      });
    });

    // Add behavioral stories
    digitalTwinData.behavioral_stories?.forEach((story, index) => {
      const storyText = `${story.question}. Situation: ${story.situation}. Task: ${story.task}. Action: ${story.action}. Result: ${story.result}`;
      records.push({
        id: `story-${index}`,
        vector: simpleEmbed(storyText),
        metadata: {
          type: 'behavioral_story',
          category: story.category,
          content: storyText,
        },
      });
    });

    // Batch upsert (Upstash supports up to 1000 records per request)
    const batchSize = 100;
    for (let i = 0; i < records.length; i += batchSize) {
      const batch = records.slice(i, i + batchSize);
      await vectorIndex.upsert(batch);
    }

    return NextResponse.json({
      success: true,
      message: `Initialized vector database with ${records.length} records`,
      recordCount: records.length,
    });
  } catch (error: unknown) {
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
