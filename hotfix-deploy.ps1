#!/usr/bin/env pwsh
# 修复聊天界面字体可读性并重新部署

Write-Host "🔧 修复聊天界面字体颜色..." -ForegroundColor Cyan
Write-Host "=" * 60 -ForegroundColor Gray

Set-Location "d:\上课\Ai agent\digital twin"

Write-Host "`n➕ 添加修复的文件..." -ForegroundColor Yellow
git add components/ChatInterface.tsx

Write-Host "`n💾 提交修复..." -ForegroundColor Yellow
git commit -m "Improve chatbot text readability: darker font and lighter background"

Write-Host "`n🔼 推送到 GitHub..." -ForegroundColor Yellow
git push

Write-Host "`n✅ 修复完成！Vercel 正在重新部署..." -ForegroundColor Green
Write-Host "📍 预计 1-2 分钟后可访问: https://douglasmo.vercel.app`n" -ForegroundColor Cyan
