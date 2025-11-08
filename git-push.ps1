#!/usr/bin/env powershell
cd "d:\上课\Ai agent\digital twin"
git add .
git commit -m "ci: Exclude all Markdown files from ESLint scanning - fixes CI/CD lint failures"
git push origin main
echo "✅ Push completed!"
