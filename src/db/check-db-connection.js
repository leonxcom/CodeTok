// 测试数据库连接和项目查询
require('dotenv').config();
const { Pool } = require('pg');
const { sql } = require('@vercel/postgres');

async function checkDatabaseConnection() {
  console.log('检查数据库连接和环境变量...');
  
  // 打印环境变量(不打印敏感信息)
  console.log('POSTGRES_URL 是否设置:', !!process.env.POSTGRES_URL);
  console.log('DATABASE_URL 是否设置:', !!process.env.DATABASE_URL);
  console.log('VERCEL_POSTGRES_URL 是否设置:', !!process.env.VERCEL_POSTGRES_URL);
  
  // 手动设置连接字符串，避免环境变量中的换行问题
  const manualConnectionString = "postgresql://neondb_owner:npg_K3Ayuov7JeFn@ep-sparkling-darkness-a1t0bvr2-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require";
  
  try {
    // 使用pg模块直接连接
    console.log('\n测试1: 直接使用pg模块连接...');
    const pool = new Pool({
      connectionString: manualConnectionString,
    });
    
    const client = await pool.connect();
    const pgResult = await client.query('SELECT 1 as test');
    console.log('直接连接成功:', pgResult.rows);
    client.release();
    
    // 查询项目表是否存在
    console.log('\n测试2: 查询项目表...');
    const tablesResult = await pool.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      AND table_name = 'projects'
    `);
    
    console.log('项目表查询结果:');
    console.log('行数:', tablesResult.rowCount);
    
    if (tablesResult.rowCount > 0) {
      // 如果项目表存在，查询项目数量
      console.log('\n测试3: 查询项目数量...');
      const projectCountResult = await pool.query(`
        SELECT COUNT(*) as count FROM projects
      `);
      console.log('项目数量:', projectCountResult.rows[0].count);
      
      // 查询随机项目
      console.log('\n测试4: 查询随机项目...');
      const randomProjectResult = await pool.query(`
        SELECT id, title, created_at
        FROM projects
        ORDER BY RANDOM()
        LIMIT 1
      `);
      
      console.log('随机项目查询结果:');
      console.log('行数:', randomProjectResult.rowCount);
      if (randomProjectResult.rowCount > 0) {
        console.log('随机项目:', randomProjectResult.rows[0]);
      }
      
      // 查询公开项目
      console.log('\n测试5: 查询公开项目...');
      const publicProjectsResult = await pool.query(`
        SELECT id, title, created_at
        FROM projects
        WHERE is_public = true
        ORDER BY RANDOM()
        LIMIT 1
      `);
      
      console.log('公开项目查询结果:');
      console.log('行数:', publicProjectsResult.rowCount);
      if (publicProjectsResult.rowCount > 0) {
        console.log('公开项目:', publicProjectsResult.rows[0]);
      }
    }
    
    await pool.end();
  } catch (error) {
    console.error('数据库查询出错:', error);
  }
}

checkDatabaseConnection(); 