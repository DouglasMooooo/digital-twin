# 冗余文件清理脚本
# 将不常用的文档和文件归档到 archived/ 文件夹

Write-Host "🗂️  开始清理冗余文件..." -ForegroundColor Cyan

# 确保 archived 目录存在
$archivedRoot = ".\archived"
$archivedDocs = ".\archived\documentation"
$archivedScripts = ".\archived\scripts"
$archivedResume = ".\archived\resume-materials"

# 创建目录（如果不存在）
New-Item -ItemType Directory -Path $archivedRoot -Force | Out-Null
New-Item -ItemType Directory -Path $archivedDocs -Force | Out-Null
New-Item -ItemType Directory -Path $archivedScripts -Force | Out-Null
New-Item -ItemType Directory -Path $archivedResume -Force | Out-Null

# ========================================
# 1. 归档重复/过时的文档
# ========================================

Write-Host "`n📄 归档文档文件..." -ForegroundColor Yellow

$docsToArchive = @(
    "CHATGPT_HALLUCINATION_FIX.md",           # 修复记录，已完成
    "DEPLOYMENT_SUMMARY.md",                  # 部署总结，已完成
    "CLAUDE_DESKTOP_QUICKSTART.md",           # 快速配置指南，可保留在 mcp-server/
    "LINKEDIN_PROFILE_CONTENT.md",            # LinkedIn 内容（简历材料）
    "RESUME_DOUGLAS_MO.md",                   # 完整简历
    "RESUME_DOUGLAS_MO_COMPACT.md",           # 紧凑简历
    "RESUME_LINKEDIN_GUIDE.md",               # LinkedIn 指南
    "IMPLEMENTATION_ROADMAP.md",              # 实施路线图（已完成）
    "SUBMISSION_CHECKLIST.md"                 # 提交清单（已完成）
)

foreach ($file in $docsToArchive) {
    if (Test-Path $file) {
        # 简历相关的文件移动到 resume-materials
        if ($file -like "*RESUME*" -or $file -like "*LINKEDIN*") {
            Move-Item -Path $file -Destination $archivedResume -Force
            Write-Host "  ✅ $file → archived/resume-materials/" -ForegroundColor Green
        }
        else {
            Move-Item -Path $file -Destination $archivedDocs -Force
            Write-Host "  ✅ $file → archived/documentation/" -ForegroundColor Green
        }
    }
}

# ========================================
# 2. 归档部署脚本
# ========================================

Write-Host "`n🔧 归档脚本文件..." -ForegroundColor Yellow

$scriptsToArchive = @(
    "cleanup-redundant-files.ps1",    # 旧的清理脚本
    "deploy-claude.ps1",              # Claude 部署脚本
    "setup-mcp-servers.ps1"           # MCP 设置脚本
)

foreach ($script in $scriptsToArchive) {
    if (Test-Path $script) {
        Move-Item -Path $script -Destination $archivedScripts -Force
        Write-Host "  ✅ $script → archived/scripts/" -ForegroundColor Green
    }
}

# ========================================
# 3. 归档测试报告（可选）
# ========================================

Write-Host "`n📊 归档测试报告..." -ForegroundColor Yellow

$testFilesToArchive = @(
    "TEST_ANALYTICS.md",              # 测试分析
    "TEST_RESULTS.json",              # 测试结果
    "PERFORMANCE_REPORT.md",          # 性能报告
    "TESTING_GUIDE.md"                # 测试指南
)

# 询问是否归档测试文件
Write-Host "`n❓ 是否归档测试报告？这些文件可能对未来参考有用。" -ForegroundColor Magenta
$archiveTests = Read-Host "  输入 'y' 归档测试文件，或按 Enter 跳过"

if ($archiveTests -eq 'y' -or $archiveTests -eq 'Y') {
    foreach ($file in $testFilesToArchive) {
        if (Test-Path $file) {
            Move-Item -Path $file -Destination $archivedDocs -Force
            Write-Host "  ✅ $file → archived/documentation/" -ForegroundColor Green
        }
    }
}
else {
    Write-Host "  ⏭️  跳过测试文件归档" -ForegroundColor Gray
}

# ========================================
# 4. 创建归档说明文件
# ========================================

Write-Host "`n📝 创建归档说明..." -ForegroundColor Yellow

$readmeContent = @"
# 归档文件夹说明

**归档日期**: $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")

## 📁 文件夹结构

- **documentation/** - 归档的文档文件（修复记录、部署总结等）
- **scripts/** - 归档的部署和设置脚本
- **resume-materials/** - 简历和 LinkedIn 相关材料

## 📋 归档原因

这些文件已完成使命或不再频繁使用，为保持项目根目录清洁而归档。

### 归档的文档
- 修复记录（ChatGPT 幻觉修复）
- 部署总结
- 实施路线图（已完成）
- 提交清单（已完成）

### 归档的简历材料
- 完整简历
- 紧凑简历
- LinkedIn 内容
- LinkedIn 指南

### 归档的脚本
- 清理脚本
- 部署脚本
- MCP 设置脚本

## 🔄 如何使用归档文件

如需访问这些文件：
1. 在 \`archived/\` 文件夹中查找
2. 文件仍然可以正常打开和编辑
3. 如需恢复到根目录，直接移动回去即可

## ⚠️ 注意事项

- 这些文件没有被删除，只是移动位置
- Git 历史记录保持完整
- 可以随时恢复任何文件

---

**项目根目录现在更清洁，核心文件更易找到！** ✨
"@

Set-Content -Path "$archivedRoot\README.md" -Value $readmeContent -Encoding UTF8
Write-Host "  ✅ 创建 archived/README.md" -ForegroundColor Green

# ========================================
# 5. 显示保留的核心文件
# ========================================

Write-Host "`n✨ 清理完成！" -ForegroundColor Green
Write-Host "`n📂 项目根目录保留的核心文件：" -ForegroundColor Cyan
Write-Host "  - README.md (项目说明)" -ForegroundColor White
Write-Host "  - ARCHITECTURE.md (架构文档)" -ForegroundColor White
Write-Host "  - TECHNICAL_ARCHITECTURE.md (技术架构)" -ForegroundColor White
Write-Host "  - QUICKSTART.md (快速开始)" -ForegroundColor White
Write-Host "  - digitaltwin.json (数据源)" -ForegroundColor White
Write-Host "  - package.json (项目配置)" -ForegroundColor White
Write-Host "  - 核心代码目录: app/, components/, lib/, mcp-server/, vscode-extension/" -ForegroundColor White

Write-Host "`n📁 归档文件位置：" -ForegroundColor Cyan
Write-Host "  - archived/documentation/ (文档)" -ForegroundColor Gray
Write-Host "  - archived/scripts/ (脚本)" -ForegroundColor Gray
Write-Host "  - archived/resume-materials/ (简历)" -ForegroundColor Gray

Write-Host "`n💡 提示：查看 archived/README.md 了解归档详情" -ForegroundColor Yellow
Write-Host "`n🎯 下一步：运行 'git add . && git commit -m ""chore: Archive redundant files to clean up project root""'" -ForegroundColor Magenta
