// 数据库迁移修复脚本
const { Client } = require('pg');
require('dotenv').config({ path: '.env.local' });

// 获取数据库连接URL
const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;
if (!connectionString) {
  throw new Error('数据库连接URL未定义。请设置DATABASE_URL或POSTGRES_URL环境变量。');
}

// 创建表的SQL语句
const createProjectsTable = `
CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY,
  title TEXT,
  description TEXT,
  files JSONB,
  main_file TEXT,
  is_public BOOLEAN DEFAULT TRUE,
  views INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  external_url TEXT,
  external_embed BOOLEAN DEFAULT FALSE,
  external_author TEXT,
  type TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
`;

const createUsersTable = `
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
`;

const createFavoritesTable = `
CREATE TABLE IF NOT EXISTS favorites (
  user_id TEXT NOT NULL REFERENCES users(id),
  id TEXT NOT NULL REFERENCES projects(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, id)
);
`;

// 执行迁移
async function migrate() {
  const client = new Client({ connectionString });
  
  try {
    console.log('连接到数据库...');
    await client.connect();
    
    console.log('开始数据库迁移...');
    
    // 创建项目表
    console.log('创建 projects 表...');
    await client.query(createProjectsTable);
    
    // 创建用户表
    console.log('创建 users 表...');
    await client.query(createUsersTable);
    
    // 创建收藏表
    console.log('创建 favorites 表...');
    await client.query(createFavoritesTable);
    
    // 测试项目表是否可写
    console.log('测试项目表...');
    const testProjectId = 'test-' + Date.now();
    await client.query(`
      INSERT INTO projects (id, title, description, files, main_file, is_public)
      VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT (id) DO NOTHING
    `, [
      testProjectId,
      '测试项目',
      '用于测试数据库连接的项目',
      JSON.stringify([{
        url: 'https://example.com/test.html',
        filename: 'test.html',
        pathname: 'test.html',
        size: 10,
        type: 'text/html',
        isEntryPoint: true
      }]),
      'test.html',
      true
    ]);
    
    // 验证插入是否成功
    const result = await client.query('SELECT * FROM projects WHERE id = $1', [testProjectId]);
    if (result.rows.length > 0) {
      console.log('测试项目创建成功:', result.rows[0].id);
      
      // 清理测试数据
      await client.query('DELETE FROM projects WHERE id = $1', [testProjectId]);
      console.log('测试项目已删除');
    } else {
      console.log('测试项目创建失败');
    }
    
    console.log('数据库迁移完成!');
  } catch (error) {
    console.error('数据库迁移失败:', error);
  } finally {
    // 关闭连接
    await client.end();
  }
}

// 执行迁移
migrate(); 