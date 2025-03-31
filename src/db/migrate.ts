// 数据库迁移脚本
import dotenv from 'dotenv';
import pg from 'pg';

// 加载环境变量
dotenv.config({ path: '.env.local' });

// 检查环境变量
const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;
if (!connectionString) {
  throw new Error('数据库连接URL未定义。请设置DATABASE_URL或POSTGRES_URL环境变量。');
}

// 创建PG客户端
const client = new pg.Client({ connectionString });

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
    
    console.log('数据库迁移完成!');
  } catch (error) {
    console.error('数据库迁移失败:', error);
  } finally {
    // 关闭连接
    await client.end();
  }
}

// 导出迁移函数
export { migrate }; 