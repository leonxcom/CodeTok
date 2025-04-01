// 直接验证生产环境中的所有项目
require('dotenv').config({ path: '.env.local' });
const { sql } = require('@vercel/postgres');
const readline = require('readline');

// 要验证的URL列表
const urlsToVerify = [
  'https://visualorigins.digitaldigging.org/',
  'https://fang-die-fliege-z23hmxbz1f9iur.needle.run/',
  'https://collidingscopes.github.io/red-panda-vibes/',
  'https://findasks.com/',
  'https://secretnamegame.com/',
  'https://summedup.ai/',
  'https://firstpersonflappy.com',
  'https://character-sample-project.netlify.app',
  'https://fps-sample-project.netlify.app'
];

// 设置生产环境的数据库URL
async function setupEnvironment() {
  if (!process.env.POSTGRES_URL_PRODUCTION) {
    // 如果.env.local中没有设置，则要求用户输入
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    await new Promise((resolve) => {
      rl.question('请输入生产环境(main)数据库连接URL: ', (answer) => {
        process.env.POSTGRES_URL_PRODUCTION = answer.trim();
        console.log('已设置生产环境数据库连接URL');
        rl.close();
        resolve();
      });
    });
  } else {
    console.log('已找到生产环境数据库URL配置');
  }
}

// 直接在生产环境执行SQL查询
async function runDirectQueries() {
  console.log('\n在生产环境直接执行SQL查询...');
  
  // 保存原始数据库URL
  const originalDatabaseUrl = process.env.POSTGRES_URL || process.env.DATABASE_URL;
  
  try {
    // 切换到生产环境数据库
    console.log(`正在连接到生产环境数据库: ${process.env.POSTGRES_URL_PRODUCTION.substring(0, 30)}...`);
    process.env.POSTGRES_URL = process.env.POSTGRES_URL_PRODUCTION;
    
    // 测试连接
    try {
      await sql`SELECT 1`;
      console.log('成功连接到生产环境数据库');
    } catch (connError) {
      console.error('连接生产环境数据库失败:', connError);
      return;
    }
    
    // 获取项目总数
    const countResult = await sql`SELECT COUNT(*) FROM projects`;
    console.log(`生产环境中共有 ${countResult.rows[0].count} 个项目`);
    
    // 执行直接查询，获取所有项目
    console.log('\n获取所有项目的基本信息:');
    const allProjects = await sql`
      SELECT id, title, external_url, type, created_at
      FROM projects
      ORDER BY created_at DESC
    `;
    
    console.log(`查询返回了 ${allProjects.rows.length} 个项目`);
    
    if (allProjects.rows.length > 0) {
      console.log('\n项目列表:');
      allProjects.rows.forEach((project, i) => {
        const createdAt = new Date(project.created_at).toLocaleString();
        console.log(`${i+1}. [${project.id}] ${project.title} (${project.external_url || '无外部URL'}) - ${createdAt}`);
      });
    }
    
    // 逐个验证指定的URL
    console.log('\n验证特定URL:');
    const results = [];
    
    for (const url of urlsToVerify) {
      // 标准化URL，移除尾部斜杠
      const normalizedUrl = url.replace(/\/$/, '');
      let found = false;
      
      // 精确匹配
      const exactMatch = await sql`
        SELECT id, title FROM projects WHERE external_url = ${url}
      `;
      
      if (exactMatch.rows.length > 0) {
        console.log(`✓ 找到URL "${url}" 的项目: "${exactMatch.rows[0].title}" (ID: ${exactMatch.rows[0].id}) - 精确匹配`);
        found = true;
        results.push({
          url,
          found: true,
          title: exactMatch.rows[0].title,
          id: exactMatch.rows[0].id,
          matchType: 'exact'
        });
        continue;
      }
      
      // 不考虑尾部斜杠的匹配
      for (const project of allProjects.rows) {
        if (project.external_url && project.external_url.replace(/\/$/, '') === normalizedUrl) {
          console.log(`✓ 找到URL "${url}" 的项目: "${project.title}" (ID: ${project.id}) - 忽略尾部斜杠`);
          found = true;
          results.push({
            url,
            found: true,
            title: project.title,
            id: project.id,
            matchType: 'normalized'
          });
          break;
        }
      }
      
      // 模糊匹配
      if (!found) {
        const baseUrl = normalizedUrl.replace(/^https?:\/\//, '').split('/')[0];
        const fuzzyMatch = await sql`
          SELECT id, title, external_url FROM projects 
          WHERE external_url LIKE ${'%' + baseUrl + '%'}
        `;
        
        if (fuzzyMatch.rows.length > 0) {
          console.log(`✓ 找到类似URL "${url}" 的项目:`);
          fuzzyMatch.rows.forEach(p => {
            console.log(`  - "${p.title}" (${p.external_url}) [ID: ${p.id}]`);
          });
          
          results.push({
            url,
            found: true,
            title: fuzzyMatch.rows[0].title,
            id: fuzzyMatch.rows[0].id,
            matchType: 'fuzzy',
            actualUrl: fuzzyMatch.rows[0].external_url
          });
        } else {
          console.log(`✗ 未找到URL "${url}" 的项目`);
          results.push({
            url,
            found: false
          });
        }
      }
    }
    
    // 结果摘要
    console.log('\n验证结果摘要:');
    const foundCount = results.filter(r => r.found).length;
    console.log(`共验证 ${results.length} 个URL，找到 ${foundCount} 个，未找到 ${results.length - foundCount} 个`);
    
    if (foundCount === results.length) {
      console.log('所有URL都已在生产环境数据库中找到。');
    } else {
      console.log('有些URL在生产环境数据库中未找到。');
      const notFound = results.filter(r => !r.found);
      console.log('未找到的URL:');
      notFound.forEach(r => console.log(`- ${r.url}`));
    }
    
    // 转储所有结果为JSON格式
    const fullJson = JSON.stringify(results, null, 2);
    console.log('\n完整验证结果JSON:');
    console.log(fullJson);
  } catch (error) {
    console.error('执行查询过程中出错:', error);
  } finally {
    // 恢复原始数据库URL
    process.env.POSTGRES_URL = originalDatabaseUrl;
  }
}

// 主函数
async function main() {
  try {
    await setupEnvironment();
    await runDirectQueries();
    console.log('\n验证完成!');
  } catch (error) {
    console.error('操作过程中发生错误:', error);
  }
}

main(); 