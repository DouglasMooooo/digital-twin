# 🔌 Claude Desktop MCP 配置指南

## 步骤1：安装依赖

```bash
cd "d:\上课\Ai agent\digital twin\mcp-server"
npm install
```

## 步骤2：配置Claude Desktop

### Windows配置文件位置：
`%APPDATA%\Claude\claude_desktop_config.json`

完整路径通常是：
`C:\Users\你的用户名\AppData\Roaming\Claude\claude_desktop_config.json`

### 配置内容：

```json
{
  "mcpServers": {
    "digital-twin": {
      "command": "node",
      "args": ["D:\\上课\\Ai agent\\digital twin\\mcp-server\\index.js"]
    }
  }
}
```

**注意：** 将路径中的 `D:\\上课\\Ai agent\\digital twin` 替换为您的实际项目路径

## 步骤3：重启Claude Desktop

关闭并重新打开Claude Desktop应用

## 步骤4：测试MCP服务器

在Claude Desktop中输入：

```
请使用digital-twin MCP服务器获取Douglas Mo的个人信息
```

或

```
Use the get_personal_info tool from digital-twin server
```

## 🎯 使用示例

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

## ✅ 验证是否配置成功

如果配置成功，您会在Claude Desktop中看到：
- MCP图标显示在聊天界面
- 可以使用上述工具查询您的数字分身数据
- Claude可以直接访问您的简历信息

## 🔧 故障排查

### 问题1：找不到配置文件
手动创建：`%APPDATA%\Claude\claude_desktop_config.json`

### 问题2：MCP服务器不显示
检查：
1. 路径是否正确（使用双反斜杠 `\\`）
2. npm依赖是否安装
3. Claude Desktop是否重启

### 问题3：Node.js未安装
下载安装：https://nodejs.org/

## 📦 需要的文件

确保以下文件存在：
- ✅ `mcp-server/package.json`
- ✅ `mcp-server/index.js`
- ✅ `mcp-server/README.md`
- ✅ `digitaltwin.json` (在项目根目录)
