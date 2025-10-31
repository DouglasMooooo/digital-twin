@echo off
echo Deploying dashboard fixes...
cd /d "d:\上课\Ai agent\digital twin"
git add app/admin/dashboard/page.tsx
git commit -m "Fix dashboard: use hourlyActivity and interviewTypeDistribution from Redis"
git push origin main
echo.
echo Deployment complete! Check Vercel in 1-2 minutes.
echo Dashboard: https://douglasmo.vercel.app/admin/dashboard
pause
