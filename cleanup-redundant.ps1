# 清理冗余文件脚本
# Cleanup Redundant Files Script

param(
    [switch]$DryRun = $false,
    [switch]$Force = $false
)

# 项目目录
$projectDir = "d:\上课\Ai agent\digital twin"
Set-Location $projectDir

# 要删除的文件列表
$filesToDelete = @(
    # 备份文件
    "digitaltwin.backup.json",
    "digitaltwin.json.backup",
    ".env.example",
    ".env.production.example",
    
    # 过时的阶段报告
    "PHASE2_COMPLETION_REPORT.md",
    "PHASE2_IMPLEMENTATION.md",
    "PHASE3_COMPLETION_REPORT.md",
    "PHASE3_PLAN.md",
    "PHASE3_STATUS.md",
    "PHASE4_COMPLETION_REPORT.md",
    
    # 过时的摘要和文档
    "EXECUTIVE_SUMMARY.md",
    "EXECUTIVE_SUMMARY_FINAL.md",
    "FINAL_SUMMARY.txt",
    "FINAL_SUMMARY_CN.md",
    "WORK_SUMMARY_CN.md",
    "SESSION_SUMMARY.md",
    "PROJECT_STATUS.md",
    "PROJECT_COMPLETION_CERTIFICATE.txt",
    "README_PHASE2_COMPLETE.md",
    "README_PHASE3.md",
    "CONTENT_UPDATE_SUMMARY.md",
    
    # 重复的快速开始和部署指南
    "QUICKSTART.md",
    "QUICK_REFERENCE.md",
    "AUTO_APPROVE_README.md",
    "DEPLOYMENT_CHECKLIST.md",
    "FREE_DEPLOYMENT_GUIDE.md"
)

Write-Host "🗑️  清理冗余文件" -ForegroundColor Cyan
Write-Host "=" * 60 -ForegroundColor Cyan
Write-Host ""

if ($DryRun) {
    Write-Host "⚠️  [干运行模式] - 仅显示将要删除的文件，不实际删除" -ForegroundColor Yellow
    Write-Host ""
}

$deletedCount = 0
$failedCount = 0

foreach ($file in $filesToDelete) {
    $filePath = Join-Path $projectDir $file
    
    if (Test-Path $filePath) {
        if ($DryRun) {
            Write-Host "[-] 将删除: $file" -ForegroundColor Yellow
        } else {
            try {
                Remove-Item $filePath -Force -ErrorAction Stop
                Write-Host "✓ 已删除: $file" -ForegroundColor Green
                $deletedCount++
            }
            catch {
                Write-Host "✗ 失败: $file - $($_.Exception.Message)" -ForegroundColor Red
                $failedCount++
            }
        }
    } else {
        Write-Host "- 不存在: $file" -ForegroundColor Gray
    }
}

Write-Host ""
Write-Host "=" * 60 -ForegroundColor Cyan
Write-Host ""
Write-Host "📊 清理结果:" -ForegroundColor Cyan
Write-Host "  ✓ 成功删除: $deletedCount 个文件" -ForegroundColor Green
Write-Host "  ✗ 删除失败: $failedCount 个文件" -ForegroundColor Red
Write-Host ""

if ($DryRun) {
    Write-Host "ℹ️  干运行完成。要真正删除文件，请运行:" -ForegroundColor Yellow
    Write-Host "   .\cleanup-redundant.ps1 -Force" -ForegroundColor Yellow
} else {
    Write-Host "✅ 清理完成！项目已精简。" -ForegroundColor Green
    Write-Host ""
    Write-Host "📝 保留的核心文件:" -ForegroundColor Cyan
    Write-Host "  • digitaltwin.json - 核心职业档案数据" -ForegroundColor Gray
    Write-Host "  • DEPLOYMENT_GUIDE.md - 最新部署指南" -ForegroundColor Gray
    Write-Host "  • GIT_AUTO_APPROVE_GUIDE.md - Git 自动批准指南" -ForegroundColor Gray
    Write-Host "  • AUTO_APPROVE_COMPLETE_SUMMARY.md - 完整总结" -ForegroundColor Gray
    Write-Host "  • SCRIPTS_QUICKREF.md - 快速参考" -ForegroundColor Gray
    Write-Host "  • AUTO_APPROVE_CHECKLIST.md - 执行清单" -ForegroundColor Gray
    Write-Host "  • auto-approve-*.* - 自动批准脚本 (5 种)" -ForegroundColor Gray
}
