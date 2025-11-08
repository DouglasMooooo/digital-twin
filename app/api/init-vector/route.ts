import { NextResponse } from 'next/server';

// Simple in-memory embedding generation (for demo purposes)
function generateEmbedding(text: string): number[] {
  // Generate a simple 384-dimensional vector for demo
  // In production, use actual embedding model (sentence-transformers, etc.)
  const vec: number[] = [];
  for (let i = 0; i < 384; i++) {
    vec.push(Math.sin(text.charCodeAt(0) + i) * 0.5 + 0.5);
  }
  return vec;
}

function generateChunks(text?: string): { id: string; content: string; vector: number[] }[] {
  const defaultText = `
I am Douglas Mo, an AI Digital Twin created to represent my professional experience,
skills, and approach to solving complex problems. My expertise spans business analysis,
data science, stakeholder management, and cross-functional collaboration.

Key Skills:
- SQL and Python for data analysis
- Power BI for visualization
- Stakeholder communication and management
- Business process optimization
- Problem-solving and analytical thinking
- Project management and execution

Education:
- Master's degree in relevant field
- Continuous learning in AI, ML, and modern analytics

Experience:
- 5+ years in data-driven business analysis
- Led cross-functional teams to deliver insights
- Implemented data-driven solutions resulting in measurable business impact
- Strong track record of stakeholder satisfaction and successful outcomes
  `;

  const contentToProcess = text || defaultText;
  const chunks: { id: string; content: string; vector: number[] }[] = [];

  // Split into paragraphs
  const paragraphs = contentToProcess.split('\n\n').filter((p) => p.trim().length > 0);

  paragraphs.forEach((paragraph, index) => {
    chunks.push({
      id: `chunk-${index}`,
      content: paragraph.substring(0, 500), // Limit chunk size
      vector: generateEmbedding(paragraph),
    });
  });

  return chunks.length > 0 ? chunks : [{ id: 'chunk-0', content: contentToProcess, vector: generateEmbedding(contentToProcess) }];
}

export async function POST(req: NextRequest) {
  try {
    const chunks = generateChunks();
    console.log(`📊 Generated ${chunks.length} chunks for vector DB`);

    // In production, these would be stored in a vector database like:
    // - Upstash Redis (serverless)
    // - Pinecone
    // - Weaviate
    // - Milvus

    return NextResponse.json({
      success: true,
      message: 'Vector database initialized',
      chunksGenerated: chunks.length,
      chunks: chunks.slice(0, 3), // Return first 3 for preview
    });
  } catch (error) {
    console.error('Vector initialization error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Initialization failed',
      },
      { status: 500 }
    );
  }
}
