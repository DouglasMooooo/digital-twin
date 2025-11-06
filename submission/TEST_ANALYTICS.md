# Analytics Testing Guide

## Question: Why Can't I See Data on the Dashboard?

### Root Cause
In Vercel's serverless environment, **in-memory data cannot be shared between different function calls**:
- `/api/chat` logs data → stored in instance A's memory
- `/api/admin/analytics` reads data → may run in instance B with empty memory

### Local Testing (Verify Functionality Works)

```bash
# 1. Start local development server
npm run dev

# 2. Visit http://localhost:3000
# 3. Use AI chat, ask a few questions
# 4. Visit http://localhost:3000/admin/dashboard
# 5. Password: admin123

# Locally, all requests share the same Node process, data should be visible
```

### Production Environment Solution (Requires Persistent Storage)

#### Option A: Using Vercel KV (Recommended)
```typescript
// Use Redis storage instead of in-memory
import { kv } from '@vercel/kv';

export async function logChatInteraction(log) {
  await kv.lpush('chat_logs', JSON.stringify(log));
  await kv.ltrim('chat_logs', 0, 999); // Keep last 1000 entries
}

export async function getChatLogs() {
  const logs = await kv.lrange('chat_logs', 0, -1);
  return logs.map(log => JSON.parse(log));
}
```

#### Option B: Using Upstash Redis
Already have Upstash account, can reuse

#### Option C: Accept Current State
- Dashboard mainly for demonstration
- Data persistence not required
- May see data if viewing dashboard immediately after someone chats

### Current Status
✅ Code logic is correct
✅ 本地测试应该能看到数据
⚠️ 生产环境需要持久化存储才能可靠工作

### 建议
对于求职作品集展示：
1. **录屏演示** - 本地运行，录制聊天→仪表板更新的视频
2. **截图** - 准备有数据的仪表板截图
3. **文档说明** - 在README中说明架构限制和解决方案
