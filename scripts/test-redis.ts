/**
 * Test Upstash Redis Connection
 * Run: npx tsx scripts/test-redis.ts
 */

import { Redis } from '@upstash/redis';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables
dotenv.config({ path: path.join(process.cwd(), '.env.local') });

async function testRedis() {
  console.log('🔍 Testing Upstash Redis connection...\n');

  try {
    const redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    });

    console.log('📊 Redis Config:');
    console.log('  URL:', process.env.UPSTASH_REDIS_REST_URL);
    console.log('  Token:', process.env.UPSTASH_REDIS_REST_TOKEN?.substring(0, 20) + '...');
    console.log('');

    // Test 1: Ping
    console.log('1️⃣ Testing PING...');
    const pong = await redis.ping();
    console.log('   ✅ PING response:', pong);
    console.log('');

    // Test 2: Set a test value
    console.log('2️⃣ Testing SET...');
    await redis.set('test_key', 'Hello from Digital Twin!');
    console.log('   ✅ Set test_key');
    console.log('');

    // Test 3: Get the value back
    console.log('3️⃣ Testing GET...');
    const value = await redis.get('test_key');
    console.log('   ✅ Got value:', value);
    console.log('');

    // Test 4: Test list operations (for chat logs)
    console.log('4️⃣ Testing LPUSH (chat logs)...');
    const testLog = JSON.stringify({
      id: 'test-123',
      timestamp: new Date().toISOString(),
      userMessage: 'Test question',
      aiResponse: 'Test answer',
      responseTime: 1500,
      interviewType: 'technical',
      contextChunks: 3,
      success: true,
    });
    await redis.lpush('digital_twin:chat_logs', testLog);
    console.log('   ✅ Pushed test log');
    console.log('');

    // Test 5: Get list length
    console.log('5️⃣ Testing LLEN...');
    const length = await redis.llen('digital_twin:chat_logs');
    console.log('   ✅ Current chat logs count:', length);
    console.log('');

    // Test 6: Get recent logs
    console.log('6️⃣ Testing LRANGE...');
    const logs = await redis.lrange('digital_twin:chat_logs', 0, 4);
    console.log('   ✅ Retrieved', logs.length, 'logs');
    console.log('');

    // Cleanup
    console.log('🧹 Cleaning up test data...');
    await redis.del('test_key');
    console.log('   ✅ Deleted test_key');
    console.log('');

    console.log('🎉 All tests passed! Redis is working correctly!\n');
    console.log('✅ Your analytics dashboard should now work in production!');
    console.log('');
    console.log('📋 Next steps:');
    console.log('   1. Visit https://douglasmo.vercel.app');
    console.log('   2. Use the AI chat to ask some questions');
    console.log('   3. Go to https://douglasmo.vercel.app/admin/dashboard');
    console.log('   4. Password: admin123');
    console.log('   5. You should see real analytics data! 📊');

  } catch (error) {
    console.error('❌ Redis connection failed!');
    console.error('Error:', error);
    console.error('');
    console.error('🔧 Troubleshooting:');
    console.error('   1. Check your .env.local file has the correct credentials');
    console.error('   2. Verify the database is active in Upstash Console');
    console.error('   3. Make sure the URL and Token are correct (no extra quotes)');
    process.exit(1);
  }
}

testRedis();
