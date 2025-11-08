const { Index } = require('@upstash/vector');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

console.log('🚀 Vector DB Initialization Starting...');
console.log('URL:', process.env.UPSTASH_VECTOR_REST_URL ? 'Set ✓' : 'Missing ✗');
console.log('Token:', process.env.UPSTASH_VECTOR_REST_TOKEN ? 'Set ✓' : 'Missing ✗');

if (!process.env.UPSTASH_VECTOR_REST_URL || !process.env.UPSTASH_VECTOR_REST_TOKEN) {
  console.error('❌ Missing Upstash credentials');
  process.exit(1);
}

const index = new Index({
  url: process.env.UPSTASH_VECTOR_REST_URL,
  token: process.env.UPSTASH_VECTOR_REST_TOKEN,
});

// Load digitaltwin.json
let digitalTwinData;
try {
  digitalTwinData = JSON.parse(fs.readFileSync(path.join(__dirname, '../digitaltwin.json'), 'utf-8'));
  console.log('✓ Loaded digitaltwin.json');
} catch (e) {
  console.error('❌ Failed to load digitaltwin.json:', e.message);
  process.exit(1);
}

function generateChunks() {
  const chunks = [];
  let chunkId = 0;

  // Personal
  chunks.push({
    id: `personal-${chunkId++}`,
    type: 'personal',
    content: `Name: ${digitalTwinData.personal.name}. Title: ${digitalTwinData.personal.title}. Location: ${digitalTwinData.personal.location}. Summary: ${digitalTwinData.personal.summary}. Elevator Pitch: ${digitalTwinData.personal.elevator_pitch}`,
    source: 'Personal Information',
  });

  // Experience
  digitalTwinData.experience.forEach((exp) => {
    chunks.push({
      id: `exp-overview-${chunkId++}`,
      type: 'experience',
      content: `${exp.title} at ${exp.company} (${exp.duration}). ${exp.company_context}. Team: ${exp.team_structure}. Skills: ${exp.technical_skills_used.join(', ')}.`,
      source: `${exp.company} - ${exp.title}`,
      category: 'overview',
    });

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

  // Skills
  const techSkills = digitalTwinData.skills?.technical;
  if (techSkills?.programming_languages) {
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

  return chunks;
}

function generateEmbedding(text) {
  const vec = [];
  let hash = 0;

  for (let i = 0; i < text.length; i++) {
    const char = text.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }

  for (let i = 0; i < 384; i++) {
    hash = (hash * 9301 + 49297) % 233280;
    vec.push((hash / 233280) * 2 - 1);
  }

  return vec;
}

async function main() {
  try {
    const chunks = generateChunks();
    console.log(`\n✅ Generated ${chunks.length} chunks`);

    let successCount = 0;
    let failureCount = 0;

    console.log('\n📤 Uploading to Upstash Vector...\n');

    for (const chunk of chunks) {
      try {
        const embedding = generateEmbedding(chunk.content);
        
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
        console.log(`   ✅ ${chunk.id}`);
      } catch (error) {
        failureCount++;
        console.log(`   ❌ ${chunk.id}: ${error.message}`);
      }
    }

    console.log(`\n📊 Summary: ${successCount} successful, ${failureCount} failed`);

    if (successCount > 0) {
      console.log('\n🎉 Vector DB initialization successful!');
      process.exit(0);
    } else {
      console.log('\n❌ All uploads failed!');
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
    process.exit(1);
  }
}

main();
