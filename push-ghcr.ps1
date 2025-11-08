#!/usr/bin/env pwsh
# 推送 GHCR workflow 改动到 GitHub
cd "d:\上课\Ai agent\digital twin"
Write-Host "当前目录: $(Get-Location)"
Write-Host "检查 git 状态..."
git status

Write-Host "`n检查 workflow 文件改动..."
git diff .github/workflows/ci-cd.yml | head -20

Write-Host "`n提交改动..."
git add ".github/workflows/ci-cd.yml"
git commit -m "fix: switch Docker push to GHCR with GITHUB_TOKEN"

Write-Host "`n推送到 main 分支..."
git push origin main

Write-Host "`n✅ 推送完成！"
Write-Host "请打开 Actions 页面查看 CI 进度："
Write-Host "https://github.com/DouglasMooooo/digital-twin/actions"
