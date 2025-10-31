# Douglas Mo Digital Twin MCP Server

This MCP server provides Claude Desktop with direct access to Douglas Mo's digital twin data, enabling intelligent queries about professional experience, skills, education, and career preparation.

## 🚀 Features

### Available Tools (8)

1. **get_personal_info** - Personal details and contact information
2. **get_work_experience** - Work history with STAR achievements (filterable by company)
3. **get_education** - Academic background with detailed coursework
4. **get_skills** - Skills by category (programming, AI/ML, business, financial)
5. **get_projects** - Project portfolio
6. **get_interview_prep** - Interview preparation materials
7. **search_experience** - Keyword search across experience
8. **generate_resume_summary** - Custom resume summary for specific job roles

### Available Resources (5)

1. `digitaltwin://personal` - Personal information
2. `digitaltwin://experience` - Work experience
3. `digitaltwin://education` - Education background
4. `digitaltwin://skills` - Skills portfolio
5. `digitaltwin://full-profile` - Complete profile data

## 📦 Installation

### 1. Install dependencies

```bash
cd mcp-server
npm install
```

### 2. Configure Claude Desktop

Add to your Claude Desktop config file:

**Windows:** `%APPDATA%\Claude\claude_desktop_config.json`
**macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "digital-twin": {
      "command": "node",
      "args": ["D:\\上课\\Ai agent\\digital twin\\mcp-server\\index.js"]
    }
  }
}
```

### 3. Restart Claude Desktop

The MCP server will be automatically loaded.

## 🎯 Usage Examples

### In Claude Desktop:

**Query personal info:**
```
Use the digital-twin MCP server to get Douglas Mo's personal information
```

**Search experience:**
```
Search Douglas's experience for "financial management" keywords
```

**Get skills by category:**
```
Get all programming skills from Douglas's profile
```

**Generate custom resume:**
```
Generate a resume summary for Douglas targeting a "Senior Data Analyst" position, 
focusing on Python, SQL, and Machine Learning
```

**Read resources:**
```
Read the digitaltwin://education resource
```

## 🛠️ Development

### Test the server:

```bash
npm start
```

### Watch mode (auto-reload):

```bash
npm run dev
```

## 📊 Data Source

The server reads from `../digitaltwin.json` which contains:
- Personal information and contact details
- 3 work experiences with STAR achievements
- 2 education degrees with coursework
- 40+ skills across 4 categories
- 5+ projects
- Interview preparation materials

## 🔐 Security

- The server runs locally on your machine
- No data is sent to external servers
- All communication happens via stdio transport
- Read-only access to profile data

## 📝 API Reference

### Tools

#### get_personal_info()
Returns: Personal object with name, title, location, summary, contact

#### get_work_experience({ company?: string })
Returns: Array of work experiences, optionally filtered by company name

#### get_education()
Returns: Array of education with degrees, institutions, coursework

#### get_skills({ category?: string })
Returns: Skills object or specific category
Categories: programming_languages, ai_ml_skills, business_skills, financial_accounting

#### get_projects()
Returns: Array of projects with descriptions and technologies

#### get_interview_prep({ section?: string })
Returns: Interview prep materials or specific section
Sections: self_introduction, strengths, why_hire_me, career_goals

#### search_experience({ keyword: string })
Returns: Work experiences matching the keyword

#### generate_resume_summary({ job_title: string, focus_areas?: string[] })
Returns: Customized resume summary for target role

## 🌐 Integration with Website

This MCP server complements the web application:
- **Website**: https://douglasmo.vercel.app/ (public access, AI chat)
- **GitHub**: https://github.com/DouglasMooooo/digital-twin
- **MCP Server**: Local Claude Desktop integration (private, direct data access)

## 📄 License

MIT License - Douglas Mo © 2025
