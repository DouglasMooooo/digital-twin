# Claude Desktop MCP 快速配置（简化版）

## ✅ 当前状态

- ✅ MCP 服务器已编译：`mcp-server/dist/index.js`
- ✅ 项目路径：`D:/上课/Ai agent/digital twin`

---

## 📝 配置步骤

### 1. 创建配置文件

在 PowerShell 中运行以下命令（**复制整段**）：

```powershell
# 创建 Claude Desktop 配置
$configPath = "$env:APPDATA\Claude\claude_desktop_config.json"

# 确保目录存在
New-Item -ItemType Directory -Path (Split-Path $configPath) -Force | Out-Null

# 创建配置内容（需要替换环境变量值！）
@'
{
  "mcpServers": {
    "douglas-digital-twin": {
      "command": "node",
      "args": [
        "D:/上课/Ai agent/digital twin/mcp-server/dist/index.js"
      ],
      "env": {
        UPSTASH_VECTOR_REST_TOKEN="YOUR_UPSTASH_VECTOR_REST_TOKEN_HERE"
        UPSTASH_VECTOR_REST_READONLY_TOKEN="YOUR_UPSTASH_VECTOR_REST_READONLY_TOKEN_HERE"
        UPSTASH_VECTOR_REST_URL="https://YOUR_REGION-vector.upstash.io"
        GROQ_API_KEY="YOUR_GROQ_API_KEY_HERE"
        OPENAI_API_KEY="YOUR_OPENAI_API_KEY_HERE"

      }
    }
  }
}
'@ | Out-File -FilePath $configPath -Encoding UTF8

Write-Host "✅ 配置文件已创建: $configPath"
```

### 2. 填写环境变量

打开配置文件：

```powershell
notepad "$env:APPDATA\Claude\claude_desktop_config.json"
```

从项目的 `.env` 文件复制真实的环境变量值替换：
- `你的_UPSTASH_VECTOR_REST_URL`
- `你的_UPSTASH_VECTOR_REST_TOKEN`
- `你的_UPSTASH_REDIS_REST_URL`
- `你的_UPSTASH_REDIS_REST_TOKEN`
- `你的_GROQ_API_KEY`

**查看 .env 文件**：
```powershell
cd "d:\上课\Ai agent\digital twin"
cat .env
```

### 3. 验证配置

```powershell
# 验证 JSON 格式
Get-Content "$env:APPDATA\Claude\claude_desktop_config.json" | ConvertFrom-Json

# 如果没报错说明格式正确 ✅
```

### 4. 测试 MCP 服务器

```powershell
# 手动测试服务器能否启动
cd "d:\上课\Ai agent\digital twin\mcp-server"
node dist\index.js

# 应该启动并等待输入，按 Ctrl+C 停止
```

### 5. 重启 Claude Desktop

1. **下载 Claude Desktop**（如果还没安装）
   - 访问：https://claude.ai/download
   - 下载并安装 Windows 版本

2. **完全关闭 Claude Desktop**
   - 右键任务栏托盘图标 → 退出
   - 或打开任务管理器确认进程已结束

3. **重新启动 Claude Desktop**
   - 等待 5-10 秒加载 MCP 服务器

### 6. 测试查询

在 Claude Desktop 中发送：

```
请使用 douglas-digital-twin 工具查询 Douglas 的技术技能。
```

或更直接：

```
调用 query_digital_twin 查询：Douglas 有哪些编程语言经验？
```

**预期结果**：
- ✅ Claude 调用 MCP 工具
- ✅ 返回包含 Python、JavaScript、TypeScript 等技术栈
- ✅ 响应基于向量数据库检索

---

## 🔧 故障排查

### 问题：Claude Desktop 不显示 MCP 服务器

```powershell
# 1. 检查配置文件位置
ls "$env:APPDATA\Claude\claude_desktop_config.json"

# 2. 验证 JSON 格式
Get-Content "$env:APPDATA\Claude\claude_desktop_config.json" | ConvertFrom-Json

# 3. 查看 Claude 日志
ls "$env:APPDATA\Claude\logs\" | Sort-Object LastWriteTime -Descending | Select-Object -First 1
```

### 问题：MCP 服务器启动失败

```powershell
# 测试 Node.js 版本（需要 >= 18）
node --version

# 手动测试 MCP 服务器
cd "d:\上课\Ai agent\digital twin\mcp-server"
node dist\index.js
```

### 问题：环境变量错误

```powershell
# 确认 .env 文件存在
cd "d:\上课\Ai agent\digital twin"
cat .env

# 复制正确的值到 claude_desktop_config.json
```

---

## 📋 完整配置示例

```json
{
  "mcpServers": {
    "douglas-digital-twin": {
      "command": "node",
      "args": [
        "D:/上课/Ai agent/digital twin/mcp-server/dist/index.js"
      ],
      "env": {
        "UPSTASH_VECTOR_REST_URL": "https://xxx-xxx.upstash.io",
        "UPSTASH_VECTOR_REST_TOKEN": "AXXXabcdefg...",
        "UPSTASH_REDIS_REST_URL": "https://xxx-xxx.upstash.io",
        "UPSTASH_REDIS_REST_TOKEN": "AYYYabcdefg...",
        "GROQ_API_KEY": "gsk_abcdefgh..."
      }
    }
  }
}
```

**⚠️ 注意**：
- 路径使用正斜杠 `/` 或双反斜杠 `\\`
- 环境变量值需要从 `.env` 文件复制真实值
- 配置文件必须是有效的 JSON 格式

---

## ✅ 成功标志

- [ ] 配置文件创建成功
- [ ] JSON 格式验证通过
- [ ] MCP 服务器可手动启动
- [ ] Claude Desktop 重启后无报错
- [ ] 测试查询返回正确响应

---

## 🎯 测试提示

成功后可以试试：

```
1. 基础查询
使用 douglas-digital-twin 工具查询 Douglas 的工作经历。

2. 技术深度
查询 Douglas 在 AI/机器学习方面的经验。

3. STAR 案例
给我一个 Douglas 解决技术难题的 STAR 格式例子。

4. 项目详情
介绍 Douglas 的数字孪生项目技术架构。
```

---

**需要帮助？**查看完整文档：`CLAUDE_DESKTOP_SETUP.md`
