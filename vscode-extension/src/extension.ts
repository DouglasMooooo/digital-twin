/**
 * Douglas Digital Twin - VS Code Copilot Extension
 * 
 * This extension integrates Douglas Mo's digital twin with GitHub Copilot,
 * allowing developers to chat with an AI assistant about Douglas's professional
 * background, skills, projects, and experience.
 * 
 * Features:
 * - @douglas chat participant in Copilot Chat
 * - Access to digital twin data via MCP server
 * - Context-aware responses using GPT-4o
 * - Slash commands for specific queries
 */

import * as vscode from 'vscode';
import { spawn } from 'child_process';
import * as path from 'path';

// Dynamic import for MCP SDK (ES modules)
let Client: any;
let StdioClientTransport: any;

async function loadMCPSDK() {
  const sdk = await import('@modelcontextprotocol/sdk/client/index.js');
  const stdio = await import('@modelcontextprotocol/sdk/client/stdio.js');
  Client = sdk.Client;
  StdioClientTransport = stdio.StdioClientTransport;
}

interface DigitalTwinData {
  personal?: unknown;
  experience?: unknown[];
  education?: unknown[];
  skills?: unknown;
  projects?: unknown[];
  interview_prep?: unknown;
}

// Default fallback data used when MCP is unavailable
const DEFAULT_DIGITAL_TWIN_DATA: DigitalTwinData = {
  personal: {
    name: 'Douglas Mo',
    title: 'AI / ML Engineer',
    location: 'Remote',
    summary: 'AI/ML engineer with experience in healthcare predictive modeling and production ML systems.'
  },
  experience: [
    {
      company: 'BF Suma Health Technology',
      role: 'Senior Machine Learning Engineer',
      period: '2021-2024',
      responsibilities: [
        'Developed predictive models for patient risk assessment',
        'Built real-time monitoring systems using streaming data',
        'Collaborated with medical professionals to design ML solutions',
        'Improved model accuracy by 25% through feature engineering'
      ],
      technologies: ['Python', 'TensorFlow', 'PyTorch', 'scikit-learn', 'Pandas', 'Docker', 'Kubernetes']
    },
    {
      company: 'Tech Startup',
      role: 'Data Scientist',
      period: '2019-2021',
      responsibilities: [
        'Analyzed customer behavior data',
        'Built recommendation systems',
        'A/B testing and experimentation'
      ],
      technologies: ['Python', 'SQL', 'Tableau', 'AWS']
    }
  ],
  skills: {
    programming_languages: ['Python', 'TypeScript', 'JavaScript', 'SQL', 'R'],
    ml_frameworks: ['TensorFlow', 'PyTorch', 'scikit-learn', 'Keras', 'XGBoost'],
    data_tools: ['Pandas', 'NumPy', 'Matplotlib', 'Seaborn', 'Jupyter'],
    cloud_platforms: ['AWS', 'Azure', 'GCP'],
    devops: ['Docker', 'Kubernetes', 'Git', 'CI/CD'],
    databases: ['PostgreSQL', 'MySQL', 'MongoDB', 'Redis']
  },
  projects: [
    {
      name: 'Patient Risk Prediction Model',
      description: 'ML model to predict patient health risks using electronic health records',
      technologies: ['Python', 'TensorFlow', 'scikit-learn', 'Docker'],
      impact: 'Reduced emergency room visits by 15% through early intervention',
      role: 'Lead ML Engineer'
    },
    {
      name: 'Real-time Health Monitoring System',
      description: 'Streaming analytics platform for continuous patient monitoring',
      technologies: ['Python', 'Kafka', 'Spark', 'PostgreSQL'],
      impact: 'Monitors 10,000+ patients in real-time',
      role: 'Backend Developer & ML Engineer'
    }
  ],
  interview_prep: {
    elevator_pitch: 'AI/ML engineer with 5+ years building production ML systems in health tech. Specialist in predictive modeling and production ML.',
    strengths: ['Python', 'Production ML', 'Healthcare domain knowledge']
  }
};

let mcpClient: any | undefined;
let digitalTwinData: DigitalTwinData = DEFAULT_DIGITAL_TWIN_DATA;

/**
 * Initialize MCP client connection to digital twin server
 */
async function initializeMCPClient(context: vscode.ExtensionContext): Promise<void> {
  try {
    // Load MCP SDK first
    await loadMCPSDK();
    // Path to MCP server (adjust based on workspace)
    const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
    if (!workspaceFolder) {
      vscode.window.showWarningMessage('Douglas Digital Twin: No workspace folder found. MCP integration disabled.');
      return;
    }

    const mcpServerPath = path.join(workspaceFolder.uri.fsPath, 'mcp-server', 'index.ts');
    
    // Check if MCP server exists
    const fs = require('fs');
    if (!fs.existsSync(mcpServerPath)) {
      console.log('MCP server not found at:', mcpServerPath);
      return;
    }

    // Create stdio transport for MCP communication
    // Use cross-platform npx command: on Windows the executable is 'npx.cmd'
    const npxCmd = process.platform === 'win32' ? 'npx.cmd' : 'npx';

    let serverProcess;
    try {
      serverProcess = spawn(npxCmd, ['tsx', mcpServerPath], {
        cwd: path.dirname(mcpServerPath),
        stdio: ['pipe', 'pipe', 'pipe']
      });
    } catch (err: any) {
      console.error('Failed to spawn MCP server process:', err);
      if (err && err.code === 'ENOENT') {
        vscode.window.showErrorMessage('Douglas Digital Twin: MCP connection failed - npx not found in PATH. Please ensure Node.js/npm is installed and npx is available.');
      } else {
        vscode.window.showErrorMessage(`Douglas Digital Twin: MCP connection failed - ${err}`);
      }
      return;
    }

    let transport;
    try {
      transport = new StdioClientTransport({
        command: npxCmd,
        args: ['tsx', mcpServerPath]
      });

      // Initialize MCP client
      mcpClient = new Client({
        name: 'douglas-digital-twin-vscode',
        version: '1.0.0'
      }, {
        capabilities: {}
      });

      await mcpClient.connect(transport);
      console.log('MCP client connected successfully');
      vscode.window.showInformationMessage('Douglas Digital Twin: MCP connection established!');
    } catch (err: any) {
      // Handle spawn/transport/connect errors gracefully
      console.error('Failed to start or connect MCP transport:', err);
      if (err && (err.code === 'ENOENT' || err.code === 'EINVAL')) {
        vscode.window.showWarningMessage(`Douglas Digital Twin: MCP connection failed (${err.code}). MCP features will be disabled. See Extension Host output for details.`);
      } else {
        vscode.window.showWarningMessage('Douglas Digital Twin: MCP connection failed. MCP features will be disabled. See Extension Host output for details.');
      }
      // Do not throw — allow the extension to continue so chat participant is still available
      return;
    }

    // Load digital twin data
    await loadDigitalTwinData();

  } catch (error) {
    console.error('Failed to initialize MCP client:', error);
    vscode.window.showErrorMessage(`Douglas Digital Twin: MCP connection failed - ${error}`);
  }
}

/**
 * Load digital twin data from MCP server
 */
async function loadDigitalTwinData(): Promise<void> {
  if (!mcpClient) {
    console.log('MCP client not initialized; using fallback data');
    digitalTwinData = DEFAULT_DIGITAL_TWIN_DATA;
    return;
  }

  try {
    // Call MCP tools to get data
    const personalInfo = await mcpClient.callTool({
      name: 'get_personal_info',
      arguments: {}
    });

    const experience = await mcpClient.callTool({
      name: 'get_work_experience',
      arguments: {}
    });

    const skills = await mcpClient.callTool({
      name: 'get_skills',
      arguments: {}
    });

    const projects = await mcpClient.callTool({
      name: 'get_projects',
      arguments: {}
    });

    const interviewPrep = await mcpClient.callTool({
      name: 'get_interview_prep',
      arguments: {}
    });

    // Parse responses
    digitalTwinData = {
      personal: (personalInfo.content as any)?.[0]?.text ? JSON.parse((personalInfo.content as any)[0].text) : undefined,
      experience: (experience.content as any)?.[0]?.text ? JSON.parse((experience.content as any)[0].text) : undefined,
      skills: (skills.content as any)?.[0]?.text ? JSON.parse((skills.content as any)[0].text) : undefined,
      projects: (projects.content as any)?.[0]?.text ? JSON.parse((projects.content as any)[0].text) : undefined,
      interview_prep: (interviewPrep.content as any)?.[0]?.text ? JSON.parse((interviewPrep.content as any)[0].text) : undefined,
    };

    console.log('Digital twin data loaded successfully');
  } catch (error) {
    console.error('Failed to load digital twin data:', error);
    // Fall back to default data on any error
    digitalTwinData = DEFAULT_DIGITAL_TWIN_DATA;
  }
}

/**
 * Chat request handler for @douglas participant
 */
const chatRequestHandler: vscode.ChatRequestHandler = async (
  request: vscode.ChatRequest,
  context: vscode.ChatContext,
  stream: vscode.ChatResponseStream,
  token: vscode.CancellationToken
): Promise<vscode.ChatResult> => {
  
  // Show thinking indicator
  stream.progress('Accessing Douglas\'s digital twin...');

  try {
    // Handle slash commands
    let relevantData = '';
    let userQuery = request.prompt;

    if (request.command === 'experience') {
      relevantData = JSON.stringify(digitalTwinData.experience, null, 2);
      userQuery = `Tell me about Douglas's work experience: ${request.prompt}`;
    } else if (request.command === 'skills') {
      relevantData = JSON.stringify(digitalTwinData.skills, null, 2);
      userQuery = `Tell me about Douglas's skills: ${request.prompt}`;
    } else if (request.command === 'projects') {
      relevantData = JSON.stringify(digitalTwinData.projects, null, 2);
      userQuery = `Tell me about Douglas's projects: ${request.prompt}`;
    } else if (request.command === 'interview') {
      relevantData = JSON.stringify(digitalTwinData.interview_prep, null, 2);
      userQuery = `Help with interview preparation: ${request.prompt}`;
    } else {
      // General query - include all relevant data
      relevantData = JSON.stringify(digitalTwinData, null, 2);
    }

    // Craft prompt for Copilot
    const systemPrompt = `You are Douglas Mo's AI assistant. You have access to Douglas's complete professional profile including work experience, skills, projects, and education.

Your role is to:
1. Answer questions about Douglas's background professionally
2. Provide specific examples from his experience using the STAR method when relevant
3. Highlight relevant skills and projects based on the query
4. Be concise but informative

Douglas's Digital Twin Data:
${relevantData}

User Question: ${userQuery}

Please provide a helpful, professional response based on Douglas's actual experience and skills.`;

    // Select Copilot model
    const [model] = await vscode.lm.selectChatModels({
      vendor: 'copilot',
      family: 'gpt-4o'
    });

    if (!model) {
      stream.markdown('❌ GitHub Copilot model not available. Please ensure you have Copilot access.');
      return { metadata: { command: request.command } };
    }

    // Send request to Copilot
    const chatResponse = await model.sendRequest(
      [
        vscode.LanguageModelChatMessage.User(systemPrompt)
      ],
      {},
      token
    );

    // Stream response
    for await (const chunk of chatResponse.text) {
      stream.markdown(chunk);
    }

    return { metadata: { command: request.command } };

  } catch (error) {
    if (error instanceof vscode.LanguageModelError) {
      console.log('Language model error:', error.message, error.code);
      stream.markdown(`❌ Error: ${error.message}`);
    } else {
      console.error('Chat request error:', error);
      stream.markdown('❌ An error occurred while processing your request.');
    }
    return { metadata: { command: request.command } };
  }
};

/**
 * Extension activation
 */
export async function activate(context: vscode.ExtensionContext) {
  console.log('Douglas Digital Twin extension is now active!');

  // Load MCP SDK
  await loadMCPSDK();

  // Initialize MCP client
  initializeMCPClient(context).catch(console.error);

  // Register chat participant (ID must match package.json `chatParticipants[].id`)
  const participant = vscode.chat.createChatParticipant(
    'douglas-digital-twin',
    chatRequestHandler
  );

  // Set participant properties
  participant.iconPath = new vscode.ThemeIcon('person');
  participant.followupProvider = {
    provideFollowups(result: vscode.ChatResult, context: vscode.ChatContext, token: vscode.CancellationToken) {
      return [
        {
          prompt: 'What are Douglas\'s Python skills?',
          label: '🐍 Python Skills',
          command: 'skills'
        },
        {
          prompt: 'Tell me about Douglas\'s machine learning projects',
          label: '🤖 ML Projects',
          command: 'projects'
        },
        {
          prompt: 'What is Douglas\'s work experience?',
          label: '💼 Work Experience',
          command: 'experience'
        },
        {
          prompt: 'Help me prepare for an interview with Douglas',
          label: '🎯 Interview Prep',
          command: 'interview'
        }
      ];
    }
  };

  context.subscriptions.push(participant);

  // Register enable MCP command
  context.subscriptions.push(
    vscode.commands.registerCommand('douglas-digital-twin.enableMCP', async () => {
      await initializeMCPClient(context);
    })
  );

  console.log('Chat participant @douglas registered successfully');
}

/**
 * Extension deactivation
 */
export function deactivate() {
  if (mcpClient) {
    // Cleanup MCP client if needed
  }
}
