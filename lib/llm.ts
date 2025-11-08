import { Groq } from 'groq-sdk';
import digitalTwinData from '../digitaltwin.json';

// Initialize Groq SDK
const client = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// System prompt that helps Groq understand the digital twin
const systemPrompt = buildSystemPrompt();

// Build the system prompt from digital twin data
function buildSystemPrompt(): string {
  return `You are an AI assistant representing ${digitalTwinData.personal?.name || 'a professional'}.

${getCoreProfileContext()}

${getExperienceContext()}

${getSkillsContext()}`;
}

/**
 * Generate core profile context from digitaltwin.json
 */
function getCoreProfileContext(): string {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { personal, experience } = digitalTwinData as any;
  return `PERSONAL INFO:
Name: ${personal?.name}
Current Role: ${personal?.current_role}
Location: ${personal?.location}
Email: ${personal?.email}
Phone: ${personal?.phone}
Website: ${personal?.website}

PROFESSIONAL SUMMARY:
${personal?.elevator_pitch}

RECENT WORK EXPERIENCE:
${experience.slice(0, 2).map((exp: Record<string, unknown>) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const result = (exp as any).achievements_star?.[0]?.result || (exp as any).key_responsibilities?.[0] || '';
  return `
• ${exp.title} at ${exp.company} (${exp.duration})
  ${result}
`;
}).join('\n')}`;
}

/**
 * Generate experience context
 */
function getExperienceContext(): string {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { experience } = digitalTwinData as any;
  if (!experience || experience.length === 0) return '';

  const fullExperience = experience
    .map((exp: Record<string, unknown>) => `• ${exp.title} at ${exp.company}`)
    .join('\n');

  return `COMPLETE EXPERIENCE:\n${fullExperience}`;
}

/**
 * Generate skills context
 */
function getSkillsContext(): string {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { skills } = digitalTwinData as any;
  if (!skills || skills.length === 0) return '';
  return `KEY SKILLS:\n${skills.map((s: Record<string, unknown>) => `• ${s.category}: ${s.names?.join(', ')}`).join('\n')}`;
}

/**
 * Chat with the digital twin
 */
export async function chat(
  userMessage: string,
  conversationHistory: Array<{ role: string; content: string }> = []
): Promise<string> {
  try {
    const messages = [
      ...conversationHistory,
      { role: 'user', content: userMessage },
    ];

    const response = await client.chat.completions.create({
      model: 'mixtral-8x7b-32768',
      messages: messages as any,
      max_tokens: 1024,
      temperature: 0.7,
    });

    return response.choices[0]?.message?.content || 'No response generated';
  } catch (error) {
    console.error('Error calling Groq API:', error);
    throw error;
  }
}

/**
 * Stream chat response
 */
export async function chatStream(
  userMessage: string,
  conversationHistory: Array<{ role: string; content: string }> = []
) {
  try {
    const messages = [
      ...conversationHistory,
      { role: 'user', content: userMessage },
    ];

    return await client.chat.completions.create({
      model: 'mixtral-8x7b-32768',
      messages: messages as any,
      max_tokens: 1024,
      temperature: 0.7,
      stream: true,
    });
  } catch (error) {
    console.error('Error streaming from Groq API:', error);
    throw error;
  }
}
