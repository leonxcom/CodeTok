// 删除包含特定URL的项目
require('dotenv').config({ path: '.env.local' });
const { sql } = require('@vercel/postgres');
const fs = require('fs');

// 确保数据库连接
function ensureDatabaseConnection() {
  // 从.env.local读取连接字符串
  if (!process.env.POSTGRES_URL && !process.env.DATABASE_URL) {
    try {
      const envContent = fs.readFileSync('.env.local', 'utf8');
      const pgUrlMatch = envContent.match(/POSTGRES_URL=(.+)/);
      const dbUrlMatch = envContent.match(/DATABASE_URL=(.+)/);
      
      if (pgUrlMatch && pgUrlMatch[1]) {
        process.env.POSTGRES_URL = pgUrlMatch[1].trim();
        console.log('手动设置了POSTGRES_URL环境变量');
      } else if (dbUrlMatch && dbUrlMatch[1]) {
        process.env.POSTGRES_URL = dbUrlMatch[1].trim();
        console.log('使用DATABASE_URL作为POSTGRES_URL');
      }
    } catch (error) {
      console.error('读取环境变量文件失败:', error);
    }
  }
}

async function deleteExternalUrlProjects() {
  console.log('准备删除包含特定URL的项目...');
  ensureDatabaseConnection();
  
  // 要删除的URL模式
  const targetUrl = 'https://fps-sample-project.netlify.app/';
  
  try {
    // 查找包含指定URL的项目
    console.log(`\n查找包含URL "${targetUrl}"的项目...`);
    
    // 使用JSON查询查找files数组中包含特定URL的项目
    const projectsToDelete = await sql`
      SELECT id, title, files
      FROM projects 
      WHERE files::text LIKE ${`%${targetUrl}%`}
    `;
    
    if (projectsToDelete.rowCount === 0) {
      console.log(`未找到包含URL "${targetUrl}"的项目`);
      return;
    }
    
    console.log(`找到 ${projectsToDelete.rowCount} 个包含URL "${targetUrl}"的项目:`);
    const projectIds = [];
    
    projectsToDelete.rows.forEach((project, index) => {
      console.log(`\n[${index + 1}] 项目ID: ${project.id}`);
      console.log(`   标题: ${project.title || '无标题'}`);
      
      // 记录要删除的项目ID
      projectIds.push(project.id);
    });
    
    // 确认删除
    console.log(`\n确认要删除这 ${projectIds.length} 个项目吗?`);
    console.log('项目IDs:', projectIds.join(', '));
    
    // 在生产环境中，您可能需要某种确认机制
    // 这里为了演示，直接删除
    
    // 删除项目
    for (const id of projectIds) {
      await sql`DELETE FROM projects WHERE id = ${id}`;
      console.log(`已删除项目ID: ${id}`);
    }
    
    console.log(`\n成功删除了 ${projectIds.length} 个包含URL "${targetUrl}"的项目`);
    
    // 验证删除结果
    const remainingProjects = await sql`
      SELECT COUNT(*) FROM projects 
      WHERE files::text LIKE ${`%${targetUrl}%`}
    `;
    
    console.log(`剩余包含URL "${targetUrl}"的项目数量: ${remainingProjects.rows[0].count}`);
    
  } catch (error) {
    console.error('操作失败:', error);
  }
}

deleteExternalUrlProjects(); 