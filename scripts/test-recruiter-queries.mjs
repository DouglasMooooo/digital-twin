/**
 * 招聘人员查询测试套件 - 20+ 场景测试
 * 测试目标：验证 RAG 系统在真实招聘场景下的表现
 * 成功标准：≥85% 满意度，响应时间 <2s (p95)
 */

import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const API_URL = 'https://douglasmo.vercel.app/api/chat';

// 20 个招聘人员场景查询（涵盖 7 大类）
const recruiterQueries = [
  // 1. 技术技能评估 (Technical Skills)
  {
    category: '技术技能评估',
    query: 'Douglas 有哪些编程语言经验？请列出他的熟练程度。',
    expectedKeywords: ['Python', 'JavaScript', 'TypeScript', 'React', 'Node.js'],
  },
  {
    category: '技术技能评估',
    query: 'Douglas 在 AI/机器学习方面有什么实际经验？',
    expectedKeywords: ['RAG', 'LLM', 'embedding', 'vector', 'OpenAI', 'Groq'],
  },
  {
    category: '技术技能评估',
    query: 'Douglas 使用过哪些数据库和云服务？',
    expectedKeywords: ['Upstash', 'Redis', 'Vercel', 'Vector Database'],
  },

  // 2. 领导力和协作 (Leadership & Collaboration)
  {
    category: '领导力和协作',
    query: '给我一个 Douglas 展示领导力的例子。',
    expectedKeywords: ['团队', '领导', '协调', '指导', 'STAR'],
  },
  {
    category: '领导力和协作',
    query: 'Douglas 如何与跨职能团队合作？',
    expectedKeywords: ['沟通', '协作', '团队', '跨部门'],
  },
  {
    category: '领导力和协作',
    query: 'Douglas 有没有指导或培训其他团队成员的经验？',
    expectedKeywords: ['指导', '培训', 'mentor', '分享'],
  },

  // 3. 问题解决能力 (Problem Solving)
  {
    category: '问题解决能力',
    query: '描述 Douglas 解决过的一个技术难题。',
    expectedKeywords: ['挑战', '解决方案', '优化', '改进'],
  },
  {
    category: '问题解决能力',
    query: 'Douglas 如何处理项目中的性能瓶颈？',
    expectedKeywords: ['性能', '优化', '延迟', '缓存', '基准'],
  },
  {
    category: '问题解决能力',
    query: 'Douglas 遇到过哪些复杂的系统架构挑战？',
    expectedKeywords: ['架构', '设计', '扩展', '集成'],
  },

  // 4. 职业发展 (Career Development)
  {
    category: '职业发展',
    query: 'Douglas 的职业目标是什么？',
    expectedKeywords: ['目标', '发展', '学习', '成长'],
  },
  {
    category: '职业发展',
    query: 'Douglas 目前在学习什么新技术？',
    expectedKeywords: ['学习', 'AI', 'MCP', 'RAG', 'LLM'],
  },
  {
    category: '职业发展',
    query: 'Douglas 的工作经历是如何发展的？',
    expectedKeywords: ['经验', '职位', '公司', '成长'],
  },

  // 5. 行业知识 (Domain Knowledge)
  {
    category: '行业知识',
    query: 'Douglas 对 AI Agent 和 RAG 系统的理解如何？',
    expectedKeywords: ['RAG', 'Agent', 'AI', '检索', 'embedding'],
  },
  {
    category: '行业知识',
    query: 'Douglas 在全栈开发方面有什么经验？',
    expectedKeywords: ['前端', '后端', 'React', 'Node.js', 'API'],
  },
  {
    category: '行业知识',
    query: 'Douglas 对现代 DevOps 和 CI/CD 了解多少？',
    expectedKeywords: ['部署', 'Vercel', 'GitHub', 'CI/CD', 'automation'],
  },

  // 6. 文化契合度 (Cultural Fit)
  {
    category: '文化契合度',
    query: 'Douglas 的工作方式和价值观是什么？',
    expectedKeywords: ['专业', '质量', '用户', '协作', '创新'],
  },
  {
    category: '文化契合度',
    query: 'Douglas 如何平衡技术深度和业务价值？',
    expectedKeywords: ['业务', '影响', '用户', '价值', '技术'],
  },
  {
    category: '文化契合度',
    query: 'Douglas 对远程工作和团队协作的看法？',
    expectedKeywords: ['远程', '沟通', '协作', '工具'],
  },

  // 7. 成就量化 (Quantified Achievements)
  {
    category: '成就量化',
    query: 'Douglas 在项目中取得了哪些可衡量的成果？',
    expectedKeywords: ['提升', '优化', '减少', '增加', '%', '数据'],
  },
  {
    category: '成就量化',
    query: 'Douglas 的数字孪生项目有什么具体的技术指标？',
    expectedKeywords: ['RAG', '向量', '响应', '准确', '性能'],
  },
  {
    category: '成就量化',
    query: 'Douglas 如何衡量和展示他的工作影响力？',
    expectedKeywords: ['指标', '结果', '影响', '改进', '成果'],
  },
];

/**
 * 调用 API 并测试查询
 */
async function testQuery(query, expectedKeywords, category) {
  const startTime = Date.now();
  
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: query }),
    });

    const duration = Date.now() - startTime;
    const data = await response.json();
    const answer = data.response || '';

    // 计算关键词命中率
    const keywordsFound = expectedKeywords.filter(keyword => 
      answer.toLowerCase().includes(keyword.toLowerCase())
    );
    const relevanceScore = (keywordsFound.length / expectedKeywords.length) * 100;

    // 评估响应质量（简化版）
    const hasContent = answer.length > 50;
    const hasSpecifics = /\d+/.test(answer) || answer.includes('例如') || answer.includes('具体');
    const professionalTone = !answer.includes('我不知道') && !answer.includes('无法回答');

    const qualityScore = [
      relevanceScore > 50 ? 25 : 0,  // 相关性
      hasContent ? 25 : 0,             // 内容完整性
      hasSpecifics ? 25 : 0,           // 具体性
      professionalTone ? 25 : 0,       // 专业性
    ].reduce((a, b) => a + b, 0);

    return {
      category,
      query,
      answer: answer.substring(0, 300) + (answer.length > 300 ? '...' : ''),
      fullAnswerLength: answer.length,
      duration,
      relevanceScore: Math.round(relevanceScore),
      qualityScore,
      keywordsFound,
      keywordsMissing: expectedKeywords.filter(k => !keywordsFound.includes(k)),
      passed: qualityScore >= 70 && duration < 2000, // 70分及格，<2秒
    };
  } catch (error) {
    return {
      category,
      query,
      answer: `ERROR: ${error.message}`,
      duration: Date.now() - startTime,
      relevanceScore: 0,
      qualityScore: 0,
      passed: false,
      error: error.message,
    };
  }
}

/**
 * 运行所有测试
 */
async function runAllTests() {
  console.log('🚀 开始招聘人员查询测试套件...\n');
  console.log(`📊 测试查询数量: ${recruiterQueries.length}`);
  console.log(`🎯 成功标准: 质量评分 ≥70/100, 响应时间 <2秒\n`);

  const results = [];
  let passCount = 0;
  const durations = [];

  for (let i = 0; i < recruiterQueries.length; i++) {
    const { category, query, expectedKeywords } = recruiterQueries[i];
    
    console.log(`\n[${i + 1}/${recruiterQueries.length}] 测试: ${category}`);
    console.log(`   查询: ${query}`);
    
    const result = await testQuery(query, expectedKeywords, category);
    results.push(result);
    durations.push(result.duration);

    console.log(`   响应时间: ${result.duration}ms`);
    console.log(`   质量评分: ${result.qualityScore}/100`);
    console.log(`   相关性: ${result.relevanceScore}% (${result.keywordsFound.length}/${expectedKeywords.length} 关键词)`);
    console.log(`   状态: ${result.passed ? '✅ 通过' : '❌ 未通过'}`);

    if (result.passed) passCount++;

    // 延迟避免速率限制
    if (i < recruiterQueries.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }

  // 计算统计数据
  durations.sort((a, b) => a - b);
  const p50 = durations[Math.floor(durations.length * 0.5)];
  const p95 = durations[Math.floor(durations.length * 0.95)];
  const p99 = durations[Math.floor(durations.length * 0.99)];
  const avgDuration = durations.reduce((a, b) => a + b, 0) / durations.length;
  
  const avgQualityScore = results.reduce((sum, r) => sum + r.qualityScore, 0) / results.length;
  const satisfactionRate = (passCount / results.length) * 100;

  // 生成报告
  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      totalQueries: results.length,
      passedQueries: passCount,
      satisfactionRate: `${satisfactionRate.toFixed(1)}%`,
      avgQualityScore: avgQualityScore.toFixed(1),
      targetMet: satisfactionRate >= 85,
    },
    performance: {
      avgDuration: `${avgDuration.toFixed(0)}ms`,
      p50: `${p50}ms`,
      p95: `${p95}ms`,
      p99: `${p99}ms`,
      targetMet: p95 < 2000,
    },
    categoryBreakdown: {},
    detailedResults: results,
  };

  // 按类别统计
  recruiterQueries.forEach((q, i) => {
    if (!report.categoryBreakdown[q.category]) {
      report.categoryBreakdown[q.category] = {
        total: 0,
        passed: 0,
        avgQuality: 0,
      };
    }
    const cat = report.categoryBreakdown[q.category];
    cat.total++;
    if (results[i].passed) cat.passed++;
    cat.avgQuality += results[i].qualityScore;
  });

  Object.keys(report.categoryBreakdown).forEach(cat => {
    const data = report.categoryBreakdown[cat];
    data.avgQuality = (data.avgQuality / data.total).toFixed(1);
    data.passRate = `${((data.passed / data.total) * 100).toFixed(1)}%`;
  });

  // 保存报告
  const reportPath = join(__dirname, '../TEST_RESULTS.json');
  writeFileSync(reportPath, JSON.stringify(report, null, 2));

  // 打印总结
  console.log('\n\n' + '='.repeat(60));
  console.log('📊 测试总结报告');
  console.log('='.repeat(60));
  console.log(`\n✅ 通过查询: ${passCount}/${results.length} (${satisfactionRate.toFixed(1)}%)`);
  console.log(`📈 平均质量评分: ${avgQualityScore.toFixed(1)}/100`);
  console.log(`⏱️  性能指标:`);
  console.log(`   - 平均响应时间: ${avgDuration.toFixed(0)}ms`);
  console.log(`   - P50: ${p50}ms`);
  console.log(`   - P95: ${p95}ms`);
  console.log(`   - P99: ${p99}ms`);
  
  console.log(`\n🎯 目标达成情况:`);
  console.log(`   - 满意度 ≥85%: ${report.summary.targetMet ? '✅ 达成' : '❌ 未达成'} (实际: ${satisfactionRate.toFixed(1)}%)`);
  console.log(`   - P95 <2秒: ${report.performance.targetMet ? '✅ 达成' : '❌ 未达成'} (实际: ${p95}ms)`);

  console.log(`\n📂 详细报告已保存至: TEST_RESULTS.json`);
  console.log('='.repeat(60) + '\n');

  return report;
}

// 执行测试
runAllTests().catch(console.error);
