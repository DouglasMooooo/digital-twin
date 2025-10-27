# 🚀 快速启动指南

## 项目已创建完成！

你的数字孪生网页项目架构已经搭建完成。以下是接下来的步骤：

## 📦 第一步：安装依赖

在PowerShell中运行：

```powershell
cd "d:\上课\Ai agent\digital twin"
npm install
```

这将安装所有必需的包（Next.js, React, TypeScript, Upstash Vector, Groq SDK等）。

## 🔑 第二步：获取API密钥

### 1. Upstash Vector数据库

- 访问：https://console.upstash.com/
- 注册/登录账户
- 创建新的Vector Index
- 选择配置：
  - Region: 选择离你最近的区域
  - Dimension: 1536 (OpenAI默认)
  - Similarity: COSINE
- 复制 **REST URL** 和 **REST TOKEN**

### 2. Groq API

- 访问：https://console.groq.com/
- 创建账户（免费）
- 生成API Key
- 复制API密钥

## ⚙️ 第三步：配置环境变量

1. 复制环境变量模板：

```powershell
Copy-Item .env.example .env
```

2. 编辑 `.env` 文件，填入你的API密钥：

```env
UPSTASH_VECTOR_REST_URL=你的Upstash URL
UPSTASH_VECTOR_REST_TOKEN=你的Upstash Token
GROQ_API_KEY=你的Groq API密钥
```

## 🗄️ 第四步：初始化向量数据库

运行初始化脚本，将你的个人信息加载到向量数据库：

```powershell
npm run setup-vector-db
```

这个脚本会：
- 读取 `digitaltwin.json` 中的数据
- 分块处理内容
- 生成向量嵌入
- 上传到Upstash Vector

## 🎨 第五步：启动开发服务器

```powershell
npm run dev
```

打开浏览器访问：**http://localhost:3000**

## ✨ 项目功能

### 1. **个人档案展示**
- 显示你的教育背景、工作经验、技能
- 使用STAR方法展示成就
- 响应式设计

### 2. **AI聊天机器人**
- 基于RAG技术的智能问答
- 自动识别面试场景类型：
  - 📞 电话筛选
  - 👥 HR面试
  - 💻 技术面试
  - 👔 管理层面试
  - 🎯 高管面试

### 3. **语义搜索**
- 从你的经验中查找相关信息
- 提供具体的、量化的答案
- 引用来源

## 📝 自定义你的信息

### 修改个人档案

编辑 `digitaltwin.json` 文件，包括：

1. **personal**: 个人信息、联系方式
2. **experience**: 工作经验（使用STAR格式）
3. **skills**: 技术技能和软技能
4. **projects_portfolio**: 项目作品集
5. **education**: 教育背景
6. **interview_prep**: 面试问题和答案

### 重新加载数据

每次修改JSON后，重新运行：

```powershell
npm run setup-vector-db
```

## 🏗️ 项目结构概览

```
digital-twin/
├── digitaltwin.json          # ⭐ 你的个人数据（可编辑）
├── app/
│   ├── page.tsx             # 主页面
│   ├── layout.tsx           # 布局
│   ├── globals.css          # 全局样式
│   └── api/chat/route.ts    # AI聊天API
├── components/
│   └── ChatInterface.tsx    # 聊天组件
├── lib/
│   ├── vectordb.ts          # 向量数据库逻辑
│   ├── llm.ts               # LLM集成
│   └── utils.ts             # 工具函数
└── scripts/
    └── init-vector-db.ts    # 数据库初始化脚本
```

## 🎯 测试聊天机器人

启动应用后，试试这些问题：

1. "Tell me about yourself"
2. "What are your key strengths?"
3. "Walk me through your digital twin project"
4. "Why are you transitioning from accounting to tech?"
5. "How would you design a RAG system?"
6. "What are your salary expectations?"

## 🚀 部署到生产环境

### 使用Vercel（推荐）

1. 推送代码到GitHub
2. 在Vercel导入项目
3. 配置环境变量
4. 部署

或使用CLI：

```powershell
npm install -g vercel
vercel login
vercel --prod
```

## 🆘 常见问题

### TypeScript错误？

这是正常的！在运行 `npm install` 之前，TypeScript会报错找不到模块。安装依赖后错误会消失。

### 向量数据库连接失败？

- 检查 `.env` 文件中的凭据
- 确保Upstash Vector Index已创建
- 检查网络连接

### AI回答不准确？

- 确保运行了 `npm run setup-vector-db`
- 检查Groq API密钥是否有效
- 查看 `digitaltwin.json` 数据是否完整

## 📚 更多资源

- **详细设置指南**: 查看 `SETUP_CN.md`
- **项目文档**: 查看 `README.md`
- **示例数据**: `digitaltwin.json` 包含完整的Douglas Mo信息作为参考

## 🎉 下一步

1. ✅ 安装依赖
2. ✅ 获取API密钥
3. ✅ 配置环境变量
4. ✅ 初始化向量数据库
5. ✅ 启动开发服务器
6. ✅ 测试聊天功能
7. 📝 修改为你自己的信息
8. 🚀 部署到生产环境

---

**需要帮助？** 联系: d157156@gmail.com

祝你好运！🚀
