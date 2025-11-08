#!/usr/bin/env node

import { Index } from '@upstash/vector';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env.local') });

// Initialize Upstash Vector using official SDK
const index = new Index({
  url: process.env.UPSTASH_VECTOR_REST_URL,
  token: process.env.UPSTASH_VECTOR_REST_TOKEN,
});

// Load digitaltwin.json
const digitalTwinPath = path.join(__dirname, '../digitaltwin.json');
const digitalTwinData = JSON.parse(fs.readFileSync(digitalTwinPath, 'utf-8'));

// Generate chunks (same logic as lib/vectordb.ts)
function generateChunks() {
  const chunks = [];
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
    if (exp.achievements_star && Array.isArray(exp.achievements_star)) {
      exp.achievements_star.forEach((achievement, idx) => {
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
  const techSkills = digitalTwinData.skills.technical;
  if (techSkills.programming_languages) {
    techSkills.programming_languages.forEach((lang) => {
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
  if (digitalTwinData.projects && Array.isArray(digitalTwinData.projects)) {
    digitalTwinData.projects.forEach((project) => {
      chunks.push({
        id: `project-${chunkId++}`,
        type: 'project',
        content: `Project: ${project.name}. Description: ${project.description}. Technologies: ${project.technologies.join(', ')}. Results: ${project.results}`,
        source: `Projects - ${project.name}`,
        category: 'project',
      });
    });
  }

  console.log(`✅ Generated ${chunks.length} chunks`);
  return chunks;
}

// Generate random embeddings (same as text for determinism)
function generateEmbedding(text) {
  // Using a deterministic but random-looking embedding
  const vec = [];
  let hash = 0;
  
  for (let i = 0; i < text.length; i++) {
    const char = text.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }

  for (let i = 0; i < 384; i++) {
    hash = (hash * 9301 + 49297) % 233280;
    vec.push((hash / 233280) * 2 - 1); // Range [-1, 1]
  }

  return vec;
}

// Main initialization function
async function initializeVectorDB() {
  try {
    console.log('🚀 Starting Vector DB Initialization...');
    console.log(`URL: ${process.env.UPSTASH_VECTOR_REST_URL}`);

    const chunks = generateChunks();
    
    console.log('📤 Uploading chunks to Upstash Vector...');
    
    let successCount = 0;
    let failCount = 0;

    for (const chunk of chunks) {
      try {
        const embedding = generateEmbedding(chunk.content);
        
        // Upsert to Upstash using SDK
        await index.upsert([
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
        console.log(`✅ ${chunk.id}`);
      } catch (err) {
        failCount++;
        console.log(`❌ ${chunk.id}: ${err.message}`);
      }
    }

    console.log(`\n📊 Results: ${successCount} successful, ${failCount} failed`);
    
    if (successCount > 0) {
      console.log('🎉 Vector DB initialization complete!');
      process.exit(0);
    } else {
      console.log('❌ All uploads failed');
      process.exit(1);
    }
  } catch (err) {
    console.error('❌ Error:', err.message);
    console.error(err);
    process.exit(1);
  }
}

initializeVectorDB();
