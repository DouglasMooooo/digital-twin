#!/usr/bin/env python3
"""
清理冗余文件脚本
Cleanup Redundant Files Script
"""

import os
import sys
from pathlib import Path

PROJECT_DIR = Path(r"d:\上课\Ai agent\digital twin")

# 要删除的文件列表
FILES_TO_DELETE = [
    # 备份文件
    "digitaltwin.backup.json",
    "digitaltwin.json.backup",
    ".env.example",
    ".env.production.example",
    
    # 过时的阶段报告
    "PHASE2_COMPLETION_REPORT.md",
    "PHASE2_IMPLEMENTATION.md",
    "PHASE3_COMPLETION_REPORT.md",
    "PHASE3_PLAN.md",
    "PHASE3_STATUS.md",
    "PHASE4_COMPLETION_REPORT.md",
    
    # 过时的摘要和文档
    "EXECUTIVE_SUMMARY.md",
    "EXECUTIVE_SUMMARY_FINAL.md",
    "FINAL_SUMMARY.txt",
    "FINAL_SUMMARY_CN.md",
    "WORK_SUMMARY_CN.md",
    "SESSION_SUMMARY.md",
    "PROJECT_STATUS.md",
    "PROJECT_COMPLETION_CERTIFICATE.txt",
    "README_PHASE2_COMPLETE.md",
    "README_PHASE3.md",
    "CONTENT_UPDATE_SUMMARY.md",
    
    # 重复的快速开始和部署指南
    "QUICKSTART.md",
    "QUICK_REFERENCE.md",
    "AUTO_APPROVE_README.md",
    "DEPLOYMENT_CHECKLIST.md",
    "FREE_DEPLOYMENT_GUIDE.md"
]

class Colors:
    RESET = '\033[0m'
    GREEN = '\033[32m'
    RED = '\033[31m'
    YELLOW = '\033[33m'
    CYAN = '\033[36m'
    GRAY = '\033[90m'

def cleanup(dry_run=False):
    """清理冗余文件"""
    print(f"{Colors.CYAN}🗑️  清理冗余文件{Colors.RESET}")
    print("=" * 60)
    print()
    
    if dry_run:
        print(f"{Colors.YELLOW}⚠️  [干运行模式] - 仅显示将要删除的文件，不实际删除{Colors.RESET}")
        print()
    
    deleted_count = 0
    failed_count = 0
    
    for file in FILES_TO_DELETE:
        file_path = PROJECT_DIR / file
        
        if file_path.exists():
            if dry_run:
                print(f"{Colors.YELLOW}[-] 将删除: {file}{Colors.RESET}")
            else:
                try:
                    file_path.unlink()
                    print(f"{Colors.GREEN}✓ 已删除: {file}{Colors.RESET}")
                    deleted_count += 1
                except Exception as e:
                    print(f"{Colors.RED}✗ 失败: {file} - {str(e)}{Colors.RESET}")
                    failed_count += 1
        else:
            print(f"{Colors.GRAY}- 不存在: {file}{Colors.RESET}")
    
    print()
    print("=" * 60)
    print()
    print(f"{Colors.CYAN}📊 清理结果:{Colors.RESET}")
    print(f"  {Colors.GREEN}✓ 成功删除: {deleted_count} 个文件{Colors.RESET}")
    print(f"  {Colors.RED}✗ 删除失败: {failed_count} 个文件{Colors.RESET}")
    print()
    
    if dry_run:
        print(f"{Colors.YELLOW}ℹ️  干运行完成。要真正删除文件，请运行:{Colors.RESET}")
        print(f"{Colors.YELLOW}   python cleanup-redundant.py --confirm{Colors.RESET}")
    else:
        print(f"{Colors.GREEN}✅ 清理完成！项目已精简。{Colors.RESET}")
        print()
        print(f"{Colors.CYAN}📝 保留的核心文件:{Colors.RESET}")
        print(f"  {Colors.GRAY}• digitaltwin.json - 核心职业档案数据{Colors.RESET}")
        print(f"  {Colors.GRAY}• DEPLOYMENT_GUIDE.md - 最新部署指南{Colors.RESET}")
        print(f"  {Colors.GRAY}• GIT_AUTO_APPROVE_GUIDE.md - Git 自动批准指南{Colors.RESET}")
        print(f"  {Colors.GRAY}• AUTO_APPROVE_COMPLETE_SUMMARY.md - 完整总结{Colors.RESET}")
        print(f"  {Colors.GRAY}• SCRIPTS_QUICKREF.md - 快速参考{Colors.RESET}")
        print(f"  {Colors.GRAY}• AUTO_APPROVE_CHECKLIST.md - 执行清单{Colors.RESET}")
        print(f"  {Colors.GRAY}• auto-approve-*.* - 自动批准脚本 (5 种){Colors.RESET}")
        print()

if __name__ == "__main__":
    dry_run = "--confirm" not in sys.argv
    cleanup(dry_run=dry_run)
