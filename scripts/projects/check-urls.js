// 检查所有脚本中使用的数据库URL
require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const path = require('path');

async function main() {
  console.log('检查环境变量中的数据库URL...');
  
  // 打印所有可能的环境变量
  console.log('\n环境变量:');
  const variables = [
    'DATABASE_URL',
    'POSTGRES_URL',
    'POSTGRES_URL_PREVIEW',
    'POSTGRES_URL_PRODUCTION'
  ];
  
  for (const variable of variables) {
    const value = process.env[variable];
    console.log(`- ${variable}: ${value ? value.substring(0, 50) + '...' : '未设置'}`);
  }
  
  // 分析.env.local文件
  console.log('\n分析.env.local文件:');
  try {
    const envPath = path.join(process.cwd(), '.env.local');
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf8');
      
      // 查找并打印所有数据库URL
      const urlRegex = /^(DATABASE_URL|POSTGRES_URL.*?)=(.+)$/gm;
      let match;
      
      while ((match = urlRegex.exec(content)) !== null) {
        console.log(`- ${match[1]}: ${match[2].substring(0, 50)}...`);
      }
    } else {
      console.log('未找到.env.local文件');
    }
  } catch (error) {
    console.error('读取.env.local文件失败:', error);
  }
  
  // 分析脚本文件
  console.log('\n分析脚本文件中的数据库URL:');
  const scriptsDir = path.join(process.cwd(), 'scripts/projects');
  
  try {
    const files = fs.readdirSync(scriptsDir);
    
    for (const file of files) {
      if (file.endsWith('.js')) {
        const filePath = path.join(scriptsDir, file);
        const content = fs.readFileSync(filePath, 'utf8');
        
        console.log(`\n${file}:`);
        
        // 提取URL设置代码
        let processEnvSetUrl = content.match(/process\.env\.POSTGRES_URL\s*=\s*process\.env\.POSTGRES_URL_PRODUCTION/);
        if (processEnvSetUrl) {
          console.log('- 设置POSTGRES_URL为POSTGRES_URL_PRODUCTION');
        }
        
        processEnvSetUrl = content.match(/process\.env\.POSTGRES_URL\s*=\s*process\.env\.POSTGRES_URL_PREVIEW/);
        if (processEnvSetUrl) {
          console.log('- 设置POSTGRES_URL为POSTGRES_URL_PREVIEW');
        }
        
        // 查找硬编码的URL
        const urlRegex = /(postgresql|postgres):\/\/[^\s'"]+/g;
        const urls = content.match(urlRegex);
        
        if (urls && urls.length > 0) {
          console.log('- 硬编码的URL:');
          urls.forEach((url, i) => {
            console.log(`  ${i+1}. ${url.substring(0, 50)}...`);
          });
        } else {
          console.log('- 没有找到硬编码的URL');
        }
      }
    }
  } catch (error) {
    console.error('分析脚本文件失败:', error);
  }
}

main(); 