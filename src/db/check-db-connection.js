// 测试数据库连接和项目查询
require('dotenv').config();
const { sql } = require('@vercel/postgres');

async function checkDatabaseConnection() {
  console.log('检查数据库连接和环境变量...');
  
  // 打印环境变量(不打印敏感信息)
  console.log('POSTGRES_URL 是否设置:', !!process.env.POSTGRES_URL);
  console.log('DATABASE_URL 是否设置:', !!process.env.DATABASE_URL);
  console.log('VERCEL_POSTGRES_URL 是否设置:', !!process.env.VERCEL_POSTGRES_URL);
  
  try {
    // 尝试简单查询测试连接
    console.log('\n测试1: 简单查询测试连接...');
    const testResult = await sql`SELECT 1 as test`;
    console.log('连接成功:', testResult);
    
    // 查询项目表是否存在
    console.log('\n测试2: 查询项目表...');
    const tables = await sql`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      AND table_name = 'projects'
    `;
    
    console.log('项目表查询结果:');
    console.log('行数:', tables.rowCount);
    
    if (tables.rowCount > 0) {
      // 如果项目表存在，查询项目数量
      console.log('\n测试3: 查询项目数量...');
      const projectCount = await sql`
        SELECT COUNT(*) as count FROM projects
      `;
      console.log('项目数量:', projectCount.rows[0].count);
      
      // 查询随机项目
      console.log('\n测试4: 查询随机项目...');
      const randomProject = await sql`
        SELECT id, title, created_at
        FROM projects
        ORDER BY RANDOM()
        LIMIT 1
      `;
      
      console.log('随机项目查询结果:');
      console.log('行数:', randomProject.rowCount);
      if (randomProject.rowCount > 0) {
        console.log('随机项目:', randomProject.rows[0]);
      }
      
      // 查询公开项目
      console.log('\n测试5: 查询公开项目...');
      const publicProjects = await sql`
        SELECT id, title, created_at
        FROM projects
        WHERE is_public = true
        ORDER BY RANDOM()
        LIMIT 1
      `;
      
      console.log('公开项目查询结果:');
      console.log('行数:', publicProjects.rowCount);
      if (publicProjects.rowCount > 0) {
        console.log('公开项目:', publicProjects.rows[0]);
      }
    }
  } catch (error) {
    console.error('数据库查询出错:', error);
  }
}

checkDatabaseConnection(); 