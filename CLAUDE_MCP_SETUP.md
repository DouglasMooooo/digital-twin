# 🚀 Claude MCP 配置指南

## 问题
Claude Desktop 中的 MCP 显示为空

## 解决方案

### 方式 1: 自动配置（推荐）
```bash
1. 运行: setup-claude-mcp.bat
2. 重启 Claude Desktop
3. MCP 工具应该出现
```

### 方式 2: 手动配置

#### Windows
1. 打开文件管理器
2. 地址栏输入: `%APPDATA%\Claude`
3. 找到 `claude_desktop_config.json`
4. 用文本编辑器打开（记事本或 VS Code）
5. 复制以下内容替换 `mcpServers` 部分：

```json
{
  "mcpServers": {
    "douglas-digital-twin": {
      "command": "node",
      "args": [
        "D:\\上课\\Ai agent\\digital twin\\claude-mcp-server\\dist\\claude-mcp-server\\index.js"
      ],
      "env": {},
      "metadata": {
        "name": "Douglas Mo Digital Twin",
        "version": "2.0.0",
        "description": "AI-powered digital twin with interview preparation"
      }
    }
  }
}
```

6. 保存文件
7. 重启 Claude Desktop

#### Mac
配置文件位置: `~/Library/Application Support/Claude/claude_desktop_config.json`

配置内容:
```json
{
  "mcpServers": {
    "douglas-digital-twin": {
      "command": "node",
      "args": [
        "/Users/您的用户名/path/to/digital-twin/claude-mcp-server/dist/claude-mcp-server/index.js"
      ]
    }
  }
}
```

#### Linux
配置文件位置: `~/.config/Claude/claude_desktop_config.json`

### 验证配置

1. 重启 Claude Desktop
2. 在新对话中输入: `@claude-mcp`
3. 应该看到可用的工具列表，如:
   - `get_experience` - 获取工作经历
   - `get_skills` - 获取技能
   - `get_projects` - 获取项目
   - `get_interview_prep` - 获取面试准备

## 常见问题

### MCP 仍然为空
- ✓ 确认文件路径正确（注意路径中的中文）
- ✓ 确认 Node.js 已安装 (`node --version`)
- ✓ 尝试重启电脑
- ✓ 检查 Claude Desktop 日志

### 错误: "Command not found"
- ✓ 确认 Node.js 在 PATH 中
- ✓ 在终端运行 `node --version` 测试

### 路径错误
- ✓ 确保使用正确的路径分隔符 (`\` for Windows, `/` for Mac/Linux)
- ✓ 中文路径需要正确转义

## 测试 MCP

在 Claude 中输入:
```
@claude-mcp get_personal_info
```

应该返回你的个人信息数据。

---

**需要帮助?** 检查 Claude Desktop 的日志文件获取更多错误信息。
