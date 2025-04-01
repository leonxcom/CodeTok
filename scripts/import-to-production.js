const fs = require('fs');
const path = require('path');
const https = require('https');

// 读取项目数据
const projectsData = JSON.parse(fs.readFileSync(path.join(__dirname, '../projects_to_import.json'), 'utf8'));

// 生产环境的 API 端点
const PRODUCTION_API = 'https://vilivili.vercel.app/api/projects/external';

// 清空现有项目（可选）
// 注意：如果要清空现有项目，需要实现相应的 API

// 导入项目
async function importProjects() {
  console.log(`开始导入 ${projectsData.length} 个项目到生产环境...`);
  
  for (const project of projectsData) {
    try {
      console.log(`导入项目: ${project.title}...`);
      
      // 准备请求数据
      const data = JSON.stringify({
        url: project.url,
        title: project.title,
        description: project.description,
        author: project.author
      });
      
      // 创建 HTTPS 请求选项
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': data.length
        }
      };
      
      // 发送请求
      await new Promise((resolve, reject) => {
        const req = https.request(PRODUCTION_API, options, (res) => {
          let responseData = '';
          
          res.on('data', (chunk) => {
            responseData += chunk;
          });
          
          res.on('end', () => {
            console.log(`项目 ${project.title} 导入结果: ${res.statusCode}`);
            if (res.statusCode >= 200 && res.statusCode < 300) {
              console.log('成功!');
            } else {
              console.error('错误:', responseData);
            }
            resolve();
          });
        });
        
        req.on('error', (error) => {
          console.error(`导入失败: ${error.message}`);
          reject(error);
        });
        
        req.write(data);
        req.end();
      });
      
      // 添加间隔以避免请求过快
      await new Promise(resolve => setTimeout(resolve, 1000));
      
    } catch (error) {
      console.error(`导入 ${project.title} 失败:`, error.message);
    }
  }
  
  console.log('所有项目导入完成!');
}

// 执行导入
importProjects().catch(console.error); 