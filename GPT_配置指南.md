# ChatGPT GPT 创建配置指南（Douglas Mo 数字孪生）

## 📋 快速概览

本指南提供在 ChatGPT Builder 中创建 Douglas Mo Digital Twin GPT 的完整配置。所有字段都可直接复制粘贴。

---

## 🚀 第一步：访问 GPT Builder

1. 打开浏览器访问：https://chat.openai.com
2. 点击左侧菜单 **"Explore"** 或 **"My GPTs"**
3. 点击右上角 **"+ Create"** 按钮
4. 选择 **"Configure"** 标签页（跳过 Create 模式直接配置）

---

## ✏️ 第二步：填写基础信息

### **Name（名称）**
```
Douglas Mo - AI数字孪生
```

### **Description（描述）**
```
与 Douglas Mo 的 AI 数字孪生对话，获取他的专业背景、技术技能、项目经验和面试准备材料。基于真实简历和项目数据，使用 RAG 检索增强生成技术提供准确回答。
```

### **Instructions（指令 / System Prompt）**
```
你是 Douglas Mo 的 AI 数字孪生助手。你的职责是：

1. **专业背景查询**：回答关于 Douglas 的工作经历、教育背景、技术栈和项目经验的问题
2. **技能展示**：详细介绍他的编程语言、框架、工具和软技能
3. **项目作品集**：展示具体项目的技术架构、挑战和成果
4. **面试准备**：提供行为面试问题的 STAR 格式回答和技术深度探讨
5. **反馈收集**：接受用户对回答质量的反馈（有用/无用）

**回答风格**：
- 专业、准确、基于事实
- 使用具体数字和案例（如项目指标、技术栈版本）
- 对技术问题提供深度解释
- 对招聘经理问题提供业务价值视角

**数据来源**：
- 所有回答基于向量数据库检索到的真实简历和项目文档
- 使用 /api/chat 端点进行 RAG 检索
- 不编造信息，如果不确定会明确说明

**交互规则**：
- 主动询问用户角色（招聘经理/技术面试官/同事）以定制回答
- 对于模糊问题，提供澄清选项
- 每次回答后询问是否需要更多细节或相关主题
```

### **Conversation Starters（对话起始示例）**
```
📝 介绍一下 Douglas 的背景和核心技能
🚀 Douglas 做过哪些有影响力的项目？
💼 Douglas 在全栈开发方面有什么经验？
🎯 给我一个 Douglas 解决复杂问题的例子
```

---

## 🔌 第三步：配置 Actions（关键步骤）

### 3.1 添加 Action

1. 在 Configure 页面向下滚动到 **"Actions"** 部分
2. 点击 **"Create new action"** 或 **"Add Action"**

### 3.2 填写 Schema URL

在弹出的窗口中，选择 **"Import from URL"** 或直接在 Schema 输入框粘贴：

**OpenAPI Schema URL（推荐）**：
```
https://douglasmo.vercel.app/api/openapi
```

**备用 URL（如果上面失败）**：
```
https://douglasmo.vercel.app/openapi.json
```

点击 **"Import"** 或 **"Validate"** 按钮。

### 3.3 验证 Schema

成功导入后，你应该看到：
- ✅ Schema 版本：`OpenAPI 3.1.0`
- ✅ API Title：`Douglas Mo Digital Twin API`
- ✅ 操作列表（Operations）：
  - `queryDigitalTwin` - POST /api/chat
  - `submitFeedback` - POST /api/feedback（如果有）
  - 其他端点...

### 3.4 配置认证（Authentication）

选择 **"None"**（无需认证，公开 API）

如果未来需要 API Key：
- 选择 **"API Key"**
- Header name: `Authorization`
- 格式: `Bearer {api_key}`

### 3.5 隐私政策（可选）

如果系统要求填写隐私政策 URL，可以使用：
```
https://douglasmo.vercel.app
```

---

## 🎨 第四步：外观设置（可选）

### **Profile Picture（头像）**
上传 Douglas 的专业照片或使用 AI 生成的代表性头像。

### **Additional Settings（其他设置）**
- **允许代码解释器**：否（此 GPT 主要是数据查询）
- **允许浏览器**：可选（用于查找补充信息）
- **允许 DALL-E**：否（不需要图像生成）

---

## 💾 第五步：保存和发布

1. 点击右上角 **"Save"** 或 **"Update"** 按钮
2. 选择发布选项：
   - **Only me**（仅自己）：适合测试阶段
   - **Anyone with a link**（任何有链接的人）：✅ **推荐**，用于分享给招聘经理
   - **Public**（公开）：发布到 GPT Store（可选）

3. 点击 **"Confirm"** 完成发布

4. **复制分享链接**：发布后会生成一个 `https://chat.openai.com/g/g-xxxxx` 格式的链接，保存此链接。

---

## ✅ 第六步：验证配置

### 快速测试（在 GPT Builder 的预览窗口）

发送以下测试消息确认 Action 正常工作：

```
你好！请介绍一下 Douglas 的技术栈。
```

**预期行为**：
- GPT 会调用 `/api/chat` 端点
- 使用 RAG 检索相关信息
- 返回结构化的技术栈列表（编程语言、框架、工具等）

**检查点**：
- ✅ 响应包含具体技术名称（如 React、Node.js、Python）
- ✅ 响应包含真实项目引用
- ✅ 没有出现 "我无法访问外部数据" 等错误

---

## 📝 完整测试提示集（下一步使用）

创建完成后，在新对话中使用以下提示进行全面测试：

### 1. 背景查询
```
Douglas 的工作经历是什么？
```

### 2. 技能深度
```
Douglas 在 AI/机器学习方面有什么经验？
```

### 3. 项目细节
```
介绍一下 Douglas 的数字孪生项目，包括技术架构。
```

### 4. 面试场景
```
给我一个 Douglas 展示领导力的 STAR 格式回答。
```

### 5. 技术深度
```
Douglas 如何处理大规模数据处理和性能优化？
```

### 6. 反馈测试（如果 API 支持）
```
这个回答很有帮助！
```
（检查是否触发 feedback API）

---

## 🔧 故障排查

### 问题 1：Schema 导入失败（404 错误）

**原因**：Vercel 部署尚未完成或 URL 错误

**解决方案**：
1. 在浏览器访问 https://douglasmo.vercel.app/api/openapi
2. 确认返回 JSON（不是 HTML 错误页面）
3. 检查 Vercel 部署日志确认构建成功
4. 尝试备用 URL：https://douglasmo.vercel.app/openapi.json

### 问题 2：Action 调用失败（500 错误）

**原因**：后端 API 运行时错误

**解决方案**：
1. 在 PowerShell 直接测试 API：
   ```powershell
   $body = @{ message = "test" } | ConvertTo-Json
   Invoke-RestMethod -Uri "https://douglasmo.vercel.app/api/chat" -Method Post -Body $body -ContentType "application/json"
   ```
2. 检查 Vercel 部署日志的 Runtime Logs
3. 确认环境变量（GROQ_API_KEY、UPSTASH_VECTOR_REST_URL 等）已配置

### 问题 3：GPT 不调用 Action

**原因**：Schema 中操作定义不清晰或 GPT 无法匹配用户意图

**解决方案**：
1. 在 Instructions 中明确说明何时使用 Action：
   ```
   对于任何关于 Douglas 专业背景的问题，必须调用 queryDigitalTwin 操作。
   ```
2. 检查 OpenAPI Schema 的 `operationId` 和 `description` 是否清晰
3. 使用更直接的提示，如："调用 API 查询 Douglas 的技能"

### 问题 4：响应数据不完整

**原因**：向量数据库未初始化或 RAG 检索失败

**解决方案**：
1. 确认向量数据库已运行初始化脚本：
   ```powershell
   cd "d:\上课\Ai agent\digital twin"
   node scripts/init-vector-db.mjs
   ```
2. 检查 Upstash Vector 仪表板确认数据已导入
3. 查看 API 日志确认检索查询返回结果

---

## 📊 成功标准

GPT 配置成功的标志：

- ✅ **Schema 验证通过**：无导入错误，所有操作显示在 Actions 列表
- ✅ **首次测试成功**：发送简单问题后 GPT 调用 API 并返回数据
- ✅ **数据准确性**：返回的信息与 Douglas 的真实简历/项目一致
- ✅ **分享链接可用**：其他人通过链接访问时 GPT 正常工作
- ✅ **对话自然**：GPT 能理解各种问法并提供有用回答

---

## 🎯 下一步行动

1. **立即执行**：按照上述步骤在 ChatGPT Builder 创建 GPT（5-10 分钟）
2. **获取链接**：保存生成的分享链接（格式：`https://chat.openai.com/g/g-xxxxx`）
3. **运行测试**：使用测试提示集验证所有功能
4. **分享结果**：把 GPT 链接和测试截图发送给我，我会帮助优化

---

## 📎 附录：完整配置速查表

| 字段 | 值 |
|------|-----|
| **名称** | Douglas Mo - AI数字孪生 |
| **Schema URL** | https://douglasmo.vercel.app/api/openapi |
| **认证** | None（无） |
| **发布范围** | Anyone with a link |
| **允许的工具** | 仅 Actions（关闭代码解释器和 DALL-E） |
| **测试命令** | "介绍一下 Douglas 的技术栈" |

---

## 🆘 需要帮助？

如果在配置过程中遇到问题：

1. **立即反馈**：把错误截图或消息粘贴到对话中
2. **提供上下文**：说明在哪一步遇到问题（Schema 导入 / Action 调用 / 响应格式等）
3. **我会修复**：我可以调整后端 API、更新 Schema 或优化 Instructions

**预计完成时间**：5-15 分钟（取决于网络速度和熟悉程度）

---

**创建日期**：2025-11-01  
**文档版本**：1.0  
**相关文档**：
- `FINAL_DEPLOYMENT.md` - 完整部署指南
- `chatgpt-actions/README.md` - OpenAPI Schema 说明
- `API_DEPLOYMENT_GUIDE.md` - API 端点验证指南
