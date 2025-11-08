@echo off
REM 清理冗余文件脚本 - 批处理版本
REM Cleanup Redundant Files Script - Batch Version

setlocal enabledelayedexpansion

cd /d "d:\上课\Ai agent\digital twin"

echo 蛈蛈蛈蛈蛈蛈蛈蛈蛈蛈蛈蛈蛈蛈蛈蛈蛈蛈蛈蛈蛈蛈蛈蛈蛈蛈
echo 清理冗余文件
echo 蛈蛈蛈蛈蛈蛈蛈蛈蛈蛈蛈蛈蛈蛈蛈蛈蛈蛈蛈蛈蛈蛈蛈蛈蛈蛈
echo.

REM 设置要删除的文件列表
set "files=^
digitaltwin.backup.json ^
digitaltwin.json.backup ^
.env.example ^
.env.production.example ^
PHASE2_COMPLETION_REPORT.md ^
PHASE2_IMPLEMENTATION.md ^
PHASE3_COMPLETION_REPORT.md ^
PHASE3_PLAN.md ^
PHASE3_STATUS.md ^
PHASE4_COMPLETION_REPORT.md ^
EXECUTIVE_SUMMARY.md ^
EXECUTIVE_SUMMARY_FINAL.md ^
FINAL_SUMMARY.txt ^
FINAL_SUMMARY_CN.md ^
WORK_SUMMARY_CN.md ^
SESSION_SUMMARY.md ^
PROJECT_STATUS.md ^
PROJECT_COMPLETION_CERTIFICATE.txt ^
README_PHASE2_COMPLETE.md ^
README_PHASE3.md ^
CONTENT_UPDATE_SUMMARY.md ^
QUICKSTART.md ^
QUICK_REFERENCE.md ^
AUTO_APPROVE_README.md ^
DEPLOYMENT_CHECKLIST.md ^
FREE_DEPLOYMENT_GUIDE.md"

set "deletedCount=0"
set "failedCount=0"

for %%F in (%files%) do (
    if exist "%%F" (
        del /q "%%F" >nul 2>&1
        if !ERRORLEVEL! equ 0 (
            echo [OK] 已删除: %%F
            set /a deletedCount+=1
        ) else (
            echo [FAIL] 删除失败: %%F
            set /a failedCount+=1
        )
    ) else (
        echo [SKIP] 不存在: %%F
    )
)

echo.
echo 蛈蛈蛈蛈蛈蛈蛈蛈蛈蛈蛈蛈蛈蛈蛈蛈蛈蛈蛈蛈蛈蛈蛈蛈蛈蛈
echo 清理结果
echo 蛈蛈蛈蛈蛈蛈蛈蛈蛈蛈蛈蛈蛈蛈蛈蛈蛈蛈蛈蛈蛈蛈蛈蛈蛈蛈
echo 成功删除: %deletedCount% 个文件
echo 删除失败: %failedCount% 个文件
echo.
echo [完成] 项目已精简！
echo.
pause
