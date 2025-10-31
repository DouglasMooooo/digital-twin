"use strict";
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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
const child_process_1 = require("child_process");
const path = __importStar(require("path"));
// Dynamic import for MCP SDK (ES modules)
let Client;
let StdioClientTransport;
async function loadMCPSDK() {
    const sdk = await Promise.resolve().then(() => __importStar(require('@modelcontextprotocol/sdk/client/index.js')));
    const stdio = await Promise.resolve().then(() => __importStar(require('@modelcontextprotocol/sdk/client/stdio.js')));
    Client = sdk.Client;
    StdioClientTransport = stdio.StdioClientTransport;
}
let mcpClient;
let digitalTwinData = {};
// Default fallback data used when MCP is unavailable
const DEFAULT_DIGITAL_TWIN_DATA = {
    personal: {
        name: 'Douglas Mo',
        title: 'AI / ML Engineer',
        location: 'Remote',
        email: 'douglas.mo@example.com',
        summary: 'Experienced AI/ML engineer specializing in predictive analytics and health technology applications.'
    },
    experience: [
        {
            company: 'BF Suma Health Technology',
            role: 'Senior Machine Learning Engineer',
            period: '2021-2024',
            location: 'Remote',
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
        },
        {
            name: 'Recommendation Engine',
            description: 'Personalized health product recommendation system',
            technologies: ['Python', 'collaborative filtering', 'AWS'],
            impact: 'Increased user engagement by 30%',
            role: 'Data Scientist'
        }
    ],
    interview_prep: {
        elevator_pitch: 'I am an AI/ML engineer with 5+ years of experience building production ML systems in health tech. I specialize in predictive modeling, real-time analytics, and deploying scalable ML solutions. My work has directly improved patient outcomes and reduced healthcare costs.',
        strengths: [
            'Strong Python and ML framework expertise',
            'Experience deploying models to production',
            'Healthcare domain knowledge',
            'Problem-solving and analytical thinking'
        ],
        star_examples: [
            {
                situation: 'Hospital needed to reduce emergency room overcrowding',
                task: 'Build predictive model to identify high-risk patients',
                action: 'Developed ML pipeline using patient EHR data, deployed to production with monitoring',
                result: 'Reduced ER visits by 15%, saved $2M annually'
            }
        ]
    }
};
/**
 * Initialize MCP client connection to digital twin server
 */
async function initializeMCPClient(context) {
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
            serverProcess = (0, child_process_1.spawn)(npxCmd, ['tsx', mcpServerPath], {
                cwd: path.dirname(mcpServerPath),
                stdio: ['pipe', 'pipe', 'pipe']
            });
        }
        catch (err) {
            console.error('Failed to spawn MCP server process:', err);
            if (err && err.code === 'ENOENT') {
                vscode.window.showErrorMessage('Douglas Digital Twin: MCP connection failed - npx not found in PATH. Please ensure Node.js/npm is installed and npx is available.');
            }
            else {
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
        }
        catch (err) {
            // Handle spawn/transport/connect errors gracefully
            console.error('Failed to start or connect MCP transport:', err);
            if (err && (err.code === 'ENOENT' || err.code === 'EINVAL')) {
                vscode.window.showWarningMessage(`Douglas Digital Twin: MCP connection failed (${err.code}). MCP features will be disabled. See Extension Host output for details.`);
            }
            else {
                vscode.window.showWarningMessage('Douglas Digital Twin: MCP connection failed. MCP features will be disabled. See Extension Host output for details.');
            }
            // Do not throw — allow the extension to continue so chat participant is still available
            return;
        }
        // Load digital twin data
        await loadDigitalTwinData();
    }
    catch (error) {
        console.error('Failed to initialize MCP client:', error);
        vscode.window.showErrorMessage(`Douglas Digital Twin: MCP connection failed - ${error}`);
        // Use fallback data so chat remains useful
        digitalTwinData = DEFAULT_DIGITAL_TWIN_DATA;
    }
}
/**
 * Load digital twin data from MCP server
 */
async function loadDigitalTwinData() {
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
            personal: personalInfo.content?.[0]?.text ? JSON.parse(personalInfo.content[0].text) : undefined,
            experience: experience.content?.[0]?.text ? JSON.parse(experience.content[0].text) : undefined,
            skills: skills.content?.[0]?.text ? JSON.parse(skills.content[0].text) : undefined,
            projects: projects.content?.[0]?.text ? JSON.parse(projects.content[0].text) : undefined,
            interview_prep: interviewPrep.content?.[0]?.text ? JSON.parse(interviewPrep.content[0].text) : undefined,
        };
        console.log('Digital twin data loaded successfully');
    }
    catch (error) {
        console.error('Failed to load digital twin data:', error);
        // If loading fails, fall back to default data
        digitalTwinData = DEFAULT_DIGITAL_TWIN_DATA;
    }
}
/**
 * Chat request handler for @douglas participant
 */
const chatRequestHandler = async (request, context, stream, token) => {
    console.log('[Douglas Digital Twin] Chat request received:', request.prompt, 'command:', request.command);
    // Show thinking indicator
    stream.progress('Accessing Douglas\'s digital twin...');
    try {
        // Handle slash commands
        let relevantData = '';
        let userQuery = request.prompt;
        if (request.command === 'experience') {
            relevantData = JSON.stringify(digitalTwinData.experience, null, 2);
            userQuery = `Tell me about Douglas's work experience: ${request.prompt}`;
        }
        else if (request.command === 'skills') {
            relevantData = JSON.stringify(digitalTwinData.skills, null, 2);
            userQuery = `Tell me about Douglas's skills: ${request.prompt}`;
        }
        else if (request.command === 'projects') {
            relevantData = JSON.stringify(digitalTwinData.projects, null, 2);
            userQuery = `Tell me about Douglas's projects: ${request.prompt}`;
        }
        else if (request.command === 'interview') {
            relevantData = JSON.stringify(digitalTwinData.interview_prep, null, 2);
            userQuery = `Help with interview preparation: ${request.prompt}`;
        }
        else {
            // General query - include all relevant data
            relevantData = JSON.stringify(digitalTwinData, null, 2);
        }
        // Craft prompt for Copilot - simplified to avoid content policy issues
        const systemPrompt = `You are a helpful assistant. Please answer this question about Douglas Mo's professional background:

${userQuery}

Here is Douglas's profile data:
${relevantData}

Please provide a brief, professional response based on this data.`;
        // Select Copilot model
        console.log('[Douglas Digital Twin] Selecting Copilot model...');
        const [model] = await vscode.lm.selectChatModels({
            vendor: 'copilot',
            family: 'gpt-4o'
        });
        if (!model) {
            console.error('[Douglas Digital Twin] No Copilot model available');
            stream.markdown('❌ GitHub Copilot model not available. Please ensure you have Copilot access.');
            return { metadata: { command: request.command } };
        }
        console.log('[Douglas Digital Twin] Model selected:', model.name, 'family:', model.family);
        // Send request to Copilot
        console.log('[Douglas Digital Twin] Sending request to Copilot...');
        const chatResponse = await model.sendRequest([
            vscode.LanguageModelChatMessage.User(systemPrompt)
        ], {}, token);
        console.log('[Douglas Digital Twin] Streaming response...');
        // Stream response
        for await (const chunk of chatResponse.text) {
            stream.markdown(chunk);
        }
        console.log('[Douglas Digital Twin] Response completed');
        return { metadata: { command: request.command } };
    }
    catch (error) {
        console.error('[Douglas Digital Twin] Chat request error:', error);
        if (error instanceof vscode.LanguageModelError) {
            console.log('[Douglas Digital Twin] Language model error:', error.message, error.code, error.cause);
            stream.markdown(`❌ Error: ${error.message}`);
        }
        else {
            stream.markdown('❌ An error occurred while processing your request.');
        }
        return { metadata: { command: request.command } };
    }
};
/**
 * Extension activation
 */
async function activate(context) {
    console.log('Douglas Digital Twin extension is now active!');
    // Initialize with fallback data immediately
    digitalTwinData = DEFAULT_DIGITAL_TWIN_DATA;
    console.log('[Douglas Digital Twin] Initialized with fallback data');
    // Load MCP SDK
    await loadMCPSDK();
    // Initialize MCP client (async, but fallback data is already set)
    initializeMCPClient(context).catch(console.error);
    // Register chat participant (ID must match package.json `chatParticipants[].id`)
    const participant = vscode.chat.createChatParticipant('douglas-digital-twin', chatRequestHandler);
    // Set participant properties
    participant.iconPath = new vscode.ThemeIcon('person');
    participant.followupProvider = {
        provideFollowups(result, context, token) {
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
    context.subscriptions.push(vscode.commands.registerCommand('douglas-digital-twin.enableMCP', async () => {
        await initializeMCPClient(context);
    }));
    console.log('Chat participant @douglas registered successfully');
}
/**
 * Extension deactivation
 */
function deactivate() {
    if (mcpClient) {
        // Cleanup MCP client if needed
    }
}
//# sourceMappingURL=extension.js.map