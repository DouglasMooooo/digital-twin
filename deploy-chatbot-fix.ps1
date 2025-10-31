#!/usr/bin/env pwsh
# 提交并部署改进的聊天界面

Write-Host "🚀 部署聊天界面改进..." -ForegroundColor Cyan

Set-Location "d:\上课\Ai agent\digital twin"

git add components/ChatInterface.tsx

git commit -m "Major chatbot readability improvement: white background, larger and bolder text

Changes:
- Background: bg-gray-50 -> bg-white with border-2 border-gray-200
- Text size: text-sm -> text-base (larger)
- Font weight: font-medium -> font-semibold (bolder)
- Padding: p-3 -> p-4 (more spacing)
- Line height: added leading-relaxed
- Context label: text-xs -> text-sm, darker color"

git push

Write-Host "`n✅ 推送完成！" -ForegroundColor Green
Write-Host "📍 访问 Vercel 查看构建状态: https://vercel.com/douglasmoooo/digital-twin" -ForegroundColor Cyan
Write-Host "📍 网站: https://douglasmo.vercel.app`n" -ForegroundColor Cyan
