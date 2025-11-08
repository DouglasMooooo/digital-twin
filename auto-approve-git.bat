@echo off
REM Auto Git Approve Script - Batch version for Windows
REM This script will commit and push all changes to GitHub

cd /d "d:\上课\Ai agent\digital twin"

echo ========================================
echo Digital Twin - Auto Git Approve
echo ========================================
echo.

echo [1/5] Checking Git Status...
git status --short
echo.

echo [2/5] Adding all changes...
git add -A
echo ✓ All changes added
echo.

echo [3/5] Checking for changes...
git diff --cached --quiet
if %ERRORLEVEL% equ 0 (
    echo No changes to commit.
    exit /b 0
)
echo ✓ Changes ready to commit
echo.

echo [4/5] Committing changes...
git commit -m "chore: Update digital twin project - VU mentorship, project titles, accounting skills, tax filing count"
if %ERRORLEVEL% neq 0 (
    echo ✗ Commit failed
    exit /b 1
)
echo ✓ Commit successful
echo.

echo [5/5] Pushing to GitHub...
git push origin main
if %ERRORLEVEL% neq 0 (
    echo ✗ Push failed
    exit /b 1
)
echo ✓ Push successful
echo.

echo ========================================
echo ✓ All operations completed successfully!
echo ========================================
echo.
echo Repository: https://github.com/DouglasMooooo/digital-twin
echo Branch: main
echo.
pause
