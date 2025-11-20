@echo off
REM 将 MCP 配置复制到 Claude Desktop 配置目录

set SOURCE=D:\上课\Ai agent\digital twin\claude-desktop-config.json
set DEST=%APPDATA%\Claude\claude_desktop_config.json

echo 源文件: %SOURCE%
echo 目标文件: %DEST%
echo.

if not exist "%SOURCE%" (
    echo ❌ 错误: 源文件不存在！
    pause
    exit /b 1
)

REM 创建备份
if exist "%DEST%" (
    echo 正在备份现有配置...
    copy "%DEST%" "%DEST%.backup"
)

REM 复制文件
echo 正在复制配置文件...
copy "%SOURCE%" "%DEST%"

if %ERRORLEVEL% EQU 0 (
    echo ✅ 配置文件已复制成功！
    echo.
    echo 请重启 Claude Desktop 应用以加载新的 MCP 配置。
) else (
    echo ❌ 复制失败！
)

pause
