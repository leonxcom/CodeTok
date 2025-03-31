// 查询数据库中的项目
require('dotenv').config({ path: '.env.local' });
const { sql } = require('@vercel/postgres');

async function checkProjects() {
  try {
    // 查询项目总数
    const totalResult = await sql`SELECT COUNT(*) as count FROM projects`;
    console.log('项目总数:', totalResult.rows[0].count);
    
    // 查询公开项目数
    const publicResult = await sql`SELECT COUNT(*) as count FROM projects WHERE is_public = true`;
    console.log('公开项目数:', publicResult.rows[0].count);
    
    // 查询最近的5个项目
    const recentProjects = await sql`
      SELECT id, title, type, is_public, created_at 
      FROM projects 
      ORDER BY created_at DESC
      LIMIT 5
    `;
    console.log('最近的5个项目:', JSON.stringify(recentProjects.rows, null, 2));
    
  } catch (error) {
    console.error('查询项目失败:', error);
  }
}

// 执行查询
checkProjects(); 