# Digital Twin Project - Git 自动批准脚本使用指南

> 📌 **重要**: 如果VS Code终端持续中断，请使用系统CMD或PowerShell直接运行脚本。

## 快速开始 (3步)

### 步骤 1: 验证项目状态
```powershell
cd "d:\上课\Ai agent\digital twin"
git status
```

### 步骤 2: 运行自动批准脚本
选择以下任意一种方法:

**方法A - PowerShell (推荐)**
```powershell
powershell -ExecutionPolicy Bypass -File auto-approve-git.ps1
```

**方法B - Python**
```powershell
python auto-approve-git.py
```

**方法C - Node.js**
```powershell
node auto-approve-git.js
```

**方法D - 批处理**
```powershell
cmd /c auto-approve-git.bat
```

### 步骤 3: 验证推送
访问 GitHub 查看推送是否成功:
https://github.com/DouglasMooooo/digital-twin

---

## 脚本详情

### 脚本执行流程

所有脚本执行相同的操作流程:

```
[1/5] 检查 Git 状态
     ↓
[2/5] 暂存所有更改 (git add -A)
     ↓
[3/5] 检查是否有待提交的更改
     ↓
[4/5] 创建提交 (git commit -m "...")
     ↓
[5/5] 推送到 GitHub (git push origin main)
     ↓
✓ 完成!
```

### 默认配置

- **提交分支**: main
- **提交信息**: "chore: Update digital twin project - VU mentorship, project titles, accounting skills, tax filing count"
- **远程**: origin (https://github.com/DouglasMooooo/digital-twin.git)

---

## 脚本文件说明

### 1. auto-approve-git.ps1 (PowerShell)

**优点**:
- ✓ 最佳错误处理
- ✓ 彩色输出
- ✓ 支持自定义参数
- ✓ Windows原生

**使用**:
```powershell
# 默认参数
.\auto-approve-git.ps1

# 自定义提交信息和分支
.\auto-approve-git.ps1 -CommitMessage "feat: New feature" -Branch "main"
```

### 2. auto-approve-git.py (Python)

**优点**:
- ✓ 跨平台
- ✓ 简单易读
- ✓ 内置错误处理
- ✓ 超时保护

**使用**:
```bash
python auto-approve-git.py
```

### 3. auto-approve-git.js (Node.js)

**优点**:
- ✓ 无外部依赖
- ✓ 快速执行
- ✓ 彩色输出
- ✓ 项目原生

**使用**:
```bash
node auto-approve-git.js
```

### 4. auto-approve-git.bat (批处理)

**优点**:
- ✓ Windows 原生
- ✓ 无依赖
- ✓ 简单直接

**使用**:
```cmd
auto-approve-git.bat
```

### 5. auto-approve-git.sh (Bash)

**优点**:
- ✓ Linux/Mac 原生
- ✓ 简单易用

**使用**:
```bash
bash auto-approve-git.sh
```

---

## 项目更新内容

这些脚本将推送以下更改到 GitHub:

### ✅ 更新的内容

1. **Victoria University 导师经历**
   - 新增: "Mentored 3 peers on ML best practices at Victoria University, improving grades to HD level"
   - 体现: 国际化的学术背景

2. **项目标题优化**
   - Business Analytics Dashboard Development
   - RAG System Implementation
   - 更强调商业价值

3. **会计技能国际化**
   - 移除 "Chinese" 前缀
   - 展示: GAAP, ERP, Financial Operations 等通用技能

4. **税务申报数量更新**
   - 从模糊的 "200+" 更新为具体的 "1000+"
   - 体现: 扎实的工作经历

### 📄 涉及的文件

- `digitaltwin.json` - 核心职业档案数据
- 其他配置和脚本文件

---

## 故障排除

### ❌ 问题: Terminal 持续中断 (^C)

**原因**: VS Code 设置中的自动批准功能与交互式 PowerShell 冲突

**解决方案**:

1. **关闭 VS Code 内的终端**
   - 按 Ctrl+Shift+` 关闭集成终端

2. **使用系统 PowerShell**
   ```powershell
   # 按 Win+R, 输入 powershell
   powershell
   cd "d:\上课\Ai agent\digital twin"
   powershell -ExecutionPolicy Bypass -File auto-approve-git.ps1
   ```

3. **或使用系统 CMD**
   ```cmd
   # 按 Win+R, 输入 cmd
   cmd
   cd "d:\上课\Ai agent\digital twin"
   python auto-approve-git.py
   ```

### ❌ 问题: "Permission denied"

**原因**: GitHub 凭证未配置或 SSH 密钥不可用

**解决方案**:
```bash
# 配置 GitHub 凭证
git config --global user.email "d157156@gmail.com"
git config --global user.name "Douglas Mo"

# 或使用 HTTPS (推荐)
git remote set-url origin https://github.com/DouglasMooooo/digital-twin.git
```

### ❌ 问题: "Nothing to commit"

**原因**: 没有新的更改 (正常情况)

**解决方案**: 这是正常的。如果之前已经推送过，就不会有新的更改。

### ❌ 问题: "Rejection"

**原因**: 远程分支有新的提交

**解决方案**:
```bash
git pull origin main
git push origin main
```

### ❌ 问题: "fatal: repository not found"

**原因**: 仓库 URL 错误或凭证失效

**解决方案**:
```bash
# 验证远程配置
git remote -v

# 如果错误，重新设置
git remote set-url origin https://github.com/DouglasMooooo/digital-twin.git
```

---

## 验证推送成功

### 在浏览器中验证

1. 访问: https://github.com/DouglasMooooo/digital-twin
2. 查看 "main" 分支的最新提交
3. 确认提交信息为: "chore: Update digital twin project - VU mentorship, project titles, accounting skills, tax filing count"

### 用 Git 命令验证

```bash
cd "d:\上课\Ai agent\digital twin"
git log --oneline -5
```

预期输出:
```
a1b2c3d chore: Update digital twin project - VU mentorship, project titles, accounting skills, tax filing count
f4e5d6c (previous commit)
...
```

---

## 高级用法

### 自定义提交信息 (PowerShell)

```powershell
.\auto-approve-git.ps1 -CommitMessage "feat: Add new features"
```

### 推送到不同分支

```powershell
# 推送到 develop 分支
.\auto-approve-git.ps1 -Branch "develop"

# 推送到 feature 分支
.\auto-approve-git.ps1 -Branch "feature/new-feature"
```

### 批量操作

创建多个提交:

```powershell
# 第一次提交
.\auto-approve-git.ps1 -CommitMessage "feat: First feature"

# 做更多更改...

# 第二次提交
.\auto-approve-git.ps1 -CommitMessage "feat: Second feature"
```

---

## 项目信息速览

| 项目 | 详情 |
|------|------|
| **项目名称** | Digital Twin |
| **GitHub** | https://github.com/DouglasMooooo/digital-twin |
| **主分支** | main |
| **本地路径** | d:\上课\Ai agent\digital twin |
| **当前用户** | Douglas Mo |
| **邮箱** | d157156@gmail.com |

---

## 相关链接

- 🔗 [GitHub 仓库](https://github.com/DouglasMooooo/digital-twin)
- 🔗 [项目网站](https://douglas-digital-twin.vercel.app)
- 📝 [Git 配置文件](.git/config)
- 📦 [项目数据](digitaltwin.json)

---

## 更新日志

- **2025-11-08**: 创建自动批准脚本套件，支持 5 种语言/平台
- **2025-11-08**: 更新职业档案内容 (VU 导师、项目标题、会计技能)
- **2025-11-08**: 初始化向量数据库 (18/18 chunks)

---

**最后更新**: 2025-11-08 by GitHub Copilot
