# RAG Quality Testing Script
# Tests the enhanced RAG system with multilingual queries

Write-Host "🧪 RAG 质量测试开始..." -ForegroundColor Cyan
Write-Host ""

# Test queries covering different scenarios
$testQueries = @(
    @{
        Name = "中文查询 - 中山恒润税务"
        Query = "中山恒润会计师事务所处理了多少税务申报？"
        ExpectedKeywords = @("1000", "tax", "中山")
    },
    @{
        Name = "英文查询 - BF Suma Churn"
        Query = "What was the customer churn reduction at BF Suma?"
        ExpectedKeywords = @("22%", "16%", "600")
    },
    @{
        Name = "项目查询 - Digital Twin"
        Query = "Tell me about the Digital Twin project"
        ExpectedKeywords = @("Upstash", "Vector", "RAG", "95%")
    },
    @{
        Name = "技能查询 - Python"
        Query = "What Python frameworks and experience do you have?"
        ExpectedKeywords = @("Python", "Django", "FastAPI", "years")
    },
    @{
        Name = "领导力查询"
        Query = "Give me examples of your leadership experience"
        ExpectedKeywords = @("leadership", "team", "mentor")
    }
)

$passedTests = 0
$totalTests = $testQueries.Count

foreach ($test in $testQueries) {
    Write-Host "📝 Testing: $($test.Name)" -ForegroundColor Yellow
    Write-Host "   Query: $($test.Query)" -ForegroundColor Gray
    
    try {
        $body = @{
            message = $test.Query
            conversationHistory = @()
            interviewType = "technical"
        } | ConvertTo-Json
        
        $response = Invoke-RestMethod -Uri "http://localhost:3000/api/chat" `
            -Method POST `
            -Body $body `
            -ContentType "application/json" `
            -ErrorAction Stop
        
        $answer = $response.response
        
        # Check if answer contains expected keywords
        $foundKeywords = @()
        $missingKeywords = @()
        
        foreach ($keyword in $test.ExpectedKeywords) {
            if ($answer -like "*$keyword*") {
                $foundKeywords += $keyword
            } else {
                $missingKeywords += $keyword
            }
        }
        
        $keywordScore = ($foundKeywords.Count / $test.ExpectedKeywords.Count) * 100
        
        if ($keywordScore -ge 50) {
            Write-Host "   ✅ PASS (Score: $([math]::Round($keywordScore))%)" -ForegroundColor Green
            $passedTests++
        } else {
            Write-Host "   ❌ FAIL (Score: $([math]::Round($keywordScore))%)" -ForegroundColor Red
        }
        
        if ($foundKeywords.Count -gt 0) {
            Write-Host "   Found keywords: $($foundKeywords -join ', ')" -ForegroundColor Green
        }
        if ($missingKeywords.Count -gt 0) {
            Write-Host "   Missing keywords: $($missingKeywords -join ', ')" -ForegroundColor Red
        }
        
        Write-Host "   Answer preview: $($answer.Substring(0, [Math]::Min(150, $answer.Length)))..." -ForegroundColor Gray
        
    } catch {
        Write-Host "   ❌ ERROR: $($_.Exception.Message)" -ForegroundColor Red
    }
    
    Write-Host ""
}

# Summary
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "📊 测试结果汇总" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "   通过: $passedTests / $totalTests" -ForegroundColor $(if ($passedTests -eq $totalTests) { "Green" } else { "Yellow" })

$accuracy = ($passedTests / $totalTests) * 100
Write-Host "   准确率: $([math]::Round($accuracy))%" -ForegroundColor $(if ($accuracy -ge 80) { "Green" } elseif ($accuracy -ge 60) { "Yellow" } else { "Red" })

if ($accuracy -ge 90) {
    Write-Host "   🎉 优秀！质量达标" -ForegroundColor Green
} elseif ($accuracy -ge 70) {
    Write-Host "   ⚠️ 良好，但仍有改进空间" -ForegroundColor Yellow
} else {
    Write-Host "   ❌ 需要进一步优化" -ForegroundColor Red
}

Write-Host ""
