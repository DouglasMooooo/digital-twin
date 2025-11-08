#!/usr/bin/env python3
"""
Auto Git Approve Script for Digital Twin Project
Automatically stages, commits, and pushes changes to GitHub
"""

import subprocess
import sys
import os
from pathlib import Path

# Configuration
PROJECT_DIR = Path("d:\\上课\\Ai agent\\digital twin")
COMMIT_MESSAGE = "chore: Update digital twin project - VU mentorship, project titles, accounting skills, tax filing count"
BRANCH = "main"

# Color codes
class Colors:
    RESET = '\033[0m'
    CYAN = '\033[36m'
    GREEN = '\033[32m'
    YELLOW = '\033[33m'
    RED = '\033[31m'

def log(message, color='reset'):
    """Print colored log message"""
    color_code = getattr(Colors, color.upper(), Colors.RESET)
    print(f"{color_code}{message}{Colors.RESET}")

def run_command(cmd, description, show_output=True):
    """Execute a git command and return success status"""
    try:
        log(f"\n[*] {description}...", 'yellow')
        result = subprocess.run(
            cmd,
            cwd=str(PROJECT_DIR),
            shell=True,
            capture_output=True,
            text=True,
            timeout=30
        )
        
        if result.stdout and show_output:
            print(result.stdout)
        
        if result.returncode != 0:
            if result.stderr:
                log(f"✗ Error: {result.stderr}", 'red')
            return False
        
        log(f"✓ {description} successful", 'green')
        return True
    except subprocess.TimeoutExpired:
        log(f"✗ Command timed out: {description}", 'red')
        return False
    except Exception as error:
        log(f"✗ Error: {str(error)}", 'red')
        return False

def main():
    """Main execution function"""
    log("========================================", 'cyan')
    log("Digital Twin - Auto Git Approve Script", 'cyan')
    log("========================================", 'cyan')
    
    # Verify project directory exists
    if not PROJECT_DIR.exists():
        log(f"Error: Project directory not found: {PROJECT_DIR}", 'red')
        return 1
    
    log(f"\nProject: {PROJECT_DIR}", 'cyan')
    log(f"Branch: {BRANCH}", 'cyan')
    log(f"Commit: {COMMIT_MESSAGE}", 'cyan')
    
    # Step 1: Check status
    log("\n[1/5] Checking Git Status", 'yellow')
    result = subprocess.run(
        "git status --short",
        cwd=str(PROJECT_DIR),
        shell=True,
        capture_output=True,
        text=True
    )
    
    if result.stdout.strip():
        log("Found changes:", 'green')
        print(result.stdout)
    else:
        log("No changes found.", 'yellow')
        log("\n✓ Script completed (no changes)", 'green')
        return 0
    
    # Step 2: Add all changes
    if not run_command("git add -A", "[2/5] Adding all changes", False):
        return 1
    
    # Step 3: Check for changes
    result = subprocess.run(
        "git status --short",
        cwd=str(PROJECT_DIR),
        shell=True,
        capture_output=True,
        text=True
    )
    
    if not result.stdout.strip():
        log("\n[3/5] No changes to commit", 'yellow')
        log("✓ Script completed (no changes to commit)", 'green')
        return 0
    
    log("\n[3/5] Changes ready to commit", 'green')
    
    # Step 4: Commit
    if not run_command(f'git commit -m "{COMMIT_MESSAGE}"', "[4/5] Committing changes"):
        return 1
    
    # Step 5: Push
    if not run_command(f"git push origin {BRANCH}", "[5/5] Pushing to GitHub"):
        return 1
    
    # Success
    log("\n========================================", 'cyan')
    log("✓ All operations completed successfully!", 'green')
    log("========================================", 'cyan')
    log("\nProject pushed to GitHub:", 'cyan')
    log(f"Branch: {BRANCH}", 'cyan')
    log("Repository: https://github.com/DouglasMooooo/digital-twin", 'cyan')
    
    return 0

if __name__ == "__main__":
    sys.exit(main())
