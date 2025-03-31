// 测试@vercel/postgres直接插入数据
require('dotenv').config({ path: '.env.local' });
const { sql } = require('@vercel/postgres');

async function testPostgres() {
  try {
    console.log('测试@vercel/postgres连接...');
    
    // 生成一个随机ID
    const projectId = 'test-' + Date.now();
    
    // 创建一个简单的项目对象
    const project = {
      id: projectId,
      title: '测试项目',
      description: '测试@vercel/postgres插入',
      files: JSON.stringify([{
        url: 'https://example.com/test.html',
        filename: 'test.html',
        pathname: 'test.html',
        size: 10,
        type: 'text/html',
        isEntryPoint: true
      }]),
      mainFile: 'test.html',
      isPublic: true
    };
    
    // 插入数据
    console.log('插入测试项目...');
    await sql`
      INSERT INTO projects (id, title, description, files, main_file, is_public)
      VALUES (${project.id}, ${project.title}, ${project.description}, ${project.files}::jsonb, ${project.mainFile}, ${project.isPublic})
    `;
    
    // 查询验证
    console.log('验证插入的数据...');
    const result = await sql`SELECT * FROM projects WHERE id = ${projectId}`;
    
    console.log('查询结果:', result.rows);
    
    // 清理
    console.log('清理测试数据...');
    await sql`DELETE FROM projects WHERE id = ${projectId}`;
    
    console.log('测试完成!');
  } catch (error) {
    console.error('测试失败:', error);
  }
}

// 执行测试
testPostgres(); 