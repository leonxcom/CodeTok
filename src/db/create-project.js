// 添加新项目到数据库
require('dotenv').config({ path: '.env.local' });
const { sql } = require('@vercel/postgres');
const fs = require('fs');
const crypto = require('crypto');

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

// 生成随机ID（10个字符）
function generateId() {
  return crypto.randomBytes(5).toString('base64')
    .replace(/\+/g, '_')
    .replace(/\//g, '-')
    .substring(0, 10);
}

async function createNewProject() {
  console.log('准备创建新项目...');
  ensureDatabaseConnection();
  
  // 要添加的项目数据
  const targetUrl = 'https://character-sample-project.netlify.app/';
  const projectId = generateId();
  const currentDate = new Date().toISOString();
  
  // 项目文件数据
  const files = [
    {
      url: targetUrl,
      size: 0,
      type: 'text/html',
      filename: 'index.html',
      pathname: 'index.html',
      isEntryPoint: true
    }
  ];
  
  // 项目数据
  const projectData = {
    id: projectId,
    title: 'Character Controller Sample',
    description: 'Interactive character sample project with animations and controls',
    files: JSON.stringify(files),
    mainFile: 'index.html',
    isPublic: true,
    views: 0,
    likes: 0,
    externalUrl: targetUrl,
    externalEmbed: true,  // 设置为true，允许嵌入
    externalAuthor: 'VibeTok Sample',
    createdAt: currentDate,
    updatedAt: currentDate
  };
  
  try {
    // 检查是否已存在相同URL的项目
    console.log(`\n检查是否已存在URL "${targetUrl}"的项目...`);
    
    const existingProjects = await sql`
      SELECT id FROM projects 
      WHERE external_url = ${targetUrl}
    `;
    
    if (existingProjects.rowCount > 0) {
      console.log(`已存在指向URL "${targetUrl}"的项目，ID:`, existingProjects.rows[0].id);
      return;
    }
    
    // 创建新项目
    console.log('\n创建新项目...');
    
    await sql`
      INSERT INTO projects (
        id, title, description, files, main_file, is_public, 
        views, likes, external_url, external_embed, external_author,
        created_at, updated_at
      ) VALUES (
        ${projectData.id}, 
        ${projectData.title}, 
        ${projectData.description}, 
        ${projectData.files}::jsonb, 
        ${projectData.mainFile}, 
        ${projectData.isPublic}, 
        ${projectData.views}, 
        ${projectData.likes}, 
        ${projectData.externalUrl}, 
        ${projectData.externalEmbed}, 
        ${projectData.externalAuthor}, 
        ${projectData.createdAt}, 
        ${projectData.updatedAt}
      )
    `;
    
    console.log(`\n成功创建了新项目，ID: ${projectData.id}`);
    console.log('项目标题:', projectData.title);
    console.log('项目URL:', projectData.externalUrl);
    console.log('允许嵌入:', projectData.externalEmbed ? '是' : '否');
    
  } catch (error) {
    console.error('创建项目失败:', error);
  }
}

createNewProject(); 