// 测试数据库查询和项目获取
require('dotenv').config();
const { sql } = require('@vercel/postgres');

async function testProjectQuery() {
  try {
    console.log('开始项目查询测试...');
    console.log('数据库URL:', process.env.POSTGRES_URL ? '已设置' : '未设置');
    
    // 查询特定项目
    console.log('\n测试1: 查询特定项目...');
    const knownProject = await sql`
      SELECT * FROM projects
      WHERE id = 'YJOzdgfAJN'
    `;
    
    console.log('特定项目查询结果:');
    console.log('行数:', knownProject.rowCount);
    console.log('数据:', JSON.stringify(knownProject.rows, null, 2));
    
    // 查询所有公开项目
    console.log('\n测试2: 查询所有公开项目...');
    const publicProjects = await sql`
      SELECT id, title, created_at
      FROM projects
      WHERE is_public = true
      ORDER BY created_at DESC
      LIMIT 10
    `;
    
    console.log('公开项目查询结果:');
    console.log('行数:', publicProjects.rowCount);
    console.log('数据:', JSON.stringify(publicProjects.rows, null, 2));
    
    // 测试随机查询
    console.log('\n测试3: 随机查询公开项目...');
    const randomProject = await sql`
      SELECT id, title, created_at
      FROM projects
      WHERE is_public = true
      ORDER BY RANDOM()
      LIMIT 1
    `;
    
    console.log('随机项目查询结果:');
    console.log('行数:', randomProject.rowCount);
    console.log('数据:', JSON.stringify(randomProject.rows, null, 2));
    
  } catch (error) {
    console.error('查询出错:', error);
  }
}

testProjectQuery(); 