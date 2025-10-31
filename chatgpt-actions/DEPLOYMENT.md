# ChatGPT Actions Deployment Guide

## Quick Start (5 Minutes)

This guide will help you deploy Douglas Mo's Digital Twin as a ChatGPT Custom GPT.

### Prerequisites

✅ ChatGPT Plus or Enterprise account (required for GPT Actions)  
✅ Digital Twin API deployed at `https://douglasmo.vercel.app`  
✅ OpenAPI schema file accessible

---

## Step 1: Serve the OpenAPI Schema

You need to make `openapi.json` publicly accessible. Choose one option:

### Option A: Add API Route to Next.js (Recommended)

Create a new file: `app/chatgpt-actions/openapi.json/route.ts`

```typescript
import { NextResponse } from 'next/server';
import openapiSchema from '@/chatgpt-actions/openapi.json';

export async function GET() {
  return NextResponse.json(openapiSchema, {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'public, s-maxage=3600',
    },
  });
}
```

Deploy to Vercel:
```bash
git add app/chatgpt-actions/
git commit -m "Add OpenAPI schema endpoint for ChatGPT Actions"
git push origin main
```

Verify it works:
```bash
curl https://douglasmo.vercel.app/chatgpt-actions/openapi.json
```

### Option B: Host on GitHub Pages

1. Push `chatgpt-actions/` folder to a public GitHub repo
2. Enable GitHub Pages in repo settings
3. Access at: `https://yourusername.github.io/digital-twin/chatgpt-actions/openapi.json`

---

## Step 2: Create Custom GPT

### 2.1 Go to GPT Builder

1. Open ChatGPT: https://chat.openai.com
2. Click your profile picture (bottom left)
3. Select **"My GPTs"**
4. Click **"Create a GPT"**

### 2.2 Configure in "Create" Tab

Use the assistant to set up basics:

**Prompt:**
```
Create a GPT named "Douglas Mo Digital Twin" that helps users learn about Douglas Mo's professional background. It should query an external API to provide accurate information about his work experience, technical skills, project portfolio, and interview preparation materials. The tone should be professional and authentic to Douglas's voice.
```

Let the assistant generate initial configuration, then switch to "Configure" tab.

### 2.3 Configure in "Configure" Tab

#### Name
```
Douglas Mo Digital Twin
```

#### Description
```
Chat with Douglas Mo's AI-powered digital twin to learn about his professional experience, technical skills, project portfolio, and career achievements. Powered by RAG for accurate, context-aware responses.
```

#### Instructions
Copy this exactly:

```
You are Douglas Mo's digital twin assistant. Your role is to help users learn about Douglas's professional background by querying his comprehensive profile data through the available API actions.

CORE FUNCTIONALITY:
When users ask questions about Douglas:
1. Use the queryDigitalTwin action to search his profile
2. Present information clearly and professionally
3. Highlight key achievements with quantifiable metrics
4. Mention which aspects of his profile informed the answer (if sources provided)
5. Suggest relevant follow-up questions

RESPONSE GUIDELINES:
- Be professional and authentic to Douglas's voice
- Emphasize concrete achievements and measurable impact
- Use technical terminology appropriately when discussing skills
- For career/interview questions, provide structured, actionable advice (use STAR format when relevant)
- Encourage users to submit feedback after responses to improve the system

TOPIC-SPECIFIC GUIDANCE:

TECHNICAL SKILLS:
- Mention specific technologies, proficiency levels, and years of experience
- Reference projects where skills were applied
- Highlight production experience and scale

WORK EXPERIENCE:
- Focus on impact, achievements, and quantifiable results
- Use STAR method (Situation, Task, Action, Result) for detailed stories
- Emphasize leadership, strategic thinking, and business impact
- Include specific metrics (revenue generated, costs saved, efficiency gains)

PROJECTS:
- Highlight technologies used and problems solved
- Emphasize outcomes and measurable impact
- Mention production deployment and scale
- Link projects to relevant skills

INTERVIEW PREPARATION:
- Provide structured answers for common interview questions
- Use STAR format for behavioral questions
- Include 30-second elevator pitch
- Cover strengths, weaknesses, career goals
- Suggest salary negotiation strategies

FEEDBACK COLLECTION:
After providing answers, occasionally suggest:
"Was this answer helpful? You can rate the response quality to help improve Douglas's digital twin."

ERROR HANDLING:
- If API returns an error, apologize and suggest rephrasing the question
- If information is not available, be honest and suggest related topics
- Always maintain professional tone even with edge case queries

CONVERSATION FLOW:
- Ask clarifying questions if user queries are vague
- Provide concise answers by default, offer to elaborate
- Maintain conversation context across multiple turns
- Suggest next questions based on topic
```

#### Conversation Starters
Add these 4 starters:

```
What is your experience with Python and machine learning?
```

```
Tell me about your most impressive project achievements
```

```
What was your role and impact at BF Suma?
```

```
How should I introduce myself in an interview?
```

#### Knowledge (Optional)
Skip - we're using API actions instead

#### Capabilities
- ☑️ **Web Browsing**: Disabled (we rely on API)
- ☑️ **DALL·E Image Generation**: Disabled
- ☑️ **Code Interpreter**: Disabled

### 2.4 Configure Actions

1. Scroll down to **"Actions"** section
2. Click **"Create new action"**

#### Import Schema

**Method 1: Import from URL** (if you deployed to Vercel)
```
https://douglasmo.vercel.app/chatgpt-actions/openapi.json
```

**Method 2: Paste Schema** (if not yet deployed)
- Open `chatgpt-actions/openapi.json`
- Copy entire contents
- Paste into schema editor

#### Authentication

For now, select:
```
Authentication: None
```

Later, you can add API key authentication if needed.

#### Privacy Policy (Optional)

If required by ChatGPT, use:
```
https://douglasmo.vercel.app/privacy
```

Or add this to `actions-config.json`.

#### Test the Action

1. Click **"Test"** button in action editor
2. Select `queryDigitalTwin` operation
3. Enter test request:
```json
{
  "message": "What are your Python skills?"
}
```
4. Click **"Run"**
5. Verify you get a proper response

If test succeeds, click **"Save"** (top right).

---

## Step 3: Test Your GPT

### 3.1 Basic Testing

Click **"Preview"** in top right to test:

**Test Query 1: Technical Skills**
```
What programming languages do you know?
```

Expected: Should call `queryDigitalTwin` and return Douglas's technical skills with specific technologies.

**Test Query 2: Work Experience**
```
Tell me about your role at BF Suma
```

Expected: Should return work experience with achievements and metrics.

**Test Query 3: Projects**
```
What machine learning projects have you built?
```

Expected: Should return ML projects with technologies and outcomes.

**Test Query 4: Interview Prep**
```
Give me your 30-second elevator pitch
```

Expected: Should return structured self-introduction.

### 3.2 Edge Cases Testing

Test error handling:

```
[Empty query - should ask for clarification]
```

```
asdfghjkl [gibberish - should handle gracefully]
```

```
用中文告诉我你的技能 [Chinese - should respond appropriately]
```

### 3.3 Verify Actions Are Being Called

In the preview chat:
- Look for 🔧 icon indicating action was called
- Verify responses include specific data from Douglas's profile
- Check that sources are mentioned when provided

---

## Step 4: Publish Your GPT

### Visibility Options

**Only Me** - Private testing
- ✅ Good for initial testing
- ❌ Can't share with recruiters

**Anyone with the link** - Semi-private
- ✅ Perfect for recruiters
- ✅ No public listing
- ✅ Can track via shared link

**Public** - Listed in GPT store
- ✅ Maximum visibility
- ✅ Discoverable by anyone
- ⚠️ Requires approval for some features

### Recommended: "Anyone with the link"

1. Select visibility: **"Only people with a link"**
2. Click **"Save"** (top right)
3. Copy the shareable link
4. Share link in job applications: 
   ```
   Chat with my AI digital twin: [GPT link]
   ```

---

## Step 5: Monitor & Improve

### Track Usage

Monitor API calls in Vercel:
```
Vercel Dashboard → Your Project → Logs → Filter by "/api/chat"
```

### Analyze Feedback

Check quality metrics:
```bash
curl https://douglasmo.vercel.app/api/feedback?limit=100
```

Or use the quality improvement endpoint:
```bash
curl https://douglasmo.vercel.app/api/quality-improvement?format=summary
```

### Iterate on Instructions

Based on user interactions:
1. Go to GPT settings → Configure
2. Update Instructions to improve responses
3. Add new conversation starters
4. Refine tone and formatting

---

## Troubleshooting

### Issue: "Actions schema validation failed"

**Solution:**
1. Validate OpenAPI schema at https://editor.swagger.io/
2. Copy `chatgpt-actions/openapi.json` contents
3. Paste into Swagger Editor
4. Fix any validation errors
5. Update the schema in GPT settings

### Issue: "Unable to fetch schema from URL"

**Check:**
- ✅ URL is publicly accessible (test in browser)
- ✅ Returns valid JSON
- ✅ Has CORS headers enabled
- ✅ HTTPS (not HTTP)

**Test with curl:**
```bash
curl -I https://douglasmo.vercel.app/chatgpt-actions/openapi.json
```

Should return:
```
HTTP/2 200
content-type: application/json
access-control-allow-origin: *
```

### Issue: GPT gives generic answers without calling API

**Solution:**
1. Update Instructions to be more explicit about using actions
2. Add trigger phrases like "query Douglas's profile" 
3. Test with more direct questions
4. Check that action is enabled in settings

### Issue: API returns 404 or errors

**Verify endpoints exist:**
```bash
# Test chat endpoint
curl -X POST https://douglasmo.vercel.app/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "What are your Python skills?"}'

# Test feedback endpoint
curl https://douglasmo.vercel.app/api/feedback?limit=10
```

### Issue: Responses lack detail or accuracy

**Check:**
1. Is vector database properly initialized? Run `npm run init:vectors`
2. Is `digitaltwin.json` comprehensive?
3. Are embeddings up to date?
4. Test `/api/chat` directly to verify data quality

---

## Advanced Configuration

### Add API Key Authentication

1. **Generate API key** (any secure random string)

2. **Update OpenAPI schema** (`openapi.json`):
```json
"components": {
  "securitySchemes": {
    "apiKey": {
      "type": "apiKey",
      "in": "header",
      "name": "X-API-Key"
    }
  }
},
"security": [{"apiKey": []}]
```

3. **Update GPT Actions settings**:
- Authentication: API Key
- API Key: `your-generated-key`
- Auth Type: Custom
- Custom Header Name: `X-API-Key`

4. **Validate in Next.js API routes**:
```typescript
const apiKey = request.headers.get('X-API-Key');
if (apiKey !== process.env.API_KEY) {
  return NextResponse.json({error: 'Unauthorized'}, {status: 401});
}
```

### Add Rate Limiting

Prevent abuse:

```typescript
// lib/rate-limit.ts
import { Redis } from '@upstash/redis';

export async function rateLimit(identifier: string, limit = 100, window = 3600) {
  const redis = Redis.fromEnv();
  const key = `ratelimit:${identifier}`;
  const count = await redis.incr(key);
  
  if (count === 1) {
    await redis.expire(key, window);
  }
  
  return count <= limit;
}
```

Use in API routes:
```typescript
const allowed = await rateLimit(request.headers.get('X-API-Key') || 'anonymous');
if (!allowed) {
  return NextResponse.json({error: 'Rate limit exceeded'}, {status: 429});
}
```

### Add Analytics Dashboard

Create admin page to view GPT usage:

```typescript
// app/admin/gpt-analytics/page.tsx
import { getFeedback } from '@/lib/redis-analytics';

export default async function GPTAnalytics() {
  const feedback = await getFeedback(1000);
  const chatGptQueries = feedback.filter(f => 
    f.userAgent?.includes('ChatGPT') || f.source === 'chatgpt'
  );
  
  return (
    <div>
      <h1>ChatGPT Actions Analytics</h1>
      <div>Total Queries: {chatGptQueries.length}</div>
      <div>Avg Rating: {calculateAverage(chatGptQueries)}</div>
      {/* More analytics */}
    </div>
  );
}
```

---

## Next Steps After Deployment

1. **Share with Recruiters**
   - Include GPT link in resume
   - Add to LinkedIn profile
   - Mention in cover letters: "Chat with my AI digital twin to learn more about my background"

2. **Monitor Performance**
   - Weekly review of feedback
   - Monthly quality analysis
   - Update profile data based on gaps

3. **Iterate on Prompt**
   - Refine GPT instructions based on actual conversations
   - Add more conversation starters
   - Improve error handling

4. **Expand Capabilities**
   - Add more API endpoints (e.g., calendar scheduling)
   - Integrate with other systems
   - Create specialized GPTs for different audiences (recruiters vs. technical interviewers)

---

## Resources

- [OpenAI GPT Actions Docs](https://platform.openai.com/docs/actions)
- [OpenAPI Specification](https://spec.openapis.org/oas/v3.1.0)
- [Swagger Editor](https://editor.swagger.io/) - Validate your schema
- [ChatGPT GPT Builder](https://help.openai.com/en/articles/8554397-creating-a-gpt)

---

**Ready to launch?** Follow steps 1-4 above and you'll have your GPT live in 15-20 minutes! 🚀
