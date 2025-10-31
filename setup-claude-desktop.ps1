# === Claude Desktop MCP 一键配置脚本 ===
# 使用方法：在项目根目录运行 .\setup-claude-desktop.ps1

Write-Host "🚀 开始配置 Claude Desktop MCP..." -ForegroundColor Cyan
Write-Host ""

# 1. 编译 MCP 服务器
Write-Host "🔨 第 1 步：编译 MCP 服务器..." -ForegroundColor Yellow
Set-Location "mcp-server"

# 检查 package.json
if (!(Test-Path "package.json")) {
    Write-Host "❌ 错误：找不到 mcp-server/package.json" -ForegroundColor Red
    exit 1
}

# 安装依赖
Write-Host "   📦 检查依赖..." -ForegroundColor Gray
if (!(Test-Path "node_modules")) {
    Write-Host "   📥 安装 npm 依赖..." -ForegroundColor Gray
    npm install
}

# 编译
Write-Host "   🔧 编译 TypeScript..." -ForegroundColor Gray
npm run build

if (Test-Path "dist\index.js") {
    Write-Host "✅ MCP 服务器编译成功" -ForegroundColor Green
} else {
    Write-Host "❌ 编译失败，请检查错误信息" -ForegroundColor Red
    Set-Location ".."
    exit 1
}

Set-Location ".."
Write-Host ""

# 2. 读取环境变量
Write-Host "🔑 第 2 步：读取环境变量..." -ForegroundColor Yellow

if (!(Test-Path ".env")) {
    Write-Host "❌ 错误：找不到 .env 文件" -ForegroundColor Red
    Write-Host "   请确保项目根目录有 .env 文件并包含以下变量：" -ForegroundColor Gray
    Write-Host "   - UPSTASH_VECTOR_REST_URL" -ForegroundColor Gray
    Write-Host "   - UPSTASH_VECTOR_REST_TOKEN" -ForegroundColor Gray
    Write-Host "   - UPSTASH_REDIS_REST_URL" -ForegroundColor Gray
    Write-Host "   - UPSTASH_REDIS_REST_TOKEN" -ForegroundColor Gray
    Write-Host "   - GROQ_API_KEY" -ForegroundColor Gray
    exit 1
}

$envContent = Get-Content ".env" -Raw
$envVars = @{}
$envContent -split "`n" | ForEach-Object {
    $line = $_.Trim()
    if ($line -and !$line.StartsWith("#") -and $line -match "^([^=]+)=(.*)$") {
        $key = $matches[1].Trim()
        $value = $matches[2].Trim().Trim('"').Trim("'")
        $envVars[$key] = $value
    }
}

# 验证必需变量
$requiredVars = @(
    'UPSTASH_VECTOR_REST_URL',
    'UPSTASH_VECTOR_REST_TOKEN',
    'UPSTASH_REDIS_REST_URL',
    'UPSTASH_REDIS_REST_TOKEN',
    'GROQ_API_KEY'
)

$missingVars = @()
foreach ($var in $requiredVars) {
    if (!$envVars[$var]) {
        $missingVars += $var
    }
}

if ($missingVars.Count -gt 0) {
    Write-Host "❌ 错误：缺少以下环境变量：" -ForegroundColor Red
    $missingVars | ForEach-Object { Write-Host "   - $_" -ForegroundColor Red }
    exit 1
}

Write-Host "✅ 环境变量读取成功" -ForegroundColor Green
Write-Host ""

# 3. 创建 Claude Desktop 配置
Write-Host "⚙️  第 3 步：生成 Claude Desktop 配置..." -ForegroundColor Yellow

$configDir = "$env:APPDATA\Claude"
if (!(Test-Path $configDir)) {
    Write-Host "   📁 创建配置目录..." -ForegroundColor Gray
    New-Item -ItemType Directory -Path $configDir -Force | Out-Null
}

# 获取项目绝对路径
$projectPath = (Get-Location).Path
$mcpServerPath = Join-Path $projectPath "mcp-server\dist\index.js"

# 转换为正斜杠路径（更安全）
$mcpServerPath = $mcpServerPath -replace '\\', '/'

$config = @{
    mcpServers = @{
        "douglas-digital-twin" = @{
            command = "node"
            args = @(
                $mcpServerPath
            )
            env = @{
                UPSTASH_VECTOR_REST_URL = $envVars['UPSTASH_VECTOR_REST_URL']
                UPSTASH_VECTOR_REST_TOKEN = $envVars['UPSTASH_VECTOR_REST_TOKEN']
                UPSTASH_REDIS_REST_URL = $envVars['UPSTASH_REDIS_REST_URL']
                UPSTASH_REDIS_REST_TOKEN = $envVars['UPSTASH_REDIS_REST_TOKEN']
                GROQ_API_KEY = $envVars['GROQ_API_KEY']
            }
        }
    }
}

$configPath = "$configDir\claude_desktop_config.json"
$config | ConvertTo-Json -Depth 10 | Out-File -FilePath $configPath -Encoding UTF8

Write-Host "✅ 配置文件已创建" -ForegroundColor Green
Write-Host "   📂 位置: $configPath" -ForegroundColor Gray
Write-Host ""

# 4. 验证配置
Write-Host "🧪 第 4 步：验证配置..." -ForegroundColor Yellow

try {
    $loadedConfig = Get-Content $configPath | ConvertFrom-Json
    if ($loadedConfig.mcpServers.'douglas-digital-twin') {
        Write-Host "✅ 配置文件格式正确" -ForegroundColor Green
    } else {
        Write-Host "❌ 配置验证失败：找不到 douglas-digital-twin 服务器配置" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "❌ 配置验证失败：JSON 格式错误" -ForegroundColor Red
    Write-Host "   错误详情: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# 5. 测试 MCP 服务器可执行性
Write-Host ""
Write-Host "🔬 第 5 步：测试 MCP 服务器..." -ForegroundColor Yellow
Write-Host "   启动测试（3 秒后自动终止）..." -ForegroundColor Gray

$testProcess = Start-Process -FilePath "node" -ArgumentList $mcpServerPath -NoNewWindow -PassThru
Start-Sleep -Seconds 3

if (!$testProcess.HasExited) {
    Stop-Process -Id $testProcess.Id -Force
    Write-Host "✅ MCP 服务器可正常启动" -ForegroundColor Green
} else {
    Write-Host "❌ MCP 服务器启动失败" -ForegroundColor Red
    Write-Host "   请手动测试：node `"$mcpServerPath`"" -ForegroundColor Gray
}

# 6. 完成提示
Write-Host ""
Write-Host "=" * 60 -ForegroundColor Cyan
Write-Host "🎉 配置完成！" -ForegroundColor Green
Write-Host "=" * 60 -ForegroundColor Cyan
Write-Host ""
Write-Host "📋 下一步操作：" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. 安装 Claude Desktop（如果还没安装）" -ForegroundColor White
Write-Host "   下载地址: https://claude.ai/download" -ForegroundColor Gray
Write-Host ""
Write-Host "2. 完全关闭 Claude Desktop" -ForegroundColor White
Write-Host "   - 右键任务栏托盘图标 → 退出" -ForegroundColor Gray
Write-Host "   - 或在任务管理器中确认进程已结束" -ForegroundColor Gray
Write-Host ""
Write-Host "3. 重新启动 Claude Desktop" -ForegroundColor White
Write-Host "   - 等待 5-10 秒让 MCP 服务器加载" -ForegroundColor Gray
Write-Host ""
Write-Host "4. 发送测试消息：" -ForegroundColor White
Write-Host '   "使用 douglas-digital-twin 工具查询 Douglas 的技术技能"' -ForegroundColor Cyan
Write-Host ""
Write-Host "5. 验证响应包含具体技术栈信息" -ForegroundColor White
Write-Host ""
Write-Host "📂 配置文件位置：" -ForegroundColor Yellow
Write-Host "   $configPath" -ForegroundColor Gray
Write-Host ""
Write-Host "📖 详细文档：" -ForegroundColor Yellow
Write-Host "   CLAUDE_DESKTOP_SETUP.md" -ForegroundColor Gray
Write-Host ""
Write-Host "🆘 遇到问题？" -ForegroundColor Yellow
Write-Host "   1. 查看 Claude Desktop 日志：$env:APPDATA\Claude\logs\" -ForegroundColor Gray
Write-Host "   2. 手动测试 MCP 服务器：node `"$mcpServerPath`"" -ForegroundColor Gray
Write-Host "   3. 验证配置文件：Get-Content `"$configPath`" | ConvertFrom-Json" -ForegroundColor Gray
Write-Host ""
Write-Host "=" * 60 -ForegroundColor Cyan
