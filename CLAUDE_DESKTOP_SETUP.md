# Claude Desktop MCP 配置指南

## 📋 概述

本指南教你如何配置 Claude Desktop 使用 Douglas Mo 数字孪生 MCP 服务器，实现在 Claude 中直接查询专业背景信息。

---

## 🚀 第一步：安装 Claude Desktop

### Windows 用户

1. 访问 https://claude.ai/download
2. 下载 Windows 版本
3. 运行安装程序
4. 启动 Claude Desktop 并登录

### macOS 用户

1. 访问 https://claude.ai/download
2. 下载 macOS 版本
3. 拖动到 Applications 文件夹
4. 启动 Claude 并登录

---

## 🔧 第二步：编译 MCP 服务器

在项目根目录打开终端：

```powershell
# 进入 MCP 服务器目录
cd "d:\上课\Ai agent\digital twin\mcp-server"

# 安装依赖（如果还没安装）
npm install

# 编译 TypeScript 到 JavaScript
npm run build

# 验证编译成功
ls dist\index.js
```

**预期输出**：
```
✅ dist/index.js 文件已创建
```

---

## ⚙️ 第三步：配置 Claude Desktop

### Windows 配置路径

配置文件位置：
```
%APPDATA%\Claude\claude_desktop_config.json
```

完整路径示例：
```
C:\Users\你的用户名\AppData\Roaming\Claude\claude_desktop_config.json
```

### 快速创建配置文件（PowerShell）

```powershell
# 创建配置目录（如果不存在）
$configDir = "$env:APPDATA\Claude"
if (!(Test-Path $configDir)) {
    New-Item -ItemType Directory -Path $configDir -Force
}

# 创建配置文件
$configPath = "$configDir\claude_desktop_config.json"

# 配置内容
$config = @{
    mcpServers = @{
        "douglas-digital-twin" = @{
            command = "node"
            args = @(
                "d:\上课\Ai agent\digital twin\mcp-server\dist\index.js"
            )
            env = @{
                UPSTASH_VECTOR_REST_URL = "你的_UPSTASH_VECTOR_URL"
                UPSTASH_VECTOR_REST_TOKEN = "你的_UPSTASH_VECTOR_TOKEN"
                UPSTASH_REDIS_REST_URL = "你的_UPSTASH_REDIS_URL"
                UPSTASH_REDIS_REST_TOKEN = "你的_UPSTASH_REDIS_TOKEN"
                GROQ_API_KEY = "你的_GROQ_API_KEY"
            }
        }
    }
} | ConvertTo-Json -Depth 10

# 保存配置
$config | Out-File -FilePath $configPath -Encoding UTF8

Write-Host "✅ 配置文件已创建: $configPath"
```

### 手动编辑配置文件

1. **找到配置文件**：
   - 按 `Win + R`
   - 输入 `%APPDATA%\Claude`
   - 回车

2. **创建或编辑 `claude_desktop_config.json`**：

```json
{
  "mcpServers": {
    "douglas-digital-twin": {
      "command": "node",
      "args": [
        "d:\\上课\\Ai agent\\digital twin\\mcp-server\\dist\\index.js"
      ],
      "env": {
        "UPSTASH_VECTOR_REST_URL": "https://xxx.upstash.io",
        "UPSTASH_VECTOR_REST_TOKEN": "你的token",
        "UPSTASH_REDIS_REST_URL": "https://xxx.upstash.io",
        "UPSTASH_REDIS_REST_TOKEN": "你的token",
        "GROQ_API_KEY": "gsk_xxx"
      }
    }
  }
}
```

**⚠️ 重要提示**：
- 路径中的反斜杠需要双写 `\\` 或使用正斜杠 `/`
- 环境变量值需要从你的 `.env` 文件复制

### macOS 配置路径

配置文件位置：
```
~/Library/Application Support/Claude/claude_desktop_config.json
```

配置内容（macOS）：
```json
{
  "mcpServers": {
    "douglas-digital-twin": {
      "command": "node",
      "args": [
        "/path/to/digital twin/mcp-server/dist/index.js"
      ],
      "env": {
        "UPSTASH_VECTOR_REST_URL": "https://xxx.upstash.io",
        "UPSTASH_VECTOR_REST_TOKEN": "your_token",
        "UPSTASH_REDIS_REST_URL": "https://xxx.upstash.io",
        "UPSTASH_REDIS_REST_TOKEN": "your_token",
        "GROQ_API_KEY": "gsk_xxx"
      }
    }
  }
}
```

---

## 🔑 第四步：获取环境变量

从项目的 `.env` 文件复制以下变量：

```powershell
# 查看你的环境变量
cd "d:\上课\Ai agent\digital twin"
cat .env
```

需要的变量：
- `UPSTASH_VECTOR_REST_URL`
- `UPSTASH_VECTOR_REST_TOKEN`
- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`
- `GROQ_API_KEY`

---

## ✅ 第五步：重启 Claude Desktop

1. 完全关闭 Claude Desktop（任务管理器确认进程结束）
2. 重新启动 Claude Desktop
3. 等待 MCP 服务器加载（约 5-10 秒）

---

## 🧪 第六步：测试 MCP 连接

### 检查 MCP 服务器状态

在 Claude Desktop 中，查看左下角是否显示 MCP 服务器图标或状态。

### 发送测试查询

在 Claude Desktop 中输入以下测试消息：

```
请使用 douglas-digital-twin 工具查询 Douglas 的技术技能。
```

或更直接：

```
调用 query_digital_twin 工具，查询内容：Douglas 有哪些编程语言经验？
```

**预期行为**：
- ✅ Claude 调用 MCP 工具
- ✅ 返回包含具体技术栈的回答
- ✅ 响应基于向量数据库检索

---

## 🔧 故障排查

### 问题 1：Claude Desktop 不显示 MCP 服务器

**可能原因**：
- 配置文件格式错误（JSON 语法）
- 路径错误

**解决方案**：
1. 验证 JSON 格式（使用在线工具 jsonlint.com）
2. 检查路径是否正确：
   ```powershell
   node "d:\上课\Ai agent\digital twin\mcp-server\dist\index.js"
   ```
   应该能运行不报错

3. 查看 Claude Desktop 日志：
   - Windows: `%APPDATA%\Claude\logs\`
   - macOS: `~/Library/Logs/Claude/`

### 问题 2：MCP 服务器启动失败

**可能原因**：
- 环境变量缺失或错误
- Node.js 版本过低

**解决方案**：
1. 确认 Node.js 版本 ≥ 18：
   ```powershell
   node --version  # 应该显示 v18.x 或更高
   ```

2. 测试环境变量：
   ```powershell
   cd "d:\上课\Ai agent\digital twin\mcp-server"
   $env:UPSTASH_VECTOR_REST_URL = "你的URL"
   $env:GROQ_API_KEY = "你的KEY"
   node dist\index.js
   ```

3. 查看错误日志

### 问题 3：工具调用无响应

**可能原因**：
- API 凭据过期
- 网络连接问题

**解决方案**：
1. 验证 API 可访问：
   ```powershell
   curl https://douglasmo.vercel.app/api/chat -Method POST -Body '{"message":"test"}' -ContentType "application/json"
   ```

2. 检查 Upstash 仪表板确认配额未耗尽

---

## 📊 验证清单

配置成功的标志：

- [ ] MCP 服务器已编译（`dist/index.js` 存在）
- [ ] 配置文件格式正确（JSON 验证通过）
- [ ] 环境变量已正确填写
- [ ] Claude Desktop 重启后显示 MCP 连接
- [ ] 测试查询返回正确响应
- [ ] 响应包含具体的专业信息

---

## 🎯 测试提示示例

配置成功后，可以在 Claude Desktop 中尝试：

### 基础查询
```
使用 douglas-digital-twin 工具查询：Douglas 的工作经历是什么？
```

### 技术深度
```
查询 Douglas 在 AI 和机器学习方面的经验。
```

### STAR 格式
```
给我一个 Douglas 解决技术难题的 STAR 格式案例。
```

### 项目详情
```
介绍 Douglas 的数字孪生项目架构。
```

---

## 💡 使用技巧

1. **明确指定工具**：首次使用时明确说"使用 douglas-digital-twin 工具"
2. **具体查询**：提供具体问题而非宽泛查询
3. **STAR 格式**：请求 STAR 格式回答可获得结构化案例
4. **多轮对话**：可以基于前一次回答深挖细节

---

## 📈 性能对比

| 平台 | 响应时间 | 优势 | 劣势 |
|------|---------|------|------|
| **Claude Desktop** | ~1-2s | 本地化、隐私保护 | 需要手动配置 |
| **ChatGPT GPT** | ~1-2s | 无需配置、分享便捷 | 需要 ChatGPT Plus |
| **Web App** | ~1-2s | 最易访问 | 需要网络连接 |
| **VS Code Extension** | ~1-2s | 开发环境集成 | 仅限 VS Code |

---

## 🆘 需要帮助？

如果配置过程中遇到问题：

1. **检查日志**：
   ```powershell
   # Windows
   cd $env:APPDATA\Claude\logs
   cat (Get-ChildItem | Sort-Object LastWriteTime -Descending | Select-Object -First 1).FullName
   ```

2. **手动测试 MCP 服务器**：
   ```powershell
   cd "d:\上课\Ai agent\digital twin\mcp-server"
   node dist\index.js
   # 应该启动并等待 stdin 输入
   ```

3. **验证配置文件**：
   ```powershell
   # 检查 JSON 格式
   Get-Content "$env:APPDATA\Claude\claude_desktop_config.json" | ConvertFrom-Json
   # 不报错说明格式正确
   ```

---

## 📎 附录：完整配置脚本（一键配置）

```powershell
# === Claude Desktop MCP 一键配置脚本 ===

# 1. 编译 MCP 服务器
Write-Host "🔨 编译 MCP 服务器..." -ForegroundColor Cyan
cd "d:\上课\Ai agent\digital twin\mcp-server"
npm run build

if (Test-Path "dist\index.js") {
    Write-Host "✅ MCP 服务器编译成功" -ForegroundColor Green
} else {
    Write-Host "❌ 编译失败" -ForegroundColor Red
    exit 1
}

# 2. 读取环境变量
Write-Host "`n🔑 读取环境变量..." -ForegroundColor Cyan
cd ".."
$envContent = Get-Content ".env" -Raw
$envVars = @{}
$envContent -split "`n" | ForEach-Object {
    if ($_ -match "^([^=]+)=(.+)$") {
        $envVars[$matches[1].Trim()] = $matches[2].Trim()
    }
}

# 3. 创建配置
Write-Host "⚙️  生成 Claude Desktop 配置..." -ForegroundColor Cyan
$configDir = "$env:APPDATA\Claude"
if (!(Test-Path $configDir)) {
    New-Item -ItemType Directory -Path $configDir -Force | Out-Null
}

$config = @{
    mcpServers = @{
        "douglas-digital-twin" = @{
            command = "node"
            args = @(
                "d:\上课\Ai agent\digital twin\mcp-server\dist\index.js"
            )
            env = @{
                UPSTASH_VECTOR_REST_URL = $envVars['UPSTASH_VECTOR_REST_URL']
                UPSTASH_VECTOR_REST_TOKEN = $envVars['UPSTASH_VECTOR_REST_TOKEN']
                UPSTASH_REDIS_REST_URL = $envVars['UPSTASH_REDIS_REST_URL']
                UPSTASH_REDIS_REST_TOKEN = $envVars['UPSTASH_REDIS_REST_TOKEN']
                GROQ_API_KEY = $envVars['GROQ_API_KEY']
            }
        }
    }
}

$configPath = "$configDir\claude_desktop_config.json"
$config | ConvertTo-Json -Depth 10 | Out-File -FilePath $configPath -Encoding UTF8

Write-Host "✅ 配置文件已创建: $configPath" -ForegroundColor Green

# 4. 验证
Write-Host "`n🧪 验证配置..." -ForegroundColor Cyan
$loadedConfig = Get-Content $configPath | ConvertFrom-Json
if ($loadedConfig.mcpServers.'douglas-digital-twin') {
    Write-Host "✅ 配置验证成功" -ForegroundColor Green
} else {
    Write-Host "❌ 配置验证失败" -ForegroundColor Red
    exit 1
}

# 5. 提示
Write-Host "`n🎉 配置完成！" -ForegroundColor Green
Write-Host "`n📋 下一步操作:" -ForegroundColor Yellow
Write-Host "1. 完全关闭 Claude Desktop（任务管理器确认）" -ForegroundColor White
Write-Host "2. 重新启动 Claude Desktop" -ForegroundColor White
Write-Host "3. 发送测试消息：'使用 douglas-digital-twin 工具查询 Douglas 的技能'" -ForegroundColor White
Write-Host "`n📂 配置文件位置: $configPath" -ForegroundColor Cyan
```

保存为 `setup-claude-desktop.ps1`，然后运行：
```powershell
cd "d:\上课\Ai agent\digital twin"
.\setup-claude-desktop.ps1
```

---

**创建日期**: 2025-11-01  
**版本**: 1.0  
**作者**: Douglas Mo  
**相关文档**:
- `mcp-server/README.md` - MCP 服务器说明
- `MCP_ECOSYSTEM_GUIDE.md` - MCP 生态系统指南
