// 检查远程数据库中的外部项目URL
require('dotenv').config({ path: '.env.local' });
const { sql } = require('@vercel/postgres');
const fs = require('fs');

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

async function checkExternalProjects() {
  console.log('检查远程数据库中的外部项目...');
  ensureDatabaseConnection();
  
  console.log('数据库连接环境变量状态:');
  console.log('- POSTGRES_URL:', process.env.POSTGRES_URL ? '已设置' : '未设置');
  console.log('- DATABASE_URL:', process.env.DATABASE_URL ? '已设置' : '未设置');
  console.log('- VERCEL_POSTGRES_URL:', process.env.VERCEL_POSTGRES_URL ? '已设置' : '未设置');
  
  try {
    // 获取全部项目数量
    console.log('\n查询全部项目数量...');
    const countResult = await sql`SELECT COUNT(*) as total FROM projects`;
    console.log(`数据库中共有 ${countResult.rows[0].total} 个项目`);
    
    // 查询包含external_url的项目
    console.log('\n查询包含external_url的项目...');
    const externalProjects = await sql`
      SELECT id, title, external_url, external_embed 
      FROM projects 
      WHERE external_url IS NOT NULL AND external_url != ''
    `;
    
    if (externalProjects.rowCount === 0) {
      console.log('未找到包含external_url的项目');
    } else {
      console.log(`找到 ${externalProjects.rowCount} 个带有external_url的项目:`);
      externalProjects.rows.forEach((project, index) => {
        console.log(`\n[${index + 1}] 项目ID: ${project.id}`);
        console.log(`   标题: ${project.title || '无标题'}`);
        console.log(`   外部URL: ${project.external_url}`);
        console.log(`   允许嵌入: ${project.external_embed ? '是' : '否'}`);
      });
    }
    
    // 查询特定的项目ID (从日志中看到有问题的ID)
    const problemIds = ['0HdunX4YnU', 'demo-project'];
    console.log('\n查询特定项目ID...');
    
    for (const id of problemIds) {
      const project = await sql`
        SELECT id, title, external_url, external_embed, type, main_file
        FROM projects 
        WHERE id = ${id}
      `;
      
      if (project.rowCount === 0) {
        console.log(`[${id}] 项目不存在`);
      } else {
        const p = project.rows[0];
        console.log(`\n[${id}] 项目数据:`);
        console.log(`   标题: ${p.title || '无标题'}`);
        console.log(`   外部URL: ${p.external_url || '无'}`);
        console.log(`   允许嵌入: ${p.external_embed ? '是' : '否'}`);
        console.log(`   类型: ${p.type || '未指定'}`);
        console.log(`   主文件: ${p.main_file || '无'}`);
      }
    }
    
    // 查询实际被访问的项目
    console.log('\n获取特定项目0HdunX4YnU的详细信息');
    const visitedProject = await sql`
      SELECT * FROM projects WHERE id = '0HdunX4YnU'
    `;
    
    if (visitedProject.rowCount > 0) {
      console.log('项目0HdunX4YnU完整数据:');
      console.log(JSON.stringify(visitedProject.rows[0], null, 2));
    } else {
      console.log('项目0HdunX4YnU不存在');
    }
    
  } catch (error) {
    console.error('数据库查询错误:', error);
  }
}

checkExternalProjects(); 