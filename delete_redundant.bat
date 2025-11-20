@echo off
REM 删除所有冗余文档和临时文件

cd /d "d:\上课\Ai agent\digital twin"

echo 正在删除冗余文档...

REM 诊断文档
del /F /Q "AUTO_APPROVE_CHECKLIST.md" 2>nul
del /F /Q "AUTO_APPROVE_COMPLETE_SUMMARY.md" 2>nul
del /F /Q "BUILD_DIAGNOSTICS.md" 2>nul
del /F /Q "CI_CD_FIXES_COMPLETE.md" 2>nul
del /F /Q "ESLINT_FIXES_SUMMARY.md" 2>nul

REM 指南文档
del /F /Q "CLEANUP_GUIDE.md" 2>nul
del /F /Q "GIT_AUTO_APPROVE_GUIDE.md" 2>nul
del /F /Q "QUICK_PUSH_GUIDE.md" 2>nul
del /F /Q "SCRIPTS_QUICKREF.md" 2>nul

REM 其他冗余文档
del /F /Q "QUALITY_OPTIMIZATION.md" 2>nul
del /F /Q "QUICKSTART_DEPLOY.md" 2>nul
del /F /Q "RAG_QUALITY_REPORT.md" 2>nul
del /F /Q "FINAL_PROJECT_SUMMARY.md" 2>nul
del /F /Q "DEPLOYMENT_READY.md" 2>nul
del /F /Q "ENTERPRISE_ARCHITECTURE.md" 2>nul
del /F /Q "VECTOR_DB_INIT.md" 2>nul
del /F /Q "VERCEL_TROUBLESHOOTING.md" 2>nul
del /F /Q "CLEANUP_AND_CONSOLIDATION_SUMMARY.md" 2>nul
del /F /Q "README_FOR_PRESENTATION.txt" 2>nul
del /F /Q "FINAL_SUMMARY.txt" 2>nul

echo.
echo ✅ 删除完成！
echo.
echo 保留的演讲文件：
echo   - PROJECT_PRESENTATION.pdf
echo   - PROJECT_PRESENTATION.md
echo   - PRESENTATION_SPEAKER_NOTES.md
echo   - PRESENTATION_INDEX.md
echo   - PROJECT_COMPLETION_SUMMARY.md
echo.
dir /B *.pdf *.md | find /I "PRESENTATION\|PROJECT_COMPLETION" 

pause
