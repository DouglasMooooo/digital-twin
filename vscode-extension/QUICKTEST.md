# 🚀 快速测试步骤

## ✅ 当前状态
- ✅ TypeScript 编译成功（0 错误）
- ✅ 所有文件已创建
- ✅ 调试配置已就绪

## 📝 测试步骤（3 分钟）

### 1️⃣ 打开扩展项目
在 VS Code 中：
- **File** → **Open Folder**
- 选择：`d:\上课\Ai agent\digital twin\vscode-extension`
- 或者在终端运行：`code "d:\上课\Ai agent\digital twin\vscode-extension"`

### 2️⃣ 启动调试（按 F5）
- 确保您在 `vscode-extension` 文件夹中
- 按键盘上的 **F5** 键
- 或者：**Run** → **Start Debugging**
- 会打开一个新窗口（Extension Development Host）

### 3️⃣ 在新窗口中测试
新窗口打开后：

#### a) 打开数字孪生项目
- **File** → **Open Folder**
- 选择：`d:\上课\Ai agent\digital twin`

#### b) 打开 Copilot Chat
- 按 **Ctrl+Shift+I**
- 或者：**View** → **Chat**

#### c) 测试 @douglas 参与者
在聊天框中输入：

```
@douglas What are your Python skills?
```

然后测试命令：
```
@douglas /experience Tell me about BF Suma

@douglas /skills What machine learning technologies do you know?

@douglas /projects Show me your ML projects

@douglas /interview Give me your elevator pitch
```

## ✅ 验证清单

测试时检查：
- [ ] @douglas 出现在参与者列表中
- [ ] 普通查询有响应
- [ ] 4 个斜杠命令都工作
- [ ] 响应包含真实数据（公司名、项目等）
- [ ] 格式专业美观
- [ ] 后续建议显示

## 🐛 遇到问题？

### @douglas 不显示
1. 检查输出面板：**View** → **Output** → 选择 "Extension Host"
2. 重新加载窗口：**Ctrl+Shift+P** → "Reload Window"

### MCP 连接失败
- 确保在包含 `mcp-server/` 的工作区中
- 查看通知栏的错误信息

### 需要重新编译
```powershell
npm run compile
```

## 🎉 测试成功！

如果所有功能都工作，恭喜！您的扩展已经可以使用了。

### 下一步：
1. **打包扩展**（可选）：`npm run package`
2. **继续 Task 9**：部署 ChatGPT Actions
3. **达到 100% 完成度！**

---

**快捷键提醒**：
- **F5** = 启动调试
- **Ctrl+Shift+I** = 打开 Copilot Chat
- **Ctrl+Shift+P** = 命令面板
