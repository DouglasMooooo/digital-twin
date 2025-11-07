#!/usr/bin/env pwsh
# MCP Servers 配置脚本

Write-Host "🔌 MCP Servers 配置助手" -ForegroundColor Cyan
Write-Host "=" * 50 -ForegroundColor Gray

# 检测 Claude Desktop 配置文件路径
$configPath = "$env:APPDATA\Claude\claude_desktop_config.json"

Write-Host "`n📂 检查 Claude Desktop 配置文件..." -ForegroundColor Yellow
if (!(Test-Path $configPath)) {
    Write-Host "⚠️  配置文件不存在，创建新文件..." -ForegroundColor Yellow
    New-Item -ItemType File -Path $configPath -Force | Out-Null
    Write-Host "✅ 配置文件已创建: $configPath" -ForegroundColor Green
} else {
    Write-Host "✅ 找到配置文件: $configPath" -ForegroundColor Green
}

# 读取现有配置
$config = @{}
if (Test-Path $configPath) {
    $existingContent = Get-Content $configPath -Raw
    if ($existingContent) {
        try {
            $config = $existingContent | ConvertFrom-Json -AsHashtable
        } catch {
            Write-Host "⚠️  现有配置格式错误，将创建新配置" -ForegroundColor Yellow
        }
    }
}

# 确保 mcpServers 键存在
if (!$config.mcpServers) {
    $config.mcpServers = @{}
}

Write-Host "`n🎯 推荐部署的 MCP Servers:" -ForegroundColor Cyan
Write-Host "1. Digital Twin (你的个人档案) - 已配置" -ForegroundColor White
Write-Host "2. GitHub (代码仓库管理) - 推荐⭐⭐⭐" -ForegroundColor White
Write-Host "3. Filesystem (本地文件访问) - 推荐⭐⭐⭐" -ForegroundColor White
Write-Host "4. Fetch (网页抓取) - 推荐⭐⭐⭐" -ForegroundColor White

Write-Host "`n" -NoNewline
$choice = Read-Host "是否配置所有推荐的 MCP servers? (y/n)"

if ($choice -eq 'y' -or $choice -eq 'Y') {
    
    # 1. Digital Twin MCP (已有)
    $projectPath = "d:/上课/Ai agent/digital twin/mcp-server/index.js"
    $config.mcpServers["digital-twin"] = @{
        command = "node"
        args = @($projectPath)
    }
    Write-Host "✅ Digital Twin MCP 已配置" -ForegroundColor Green

    # 2. GitHub MCP
    Write-Host "`n🔑 GitHub Token 配置:" -ForegroundColor Yellow
    Write-Host "请访问: https://github.com/settings/tokens" -ForegroundColor Cyan
    Write-Host "创建 token 时勾选: repo, read:user, read:org" -ForegroundColor Cyan
    $githubToken = Read-Host "`n请输入你的 GitHub Token (ghp_xxx...)"
    
    if ($githubToken) {
        $config.mcpServers["github"] = @{
            command = "npx"
            args = @("-y", "@modelcontextprotocol/server-github")
            env = @{
                GITHUB_PERSONAL_ACCESS_TOKEN = $githubToken
            }
        }
        Write-Host "✅ GitHub MCP 已配置" -ForegroundColor Green
    }

    # 3. Filesystem MCP
    $config.mcpServers["filesystem"] = @{
        command = "npx"
        args = @(
            "-y",
            "@modelcontextprotocol/server-filesystem",
            "d:/上课/Ai agent/digital twin"
        )
    }
    Write-Host "✅ Filesystem MCP 已配置" -ForegroundColor Green

    # 4. Fetch MCP
    $config.mcpServers["fetch"] = @{
        command = "npx"
        args = @("-y", "@modelcontextprotocol/server-fetch")
    }
    Write-Host "✅ Fetch MCP 已配置" -ForegroundColor Green

    # 保存配置
    Write-Host "`n💾 保存配置到 $configPath ..." -ForegroundColor Yellow
    $config | ConvertTo-Json -Depth 10 | Set-Content $configPath -Encoding UTF8
    Write-Host "✅ 配置已保存！" -ForegroundColor Green

    # 显示最终配置
    Write-Host "`n📋 最终配置:" -ForegroundColor Cyan
    Write-Host "=" * 50 -ForegroundColor Gray
    Get-Content $configPath | Write-Host -ForegroundColor White
    Write-Host "=" * 50 -ForegroundColor Gray

    # 使用说明
    Write-Host "`n🎉 配置完成！下一步操作:" -ForegroundColor Green
    Write-Host "1. 重启 Claude Desktop" -ForegroundColor Yellow
    Write-Host "2. 在 Claude 中输入测试命令:" -ForegroundColor Yellow
    Write-Host "   - Use the digital-twin MCP to get my work experience" -ForegroundColor Cyan
    Write-Host "   - Use the github MCP to show my repositories" -ForegroundColor Cyan
    Write-Host "   - Use the filesystem MCP to list files in my project" -ForegroundColor Cyan
    Write-Host "   - Use the fetch MCP to get content from a URL" -ForegroundColor Cyan

    Write-Host "`n📖 查看完整文档: MCP_ECOSYSTEM_GUIDE.md" -ForegroundColor White

} else {
    Write-Host "`n取消配置。你可以稍后手动编辑: $configPath" -ForegroundColor Yellow
}

Write-Host "`n✨ 完成！" -ForegroundColor Green
