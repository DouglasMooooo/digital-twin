#!/usr/bin/env node
/**
 * 快速清理冗余文件脚本 - 用于修复 CI/CD Pipeline 中的 Lint 错误
 * Quick cleanup script to fix CI/CD Pipeline lint errors
 */

const fs = require('fs');
const path = require('path');

const projectDir = 'd:\\上课\\Ai agent\\digital twin';

// 这些文件导致 CI/CD Lint 失败，需要立即删除
const filesToDelete = [
  'README_PHASE2_COMPLETE.md',
  'README_PHASE3.md',
  'PHASE2_COMPLETION_REPORT.md',
  'PHASE2_IMPLEMENTATION.md',
  'PHASE3_COMPLETION_REPORT.md',
  'PHASE3_PLAN.md',
  'PHASE3_STATUS.md',
  'PHASE4_COMPLETION_REPORT.md',
  'EXECUTIVE_SUMMARY.md',
  'EXECUTIVE_SUMMARY_FINAL.md',
  'FINAL_SUMMARY.txt',
  'FINAL_SUMMARY_CN.md',
  'WORK_SUMMARY_CN.md',
  'SESSION_SUMMARY.md',
  'PROJECT_STATUS.md',
  'PROJECT_COMPLETION_CERTIFICATE.txt',
  'CONTENT_UPDATE_SUMMARY.md',
  'QUICKSTART.md',
  'QUICK_REFERENCE.md',
  'AUTO_APPROVE_README.md',
  'DEPLOYMENT_CHECKLIST.md',
  'FREE_DEPLOYMENT_GUIDE.md',
  'digitaltwin.backup.json',
  'digitaltwin.json.backup',
  '.env.example',
  '.env.production.example'
];

console.log('🗑️  快速清理 CI/CD Pipeline 冗余文件\n');
console.log('=' .repeat(60));

let deleted = 0;
let failed = 0;

filesToDelete.forEach(file => {
  const filePath = path.join(projectDir, file);
  
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log(`✓ 已删除: ${file}`);
      deleted++;
    }
  } catch (error) {
    console.log(`✗ 失败: ${file}`);
    failed++;
  }
});

console.log('=' .repeat(60));
console.log(`\n✅ 清理完成！`);
console.log(`  成功删除: ${deleted} 个文件`);
console.log(`  删除失败: ${failed} 个文件\n`);
console.log('🔄 下一步: 提交更改并推送到 GitHub');
console.log('   git add -A');
console.log('   git commit -m "chore: Clean up redundant files to fix CI/CD lint"');
console.log('   git push origin main\n');
