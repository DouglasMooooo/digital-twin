#!/usr/bin/env pwsh
# Deploy dashboard fixes to Vercel

Write-Host "🚀 Deploying dashboard fixes..." -ForegroundColor Cyan

# Add files
git add app/admin/dashboard/page.tsx
Write-Host "✓ Files staged" -ForegroundColor Green

# Commit
git commit -m "Fix dashboard: use hourlyActivity and interviewTypeDistribution from Redis"
Write-Host "✓ Changes committed" -ForegroundColor Green

# Push
git push origin main
Write-Host "✓ Pushed to GitHub" -ForegroundColor Green

Write-Host "`n✅ Deployment complete! Vercel will auto-deploy in ~1-2 minutes" -ForegroundColor Green
Write-Host "📊 Dashboard URL: https://douglasmo.vercel.app/admin/dashboard" -ForegroundColor Yellow
Write-Host "🔐 Password: admin123" -ForegroundColor Yellow
