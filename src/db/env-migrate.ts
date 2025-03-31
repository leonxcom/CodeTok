import { Client } from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

// 加载正确的环境变量
function loadEnv() {
  const environment = process.env.NODE_ENV || 'development';
  console.log(`当前环境: ${environment}`);
  
  if (environment === 'production') {
    // 生产环境 - 使用 .env.production 或环境变量
    dotenv.config({ path: path.resolve(process.cwd(), '.env.production') });
    console.log('已加载生产环境配置');
  } else {
    // 开发环境 - 使用 .env.local
    dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
    console.log('已加载开发环境配置');
  }
}

// 检查环境变量
function getConnectionString() {
  // 加载环境变量
  loadEnv();
  
  const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  if (!connectionString) {
    throw new Error('数据库连接URL未定义。请设置DATABASE_URL或POSTGRES_URL环境变量。');
  }
  
  return connectionString;
}

// 创建表的SQL语句
const createProjectsTable = `
CREATE TABLE IF NOT EXISTS projects (
  id VARCHAR(255) PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  files JSONB NOT NULL,
  main_file TEXT NOT NULL,
  is_public BOOLEAN DEFAULT true,
  views INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  external_url TEXT,
  external_embed BOOLEAN DEFAULT false,
  external_author TEXT,
  type TEXT
);
`;

// 执行迁移
async function migrate() {
  try {
    const connectionString = getConnectionString();
    console.log('使用连接字符串:', connectionString.replace(/postgresql:\/\/[^:]+:[^@]+@/, 'postgresql://user:****@'));
    
    // 创建PG客户端
    const client = new Client({ connectionString });
    
    console.log('连接到数据库...');
    await client.connect();
    
    console.log('开始数据库迁移...');
    
    // 删除外键约束（如果存在）
    console.log('删除外键约束...');
    await client.query(`
      DO $$ 
      DECLARE
        r RECORD;
      BEGIN
        FOR r IN (SELECT tc.table_schema, tc.table_name, kcu.column_name, ccu.table_name AS foreign_table_name
                 FROM information_schema.table_constraints tc
                 JOIN information_schema.key_column_usage kcu ON tc.constraint_name = kcu.constraint_name
                 JOIN information_schema.constraint_column_usage ccu ON ccu.constraint_name = tc.constraint_name
                 WHERE tc.constraint_type = 'FOREIGN KEY')
        LOOP
          BEGIN
            EXECUTE format('ALTER TABLE %I.%I DROP CONSTRAINT %I', r.table_schema, r.table_name, r.table_name || '_' || r.column_name || '_fkey');
            RAISE NOTICE 'Dropped foreign key constraint: %', r.table_name || '_' || r.column_name || '_fkey';
          EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to drop constraint: %', SQLERRM;
          END;
        END LOOP;
      END $$;
    `);
    
    // 删除依赖表
    console.log('删除依赖表...');
    await client.query('DROP TABLE IF EXISTS favorites;');
    await client.query('DROP TABLE IF EXISTS users;');
    
    // 删除旧表
    console.log('删除旧表...');
    await client.query('DROP TABLE IF EXISTS projects;');
    
    // 创建项目表
    console.log('创建 projects 表...');
    await client.query(createProjectsTable);
    
    // 验证迁移
    console.log('验证迁移...');
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    
    console.log('数据库中的表:', tablesResult.rows.map(row => row.table_name));
    
    const projectsResult = await client.query('SELECT COUNT(*) FROM projects');
    console.log('项目数量:', projectsResult.rows[0].count);
    
    console.log('数据库迁移完成!');
  } catch (error) {
    console.error('数据库迁移失败:', error);
    process.exit(1);
  }
}

// 执行迁移
migrate()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  }); 