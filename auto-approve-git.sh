#!/bin/bash
# Auto Git Approve Script - Bash version
# Use: bash auto-approve-git.sh

cd "/d/上课/Ai agent/digital twin" || exit 1

echo "========================================" 
echo "Digital Twin - Git Auto Approve"
echo "========================================" 
echo ""

# Check status
echo "[1/5] Checking Git Status..."
git status --short

echo ""
echo "[2/5] Adding all changes..."
git add -A

echo ""
echo "[3/5] Checking for changes..."
if git diff --cached --quiet; then
    echo "No changes to commit."
    exit 0
fi

echo ""
echo "[4/5] Committing changes..."
git commit -m "chore: Update digital twin project - VU mentorship, project titles, accounting skills, tax filing count"

echo ""
echo "[5/5] Pushing to GitHub..."
git push origin main

echo ""
echo "========================================" 
echo "✓ Completed Successfully!"
echo "========================================" 
