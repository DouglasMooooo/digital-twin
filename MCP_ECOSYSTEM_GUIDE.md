# 🔌 MCP 生态系统集成指南

## 📚 推荐的 MCP Servers 部署清单

### **1. 🗄️ Database MCP Servers** ⭐⭐⭐

#### **A. PostgreSQL MCP Server**
**用途**: 连接数据库，让 Claude 直接查询你的数据

**安装**:
```bash
npm install -g @modelcontextprotocol/server-postgres
```

**配置** (`claude_desktop_config.json`):
```json
{
  "mcpServers": {
    "postgres": {
      "command": "mcp-server-postgres",
      "args": ["postgresql://user:pass@localhost:5432/mydb"]
    }
  }
}
```

**使用场景**:
- 在 Claude Desktop 中直接查询用户数据
- 分析聊天日志统计
- 生成数据报告

---

#### **B. SQLite MCP Server**
**用途**: 轻量级数据库访问（适合本地开发）

**安装**:
```bash
npm install -g @modelcontextprotocol/server-sqlite
```

**配置**:
```json
{
  "mcpServers": {
    "sqlite": {
      "command": "mcp-server-sqlite",
      "args": ["--db-path", "d:/上课/Ai agent/digital twin/analytics.db"]
    }
  }
}
```

**价值**: 存储聊天记录、用户分析数据

---

### **2. 🌐 Web & API MCP Servers** ⭐⭐⭐

#### **A. Fetch MCP Server** (推荐)
**用途**: 让 Claude 访问任何网页和 API

**安装**:
```bash
npm install -g @modelcontextprotocol/server-fetch
```

**配置**:
```json
{
  "mcpServers": {
    "fetch": {
      "command": "mcp-server-fetch"
    }
  }
}
```

**使用场景**:
- 抓取职位描述并分析匹配度
- 获取公司信息准备面试
- 监控竞争对手网站

**示例**:
```
Claude, use the fetch MCP to get the job description from 
https://careers.microsoft.com/job/123456 and compare with my skills
```

---

#### **B. Brave Search MCP Server**
**用途**: 实时搜索互联网

**安装**:
```bash
npm install -g @modelcontextprotocol/server-brave-search
```

**配置**:
```json
{
  "mcpServers": {
    "brave-search": {
      "command": "mcp-server-brave-search",
      "env": {
        "BRAVE_API_KEY": "your-api-key"
      }
    }
  }
}
```

**价值**: 面试前快速了解公司最新动态

---

### **3. 📁 File System MCP Servers** ⭐⭐⭐

#### **A. Filesystem MCP Server**
**用途**: 让 Claude 读写本地文件

**安装**:
```bash
npm install -g @modelcontextprotocol/server-filesystem
```

**配置**:
```json
{
  "mcpServers": {
    "filesystem": {
      "command": "mcp-server-filesystem",
      "args": ["d:/上课/Ai agent/digital twin"]
    }
  }
}
```

**使用场景**:
- Claude 帮你更新 `digitaltwin.json`
- 自动生成周报文档
- 整理项目文件结构

---

#### **B. Google Drive MCP Server**
**用途**: 访问云端文件

**安装**:
```bash
npm install -g @modelcontextprotocol/server-gdrive
```

**价值**: 同步简历、证书、作品集

---

### **4. 💼 求职相关 MCP Servers** ⭐⭐⭐

#### **A. GitHub MCP Server** (强烈推荐)
**用途**: 管理你的 GitHub 仓库

**安装**:
```bash
npm install -g @modelcontextprotocol/server-github
```

**配置**:
```json
{
  "mcpServers": {
    "github": {
      "command": "mcp-server-github",
      "env": {
        "GITHUB_TOKEN": "ghp_your_token_here"
      }
    }
  }
}
```

**使用场景**:
- Claude 帮你写 commit message
- 自动创建 issue 和 PR
- 分析代码统计（面试时展示贡献）

**示例**:
```
Claude, use GitHub MCP to show my commit activity in the last 3 months
```

---

#### **B. LinkedIn MCP Server** (自定义)
**你可以创建**: 基于 LinkedIn API

**功能**:
- 自动更新个人资料
- 分析职位推荐
- 生成求职邮件

---

### **5. 🤖 AI & LLM MCP Servers** ⭐⭐

#### **A. OpenAI MCP Server**
**用途**: 在 Claude 中调用 GPT-4

**安装**:
```bash
npm install -g @modelcontextprotocol/server-openai
```

**使用场景**:
- 对比不同 LLM 的回答质量
- 生成多个面试答案版本

---

#### **B. Anthropic MCP Server**
**用途**: 访问 Claude API（递归调用）

**价值**: 批量生成 STAR 答案变体

---

### **6. 📊 Analytics & Monitoring MCP** ⭐⭐

#### **A. Google Analytics MCP Server**
**用途**: 分析网站访问数据

**配置**:
```json
{
  "mcpServers": {
    "google-analytics": {
      "command": "mcp-server-ga",
      "env": {
        "GA_PROPERTY_ID": "G-XXXXXXXXXX"
      }
    }
  }
}
```

**使用场景**:
- Claude 生成访问报告
- 分析招聘经理行为（哪些页面停留时间长）

---

#### **B. Vercel MCP Server** (自定义)
**你可以创建**: 基于 Vercel API

**功能**:
- 查看部署状态
- 分析性能指标
- 管理环境变量

---

### **7. 🛠️ Developer Tools MCP** ⭐⭐⭐

#### **A. Puppeteer MCP Server**
**用途**: 自动化浏览器操作

**安装**:
```bash
npm install -g @modelcontextprotocol/server-puppeteer
```

**使用场景**:
- 自动填写求职申请表
- 截图职位描述
- 抓取公司评价（Glassdoor）

---

#### **B. Git MCP Server**
**用途**: 高级 Git 操作

**安装**:
```bash
npm install -g @modelcontextprotocol/server-git
```

**使用场景**:
- Claude 帮你写 commit message
- 自动生成 changelog
- 分析代码贡献统计

---

### **8. 📧 Communication MCP** ⭐⭐

#### **A. Gmail MCP Server**
**用途**: 发送和管理邮件

**配置**:
```json
{
  "mcpServers": {
    "gmail": {
      "command": "mcp-server-gmail",
      "env": {
        "GMAIL_CLIENT_ID": "your-id",
        "GMAIL_CLIENT_SECRET": "your-secret"
      }
    }
  }
}
```

**使用场景**:
- Claude 帮你回复招聘邮件
- 自动发送 follow-up
- 整理面试邀请

---

#### **B. Slack MCP Server**
**用途**: 团队协作

**价值**: 如果你申请的公司用 Slack，展示你的自动化能力

---

### **9. 🎨 Creative MCP** ⭐

#### **A. Image Generation MCP**
**用途**: 生成作品集图片

**示例**: DALL-E MCP Server
```bash
npm install -g @modelcontextprotocol/server-dalle
```

**使用场景**:
- 为项目生成 logo
- 创建演示图片

---

### **10. 📚 Knowledge Base MCP** ⭐⭐⭐

#### **A. Notion MCP Server**
**用途**: 访问 Notion 数据库

**安装**:
```bash
npm install -g @modelcontextprotocol/server-notion
```

**使用场景**:
- 从 Notion 同步面试笔记
- 自动生成学习日志

---

#### **B. Obsidian MCP Server** (自定义)
**你可以创建**: 如果你用 Obsidian 做笔记

---

## 🎯 针对你项目的推荐部署

### **阶段 1: 立即部署（1小时内）** ⭐⭐⭐

1. **GitHub MCP Server** - 展示你的代码贡献
2. **Filesystem MCP Server** - 让 Claude 管理你的项目文件
3. **Fetch MCP Server** - 抓取职位描述分析

**安装脚本**:
```powershell
# 在 PowerShell 中运行
npm install -g @modelcontextprotocol/server-github
npm install -g @modelcontextprotocol/server-filesystem
npm install -g @modelcontextprotocol/server-fetch
```

**配置文件路径**:
```
C:\Users\YourName\AppData\Roaming\Claude\claude_desktop_config.json
```

**完整配置示例**:
```json
{
  "mcpServers": {
    "digital-twin": {
      "command": "node",
      "args": ["d:/上课/Ai agent/digital twin/mcp-server/index.js"]
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_your_token_here"
      }
    },
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "d:/上课/Ai agent/digital twin"
      ]
    },
    "fetch": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-fetch"]
    }
  }
}
```

---

### **阶段 2: 本周部署（2-3小时）** ⭐⭐

4. **SQLite MCP Server** - 存储面试准备数据
5. **Puppeteer MCP Server** - 自动化求职流程
6. **Git MCP Server** - 优化版本管理

---

### **阶段 3: 长期规划（选择性）** ⭐

7. **Gmail MCP Server** - 邮件自动化
8. **Google Analytics MCP** - 网站分析
9. **Notion MCP Server** - 知识管理

---

## 🚀 快速启动：部署前3个 MCP Server

### **步骤 1: 获取 GitHub Token**

1. 访问: https://github.com/settings/tokens
2. 点击 "Generate new token (classic)"
3. 勾选权限: `repo`, `read:user`, `read:org`
4. 复制 token (格式: `ghp_xxxxxxxxxxxx`)

---

### **步骤 2: 创建配置文件**

```powershell
# 在 PowerShell 中运行
$configPath = "$env:APPDATA\Claude\claude_desktop_config.json"

# 如果文件不存在，创建它
if (!(Test-Path $configPath)) {
    New-Item -ItemType File -Path $configPath -Force
}

# 打开配置文件
notepad $configPath
```

---

### **步骤 3: 粘贴配置**

```json
{
  "mcpServers": {
    "digital-twin": {
      "command": "node",
      "args": ["d:/上课/Ai agent/digital twin/mcp-server/index.js"]
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_YOUR_TOKEN_HERE"
      }
    },
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "d:/上课/Ai agent/digital twin"
      ]
    },
    "fetch": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-fetch"]
    }
  }
}
```

**记得替换**: `ghp_YOUR_TOKEN_HERE` 为你的真实 GitHub token

---

### **步骤 4: 重启 Claude Desktop**

关闭并重新打开 Claude Desktop，你会看到4个 MCP servers 连接成功！

---

### **步骤 5: 测试**

在 Claude Desktop 中输入:

```
Use the github MCP to show my repositories
```

```
Use the filesystem MCP to list files in my digital twin project
```

```
Use the fetch MCP to get content from https://douglasmo.vercel.app
```

```
Use the digital-twin MCP to get my work experience at BF Suma
```

---

## 💡 创意使用场景

### **场景 1: 智能求职助手**
```
Claude, use fetch MCP to get this job description:
https://www.seek.com.au/job/12345678

Then use my digital-twin MCP to:
1. Compare the requirements with my skills
2. Generate a customized cover letter
3. Suggest which STAR stories to prepare
```

---

### **场景 2: 自动化 GitHub 管理**
```
Claude, use github MCP to:
1. Create a new repository for my "Interview Prep" project
2. Generate a professional README
3. Set up GitHub Actions for auto-deployment
```

---

### **场景 3: 项目文档生成**
```
Claude, use filesystem MCP to:
1. Read all my project files
2. Generate comprehensive API documentation
3. Create a CHANGELOG.md based on git history
```

---

## 🔐 安全提示

### **保护敏感信息**:
- ✅ 使用环境变量存储 API keys
- ✅ 不要把 tokens 提交到 GitHub
- ✅ 定期轮换访问令牌
- ✅ 只授予必要的最小权限

### **创建 `.env` 文件**:
```bash
# .env
GITHUB_TOKEN=ghp_your_token
OPENAI_API_KEY=sk-your_key
GMAIL_CLIENT_SECRET=your_secret
```

**在配置中引用**:
```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "${GITHUB_TOKEN}"
      }
    }
  }
}
```

---

## 📈 进阶：自定义 MCP Server 创建

### **创建自己的 MCP Server 模板**:

```javascript
// my-custom-mcp/index.js
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

const server = new Server({
  name: 'my-custom-server',
  version: '1.0.0',
}, {
  capabilities: {
    tools: {},
  },
});

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'custom_tool',
        description: 'Your custom functionality',
        inputSchema: {
          type: 'object',
          properties: {
            input: { type: 'string' }
          }
        }
      }
    ]
  };
});

// 启动服务器
const transport = new StdioServerTransport();
await server.connect(transport);
```

---

## 🎯 你的下一步

**想要部署哪些 MCP servers？我推荐先从这3个开始：**

1. ✅ **GitHub MCP** - 展示代码贡献（对求职有帮助）
2. ✅ **Filesystem MCP** - 让 Claude 管理你的项目
3. ✅ **Fetch MCP** - 抓取和分析职位描述

**我可以帮你：**
- 🔧 配置这些 MCP servers
- 📝 创建自定义 MCP server（比如 LinkedIn 集成）
- 🧪 测试 MCP server 功能
- 📚 写使用文档

你想先部署哪个？还是想创建一个自定义的 MCP server？
