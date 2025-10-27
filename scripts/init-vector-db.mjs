/**
 * Script to initialize Upstash Vector database with digital twin data
 * Run this: node scripts/init-vector-db.mjs
 */

import { Index } from '@upstash/vector';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../.env') });

// Read digital twin data
const digitalTwinData = JSON.parse(
  readFileSync(join(__dirname, '../digitaltwin.json'), 'utf-8')
);

// Initialize Upstash Vector client
const vectorIndex = new Index({
  url: process.env.UPSTASH_VECTOR_REST_URL,
  token: process.env.UPSTASH_VECTOR_REST_TOKEN,
});

/**
 * Generate text chunks from digital twin data
 */
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

  // Projects
  digitalTwinData.projects_portfolio.forEach((project) => {
    chunks.push({
      id: `project-${chunkId++}`,
      type: 'project',
      content: `Project: ${project.name}. Description: ${project.description}. Technologies: ${project.technologies.join(', ')}. Impact: ${project.impact}. ${project.key_features ? 'Features: ' + project.key_features.join('. ') : ''}`,
      source: `Project - ${project.name}`,
    });
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

  return chunks;
}

/**
 * Initialize vector database
 */
async function initializeVectorDB() {
  const chunks = generateChunks();
  
  console.log(`✅ Generated ${chunks.length} chunks for vector storage`);
  console.log(`📤 Uploading to Upstash Vector...`);

  let successCount = 0;
  let errorCount = 0;

  // Upsert chunks to Upstash Vector with delay to avoid rate limits
  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
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
      successCount++;
      if (successCount % 5 === 0) {
        console.log(`   Uploaded ${successCount}/${chunks.length} chunks...`);
      }
      // Small delay to avoid rate limits
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (error) {
      console.error(`   ❌ Error upserting chunk ${chunk.id}:`, error.message);
      errorCount++;
      // Continue even if one fails
    }
  }

  console.log(`\n✅ Vector database initialized!`);
  console.log(`   Success: ${successCount} chunks`);
  if (errorCount > 0) {
    console.log(`   Errors: ${errorCount} chunks`);
  }
}

// Main execution
async function main() {
  console.log('🚀 Starting vector database initialization...\n');
  
  // Verify environment variables
  if (!process.env.UPSTASH_VECTOR_REST_URL || !process.env.UPSTASH_VECTOR_REST_TOKEN) {
    console.error('❌ Error: Missing Upstash Vector credentials!');
    console.error('Please check your .env file has:');
    console.error('  - UPSTASH_VECTOR_REST_URL');
    console.error('  - UPSTASH_VECTOR_REST_TOKEN');
    process.exit(1);
  }
  
  try {
    await initializeVectorDB();
    console.log('\n🎉 You can now use the AI chat feature!');
    console.log('   Visit: http://localhost:3000');
  } catch (error) {
    console.error('\n❌ Error initializing vector database:', error);
    process.exit(1);
  }
}

main();
