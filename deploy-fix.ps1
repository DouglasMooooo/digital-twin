#!/usr/bin/env pwsh
# 修复 Vercel 构建错误 - 排除 MCP Server 和 VS Code Extension

Write-Host "🔧 准备提交构建修复..." -ForegroundColor Cyan

# 添加修改的文件
git add next.config.js tsconfig.json app/api/feedback/route.ts

# 提交
git commit -m "fix: 排除 mcp-server/vscode-extension 目录 + 修复 feedback.ts 类型安全

- next.config.js: 添加 webpack watchOptions 排除目录
- tsconfig.json: exclude 数组添加 mcp-server 和 vscode-extension
- app/api/feedback/route.ts: Redis 返回值类型转换和空值检查

这修复了 Vercel 构建错误:
1. MCP SDK 模块找不到 (mcp-server 不应被 Next.js 构建)
2. feedback.ts 类型安全问题"

# 推送
Write-Host "📤 推送到 GitHub..." -ForegroundColor Yellow
git push origin main

Write-Host "✅ 完成！Vercel 将自动重新构建" -ForegroundColor Green
Write-Host "🔗 监控部署: https://vercel.com/douglasmooooos-projects/digital-twin" -ForegroundColor Cyan
