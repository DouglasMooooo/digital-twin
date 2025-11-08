import Groq from 'groq-sdk';
import digitalTwinData from '../digitaltwin.json' assert { type: 'json' };

// Initialize Groq client
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY!,
});

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface InterviewContext {
  type: 'screening' | 'hr' | 'technical' | 'manager' | 'executive';
  relevantContext: string[];
}

/**
 * Generate core profile context from digitaltwin.json
 */
function getCoreProfileContext(): string {
  const { personal, experience } = digitalTwinData as any;
  
  return `DOUGLAS MO - PROFESSIONAL PROFILE

PERSONAL INFO:
- Name: ${personal.name}
- Title: ${personal.title}
- Location: ${personal.location}
- Summary: ${personal.summary}

ELEVATOR PITCH:
${personal.elevator_pitch}

RECENT WORK EXPERIENCE:
${experience.slice(0, 2).map((exp: Record<string, unknown>) => {
  const result = (exp as any).achievements_star?.[0]?.result || (exp as any).key_responsibilities?.[0] || '';
  return `
• ${exp.title} at ${exp.company} (${exp.duration})
  ${result}
`;
}).join('\n')}

KEY TECHNICAL SKILLS:
- Programming: Python (1.5 years), JavaScript, SQL
- AI/ML: RAG Systems, Vector Databases (ChromaDB, Upstash), LLM Integration (Groq, OpenAI)
- Web Development: Next.js, React, Tailwind CSS, REST APIs
- Cloud & Tools: Vercel, GitHub Actions, Git
- Data Analysis: Pandas, NumPy, Power BI, Excel

EDUCATION:
- Master of Business Analytics - QUT (June 2026)
- Bachelor of Commerce - UNSW (2022)
`;
}

/**
 * Generate system prompt based on interview type
 */
function generateSystemPrompt(interviewType: InterviewContext['type']): string {
  const coreProfile = getCoreProfileContext();
  
  const basePrompt = `You are Douglas Mo's AI Digital Twin for interview preparation.

${coreProfile}

IMPORTANT GUIDELINES:
- Answer as Douglas Mo in FIRST PERSON ("I", "my", "me")
- Use SPECIFIC details from the profile above
- Use STAR methodology for behavioral questions
- Provide QUANTIFIABLE results when possible
- Be professional, confident, and authentic
- If you don't have specific information, be honest but emphasize willingness to learn
- Keep responses focused and concise`;

  const contextSpecific = {
    screening: `This is a phone screening call. Keep answers concise (30-60 seconds). Focus on:
- Confirming qualifications and availability
- Brief career highlights
- Salary expectations alignment
- Enthusiasm for the role`,
    
    hr: `This is an HR/behavioral interview. Focus on:
- Cultural fit and values alignment
- Team collaboration examples
- Career motivations and goals
- Detailed STAR responses
- Work style and soft skills`,
    
    technical: `This is a technical interview. Focus on:
- Technical expertise and problem-solving
- Architecture decisions and trade-offs
- Code quality and best practices
- Learning approach for new technologies
- Specific project implementations`,
    
    manager: `This is a hiring manager interview. Focus on:
- Business impact and ROI
- Ownership and initiative
- Priority management
- Growth potential
- Team contribution`,
    
    executive: `This is an executive interview. Focus on:
- Strategic thinking
- Long-term vision alignment
- Industry awareness
- Cultural contribution
- Leadership potential`,
  };

  return `${basePrompt}\n\n${contextSpecific[interviewType]}`;
}

/**
 * Generate AI response using Groq LLM
 */
export async function generateAIResponse(
  userMessage: string,
  context: InterviewContext,
  conversationHistory: ChatMessage[] = []
): Promise<string> {
  try {
    const systemPrompt = generateSystemPrompt(context.type);
    
    // Build context from relevant information
    const contextPrompt = context.relevantContext.length > 0
      ? `\n\nRelevant information from Douglas's profile:\n${context.relevantContext.join('\n\n')}`
      : '';

    const messages: ChatMessage[] = [
      {
        role: 'system',
        content: systemPrompt + contextPrompt,
      },
      ...conversationHistory,
      {
        role: 'user',
        content: userMessage,
      },
    ];

    const response = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile', // Updated to new model (llama-3.1-70b deprecated)
      messages: messages as unknown as Array<{role: string; content: string}>,
      temperature: 0.7,
      max_tokens: 1024,
      top_p: 0.9,
    });

    return response.choices[0]?.message?.content || 'I apologize, but I encountered an error generating a response.';
  } catch (error) {
    console.error('Error generating AI response:', error);
    throw new Error('Failed to generate response from LLM');
  }
}

/**
 * Analyze question type to determine appropriate interview context
 */
export function analyzeQuestionType(question: string): InterviewContext['type'] {
  const lowerQuestion = question.toLowerCase();

  // Screening indicators
  if (
    lowerQuestion.includes('available') ||
    lowerQuestion.includes('salary') ||
    lowerQuestion.includes('relocation') ||
    lowerQuestion.includes('notice period') ||
    lowerQuestion.includes('tell me about yourself') && lowerQuestion.length < 50
  ) {
    return 'screening';
  }

  // Technical indicators
  if (
    lowerQuestion.includes('how would you implement') ||
    lowerQuestion.includes('design a system') ||
    lowerQuestion.includes('algorithm') ||
    lowerQuestion.includes('code') ||
    lowerQuestion.includes('architecture') ||
    lowerQuestion.includes('database') ||
    lowerQuestion.includes('api') ||
    lowerQuestion.includes('technical')
  ) {
    return 'technical';
  }

  // Executive indicators
  if (
    lowerQuestion.includes('vision') ||
    lowerQuestion.includes('strategic') ||
    lowerQuestion.includes('long-term') ||
    lowerQuestion.includes('industry') ||
    lowerQuestion.includes('future of')
  ) {
    return 'executive';
  }

  // Manager indicators
  if (
    lowerQuestion.includes('priority') ||
    lowerQuestion.includes('initiative') ||
    lowerQuestion.includes('ownership') ||
    lowerQuestion.includes('business impact') ||
    lowerQuestion.includes('roi')
  ) {
    return 'manager';
  }

  // Default to HR for behavioral questions
  return 'hr';
}

/**
 * Suggest follow-up questions based on interview type
 */
export function suggestFollowUpQuestions(interviewType: InterviewContext['type']): string[] {
  const suggestions = {
    screening: [
      'What are your salary expectations?',
      'When can you start?',
      'Why are you interested in this role?',
      'Tell me about yourself in 60 seconds',
    ],
    hr: [
      'Tell me about a time you faced a difficult challenge',
      'How do you handle conflicting priorities?',
      'Describe your ideal work environment',
      'What are your career goals?',
    ],
    technical: [
      'How would you design a RAG system?',
      'Explain your experience with vector databases',
      'Walk me through your digital twin project',
      'How do you approach debugging complex issues?',
    ],
    manager: [
      'What was your biggest achievement in your last role?',
      'How do you prioritize multiple projects?',
      'Tell me about a time you showed initiative',
      'How do you measure success?',
    ],
    executive: [
      'Where do you see yourself in 5 years?',
      'What excites you about our company?',
      'How do you stay current with industry trends?',
      'What unique value do you bring?',
    ],
  };

  return suggestions[interviewType];
}
