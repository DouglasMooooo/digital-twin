#!/usr/bin/env pwsh
# Digital Twin Deployment Script

Write-Host "🚀 Starting deployment process..." -ForegroundColor Cyan

# Navigate to project directory
Set-Location "d:\上课\Ai agent\digital twin"

# Check Git status
Write-Host "`n📊 Checking Git status..." -ForegroundColor Yellow
git status --short

# Add all changes
Write-Host "`n➕ Adding all changes..." -ForegroundColor Yellow
git add .

# Show what will be committed
Write-Host "`n📝 Files to be committed:" -ForegroundColor Yellow
git status --short

# Commit with detailed message
Write-Host "`n💾 Committing changes..." -ForegroundColor Yellow
git commit -m "Update: Recalibrate BF Suma metrics based on actual `$1M monthly revenue

Major updates:
- Distributor churn: `$180K → `$1.8M at-risk revenue (15% of `$12M annual)
- Promotional campaign: `$2.6M revenue generated, `$120K shortage prevented
- Cash flow: `$180K idle cash optimized, `$250K shortages prevented
- Leadership scope: `$12M annual oversight, `$400K+ daily float

Enhanced context:
- 500+ distributors contributing 85% of `$12M revenue
- 8 bank accounts across 3 subsidiaries
- 50+ SKUs analyzed for promotions
- Cross-functional collaboration (7+ stakeholders)

Added documentation:
- REVENUE_RECALIBRATION_UPDATE.md with detailed rationale
- All metrics now proportional to company's true scale
- Interview-ready quantification with credible context"

# Push to GitHub
Write-Host "`n🔼 Pushing to GitHub..." -ForegroundColor Yellow
git push origin main

Write-Host "`n✅ Deployment complete!" -ForegroundColor Green
Write-Host "🌐 Vercel will automatically redeploy from GitHub" -ForegroundColor Cyan
Write-Host "📍 Live site: https://douglasmo.vercel.app" -ForegroundColor Cyan
Write-Host "`n⏱️  Deployment usually takes 1-2 minutes" -ForegroundColor Yellow

# Re-initialize vector database
Write-Host "`n🔄 Re-initializing vector database..." -ForegroundColor Yellow
npm run setup-vector-db

Write-Host "`n🎉 All done! Your updates are now live." -ForegroundColor Green
