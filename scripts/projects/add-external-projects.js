// 批量添加外部项目到数据库
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

// 要添加的外部项目列表
const externalProjects = [
  {
    url: 'https://firstpersonflappy.com/',
    title: 'First Person Flappy Bird',
    description: 'A first-person 3D version of the classic Flappy Bird game'
  },
  {
    url: 'https://visualorigins.digitaldigging.org/',
    title: 'Visual Origins',
    description: 'Interactive digital archaeology experience exploring the origins of visual communication'
  },
  {
    url: 'https://fang-die-fliege-z23hmxbz1f9iur.needle.run/',
    title: 'Fang Die Fliege',
    description: 'An interactive fly-catching game with physics-based gameplay'
  },
  {
    url: 'https://collidingscopes.github.io/red-panda-vibes/',
    title: 'Red Panda Vibes',
    description: 'Relaxing interactive experience with red pandas and ambient music'
  },
  {
    url: 'https://findasks.com/',
    title: 'Find Asks',
    description: 'Interactive question and answer platform with visual exploration'
  },
  {
    url: 'https://secretnamegame.com/',
    title: 'Secret Name Game',
    description: 'A multiplayer word guessing game with secret names and categories'
  },
  {
    url: 'https://summedup.ai/',
    title: 'Summed Up AI',
    description: 'AI-powered content summarization tool with interactive interface'
  }
];

// 创建单个项目
async function createProject(projectData) {
  try {
    const projectId = generateId();
    const currentDate = new Date().toISOString();
    
    // 项目文件数据
    const files = [
      {
        url: projectData.url,
        size: 0,
        type: 'text/html',
        filename: 'index.html',
        pathname: 'index.html',
        isEntryPoint: true
      }
    ];
    
    // 检查是否已存在相同URL的项目
    console.log(`\n检查是否已存在URL "${projectData.url}"的项目...`);
    
    const existingProjects = await sql`
      SELECT id FROM projects 
      WHERE external_url = ${projectData.url}
    `;
    
    if (existingProjects.rowCount > 0) {
      console.log(`已存在指向URL "${projectData.url}"的项目，ID:`, existingProjects.rows[0].id);
      return null;
    }
    
    // 创建新项目
    console.log(`\n创建新项目: ${projectData.title}...`);
    
    await sql`
      INSERT INTO projects (
        id, title, description, files, main_file, is_public, 
        views, likes, external_url, external_embed, external_author, type,
        created_at, updated_at
      ) VALUES (
        ${projectId}, 
        ${projectData.title}, 
        ${projectData.description}, 
        ${JSON.stringify(files)}::jsonb, 
        ${'index.html'}, 
        ${true}, 
        ${0}, 
        ${0}, 
        ${projectData.url}, 
        ${true}, 
        ${'External Project'}, 
        ${'external'},
        ${currentDate}, 
        ${currentDate}
      )
    `;
    
    console.log(`成功创建了新项目，ID: ${projectId}`);
    console.log('项目标题:', projectData.title);
    console.log('项目URL:', projectData.url);
    
    return projectId;
  } catch (error) {
    console.error(`创建项目 "${projectData.title}" 失败:`, error);
    return null;
  }
}

// 批量添加项目
async function addExternalProjects() {
  console.log('准备批量添加外部项目...');
  ensureDatabaseConnection();
  
  const results = [];
  
  for (const project of externalProjects) {
    const projectId = await createProject(project);
    if (projectId) {
      results.push({
        title: project.title,
        id: projectId,
        url: project.url
      });
    }
  }
  
  console.log('\n批量添加完成！共添加项目数量:', results.length);
  console.log('添加的项目列表:', results);
}

addExternalProjects(); 