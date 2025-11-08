#!/usr/bin/env node

/**
 * Auto Git Approve Script for Digital Twin Project
 * Automatically stages, commits, and pushes changes to GitHub
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// Configuration
const projectDir = path.resolve('d:', '上课', 'Ai agent', 'digital twin');
const commitMessage = 'chore: Update digital twin project - VU mentorship, project titles, accounting skills, tax filing count';
const branch = 'main';

// Color codes for console output
const colors = {
  reset: '\x1b[0m',
  cyan: '\x1b[36m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function runCommand(cmd, description) {
  try {
    log(`\n[*] ${description}...`, 'yellow');
    const result = execSync(cmd, {
      cwd: projectDir,
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'pipe']
    });
    if (result.trim()) {
      console.log(result);
    }
    log(`✓ ${description} successful`, 'green');
    return true;
  } catch (error) {
    log(`✗ Error: ${error.message}`, 'red');
    return false;
  }
}

async function main() {
  log('========================================', 'cyan');
  log('Digital Twin - Auto Git Approve Script', 'cyan');
  log('========================================', 'cyan');
  
  // Verify project directory exists
  if (!fs.existsSync(projectDir)) {
    log(`Error: Project directory not found: ${projectDir}`, 'red');
    process.exit(1);
  }

  log(`\nProject: ${projectDir}`, 'cyan');
  log(`Branch: ${branch}`, 'cyan');
  log(`Commit: ${commitMessage}`, 'cyan');

  // Step 1: Check status
  log('\n[1/5] Checking Git Status', 'yellow');
  try {
    const status = execSync('git status --short', {
      cwd: projectDir,
      encoding: 'utf-8'
    });
    if (status.trim()) {
      log('Found changes:', 'green');
      console.log(status);
    } else {
      log('No changes found.', 'yellow');
      log('\n✓ Script completed (no changes)', 'green');
      process.exit(0);
    }
  } catch (error) {
    log(`Error checking status: ${error.message}`, 'red');
    process.exit(1);
  }

  // Step 2: Add all changes
  if (!runCommand('git add -A', '[2/5] Adding all changes')) {
    process.exit(1);
  }

  // Step 3: Check for changes
  try {
    const statusCheck = execSync('git status --short', {
      cwd: projectDir,
      encoding: 'utf-8'
    });
    if (!statusCheck.trim()) {
      log('\n[3/5] No changes to commit', 'yellow');
      log('✓ Script completed (no changes to commit)', 'green');
      process.exit(0);
    }
    log('\n[3/5] Changes ready to commit', 'green');
  } catch (error) {
    log(`Error checking changes: ${error.message}`, 'red');
    process.exit(1);
  }

  // Step 4: Commit
  if (!runCommand(`git commit -m "${commitMessage}"`, '[4/5] Committing changes')) {
    process.exit(1);
  }

  // Step 5: Push
  if (!runCommand('git push origin ' + branch, '[5/5] Pushing to GitHub')) {
    process.exit(1);
  }

  log('\n========================================', 'cyan');
  log('✓ All operations completed successfully!', 'green');
  log('========================================', 'cyan');
  log(`\nProject pushed to GitHub:`, 'cyan');
  log(`Branch: ${branch}`, 'cyan');
  log(`Repository: https://github.com/DouglasMooooo/digital-twin`, 'cyan');
}

main().catch(error => {
  log(`Fatal error: ${error.message}`, 'red');
  process.exit(1);
});
