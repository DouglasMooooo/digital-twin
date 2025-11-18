import { Groq } from '@/lib/llm';
import digitalTwinData from '@/digitaltwin.json';

interface Chunk {
  id: string;
  type: string;
  content: string;
  source: string;
}

let chunkId = 0;

export function generateChunks(): Chunk[] {
  const chunks: Chunk[] = [];

  // Personal info
  chunks.push({
    id: `personal-${chunkId++}`,
    type: 'personal',
    content: `Name: ${digitalTwinData.personal.name}. Title: ${digitalTwinData.personal.title}. Location: ${digitalTwinData.personal.location}. Summary: ${digitalTwinData.personal.summary}. Elevator pitch: ${digitalTwinData.personal.elevator_pitch}`,
    source: 'Personal Profile',
  });

  // Experience
  digitalTwinData.experience.forEach((exp, idx) => {
    chunks.push({
      id: `exp-${chunkId++}`,
      type: 'experience',
      content: `Company: ${exp.company}. Title: ${exp.title}. Duration: ${exp.duration}. Location: ${exp.location}. Context: ${exp.company_context}. Team: ${exp.team_structure}. Key Achievement: ${exp.achievements_star[0]?.result || 'N/A'}`,
      source: `Experience ${idx + 1} - ${exp.company}`,
    });
  });

  // Skills
  const skillsContent = [
    `Programming Languages: ${digitalTwinData.skills.technical.programming_languages.map((p) => p.language).join(', ')}`,
    `Databases: ${digitalTwinData.skills.technical.databases.join(', ')}`,
    `Cloud Platforms: ${digitalTwinData.skills.technical.cloud_platforms.join(', ')}`,
    `AI/ML Skills: ${digitalTwinData.skills.technical.ai_ml.join(', ')}`,
    `Soft Skills: ${digitalTwinData.skills.soft_skills.join(', ')}`,
  ].join('. ');

  chunks.push({
    id: `skills-${chunkId++}`,
    type: 'skills',
    content: skillsContent,
    source: 'Skills & Expertise',
  });

  // Projects
  digitalTwinData.projects_portfolio.forEach((project) => {
    chunks.push({
      id: `project-${chunkId++}`,
      type: 'project',
      content: `Project: ${project.name}. Description: ${project.description}. Technologies: ${project.technologies.join(', ')}. Impact: ${project.impact}. ${(project as any).key_features ? 'Features: ' + (project as any).key_features.join('. ') : ''}`,
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

  // Career Goals
  chunks.push({
    id: `goals-${chunkId++}`,
    type: 'career_goals',
    content: `Short-term: ${digitalTwinData.career_goals.short_term}. Medium-term: ${digitalTwinData.career_goals.medium_term}. Long-term: ${digitalTwinData.career_goals.long_term}. Industries interested: ${digitalTwinData.career_goals.industries_interested.join(', ')}.`,
    source: 'Career Goals',
  });

  // Unique Value Propositions
  chunks.push({
    id: `uvp-${chunkId++}`,
    type: 'unique_value',
    content: `Unique Value Propositions: ${digitalTwinData.unique_value_propositions.join('. ')}`,
    source: 'Unique Value Propositions',
  });

  return chunks;
}

export async function queryWithRAG(userQuery: string): Promise<string> {
  const chunks = generateChunks();
  const relevantChunks = chunks.slice(0, 10);
  const context = relevantChunks.map((c) => c.content).join('\n\n');

  const systemPrompt = `You are Douglas Mo's AI assistant. You have access to Douglas's complete professional profile including work experience, skills, projects, and education.

When answering questions:
1. Be accurate and cite specific achievements when relevant
2. Highlight quantifiable results and impact
3. Connect user requests to relevant experiences or skills
4. Be professional yet personable
5. If the question is outside your knowledge base, admit it honestly

Context about Douglas Mo:
${context}`;

  const groq = new Groq();

  const message = await groq.chat.completions.create({
    messages: [
      {
        role: 'user',
        content: userQuery,
      },
    ],
    model: 'mixtral-8x7b-32768',
    system: systemPrompt,
    temperature: 0.7,
    max_tokens: 1024,
  });

  return message.choices[0]?.message?.content || 'Unable to generate response';
}
