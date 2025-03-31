// 设置新数据库并导入项目数据
const fs = require('fs');
const path = require('path');
const { Client } = require('pg');
require('dotenv').config({ path: '.env.local' });

// 获取数据库连接信息
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error('数据库连接 URL 未定义。请在 .env.local 文件中设置 DATABASE_URL。');
  process.exit(1);
}

// 读取项目数据
const projectsData = JSON.parse(fs.readFileSync(path.join(__dirname, '../projects_to_import.json'), 'utf8'));

// 数据库迁移 - 创建表
async function runMigration() {
  // 创建PG客户端
  const client = new Client({ connectionString });

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
    id TEXT PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    name TEXT,
    created_at TIMESTAMP DEFAULT NOW()
  );
  `;

  const createFavoritesTable = `
  CREATE TABLE IF NOT EXISTS favorites (
    user_id TEXT NOT NULL,
    project_id TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, project_id)
  );
  `;

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
    
    return true;
  } catch (error) {
    console.error('数据库迁移失败:', error);
    return false;
  } finally {
    // 关闭连接
    await client.end();
  }
}

// 导入项目数据
async function importProjects() {
  // 创建一个 PostgreSQL 客户端
  const client = new Client({ connectionString });
  
  try {
    await client.connect();
    console.log('成功连接到数据库!');
    
    // 导入项目
    console.log(`开始导入 ${projectsData.length} 个项目...`);
    
    for (const project of projectsData) {
      // 构建文件数据
      const files = [
        {
          url: project.url,
          filename: 'index.html',
          pathname: 'index.html',
          size: 0,
          type: 'text/html',
          isEntryPoint: true
        }
      ];
      
      // 创建插入语句
      const query = `
        INSERT INTO projects (
          id, title, description, files, main_file, is_public, 
          external_url, external_embed, external_author, type
        ) 
        VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10
        )
        ON CONFLICT (id) DO NOTHING
        RETURNING id;
      `;
      
      // 生成唯一ID
      const id = Math.random().toString(36).substring(2, 10);
      
      // 执行插入
      const result = await client.query(query, [
        id,
        project.title,
        project.description,
        JSON.stringify(files),
        'index.html',
        true, // is_public
        project.url,
        true, // external_embed
        project.author,
        'external'
      ]);
      
      if (result.rows.length > 0) {
        console.log(`- 项目 "${project.title}" 已导入，ID: ${result.rows[0].id}`);
      } else {
        console.log(`- 项目 "${project.title}" 导入失败或已存在`);
      }
    }
    
    console.log('所有项目导入完成!');
    
    // 验证导入
    const countResult = await client.query('SELECT COUNT(*) FROM projects');
    console.log(`数据库中现在有 ${countResult.rows[0].count} 个项目`);
    
  } catch (error) {
    console.error('导入失败:', error);
  } finally {
    await client.end();
  }
}

// 主函数
async function main() {
  try {
    // 运行迁移
    const migrationSuccess = await runMigration();
    
    if (!migrationSuccess) {
      console.error('数据库迁移失败，中止导入过程');
      return;
    }
    
    // 导入项目
    await importProjects();
    
    console.log('数据库设置完成!');
  } catch (error) {
    console.error('设置失败:', error);
  }
}

// 执行主函数
main(); 