# PowerShell wrapper for init-vector-hf-1024.py
# Ensures proper execution with error handling

$ErrorActionPreference = "Continue"
Write-Host "=== 开始向量初始化 ===" -ForegroundColor Green

# Change to repo root
Set-Location "d:\上课\Ai agent\digital twin"

# Run Python script
Write-Host "`n正在运行 Python 脚本..." -ForegroundColor Cyan
$output = python scripts/init-vector-hf-1024.py 2>&1
$exitCode = $LASTEXITCODE

# Print output
$output | ForEach-Object { Write-Host $_ }

# Check result
if ($exitCode -eq 0) {
    Write-Host "`n✅ 向量初始化成功完成" -ForegroundColor Green
    exit 0
} else {
    Write-Host "`n❌ 向量初始化失败 (exit code: $exitCode)" -ForegroundColor Red
    exit $exitCode
}
