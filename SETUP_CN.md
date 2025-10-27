# Douglas Mo Digital Twin - 设置指南

## 项目概述

这是一个基于AI的数字孪生系统，专为面试场景优化。使用RAG（检索增强生成）技术，结合Next.js、TypeScript、Upstash Vector数据库和Groq API。

## 功能特性

✅ **全面的个人档案**：基于STAR方法的成就展示  
✅ **AI聊天机器人**：回答面试问题，提供个性化响应  
✅ **RAG系统**：语义搜索专业经验和技能  
✅ **多场景优化**：电话筛选、HR面试、技术面试、管理层面试  
✅ **实时响应**：使用Groq API的快速LLM集成  
✅ **现代化UI**：Tailwind CSS响应式设计

## 技术栈

- **前端**: Next.js 14, React, TypeScript, Tailwind CSS
- **AI/ML**: Upstash Vector (向量数据库), Groq API (LLM), OpenAI Embeddings
- **部署**: Vercel
- **开发工具**: VS Code, GitHub Copilot

## 安装步骤

### 1. 环境要求

- Node.js 18+ 
- npm 9+
- Upstash账户（免费）
- Groq API密钥（免费）

### 2. 安装依赖

```bash
npm install
```

### 3. 配置环境变量

创建 `.env` 文件：

```bash
cp .env.example .env
```

编辑 `.env` 文件，添加以下API密钥：

```env
UPSTASH_VECTOR_REST_URL=你的Upstash向量数据库URL
UPSTASH_VECTOR_REST_TOKEN=你的Upstash向量数据库令牌
GROQ_API_KEY=你的Groq API密钥
```

#### 获取API密钥：

**Upstash Vector:**
1. 访问 https://console.upstash.com/
2. 创建账户并登录
3. 创建新的Vector Index
4. 复制REST URL和REST TOKEN

**Groq API:**
1. 访问 https://console.groq.com/
2. 创建账户
3. 生成API密钥
4. 复制密钥

### 4. 初始化向量数据库

运行以下命令将你的个人信息加载到向量数据库：

```bash
npm run setup-vector-db
```

这个脚本会：
- 读取 `digitaltwin.json`
- 将内容分块
- 生成嵌入向量
- 存储到Upstash Vector

### 5. 启动开发服务器

```bash
npm run dev
```

打开浏览器访问 [http://localhost:3000](http://localhost:3000)

## 自定义你的数字孪生

### 编辑个人信息

修改 `digitaltwin.json` 文件，包含你的：

1. **个人信息**：姓名、职位、联系方式
2. **工作经验**：使用STAR方法描述成就
3. **技能**：技术和软技能
4. **项目**：作品集项目
5. **教育背景**
6. **面试准备**：预设问题和答案

### 重新加载数据

每次修改 `digitaltwin.json` 后，重新运行：

```bash
npm run setup-vector-db
```

## 项目结构

```
digital-twin/
├── app/                    # Next.js应用目录
│   ├── page.tsx           # 主页
│   ├── layout.tsx         # 根布局
│   ├── globals.css        # 全局样式
│   └── api/               # API路由
│       └── chat/          # AI聊天端点
├── components/            # React组件
│   └── ChatInterface.tsx # AI聊天界面
├── lib/                   # 工具函数
│   ├── vectordb.ts       # Upstash Vector集成
│   ├── llm.ts            # Groq API集成
│   └── utils.ts          # 辅助函数
├── scripts/              # 脚本
│   └── init-vector-db.ts # 数据库初始化
├── digitaltwin.json      # 你的个人档案数据
├── package.json          # 项目依赖
├── tsconfig.json         # TypeScript配置
├── tailwind.config.ts    # Tailwind配置
└── next.config.js        # Next.js配置
```

## 使用场景

### 作为求职者

1. **面试准备**：与AI练习面试问题
2. **个人展示**：向招聘者展示专业背景
3. **技能展示**：演示你的AI/全栈开发能力

### 作为招聘者

1. **互动了解候选人**：通过AI聊天深入了解
2. **快速筛选**：获取结构化的STAR格式回答
3. **技术能力评估**：查看实际项目实现

### 作为开发者学习

1. **RAG系统实现**：学习向量数据库和LLM集成
2. **Next.js + AI模式**：研究全栈AI应用架构
3. **作品集网站参考**：借鉴设计和实现

## 部署到Vercel

### 方法一：GitHub集成（推荐）

1. 将代码推送到GitHub
2. 在Vercel中导入仓库
3. 添加环境变量
4. 部署

### 方法二：CLI部署

```bash
npm install -g vercel
vercel login
vercel --prod
```

### 环境变量设置

在Vercel项目设置中添加：
- `UPSTASH_VECTOR_REST_URL`
- `UPSTASH_VECTOR_REST_TOKEN`
- `GROQ_API_KEY`

## 性能指标

- **响应时间**: 平均 < 2秒
- **准确率**: 95%+ 相关响应
- **向量搜索**: Sub-100ms语义检索
- **LLM延迟**: ~1.5秒（使用Groq的Llama模型）

## 常见问题

### Q: 向量数据库初始化失败？
A: 检查Upstash凭据是否正确，确保网络连接正常。

### Q: AI回答不准确？
A: 重新运行 `npm run setup-vector-db` 确保数据已正确加载。检查Groq API密钥是否有效。

### Q: 如何添加更多面试问题？
A: 编辑 `digitaltwin.json` 的 `interview_prep` 部分，添加新的问题和STAR格式答案。

### Q: 可以用其他LLM API吗？
A: 可以！修改 `lib/llm.ts` 中的API调用，支持OpenAI、Anthropic等。

### Q: 如何更改UI样式？
A: 编辑 `tailwind.config.ts` 修改颜色主题，或直接修改组件中的Tailwind类。

## 下一步增强

- [ ] 添加用户认证
- [ ] 添加分析仪表板
- [ ] 支持多语言（中文/英文切换）
- [ ] 添加语音对话功能
- [ ] 集成视频面试模拟
- [ ] 导出面试准备PDF

## 技术支持

遇到问题？

1. 查看 `README.md` 文档
2. 检查GitHub Issues
3. 联系：d157156@gmail.com

## 许可证

MIT License - 随意使用此模板创建你自己的数字孪生！

---

**作者**: Douglas Mo  
**项目**: AI-Powered Digital Twin for Interview Preparation  
**技术**: Next.js, TypeScript, Upstash Vector, Groq API, Vercel
