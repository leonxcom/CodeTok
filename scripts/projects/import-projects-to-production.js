// 将本地开发环境的项目导入到生产环境数据库
require('dotenv').config({ path: '.env.local' });
const { sql } = require('@vercel/postgres');
const fs = require('fs');
const readline = require('readline');

// 获取特定URL的项目列表
const targetURLs = [
  'https://firstpersonflappy.com/',
  'https://visualorigins.digitaldigging.org/',
  'https://fang-die-fliege-z23hmxbz1f9iur.needle.run/',
  'https://collidingscopes.github.io/red-panda-vibes/',
  'https://findasks.com/',
  'https://secretnamegame.com/',
  'https://summedup.ai/'
];

// 读取环境变量
async function setupEnvironment() {
  console.log('设置环境...');
  
  // 检查是否有生产环境变量
  if (!process.env.POSTGRES_URL_PRODUCTION && !process.env.PRODUCTION_DATABASE_URL) {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    return new Promise((resolve) => {
      rl.question('请输入生产环境数据库连接URL: ', (answer) => {
        process.env.POSTGRES_URL_PRODUCTION = answer.trim();
        console.log('已设置生产环境数据库连接URL');
        rl.close();
        resolve();
      });
    });
  }
}

// 获取本地数据库中的项目
async function getLocalProjects() {
  console.log('从本地数据库获取项目...');
  
  try {
    // 从本地数据库查询特定URL的项目
    const result = await sql`
      SELECT id, title, description, files, main_file, external_url, external_embed, external_author, type
      FROM projects
      WHERE external_url IN ${sql(targetURLs)}
    `;
    
    console.log(`从本地数据库获取了 ${result.rowCount} 个项目`);
    return result.rows;
  } catch (error) {
    console.error('从本地数据库获取项目失败:', error);
    return [];
  }
}

// 将项目导入到生产环境
async function importToProduction(projects) {
  console.log('准备导入项目到生产环境...');
  
  // 保存当前数据库URL
  const originalDatabaseUrl = process.env.POSTGRES_URL || process.env.DATABASE_URL;
  
  try {
    // 切换到生产环境数据库
    process.env.POSTGRES_URL = process.env.POSTGRES_URL_PRODUCTION || process.env.PRODUCTION_DATABASE_URL;
    console.log('已切换到生产环境数据库');
    
    const importedProjects = [];
    
    for (const project of projects) {
      try {
        // 检查生产环境是否已存在该项目
        const existingCheck = await sql`
          SELECT id FROM projects WHERE external_url = ${project.external_url}
        `;
        
        if (existingCheck.rowCount > 0) {
          console.log(`项目 "${project.title}" 已在生产环境中存在，跳过导入`);
          continue;
        }
        
        // 获取当前时间
        const currentDate = new Date().toISOString();
        
        // 导入项目到生产环境
        await sql`
          INSERT INTO projects (
            id, title, description, files, main_file, is_public, 
            views, likes, external_url, external_embed, external_author, type,
            created_at, updated_at
          ) VALUES (
            ${project.id}, 
            ${project.title}, 
            ${project.description}, 
            ${project.files}, 
            ${project.main_file}, 
            ${true}, 
            ${0}, 
            ${0}, 
            ${project.external_url}, 
            ${project.external_embed}, 
            ${project.external_author}, 
            ${project.type || 'external'},
            ${currentDate}, 
            ${currentDate}
          )
        `;
        
        console.log(`成功导入项目 "${project.title}" 到生产环境`);
        importedProjects.push(project.title);
      } catch (error) {
        console.error(`导入项目 "${project.title}" 到生产环境失败:`, error);
      }
    }
    
    console.log(`\n导入完成！成功导入 ${importedProjects.length} 个项目到生产环境`);
    console.log('导入的项目:', importedProjects);
  } catch (error) {
    console.error('导入到生产环境过程中出错:', error);
  } finally {
    // 恢复原始数据库URL
    process.env.POSTGRES_URL = originalDatabaseUrl;
    console.log('已恢复到本地开发环境数据库');
  }
}

// 执行导入流程
async function importProjects() {
  try {
    await setupEnvironment();
    const projects = await getLocalProjects();
    
    if (projects.length === 0) {
      console.log('没有找到需要导入的项目，请先在本地环境添加项目');
      return;
    }
    
    await importToProduction(projects);
  } catch (error) {
    console.error('导入过程发生错误:', error);
  }
}

importProjects(); 