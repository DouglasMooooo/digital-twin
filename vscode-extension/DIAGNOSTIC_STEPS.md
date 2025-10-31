# 🧪 完整诊断步骤

**目标**: 确认扩展是否正常工作并找出问题所在

---

## 步骤 1: 验证扩展已激活 ✅

从你的日志看，这一步已经成功：
```
2025-11-01 01:32:12.255 [info] ExtensionService#_doActivateExtension douglasmo.douglas-digital-twin-copilot
```

---

## 步骤 2: 查看控制台日志

### 在 Extension Development Host 窗口（新打开的窗口）：

1. 按 **F12** 打开开发者工具
2. 切换到 **Console** 标签
3. 在 Filter 框输入: `Douglas`
4. 你应该看到：

```
Douglas Digital Twin extension is now active!
Chat participant @douglas registered successfully
```

### 如果看到这些日志 ✅

说明扩展注册成功！继续下一步。

### 如果没看到这些日志 ❌

说明 `activate()` 函数有问题。请：
1. 截图控制台的所有红色错误
2. 发给我

---

## 步骤 3: 测试 Chat Participant

### A. 检查参与者是否可见

1. 在 Extension Development Host 窗口打开 Chat（Ctrl+Shift+I）
2. 在输入框输入 `@`
3. 查看下拉列表

**应该看到**:
- `douglas` - Chat with Douglas Mo's digital twin...

**如果没看到 @douglas**:
- 说明注册失败
- 查看控制台是否有错误
- 把错误发给我

### B. 测试查询

在 Chat 输入框输入：

```
@douglas Hello!
```

### C. 查看详细日志

在控制台（Console）中，你应该看到：

```javascript
[Douglas Digital Twin] Chat request received: Hello! command: undefined
[Douglas Digital Twin] Selecting Copilot model...
[Douglas Digital Twin] Model selected: gpt-4o family: gpt-4o
[Douglas Digital Twin] Sending request to Copilot...
[Douglas Digital Twin] Streaming response...
[Douglas Digital Twin] Response completed
```

### 如果日志停在某一步

**停在 "Selecting Copilot model..."** 后：
- 说明 `selectChatModels` 没有返回模型
- 可能 Copilot 未登录或无权限

**停在 "Sending request..." 后：
- 说明请求被发送但失败或被拒绝
- 查看是否有红色错误

**完全没有这些日志**:
- 说明 chat handler 没有被调用
- @douglas 可能注册失败

---

## 步骤 4: 检查错误（如果有）

在控制台（Console）查找红色错误，常见的有：

### 错误 1: "No language models available"
**原因**: GitHub Copilot 未登录或订阅过期
**解决**: 
1. 检查 VS Code 右下角 Copilot 图标状态
2. 命令面板运行: `GitHub Copilot: Sign In`

### 错误 2: "User rejected the request"
**原因**: Copilot 内容政策拒绝请求
**解决**: 简化提示词（我会修改）

### 错误 3: "chatParticipant must be declared..."
**原因**: package.json 配置错误
**解决**: 已修复，但需要重启

---

## 步骤 5: 完整测试清单

请逐项检查并告诉我结果：

### 扩展激活
- [ ] Extension Host 日志显示扩展激活
- [ ] 控制台显示 "extension is now active!"
- [ ] 控制台显示 "Chat participant registered"

### Participant 可见性
- [ ] 输入 `@` 后看到 `douglas` 在列表中
- [ ] `douglas` 描述正确显示

### Chat 功能
- [ ] 输入 `@douglas Hello!` 后有响应
- [ ] 控制台显示 "Chat request received"
- [ ] 控制台显示 "Model selected"
- [ ] 控制台显示 "Streaming response"

### 实际响应
- [ ] Chat 返回有意义的内容（不是 "Sorry, I can't assist"）
- [ ] 响应包含关于 Douglas 的信息

---

## 🐛 常见问题快速修复

### @douglas 不在列表中

**原因**: 注册失败或 package.json 不匹配

**快速检查**:
```javascript
// 在控制台运行：
vscode.chat
```

如果返回 undefined，说明 Chat API 不可用。

### 返回 "Sorry, I can't assist"

**可能原因**:
1. Copilot 模型未选中
2. 请求被 Copilot 政策拒绝
3. 提示词格式问题

**查看控制台确认哪一步失败**

### 控制台完全没有日志

**原因**: 代码未编译或未重启

**解决**:
1. 确认 `npm run compile` 成功
2. 完全停止调试（Shift+F5）
3. 关闭所有窗口
4. 重新按 F5

---

## 📊 把以下信息发给我

1. **控制台日志截图**（F12 → Console）
   - 包含所有 "Douglas" 相关的行
   - 包含所有红色错误

2. **@douglas 是否在列表中**
   - 截图输入 `@` 后的下拉列表

3. **Extension Host 输出**
   - 只需要包含 "douglas-digital-twin-copilot" 的行

4. **Chat 响应**
   - 你输入后看到的任何回复

---

**现在请按步骤操作并把结果告诉我！** 🎯

有了这些信息，我能立刻定位问题！
