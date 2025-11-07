# Cleanup Redundant Files Script
# Created: November 6, 2025

Write-Host "🧹 Cleaning up redundant files..." -ForegroundColor Cyan

$filesToDelete = @(
    "ASSIGNMENT_COMPLETION_REPORT.md",
    "FINAL_SUBMISSION_PACKAGE.md", 
    "SUBMISSION_GUIDE.md",
    "SUBMISSION_READY.md",
    "DEPLOYMENT_UPDATE.md",
    "submission.rar"
)

$baseDir = "d:\上课\Ai agent\digital twin"

foreach ($file in $filesToDelete) {
    $fullPath = Join-Path $baseDir $file
    if (Test-Path $fullPath) {
        Remove-Item $fullPath -Force
        Write-Host "✅ Deleted: $file" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Not found: $file" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "✨ Cleanup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Deleted files:" -ForegroundColor Cyan
Write-Host "- ASSIGNMENT_COMPLETION_REPORT.md (redundant with submission folder)" -ForegroundColor Gray
Write-Host "- FINAL_SUBMISSION_PACKAGE.md (redundant with submission folder)" -ForegroundColor Gray
Write-Host "- SUBMISSION_GUIDE.md (redundant with QUICKSTART.md)" -ForegroundColor Gray
Write-Host "- SUBMISSION_READY.md (temporary status file)" -ForegroundColor Gray
Write-Host "- DEPLOYMENT_UPDATE.md (temporary deployment notes)" -ForegroundColor Gray
Write-Host "- submission.rar (archive file, source files in submission/)" -ForegroundColor Gray
