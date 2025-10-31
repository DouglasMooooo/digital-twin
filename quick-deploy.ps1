#!/usr/bin/env pwsh
# 快速部署脚本

Write-Host "🚀 开始部署到 Vercel..." -ForegroundColor Cyan
Write-Host "=" * 60 -ForegroundColor Gray

# 切换到项目目录
Set-Location "d:\上课\Ai agent\digital twin"

# 显示当前状态
Write-Host "`n📊 检查 Git 状态..." -ForegroundColor Yellow
git status --short

# 添加所有文件
Write-Host "`n➕ 添加所有更改..." -ForegroundColor Yellow
git add .

# 提交
Write-Host "`n💾 提交更改..." -ForegroundColor Yellow
git commit -m "Complete workshop: Add MCP ecosystem, workflow diagrams, 15 STAR achievements"

# 推送到 GitHub
Write-Host "`n🔼 推送到 GitHub..." -ForegroundColor Yellow
git push

Write-Host "`n✅ 部署完成！" -ForegroundColor Green
Write-Host "🌐 Vercel 正在自动部署..." -ForegroundColor Cyan
Write-Host "📍 预计 1-2 分钟后可访问: https://douglasmo.vercel.app" -ForegroundColor Cyan

Write-Host "`n🔍 验证步骤:" -ForegroundColor Yellow
Write-Host "1. 访问 GitHub: https://github.com/DouglasMooooo/digital-twin/commits/main" -ForegroundColor White
Write-Host "2. 访问 Vercel: https://vercel.com/douglasmoooo/digital-twin" -ForegroundColor White
Write-Host "3. 测试网站: https://douglasmo.vercel.app" -ForegroundColor White

Write-Host "`n🎉 完成！" -ForegroundColor Green
