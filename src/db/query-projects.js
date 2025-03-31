// 查询项目表中的所有数据
const { Client } = require('pg');
require('dotenv').config({ path: '.env.local' });

// 获取数据库连接URL
const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;
if (!connectionString) {
  throw new Error('数据库连接URL未定义。请设置DATABASE_URL或POSTGRES_URL环境变量。');
}

async function queryProjects() {
  const client = new Client({ connectionString });
  
  try {
    console.log('连接到数据库...');
    await client.connect();
    
    // 检查表是否存在
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    
    console.log('数据库中的表:', tablesResult.rows.map(row => row.table_name));
    
    // 查询项目表中的所有数据
    console.log('查询 projects 表...');
    const projectsResult = await client.query('SELECT * FROM projects');
    
    console.log('项目数量:', projectsResult.rowCount);
    console.log('项目数据:', JSON.stringify(projectsResult.rows, null, 2));
    
    return projectsResult.rows;
  } catch (error) {
    console.error('查询失败:', error);
  } finally {
    // 关闭连接
    await client.end();
  }
}

// 执行查询
queryProjects(); 