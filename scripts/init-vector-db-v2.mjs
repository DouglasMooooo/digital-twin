/**
 * Improved script to initialize Upstash Vector database with digital twin data
 * Run this: node scripts/init-vector-db-v2.mjs
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
      const category = achievement.category || `Achievement ${idx + 1}`;
      chunks.push({
        id: `exp-star-${exp.company.replace(/\s+/g, '-')}-${chunkId++}`,
        type: 'experience',
        content: `STAR Example from ${exp.company} (${achievement.category}): Situation: ${achievement.situation}. Task: ${achievement.task}. Action: ${achievement.action}. Result: ${achievement.result}. Metrics: ${JSON.stringify(achievement.metrics || {})}`,
        source: `${exp.company} - ${category}`,
        category: 'achievement',
      });
    });

    // Leadership examples
    if (exp.leadership_examples && exp.leadership_examples.length > 0) {
      chunks.push({
        id: `exp-leadership-${exp.company.replace(/\s+/g, '-')}-${chunkId++}`,
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
        content: `Programming Language: ${lang.language} with ${lang.years_experience} years experience. Proficiency: ${lang.proficiency}. Frameworks: ${(lang.frameworks || []).join(', ')}.`,
        source: `Technical Skills - ${lang.language}`,
        category: 'programming',
      });
    });
  }

  // AI/ML skills
  if (techSkills.ai_ml) {
    chunks.push({
      id: `skill-ai-${chunkId++}`,
      type: 'skill',
      content: `AI/ML Skills: ${(techSkills.ai_ml || []).join('. ')}`,
      source: 'Technical Skills - AI/ML',
      category: 'ai_ml',
    });
  }

  // Projects
  if (digitalTwinData.projects_portfolio) {
    digitalTwinData.projects_portfolio.forEach((project) => {
      chunks.push({
        id: `project-${chunkId++}`,
        type: 'project',
        content: `Project: ${project.name}. Description: ${project.description}. Technologies: ${(project.technologies || []).join(', ')}. Impact: ${project.impact}.`,
        source: `Project - ${project.name}`,
      });
    });
  }

  // Interview prep - Behavioral questions
  if (digitalTwinData.interview_prep && digitalTwinData.interview_prep.common_questions) {
    const behavioral = digitalTwinData.interview_prep.common_questions.behavioral || [];
    behavioral.forEach((q, idx) => {
      chunks.push({
        id: `interview-behavioral-${chunkId++}`,
        type: 'interview_prep',
        content: `Behavioral Interview Question: ${q.question}. STAR Answer - Situation: ${q.star_answer?.situation || ''}. Task: ${q.star_answer?.task || ''}. Action: ${q.star_answer?.action || ''}. Result: ${q.star_answer?.result || ''}`,
        source: `Interview Prep - Behavioral ${idx + 1}`,
        category: 'behavioral',
      });
    });
  }

  // Career goals
  if (digitalTwinData.career_goals) {
    chunks.push({
      id: `career-goals-${chunkId++}`,
      type: 'personal',
      content: `Career Goals - Short term: ${digitalTwinData.career_goals.short_term || ''}. Long term: ${digitalTwinData.career_goals.long_term || ''}. Learning focus: ${(digitalTwinData.career_goals.learning_focus || []).join(', ')}.`,
      source: 'Career Goals',
    });
  }

  return chunks;
}

/**
 * Retry logic with exponential backoff
 */
async function retryWithBackoff(fn, maxRetries = 3, baseDelay = 500) {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (attempt === maxRetries - 1) throw error;
      const delay = baseDelay * Math.pow(2, attempt);
      console.log(`   ⏳ Retry ${attempt + 1}/${maxRetries - 1} in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

/**
 * Initialize vector database with batch uploads
 */
async function initializeVectorDB() {
  const chunks = generateChunks();
  
  console.log(`✅ Generated ${chunks.length} chunks for vector storage\n`);
  console.log(`📤 Uploading to Upstash Vector...\n`);

  let successCount = 0;
  let errorCount = 0;
  const errors = [];

  // Upsert chunks with batch processing and retry
  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    try {
      await retryWithBackoff(async () => {
        await vectorIndex.upsert({
          id: chunk.id,
          data: chunk.content,
          metadata: {
            type: chunk.type,
            source: chunk.source,
            category: chunk.category || '',
          },
        });
      });
      
      successCount++;
      if ((i + 1) % 5 === 0 || i === chunks.length - 1) {
        console.log(`   ✅ Uploaded ${successCount}/${chunks.length} chunks (${Math.round((successCount / chunks.length) * 100)}%)`);
      }
      
      // Increased delay to avoid rate limits
      await new Promise(resolve => setTimeout(resolve, 200));
    } catch (error) {
      console.error(`   ❌ Error on chunk ${i + 1}/${chunks.length} (${chunk.id}):`, error.message);
      errorCount++;
      errors.push({ chunkId: chunk.id, error: error.message });
    }
  }

  return { successCount, errorCount, errors, totalChunks: chunks.length };
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
    const result = await initializeVectorDB();
    
    console.log(`\n${'='.repeat(60)}`);
    console.log(`✅ Vector database initialization complete!`);
    console.log(`${'='.repeat(60)}`);
    console.log(`   Total chunks: ${result.totalChunks}`);
    console.log(`   ✅ Successful: ${result.successCount}`);
    if (result.errorCount > 0) {
      console.log(`   ❌ Failed: ${result.errorCount}`);
      console.log(`\n   Failed chunks:`);
      result.errors.forEach(err => {
        console.log(`     - ${err.chunkId}: ${err.error}`);
      });
    }
    console.log(`${'='.repeat(60)}`);
    
    if (result.errorCount === 0) {
      console.log('\n🎉 All chunks uploaded successfully!');
      console.log('   You can now use the AI chat feature!');
      console.log('   Visit: http://localhost:3000');
    } else if (result.successCount > 0) {
      console.log('\n⚠️  Partial success - most chunks uploaded');
      console.log('   The system should still work, but some context may be missing');
    } else {
      process.exit(1);
    }
  } catch (error) {
    console.error('\n❌ Fatal error initializing vector database:', error);
    console.error('\nDebug info:');
    console.error('  - UPSTASH_VECTOR_REST_URL:', process.env.UPSTASH_VECTOR_REST_URL ? '✅ Set' : '❌ Missing');
    console.error('  - UPSTASH_VECTOR_REST_TOKEN:', process.env.UPSTASH_VECTOR_REST_TOKEN ? '✅ Set' : '❌ Missing');
    process.exit(1);
  }
}

main();
