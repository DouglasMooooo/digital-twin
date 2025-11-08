const { execSync } = require('child_process');
const path = require('path');

try {
  process.chdir('d:\\上课\\Ai agent\\digital twin');
  
  console.log('📝 Adding files...');
  execSync('git add .', { stdio: 'inherit' });
  
  console.log('💾 Committing...');
  execSync('git commit -m "ci: Exclude all Markdown files from ESLint scanning - fixes CI/CD lint failures"', { stdio: 'inherit' });
  
  console.log('🚀 Pushing to GitHub...');
  execSync('git push origin main', { stdio: 'inherit' });
  
  console.log('✅ All done!');
} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}
