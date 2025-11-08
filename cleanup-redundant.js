#!/usr/bin/env node

/**
 * 清理冗余文件脚本
 * 删除备份、过时文档和重复的指南文件
 */

const fs = require('fs');
const path = require('path');

const projectDir = 'd:\\上课\\Ai agent\\digital twin';

// 要删除的文件列表
const filesToDelete = [
  // 备份文件
  'digitaltwin.backup.json',
  'digitaltwin.json.backup',
  '.env.example',
  '.env.production.example',
  
  // 过时的阶段报告
  'PHASE2_COMPLETION_REPORT.md',
  'PHASE2_IMPLEMENTATION.md',
  'PHASE3_COMPLETION_REPORT.md',
  'PHASE3_PLAN.md',
  'PHASE3_STATUS.md',
  'PHASE4_COMPLETION_REPORT.md',
  
  // 过时的摘要和文档
  'EXECUTIVE_SUMMARY.md',
  'EXECUTIVE_SUMMARY_FINAL.md',
  'FINAL_SUMMARY.txt',
  'FINAL_SUMMARY_CN.md',
  'WORK_SUMMARY_CN.md',
  'SESSION_SUMMARY.md',
  'PROJECT_STATUS.md',
  'PROJECT_COMPLETION_CERTIFICATE.txt',
  'README_PHASE2_COMPLETE.md',
  'README_PHASE3.md',
  'CONTENT_UPDATE_SUMMARY.md',
  
  // 重复的快速开始和部署指南
  'QUICKSTART.md',
  'QUICK_REFERENCE.md',
  'AUTO_APPROVE_README.md',
  'DEPLOYMENT_CHECKLIST.md',
  'FREE_DEPLOYMENT_GUIDE.md'
];

console.log('🗑️  清理冗余文件...\n');
console.log('=' .repeat(50));

let deletedCount = 0;
let failedCount = 0;

filesToDelete.forEach(file => {
  const filePath = path.join(projectDir, file);
  
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log(`✓ 已删除: ${file}`);
      deletedCount++;
    } else {
      console.log(`- 不存在: ${file}`);
    }
  } catch (error) {
    console.log(`✗ 失败: ${file} - ${error.message}`);
    failedCount++;
  }
});

console.log('='.repeat(50));
console.log(`\n📊 清理结果:`);
console.log(`  ✓ 成功删除: ${deletedCount} 个文件`);
console.log(`  ✗ 删除失败: ${failedCount} 个文件`);
console.log(`\n✅ 清理完成！项目已精简。`);
