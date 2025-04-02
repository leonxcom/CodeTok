// 检查生产环境数据库结构和内容
require('dotenv').config({ path: '.env.local' });
const { sql } = require('@vercel/postgres');
const readline = require('readline');

// 设置环境变量
async function setupEnvironment() {
  console.log('设置环境变量...');
  
  // 检查是否有生产环境的数据库连接URL
  if (!process.env.POSTGRES_URL_PRODUCTION) {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    // 获取生产环境数据库URL
    const getProductionUrl = () => {
      return new Promise((resolve) => {
        rl.question('请输入生产环境(main)数据库连接URL: ', (answer) => {
          process.env.POSTGRES_URL_PRODUCTION = answer.trim();
          console.log('已设置生产环境数据库连接URL');
          rl.close();
          resolve();
        });
      });
    };

    await getProductionUrl();
  }
}

// 检查数据库表结构
async function checkTableStructure() {
  console.log('\n检查数据库表结构...');
  
  // 保存原始数据库URL
  const originalDatabaseUrl = process.env.POSTGRES_URL || process.env.DATABASE_URL;
  
  try {
    // 切换到生产环境数据库
    process.env.POSTGRES_URL = process.env.POSTGRES_URL_PRODUCTION;
    
    // 获取所有表
    const tables = await sql`
      SELECT tablename 
      FROM pg_catalog.pg_tables 
      WHERE schemaname = 'public'
      ORDER BY tablename;
    `;
    
    console.log('\n数据库表列表:');
    tables.rows.forEach((table, index) => {
      console.log(`${index + 1}. ${table.tablename}`);
    });
    
    // 特别检查项目表结构
    if (tables.rows.some(t => t.tablename === 'projects')) {
      console.log('\n项目表(projects)结构:');
      const projectColumns = await sql`
        SELECT column_name, data_type, character_maximum_length, is_nullable
        FROM information_schema.columns
        WHERE table_name = 'projects'
        ORDER BY ordinal_position;
      `;
      
      projectColumns.rows.forEach((column) => {
        console.log(`- ${column.column_name} (${column.data_type}${column.character_maximum_length ? `(${column.character_maximum_length})` : ''}, ${column.is_nullable === 'YES' ? '可空' : '非空'})`);
      });
    } else {
      console.log('\n未找到项目表(projects)');
    }
    
  } catch (error) {
    console.error('检查表结构失败:', error);
  } finally {
    // 恢复原始数据库URL
    process.env.POSTGRES_URL = originalDatabaseUrl;
  }
}

// 检查项目数据
async function checkProjectsData() {
  console.log('\n检查项目数据...');
  
  // 保存原始数据库URL
  const originalDatabaseUrl = process.env.POSTGRES_URL || process.env.DATABASE_URL;
  
  try {
    // 切换到生产环境数据库
    process.env.POSTGRES_URL = process.env.POSTGRES_URL_PRODUCTION;
    
    // 获取项目总数
    const countResult = await sql`SELECT COUNT(*) FROM projects`;
    console.log(`项目总数: ${countResult.rows[0].count}`);
    
    // 获取外部项目
    const externalProjects = await sql`
      SELECT id, title, external_url, type 
      FROM projects 
      WHERE external_url IS NOT NULL AND external_url != ''
      ORDER BY created_at DESC
    `;
    
    console.log(`\n外部项目数量: ${externalProjects.rows.length}`);
    console.log('外部项目列表:');
    externalProjects.rows.forEach((project, index) => {
      console.log(`${index + 1}. ${project.title} (${project.external_url}) [${project.type || 'unknown'}]`);
    });
    
    // 检查特定的外部项目URL
    const targetURLs = [
      'https://firstpersonflappy.com',
      'https://firstpersonflappy.com/',
      'https://visualorigins.digitaldigging.org',
      'https://visualorigins.digitaldigging.org/',
      'https://findasks.com',
      'https://findasks.com/',
      'https://summedup.ai',
      'https://summedup.ai/'
    ];
    
    console.log('\n检查指定的外部项目URL:');
    for (const url of targetURLs) {
      const result = await sql`
        SELECT id, title, external_url 
        FROM projects 
        WHERE external_url = ${url}
      `;
      
      if (result.rows.length > 0) {
        console.log(`✓ 找到URL为 "${url}" 的项目: "${result.rows[0].title}" (ID: ${result.rows[0].id})`);
      } else {
        console.log(`✗ 未找到URL为 "${url}" 的项目`);
      }
    }
    
    // 检查具有类似URL的项目（不区分尾部斜杠）
    console.log('\n使用模糊匹配搜索项目URL:');
    for (const baseUrl of ['findasks.com', 'summedup.ai', 'firstpersonflappy.com']) {
      const result = await sql`
        SELECT id, title, external_url 
        FROM projects 
        WHERE external_url LIKE ${'%' + baseUrl + '%'}
      `;
      
      if (result.rows.length > 0) {
        console.log(`找到包含 "${baseUrl}" 的项目:`);
        result.rows.forEach(project => {
          console.log(`  - "${project.title}" (${project.external_url}) [ID: ${project.id}]`);
        });
      } else {
        console.log(`未找到包含 "${baseUrl}" 的项目`);
      }
    }
    
  } catch (error) {
    console.error('检查项目数据失败:', error);
  } finally {
    // 恢复原始数据库URL
    process.env.POSTGRES_URL = originalDatabaseUrl;
  }
}

// 主函数
async function main() {
  try {
    await setupEnvironment();
    await checkTableStructure();
    await checkProjectsData();
    console.log('\n数据库检查完成!');
  } catch (error) {
    console.error('检查过程中发生错误:', error);
  }
}

main(); 
 