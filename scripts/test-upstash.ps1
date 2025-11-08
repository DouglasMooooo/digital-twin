# Load environment variables
$envFile = ".env.local"
if (-not (Test-Path $envFile)) {
    Write-Host "❌ .env.local not found" -ForegroundColor Red
    exit 1
}

$env_vars = Get-Content $envFile | Select-String -Pattern '^\w+=' | ForEach-Object {
    $parts = $_ -split '='
    [pscustomobject]@{ Key = $parts[0]; Value = $parts[1] }
}

$env_vars | ForEach-Object { [Environment]::SetEnvironmentVariable($_.Key, $_.Value) }

$url = $env:UPSTASH_VECTOR_REST_URL
$token = $env:UPSTASH_VECTOR_REST_TOKEN

if (-not $url -or -not $token) {
    Write-Host "❌ Missing Upstash credentials" -ForegroundColor Red
    exit 1
}

Write-Host "✓ Upstash credentials loaded" -ForegroundColor Green
Write-Host "URL: $($url.Substring(0, 50))..." -ForegroundColor Cyan

# Generate test vector (384 dimensions)
$vector = @()
for ($i = 0; $i -lt 384; $i++) {
    $vector += (Get-Random -Minimum 0 -Maximum 1000) / 1000.0
}

# Create test payload
$testData = @{
    vectors = @(
        @{
            id = "test-1"
            vector = $vector
            metadata = @{
                type = "test"
                content = "This is a test vector"
            }
        }
    )
} | ConvertTo-Json -Depth 10

Write-Host "`n📤 Sending test vector to Upstash..." -ForegroundColor Yellow
Write-Host "Vector dimensions: $($vector.Length)" -ForegroundColor Cyan

# Send to Upstash
try {
    $response = Invoke-WebRequest -Uri "$url/upsert" `
        -Method Post `
        -Headers @{ "Authorization" = "Bearer $token"; "Content-Type" = "application/json" } `
        -Body $testData `
        -UseBasicParsing

    Write-Host "Response: $($response.Content)" -ForegroundColor Green
    Write-Host "`n✅ Test successful!" -ForegroundColor Green
} catch {
    $errorResponse = $_.Exception.Response.Content.ToString()
    Write-Host "❌ Error: $errorResponse" -ForegroundColor Red
    exit 1
}
