// 检查生产环境和预发布环境数据库中的项目差异
require('dotenv').config({ path: '.env.local' });
const { sql } = require('@vercel/postgres');
const readline = require('readline');

// 设置环境变量
async function setupEnvironment() {
  console.log('设置环境变量...');
  
  // 检查是否有生产环境和预发布环境的数据库连接URL
  if (!process.env.POSTGRES_URL_PRODUCTION && !process.env.POSTGRES_URL_PREVIEW) {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    // 获取生产环境数据库URL
    const getProductionUrl = () => {
      return new Promise((resolve) => {
        rl.question('请输入生产环境(main)数据库连接URL: ', (answer) => {
          process.env.POSTGRES_URL_PRODUCTION = answer.trim();
          console.log('已设置生产环境数据库连接URL');
          resolve();
        });
      });
    };
    
    // 获取预发布环境数据库URL
    const getPreviewUrl = () => {
      return new Promise((resolve) => {
        rl.question('请输入预发布环境(preview)数据库连接URL: ', (answer) => {
          process.env.POSTGRES_URL_PREVIEW = answer.trim();
          console.log('已设置预发布环境数据库连接URL');
          rl.close();
          resolve();
        });
      });
    };

    await getProductionUrl();
    await getPreviewUrl();
  }
}

// 获取数据库中的所有项目
async function getProjects(databaseUrl, environmentName) {
  // 保存原始数据库URL
  const originalDatabaseUrl = process.env.POSTGRES_URL || process.env.DATABASE_URL;
  
  try {
    // 切换到指定数据库
    process.env.POSTGRES_URL = databaseUrl;
    
    // 获取项目总数
    const countResult = await sql`SELECT COUNT(*) FROM projects`;
    console.log(`${environmentName}中共有 ${countResult.rows[0].count} 个项目`);
    
    // 获取所有项目
    const result = await sql`
      SELECT id, title, external_url, type, created_at
      FROM projects
      ORDER BY created_at DESC
    `;
    
    console.log(`成功获取${environmentName}中的 ${result.rowCount} 个项目`);
    return result.rows;
  } catch (error) {
    console.error(`获取${environmentName}中的项目失败:`, error);
    return [];
  } finally {
    // 恢复原始数据库URL
    process.env.POSTGRES_URL = originalDatabaseUrl;
  }
}

// 比较两个环境的项目
function compareProjects(productionProjects, previewProjects) {
  console.log('\n比较两个环境的项目差异...');
  
  // 创建URL到项目的映射
  const productionUrlMap = new Map();
  const previewUrlMap = new Map();
  
  productionProjects.forEach(project => {
    productionUrlMap.set(project.external_url, project);
  });
  
  previewProjects.forEach(project => {
    previewUrlMap.set(project.external_url, project);
  });
  
  // 找出preview中缺少的项目
  const missingInPreview = [];
  productionProjects.forEach(project => {
    if (!previewUrlMap.has(project.external_url)) {
      missingInPreview.push(project);
    }
  });
  
  // 找出production中缺少的项目
  const missingInProduction = [];
  previewProjects.forEach(project => {
    if (!productionUrlMap.has(project.external_url)) {
      missingInProduction.push(project);
    }
  });
  
  // 打印结果
  console.log('\n预发布环境中缺少的项目 (存在于生产环境但不在预发布环境):');
  if (missingInPreview.length === 0) {
    console.log('  无');
  } else {
    missingInPreview.forEach(project => {
      console.log(`  - ${project.title} (${project.external_url})`);
    });
  }
  
  console.log('\n生产环境中缺少的项目 (存在于预发布环境但不在生产环境):');
  if (missingInProduction.length === 0) {
    console.log('  无');
  } else {
    missingInProduction.forEach(project => {
      console.log(`  - ${project.title} (${project.external_url})`);
    });
  }
  
  // 列出所有项目
  console.log('\n生产环境中的所有项目:');
  productionProjects.forEach(project => {
    console.log(`  - [${project.id}] ${project.title} (${project.external_url})`);
  });
  
  console.log('\n预发布环境中的所有项目:');
  previewProjects.forEach(project => {
    console.log(`  - [${project.id}] ${project.title} (${project.external_url})`);
  });
}

// 执行检查流程
async function checkDatabases() {
  try {
    await setupEnvironment();
    
    const productionProjects = await getProjects(process.env.POSTGRES_URL_PRODUCTION, '生产环境');
    const previewProjects = await getProjects(process.env.POSTGRES_URL_PREVIEW, '预发布环境');
    
    compareProjects(productionProjects, previewProjects);
  } catch (error) {
    console.error('检查过程发生错误:', error);
  }
}

checkDatabases(); 