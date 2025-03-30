// 测试项目查询
require('dotenv').config({ path: '.env.local' });
const { sql } = require('@vercel/postgres');

async function testProjectQuery() {
  try {
    // 查询特定项目
    console.log('查询特定项目...');
    const specificProject = await sql`
      SELECT id FROM projects 
      WHERE id = 'YJOzdgfAJN'
      LIMIT 1
    `;
    
    console.log('特定项目查询结果:');
    console.log(JSON.stringify(specificProject, null, 2));
    console.log('行数:', specificProject.rows.length);
    console.log('rowCount:', specificProject.rowCount);
    
    // 查询随机项目
    console.log('\n查询随机项目...');
    const randomProject = await sql`
      SELECT id FROM projects
      WHERE is_public = true
      ORDER BY RANDOM()
      LIMIT 1
    `;
    
    console.log('随机项目查询结果:');
    console.log(JSON.stringify(randomProject, null, 2));
    console.log('行数:', randomProject.rows.length);
    console.log('rowCount:', randomProject.rowCount);
    
    // 查询刚创建的角色样本项目
    console.log('\n查询角色样本项目...');
    const characterProject = await sql`
      SELECT id, title, external_url, external_embed
      FROM projects
      WHERE external_url = 'https://character-sample-project.netlify.app/'
      LIMIT 1
    `;
    
    console.log('角色样本项目查询结果:');
    console.log(JSON.stringify(characterProject, null, 2));
    console.log('行数:', characterProject.rows.length);
    console.log('rowCount:', characterProject.rowCount);
    
    // 验证ID为character-sample的项目
    console.log('\n验证ID为character-sample的项目...');
    const idProject = await sql`
      SELECT id, title, external_url, external_embed
      FROM projects
      WHERE id = 'character-sample'
      LIMIT 1
    `;
    
    console.log('ID查询结果:');
    console.log(JSON.stringify(idProject, null, 2));
    console.log('行数:', idProject.rows.length);
    console.log('rowCount:', idProject.rowCount);
    
  } catch (error) {
    console.error('测试查询失败:', error);
  }
}

// 执行测试
testProjectQuery(); 