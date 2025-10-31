# Douglas Digital Twin - VS Code Copilot Extension

**Integrate Douglas Mo's professional digital twin with GitHub Copilot Chat!**

This VS Code extension allows you to chat with an AI assistant about Douglas Mo's professional background, skills, projects, and experience directly in GitHub Copilot Chat.

## Features

### 🤖 Chat Participant: `@douglas`

Chat with Douglas's digital twin directly in Copilot Chat:

```
@douglas What is your Python experience?
@douglas Tell me about your machine learning projects
@douglas What are your key achievements?
```

### 💬 Slash Commands

Use specific commands for targeted queries:

- **`@douglas /experience`** - Get work experience details
- **`@douglas /skills`** - Get technical and business skills
- **`@douglas /projects`** - Get project portfolio
- **`@douglas /interview`** - Get interview preparation materials

### 🔗 MCP Integration

The extension connects to Douglas's digital twin via the Model Context Protocol (MCP) server, ensuring real-time access to:

- Personal information
- Work experience with STAR achievements
- Education background
- Technical skills (Python, SQL, ML, etc.)
- Business skills (Financial analysis, Data visualization)
- Project portfolio
- Interview preparation materials

## Requirements

1. **VS Code** version 1.90.0 or higher
2. **GitHub Copilot** subscription and extension installed
3. **Digital Twin MCP Server** running in workspace

## Installation

### Option 1: Install from VSIX (Recommended)

1. Download `douglas-digital-twin-copilot-1.0.0.vsix`
2. Open VS Code
3. Go to Extensions (`Ctrl+Shift+X` / `Cmd+Shift+X`)
4. Click "..." menu → "Install from VSIX..."
5. Select the downloaded `.vsix` file

### Option 2: Build from Source

```bash
cd vscode-extension
npm install
npm run compile
npm run package
```

Then install the generated `.vsix` file.

## Setup

1. **Ensure MCP Server is in your workspace:**
   - The extension looks for `mcp-server/index.ts` in your workspace root
   - The digital twin MCP server should be properly configured

2. **Enable MCP Connection:**
   - Run command: `Douglas Digital Twin: Enable MCP Connection`
   - Or the extension will auto-connect when activated

3. **Start Chatting:**
   - Open Copilot Chat (`Ctrl+Shift+I` / `Cmd+Shift+I`)
   - Type `@douglas` followed by your question
   - Use slash commands for specific queries

## Usage Examples

### General Queries

```
User: @douglas What programming languages do you know?
Douglas: I have extensive experience with Python, SQL, and JavaScript...

User: @douglas Tell me about your AI/ML background
Douglas: I've worked on several machine learning projects including...
```

### Using Slash Commands

```
User: @douglas /skills
Douglas: Here are my technical and business skills:
- Programming: Python, SQL, JavaScript, HTML/CSS
- AI/ML: Machine Learning, RAG Systems, LangChain...

User: @douglas /projects Tell me about your data visualization work
Douglas: I've built several data visualization projects including...
```

### Interview Preparation

```
User: @douglas /interview How should I introduce myself?
Douglas: Here's my professional introduction: I'm Douglas Mo, a Data Analyst...

User: @douglas What are your greatest strengths?
Douglas: My key strengths include...
```

## Architecture

```
┌─────────────────┐
│   VS Code UI    │
│  Copilot Chat   │
└────────┬────────┘
         │
         │ @douglas query
         ▼
┌─────────────────┐
│   Extension     │
│ Chat Participant│
└────────┬────────┘
         │
         │ Calls tools
         ▼
┌─────────────────┐
│   MCP Client    │
│  (SDK Client)   │
└────────┬────────┘
         │
         │ stdio transport
         ▼
┌─────────────────┐
│   MCP Server    │
│ (Digital Twin)  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│digitaltwin.json │
│   (Data Store)  │
└─────────────────┘
```

## Technical Details

### Tech Stack

- **TypeScript** - Extension code
- **VS Code Extension API** - Chat participants, commands
- **GitHub Copilot API** - `vscode.lm` language model access
- **MCP SDK** - Model Context Protocol client
- **Node.js** - Runtime environment

### Key Components

1. **Chat Request Handler** (`chatRequestHandler`)
   - Processes `@douglas` queries
   - Routes slash commands to appropriate data
   - Crafts prompts for Copilot with context

2. **MCP Client Integration** (`initializeMCPClient`)
   - Connects to digital twin MCP server via stdio
   - Loads all digital twin data on startup
   - Maintains connection for real-time queries

3. **Data Loading** (`loadDigitalTwinData`)
   - Calls MCP tools: `get_personal_info`, `get_work_experience`, `get_skills`, `get_projects`, `get_interview_prep`
   - Caches data in memory for fast access
   - Parses JSON responses from MCP server

4. **Followup Suggestions**
   - Provides contextual next questions
   - Categories: Skills, Projects, Experience, Interview

### Configuration

The extension uses the following VS Code APIs:

- `vscode.chat.createChatParticipant` - Register `@douglas` participant
- `vscode.lm.selectChatModels` - Access Copilot GPT-4o model
- `vscode.commands.registerCommand` - Register MCP enable command
- `vscode.window.showInformationMessage` - User notifications

## Troubleshooting

### "MCP connection failed"

**Solution:**
1. Ensure `mcp-server/index.ts` exists in workspace root
2. Check that MCP server dependencies are installed:
   ```bash
   cd mcp-server
   npm install
   ```
3. Run command: `Douglas Digital Twin: Enable MCP Connection`

### "GitHub Copilot model not available"

**Solution:**
1. Ensure GitHub Copilot extension is installed
2. Verify you have an active Copilot subscription
3. Restart VS Code

### "@douglas participant not found"

**Solution:**
1. Check extension is activated (look for "Douglas Digital Twin" in Extensions)
2. Reload window: `Developer: Reload Window`
3. Check Output panel (`Douglas Digital Twin`) for errors

### "No workspace folder found"

**Solution:**
1. Open a folder/workspace in VS Code (MCP server must be in workspace)
2. Ensure the folder contains the digital twin project

## Development

### Build Commands

```bash
# Install dependencies
npm install

# Compile TypeScript
npm run compile

# Watch mode (auto-compile on save)
npm run watch

# Package extension
npm run package

# Lint code
npm run lint
```

### Project Structure

```
vscode-extension/
├── src/
│   └── extension.ts       # Main extension code
├── out/                   # Compiled JavaScript
├── package.json           # Extension manifest
├── tsconfig.json          # TypeScript config
└── README.md              # This file
```

### Extension Manifest Highlights

```json
{
  "contributes": {
    "chatParticipants": [
      {
        "id": "douglas-digital-twin",
        "name": "douglas",
        "commands": ["experience", "skills", "projects", "interview"]
      }
    ]
  }
}
```

## Roadmap

- [ ] **Multi-language support** - Chinese/English responses
- [ ] **Rich formatting** - Code blocks, tables, images
- [ ] **Context awareness** - Remember conversation history
- [ ] **Streaming updates** - Real-time MCP data sync
- [ ] **Custom prompts** - User-configurable AI behavior

## Contributing

This extension is part of the Douglas Mo Digital Twin project. Contributions welcome!

## License

MIT License - See LICENSE file for details

## Credits

- **Author**: Douglas Mo
- **MCP SDK**: Anthropic's Model Context Protocol
- **Copilot API**: GitHub Copilot Extension API
- **VS Code**: Microsoft Visual Studio Code

## Support

For issues or questions:
- GitHub Issues: [digital-twin/issues](https://github.com/DouglasMooooo/digital-twin/issues)
- Email: douglasmo@example.com

---

**Version**: 1.0.0  
**Last Updated**: November 1, 2025  
**Compatibility**: VS Code 1.90.0+, Copilot required
