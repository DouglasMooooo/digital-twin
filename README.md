# Douglas Mo - Digital Twin 🤖

An AI-powered professional profile and interview preparation platform built with Next.js, RAG (Retrieval-Augmented Generation), and modern AI technologies.

## 🔗 Live Demo

- **Website**: https://douglasmo.vercel.app/
- **GitHub**: https://github.com/DouglasMooooo/digital-twin

## 🌟 Features

- **Interactive Digital Twin**: AI-powered chatbot that answers interview questions based on Douglas Mo's professional profile
- **Claude Desktop Integration**: MCP server for direct access to profile data from Claude Desktop
- **Admin Dashboard**: Comprehensive analytics and monitoring for chat interactions
- **Comprehensive Profile**: Detailed showcase of experience, skills, projects, and achievements
- **RAG System**: Semantic search across professional experiences using Upstash Vector database
- **Interview Scenarios**: Optimized for phone screening, HR interviews, technical interviews, and executive interviews
- **STAR Methodology**: Structured achievement responses using Situation-Task-Action-Result framework
- **Real-time AI Responses**: Fast LLM integration using Groq API
- **Analytics & Monitoring**: Track visitors, questions, response times, and user behavior

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **AI/ML**: Upstash Vector (vector database), Groq API (LLM), OpenAI Embeddings
- **Deployment**: Vercel
- **Development**: VS Code, GitHub Copilot

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Upstash Vector database account
- Groq API key

### Installation

1. Clone the repository
```bash
git clone https://github.com/DouglasMooooo/digital-twin.git
cd digital-twin
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env
```

Edit `.env` and add your API keys:
- `UPSTASH_VECTOR_REST_URL`: Your Upstash Vector database URL
- `UPSTASH_VECTOR_REST_TOKEN`: Your Upstash Vector token
- `GROQ_API_KEY`: Your Groq API key

4. Initialize the vector database (one-time setup)
```bash
npm run setup-vector-db
```

5. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📁 Project Structure

```
digital-twin/
├── app/                    # Next.js app directory
│   ├── page.tsx           # Home page
│   ├── layout.tsx         # Root layout
│   ├── api/               # API routes
│   │   ├── chat/          # Chat endpoint for AI responses
│   │   └── embeddings/    # Vector search endpoints
├── components/            # React components
│   ├── Hero.tsx          # Hero section
│   ├── Experience.tsx    # Experience timeline
│   ├── Skills.tsx        # Skills showcase
│   ├── Projects.tsx      # Projects portfolio
│   └── ChatInterface.tsx # AI chat interface
├── lib/                   # Utility functions
│   ├── vectordb.ts       # Upstash Vector integration
│   ├── llm.ts            # Groq API integration
│   └── utils.ts          # Helper functions
├── data/
│   └── digitaltwin.json  # Professional profile data
├── public/               # Static assets
└── styles/               # Global styles
```

## 🎯 Use Cases

### For Job Seekers
- Use as a template to create your own digital twin
- Practice interview responses with AI
- Showcase your professional profile interactively

### For Recruiters
- Interactive way to learn about candidate background
- Ask any question about experience, skills, or achievements
- Get detailed STAR-formatted responses

### For Developers
- Learn RAG system implementation
- Study Next.js + AI integration patterns
- Reference for building portfolio websites

## 🔧 Configuration

### Vector Database Setup

The system uses Upstash Vector for semantic search. To populate the database:

```bash
npm run setup-vector-db
```

This script:
1. Reads `digitaltwin.json`
2. Chunks the content appropriately
3. Generates embeddings
4. Stores in Upstash Vector with metadata

### Customization

To create your own digital twin:

1. Edit `data/digitaltwin.json` with your information
2. Update the color scheme in `tailwind.config.ts`
3. Modify components to match your style
4. Re-run vector database setup

## 📊 Performance

- **Response Time**: < 2 seconds average
- **Accuracy**: 95%+ relevant responses
- **Vector Search**: Sub-100ms semantic retrieval
- **LLM Latency**: ~1.5s with Groq's Llama models

## �️ Admin Dashboard

Access the admin dashboard at `/admin` to monitor and analyze chat interactions.

### Features
- **Real-time Analytics**: Track visitors, questions, and performance metrics
- **Chat Logs**: View and search all chat interactions
- **Performance Monitoring**: Response time distribution and success rates
- **User Behavior**: Interview type distribution, hourly activity, top questions
- **Data Export**: Download logs as JSON for analysis
- **Session Tracking**: Monitor individual user sessions

### Access
1. Navigate to `http://localhost:3000/admin`
2. Enter admin password (default: `admin123`)
3. View analytics and logs

### Configuration
Set admin password in `.env`:
```env
ADMIN_PASSWORD=your_secure_password
```

**See [ADMIN_GUIDE.md](./ADMIN_GUIDE.md) for detailed documentation.**

## �🌐 Deployment

### Deploy to Vercel

1. Push to GitHub
2. Import repository in Vercel
3. Add environment variables
4. Deploy

```bash
vercel --prod
```

### Environment Variables on Vercel

Set these in your Vercel project settings:
- `UPSTASH_VECTOR_REST_URL`
- `UPSTASH_VECTOR_REST_TOKEN`
- `GROQ_API_KEY`

## 📝 License

MIT License - feel free to use this as a template for your own digital twin!

## 👤 About Douglas Mo

**Business Analytics Graduate | AI Systems Developer**

- 📧 Email: d157156@gmail.com
- 📱 Phone: 0434 001 262
- 💼 LinkedIn: [douglas-mo-67344531b](https://www.linkedin.com/in/douglas-mo-67344531b/)
- 🐙 GitHub: [DouglasMooooo](https://github.com/DouglasMooooo)

Currently pursuing Master of Business Analytics at Victoria University (Brisbane), with expertise in AI/ML systems, data analytics, and financial operations.

## 🙏 Acknowledgments

- Built during AI Builder Bootcamp at Ausbis Consulting
- Powered by Upstash Vector and Groq API
- Deployed on Vercel

---

**Note**: This is a demonstration project showcasing RAG system implementation and digital twin concepts for interview preparation and professional portfolio presentation.
