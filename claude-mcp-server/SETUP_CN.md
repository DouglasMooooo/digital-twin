# 🔌 Claude Desktop MCP 服务器配置指南

## 概述

这是专门为 **Claude Desktop** 设计的 **MCP (Model Context Protocol) 服务器**，用于提供数字分身数据访问功能。

**MCP服务器类型：** Claude Desktop MCP Server
**功能：** 提供Douglas Mo的数字分身数据查询
**集成平台：** Claude Desktop 应用

## 步骤1：安装 Claude Desktop MCP 服务器依赖

```bash
cd "d:\上课\Ai agent\digital twin\claude-mcp-server"
npm install
```

## 步骤2：配置 Claude Desktop MCP 服务器

### Windows 配置文件位置
`%APPDATA%\Claude\claude_desktop_config.json`

完整路径通常是：
`C:\Users\你的用户名\AppData\Roaming\Claude\claude_desktop_config.json`

### 配置内容

```json
{
  "mcpServers": {
    "digital-twin": {
      "command": "node",
      "args": ["D:\\上课\\Ai agent\\digital twin\\claude-mcp-server\\index.js"]
    }
  }
}
```

**注意：** 将路径中的 `D:\\上课\\Ai agent\\digital twin` 替换为您的实际项目路径

## 步骤3：重启 Claude Desktop

关闭并重新打开 Claude Desktop 应用，让 MCP 服务器配置生效。

## 步骤4：测试 Claude Desktop MCP 服务器

在 Claude Desktop 中输入测试命令，验证 MCP 服务器是否正常工作：

```
请使用 digital-twin MCP 服务器获取 Douglas Mo 的个人信息
```

或使用英文命令：

```
Use the get_personal_info tool from digital-twin server
```

## 🎯 Claude Desktop MCP 服务器使用示例

### 1. 获取个人信息
```
Get my personal information using the digital-twin MCP
```

### 2. 搜索工作经验
```
Search my experience for "financial management" using digital-twin
```

### 3. 生成定制简历
```
Generate a resume summary for a Data Analyst position focusing on Python and SQL
```

### 4. 获取特定类别技能
```
Get my programming skills from the digital-twin server
```

## ✅ 验证 Claude Desktop MCP 服务器配置成功

如果配置成功，您会在 Claude Desktop 中看到：
- MCP 图标显示在聊天界面
- 可以使用上述工具查询您的数字分身数据
- Claude 可以直接访问您的简历信息

## 🔧 Claude Desktop MCP 服务器故障排查

### 问题1：找不到配置文件
手动创建：`%APPDATA%\Claude\claude_desktop_config.json`

### 问题2：MCP 服务器不显示
检查：
1. 路径是否正确（使用双反斜杠 `\\`）
2. npm 依赖是否安装
3. Claude Desktop 是否重启

### 问题3：Node.js 未安装
下载安装：https://nodejs.org/

## 📦 Claude Desktop MCP 服务器所需文件

确保以下文件存在：
- ✅ `claude-mcp-server/package.json`
- ✅ `claude-mcp-server/index.js`
- ✅ `claude-mcp-server/README.md`
- ✅ `digitaltwin.json` (在项目根目录)
