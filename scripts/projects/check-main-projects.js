// 检查主数据库中的项目 - 使用直接连接
// 避免环境变量缓存问题
const { Client } = require('pg');
require('dotenv').config({ path: '.env.local' });

// 建立PG客户端直接连接
async function connectDirectly() {
  console.log('\n使用PG直接连接主数据库...');

  // 获取数据库URL
  const dbUrl = process.env.POSTGRES_URL_PRODUCTION;
  
  if (!dbUrl) {
    console.error('错误: 未找到POSTGRES_URL_PRODUCTION环境变量');
    process.exit(1);
  }
  
  console.log(`使用连接字符串: ${dbUrl.substring(0, 30)}...`);
  
  // 创建客户端
  const client = new Client({
    connectionString: dbUrl
  });
  
  try {
    // 连接数据库
    console.log('正在连接...');
    await client.connect();
    console.log('连接成功!');
    
    // 验证连接
    const testResult = await client.query('SELECT 1 as test');
    if (testResult.rows[0].test === 1) {
      console.log('连接验证成功');
    }
    
    // 获取项目数量
    const countResult = await client.query('SELECT COUNT(*) FROM projects');
    console.log(`\n数据库中共有 ${countResult.rows[0].count} 个项目`);
    
    // 获取所有项目列表
    const projectsResult = await client.query(`
      SELECT id, title, external_url, created_at 
      FROM projects 
      ORDER BY created_at DESC
    `);
    
    console.log(`\n检索到 ${projectsResult.rows.length} 个项目:`);
    projectsResult.rows.forEach((project, index) => {
      const createdAt = new Date(project.created_at).toLocaleString();
      console.log(`${index + 1}. [${project.id}] ${project.title} (${project.external_url || '无URL'}) - ${createdAt}`);
    });
    
    // 特定项目ID检查
    const specificIds = [
      'hv2MyfkE',  // Visual Origins
      'OUqkCPge',  // Fang Die Fliege
      'Kw6po9Rc',  // Red Panda Vibes
      'AuwigNZk',  // Find Asks
      'sCGsO5Qk',  // Secret Name Game
      'nrRjnASj'   // Summed Up AI
    ];
    
    console.log('\n检查特定项目ID:');
    
    for (const id of specificIds) {
      const result = await client.query('SELECT id, title FROM projects WHERE id = $1', [id]);
      
      if (result.rows.length > 0) {
        console.log(`✓ ID "${id}" - 存在: "${result.rows[0].title}"`);
      } else {
        console.log(`✗ ID "${id}" - 不存在`);
      }
    }
    
    return projectsResult.rows;
  } catch (error) {
    console.error('数据库操作出错:', error);
    throw error;
  } finally {
    // 关闭连接
    await client.end();
    console.log('\nPG客户端连接已关闭');
  }
}

// 主函数
async function main() {
  try {
    console.log('====== 检查主数据库的项目 ======');
    const projects = await connectDirectly();
    console.log('\n检查完成!');
    
    // 输出汇总
    if (projects && projects.length > 0) {
      console.log(`\n主数据库中有 ${projects.length} 个项目`);
    } else {
      console.log('\n警告: 未找到任何项目');
    }
  } catch (error) {
    console.error('操作失败:', error);
    process.exit(1);
  }
}

// 执行主函数
main(); 