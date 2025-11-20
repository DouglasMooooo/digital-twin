$claudeConfigPath = "$env:APPDATA\Claude\claude_desktop_config.json"
$sourceConfigPath = "D:\上课\Ai agent\digital twin\claude-desktop-config.json"

# 确保目录存在
$claudeDir = "$env:APPDATA\Claude"
if (!(Test-Path $claudeDir)) {
    New-Item -ItemType Directory -Path $claudeDir -Force | Out-Null
    Write-Host "✅ 创建 Claude 配置目录: $claudeDir" -ForegroundColor Green
}

# 复制配置文件
Copy-Item -Path $sourceConfigPath -Destination $claudeConfigPath -Force
Write-Host "✅ 已更新 Claude Desktop 配置文件" -ForegroundColor Green
Write-Host "   路径: $claudeConfigPath" -ForegroundColor Cyan
Write-Host ""
Write-Host "📝 配置内容:" -ForegroundColor Yellow
Get-Content $claudeConfigPath | ConvertFrom-Json | ConvertTo-Json -Depth 10

Write-Host ""
Write-Host "⚠️  请重启 Claude Desktop 应用以加载新配置" -ForegroundColor Yellow
Write-Host "   MCP Server 工具应该会在左侧边栏显示" -ForegroundColor Cyan
