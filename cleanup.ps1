#!/usr/bin/env pwsh
# Cleanup unused files

Write-Host "🧹 Cleaning up unused files..." -ForegroundColor Cyan

# Remove deployment scripts that are redundant
$filesToRemove = @(
    "deploy-chatbot-fix.ps1",
    "deploy-dashboard-fix.ps1", 
    "deploy.bat",
    "hotfix-deploy.ps1",
    "quick-deploy.ps1"
)

foreach ($file in $filesToRemove) {
    if (Test-Path $file) {
        git rm $file
        Write-Host "✓ Removed: $file" -ForegroundColor Green
    }
}

# Commit the cleanup
git commit -m "chore: Remove unused deployment scripts"
git push

Write-Host "`n✅ Cleanup complete!" -ForegroundColor Green
