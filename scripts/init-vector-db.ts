/**
 * Script to initialize Upstash Vector database with digital twin data
 * Run this once before starting the application: npm run setup-vector-db
 */

import { initializeVectorDB } from '../lib/vectordb.js';

async function main() {
  console.log('🚀 Starting vector database initialization...');
  
  try {
    await initializeVectorDB();
    console.log('✅ Vector database initialized successfully!');
    console.log('You can now run: npm run dev');
  } catch (error) {
    console.error('❌ Error initializing vector database:', error);
    process.exit(1);
  }
}

main();
