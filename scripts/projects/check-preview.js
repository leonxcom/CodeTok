// 检查预览环境中的所有项目
require('dotenv').config({ path: '.env.local' });
const { sql } = require('@vercel/postgres');

async function main() {
  try {
    console.log('检查预览环境中的所有项目...');
    
    // 保存原始数据库URL
    const originalUrl = process.env.POSTGRES_URL || process.env.DATABASE_URL;
    
    // 设置为预览环境URL
    process.env.POSTGRES_URL = process.env.POSTGRES_URL_PREVIEW;
    console.log(`正在连接到预览环境数据库: ${process.env.POSTGRES_URL_PREVIEW.substring(0, 30)}...`);
    
    // 测试连接
    await sql`SELECT 1`;
    console.log('成功连接到预览环境数据库');
    
    // 计数
    const countResult = await sql`SELECT COUNT(*) FROM projects`;
    console.log(`预览环境中共有 ${countResult.rows[0].count} 个项目`);
    
    // 查询所有项目
    const result = await sql`
      SELECT id, title, external_url 
      FROM projects 
      ORDER BY created_at DESC
    `;
    
    console.log(`\n获取到 ${result.rows.length} 个项目:`);
    
    if (result.rows.length > 0) {
      result.rows.forEach((project, i) => {
        console.log(`${i+1}. [${project.id}] ${project.title} (${project.external_url || '无外部URL'})`);
      });
    }
    
    // 查找特定URL
    console.log('\n查找特定项目:');
    const urls = [
      'https://visualorigins.digitaldigging.org/',
      'https://fang-die-fliege-z23hmxbz1f9iur.needle.run/',
      'https://collidingscopes.github.io/red-panda-vibes/',
      'https://findasks.com/',
      'https://secretnamegame.com/',
      'https://summedup.ai/'
    ];
    
    for (const url of urls) {
      // 标准查询
      const exactMatch = await sql`
        SELECT id, title FROM projects WHERE external_url = ${url}
      `;
      
      if (exactMatch.rows.length > 0) {
        console.log(`✓ 找到URL "${url}" 的项目: "${exactMatch.rows[0].title}" (ID: ${exactMatch.rows[0].id})`);
      } else {
        // 尝试不带尾部斜杠的查询
        const urlWithoutSlash = url.replace(/\/$/, '');
        const withoutSlashMatch = await sql`
          SELECT id, title FROM projects WHERE external_url = ${urlWithoutSlash}
        `;
        
        if (withoutSlashMatch.rows.length > 0) {
          console.log(`✓ 找到URL "${url}" 的项目(不含尾部斜杠): "${withoutSlashMatch.rows[0].title}" (ID: ${withoutSlashMatch.rows[0].id})`);
        } else {
          // 尝试模糊匹配
          const baseUrl = url.replace(/^https?:\/\//, '').split('/')[0];
          const fuzzyMatch = await sql`
            SELECT id, title, external_url FROM projects 
            WHERE external_url LIKE ${'%' + baseUrl + '%'}
          `;
          
          if (fuzzyMatch.rows.length > 0) {
            console.log(`✓ 找到相似URL "${url}" 的项目:`);
            fuzzyMatch.rows.forEach(p => {
              console.log(`  - "${p.title}" (${p.external_url}) [ID: ${p.id}]`);
            });
          } else {
            console.log(`✗ 未找到URL "${url}" 的项目`);
          }
        }
      }
    }
    
    // 恢复原始数据库URL
    process.env.POSTGRES_URL = originalUrl;
  } catch (error) {
    console.error('查询数据库时出错:', error);
  }
}

main(); 