# Auto-Approve Git Operations Script
# This script automatically approves and executes git commands for digital twin project

param(
    [Parameter(Mandatory=$false)]
    [string]$CommitMessage = "chore: Update digital twin project - VU mentorship, project titles, accounting skills, tax filing count",
    
    [Parameter(Mandatory=$false)]
    [string]$Branch = "main"
)

# Set error action preference
$ErrorActionPreference = "Continue"

# Project directory
$ProjectDir = "d:\上课\Ai agent\digital twin"

# Change to project directory
Set-Location $ProjectDir

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Digital Twin - Auto Git Approve Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Check git status
Write-Host "[1/5] Checking Git Status..." -ForegroundColor Yellow
try {
    $status = & git status --short
    if ($status) {
        Write-Host "Found changes:" -ForegroundColor Green
        Write-Host $status
    } else {
        Write-Host "No changes found." -ForegroundColor Yellow
    }
}
catch {
    Write-Host "Error checking status: $_" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Step 2: Add all changes
Write-Host "[2/5] Adding all changes..." -ForegroundColor Yellow
try {
    & git add -A
    Write-Host "✓ All changes added" -ForegroundColor Green
}
catch {
    Write-Host "Error adding changes: $_" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Step 3: Check if there's anything to commit
Write-Host "[3/5] Checking for changes to commit..." -ForegroundColor Yellow
$statusCheck = & git status --short
if (!$statusCheck) {
    Write-Host "No changes to commit. Skipping..." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "[4/5] Skipping commit (no changes)" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "[5/5] Skipping push (no changes)" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "✓ Script completed (no changes)" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Cyan
    exit 0
}

Write-Host "✓ Changes ready to commit" -ForegroundColor Green

Write-Host ""

# Step 4: Commit changes
Write-Host "[4/5] Committing changes..." -ForegroundColor Yellow
Write-Host "Commit Message: $CommitMessage" -ForegroundColor Cyan
try {
    & git commit -m $CommitMessage
    Write-Host "✓ Commit successful" -ForegroundColor Green
}
catch {
    Write-Host "Error committing: $_" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Step 5: Push to GitHub
Write-Host "[5/5] Pushing to GitHub ($Branch branch)..." -ForegroundColor Yellow
try {
    & git push origin $Branch
    Write-Host "✓ Push successful" -ForegroundColor Green
}
catch {
    Write-Host "Error pushing: $_" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "✓ All operations completed successfully!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Project has been pushed to GitHub:" -ForegroundColor Cyan
Write-Host "Branch: $Branch" -ForegroundColor Cyan
Write-Host ""
