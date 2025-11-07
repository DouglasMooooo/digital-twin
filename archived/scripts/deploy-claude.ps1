#!/usr/bin/env pwsh
# Deploy Claude Desktop Integration

Write-Host "🔄 Resetting last commit..." -ForegroundColor Yellow
git reset --soft HEAD~1

Write-Host "📝 Adding safe files only..." -ForegroundColor Yellow  
git add app/page.tsx
git add mcp-server/digitaltwin.json
git add CLAUDE_DESKTOP_QUICKSTART.md

Write-Host "💾 Committing changes..." -ForegroundColor Yellow
git commit -m "feat: add Claude Desktop MCP integration to homepage

- Add Claude Desktop card (4th integration option, orange theme)
- Complete 4-platform coverage: Web + VS Code + ChatGPT GPT + Claude Desktop
- Copy digitaltwin.json to mcp-server directory (fix MCP server data loading)
- MCP server tested and running successfully
- Update homepage stats: 3 → 4 integration options
- Add CLAUDE_DESKTOP_QUICKSTART.md setup guide

Features:
✓ Native Claude Desktop integration via MCP protocol
✓ Vector-powered professional profile queries
✓ Real-time semantic search
✓ Complete documentation provided"

Write-Host "🚀 Pushing to GitHub..." -ForegroundColor Yellow
git push origin main

Write-Host "✅ Deployment complete!" -ForegroundColor Green
Write-Host "🌐 Vercel will auto-deploy from main branch" -ForegroundColor Cyan
Write-Host "📍 Live at: https://douglasmo.vercel.app" -ForegroundColor Cyan
