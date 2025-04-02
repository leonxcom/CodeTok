// 添加外部项目到预发布环境(preview)
require('dotenv').config({ path: '.env.local' });
const { sql } = require('@vercel/postgres');
const readline = require('readline');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// 要添加的外部项目URL列表
const externalProjects = [
  {
    url: 'https://visualorigins.digitaldigging.org/',
    title: 'Visual Origins',
    description: 'A digital digging visualization project exploring visual origins.'
  },
  {
    url: 'https://fang-die-fliege-z23hmxbz1f9iur.needle.run/',
    title: 'Fang Die Fliege',
    description: 'An interactive game where you catch flies.'
  },
  {
    url: 'https://collidingscopes.github.io/red-panda-vibes/',
    title: 'Red Panda Vibes',
    description: 'A red panda themed interactive experience.'
  },
  {
    url: 'https://findasks.com/',
    title: 'Find Asks',
    description: 'A platform for finding and answering questions.'
  },
  {
    url: 'https://secretnamegame.com/',
    title: 'Secret Name Game',
    description: 'A fun name guessing game with secret identities.'
  },
  {
    url: 'https://summedup.ai/',
    title: 'Summed Up AI',
    description: 'AI-powered content summarization tool.'
  }
];

// 检查.env.local文件
function checkEnvFile() {
  const envPath = path.join(process.cwd(), '.env.local');
  console.log('检查.env.local文件...');
  
  if (fs.existsSync(envPath)) {
    console.log('找到.env.local文件');
    try {
      const envContent = fs.readFileSync(envPath, 'utf-8');
      const hasPreviewUrl = envContent.includes('POSTGRES_URL_PREVIEW');
      
      console.log('.env.local文件内容分析:');
      console.log(`- POSTGRES_URL_PREVIEW: ${hasPreviewUrl ? '已配置' : '未配置'}`);
      
      if (hasPreviewUrl) {
        console.log('环境变量中的预发布数据库URL:', process.env.POSTGRES_URL_PREVIEW ? '已读取' : '读取失败');
      }
    } catch (error) {
      console.error('读取.env.local文件失败:', error.message);
    }
  } else {
    console.log('未找到.env.local文件，将通过命令行输入数据库URL');
  }
}

// 设置环境变量
async function setupEnvironment() {
  console.log('设置环境变量...');
  
  // 首先检查.env.local文件
  checkEnvFile();
  
  if (!process.env.POSTGRES_URL_PREVIEW) {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    // 获取预发布环境数据库URL
    const getPreviewUrl = () => {
      return new Promise((resolve) => {
        rl.question('请输入预发布环境(preview)数据库连接URL: ', (answer) => {
          process.env.POSTGRES_URL_PREVIEW = answer.trim();
          console.log('已设置预发布环境数据库连接URL');
          rl.close();
          resolve();
        });
      });
    };

    await getPreviewUrl();
  } else {
    console.log('环境变量中已存在预发布数据库URL配置，将使用该配置');
  }
}

// 生成随机项目ID
function generateProjectId() {
  const id = crypto.randomBytes(6).toString('base64');
  return id.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

// 获取预发布环境中的现有项目
async function getExistingProjects() {
  console.log('\n检查预发布环境现有项目...');
  
  // 保存原始数据库URL
  const originalDatabaseUrl = process.env.POSTGRES_URL || process.env.DATABASE_URL;
  
  try {
    // 切换到预发布环境数据库
    console.log(`正在切换到预发布环境数据库: ${process.env.POSTGRES_URL_PREVIEW.substring(0, 30)}...`);
    process.env.POSTGRES_URL = process.env.POSTGRES_URL_PREVIEW;
    
    // 测试连接
    try {
      await sql`SELECT 1`;
      console.log('成功连接到预发布环境数据库');
    } catch (connError) {
      console.error('连接预发布环境数据库失败:', connError);
      return { count: 0, urls: new Set() };
    }
    
    // 获取项目总数
    const countResult = await sql`SELECT COUNT(*) FROM projects`;
    console.log(`预发布环境中共有 ${countResult.rows[0].count} 个项目`);
    
    // 获取所有外部URL
    const urlsResult = await sql`
      SELECT external_url FROM projects 
      WHERE external_url IS NOT NULL AND external_url != ''
    `;
    
    const urls = new Set(urlsResult.rows.map(row => row.external_url));
    console.log(`预发布环境中已有 ${urls.size} 个外部URL`);
    
    return { 
      count: parseInt(countResult.rows[0].count), 
      urls
    };
  } catch (error) {
    console.error('检查预发布环境现有项目失败:', error);
    return { count: 0, urls: new Set() };
  } finally {
    // 恢复原始数据库URL
    process.env.POSTGRES_URL = originalDatabaseUrl;
  }
}

// 添加外部项目到预发布环境
async function addExternalProjects() {
  console.log('\n准备添加外部项目到预发布环境...');
  
  // 保存原始数据库URL
  const originalDatabaseUrl = process.env.POSTGRES_URL || process.env.DATABASE_URL;
  
  try {
    // 切换到预发布环境数据库
    console.log(`正在切换到预发布环境数据库: ${process.env.POSTGRES_URL_PREVIEW.substring(0, 30)}...`);
    process.env.POSTGRES_URL = process.env.POSTGRES_URL_PREVIEW;
    
    // 获取现有项目
    const { urls: existingUrls } = await getExistingProjects();
    
    // 添加计数器
    let addedCount = 0;
    let skippedCount = 0;
    
    // 遍历并添加项目
    for (const project of externalProjects) {
      // 标准化URL，移除尾部斜杠以便比较
      const normalizedUrl = project.url.replace(/\/$/, '');
      
      // 检查URL是否存在（考虑尾部斜杠的差异）
      const urlExists = Array.from(existingUrls).some(url => {
        return url.replace(/\/$/, '') === normalizedUrl;
      });
      
      if (urlExists) {
        console.log(`\n跳过已存在的项目: ${project.title} (${project.url})`);
        skippedCount++;
        continue;
      }
      
      // 生成随机ID
      const projectId = generateProjectId();
      
      // 基本项目数据
      const defaultFiles = {
        '/index.html': {
          content: '<html><body><h1>External Project</h1><p>This is an external project.</p></body></html>',
          pathname: 'index.html',
          isEntryPoint: true
        }
      };
      
      // 当前时间
      const now = new Date().toISOString();
      
      console.log(`\n添加项目: ${project.title} (${project.url})`);
      
      try {
        // 插入项目数据
        await sql`
          INSERT INTO projects (
            id, title, description, files, main_file, is_public, 
            views, likes, external_url, external_embed, external_author, type,
            created_at, updated_at
          ) VALUES (
            ${projectId}, 
            ${project.title}, 
            ${project.description}, 
            ${JSON.stringify(defaultFiles)}::jsonb, 
            ${'index.html'}, 
            ${true}, 
            ${0}, 
            ${0}, 
            ${project.url}, 
            ${false}, 
            ${'CodeTok'}, 
            ${'external'},
            ${now}, 
            ${now}
          )
        `;
        
        console.log(`✓ 成功添加项目 "${project.title}" (ID: ${projectId})`);
        addedCount++;
      } catch (error) {
        console.error(`✗ 添加项目 "${project.title}" 失败:`, error);
      }
    }
    
    // 重新获取项目数量
    const countResult = await sql`SELECT COUNT(*) FROM projects`;
    
    console.log(`\n添加完成! 成功添加 ${addedCount} 个项目，跳过 ${skippedCount} 个已存在项目`);
    console.log(`预发布环境现在共有 ${countResult.rows[0].count} 个项目`);
    
    return addedCount > 0;
  } catch (error) {
    console.error('添加外部项目失败:', error);
    return false;
  } finally {
    // 恢复原始数据库URL
    process.env.POSTGRES_URL = originalDatabaseUrl;
  }
}

// 同步到生产环境
async function syncToProduction() {
  console.log('\n准备同步到生产环境...');
  
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  try {
    // 询问是否要同步到生产环境
    const shouldSync = await new Promise((resolve) => {
      rl.question('是否要将新添加的项目同步到生产环境? (y/N) ', (answer) => {
        resolve(answer.toLowerCase() === 'y');
      });
    });

    if (!shouldSync) {
      console.log('已取消同步到生产环境');
      return false;
    }

    // 获取生产环境数据库URL
    const prodUrl = await new Promise((resolve) => {
      rl.question('请输入生产环境数据库连接URL: ', (answer) => {
        resolve(answer.trim());
      });
    });

    if (!prodUrl) {
      console.log('未提供生产环境数据库URL，取消同步');
      return false;
    }

    // 保存原始数据库URL
    const originalDatabaseUrl = process.env.POSTGRES_URL || process.env.DATABASE_URL;
    
    try {
      // 切换到生产环境数据库
      process.env.POSTGRES_URL = prodUrl;
      
      // 测试连接
      await sql`SELECT 1`;
      console.log('成功连接到生产环境数据库');
      
      // 获取预发布环境的项目
      process.env.POSTGRES_URL = process.env.POSTGRES_URL_PREVIEW;
      const previewProjects = await sql`
        SELECT * FROM projects 
        WHERE type = 'external' 
        ORDER BY created_at DESC
      `;
      
      // 切换回生产环境
      process.env.POSTGRES_URL = prodUrl;
      
      // 获取生产环境中的外部URL
      const prodUrlsResult = await sql`
        SELECT external_url FROM projects 
        WHERE external_url IS NOT NULL AND external_url != ''
      `;
      
      const prodUrls = new Set(prodUrlsResult.rows.map(row => row.external_url));
      
      // 同步项目
      let syncedCount = 0;
      let skippedCount = 0;
      
      for (const project of previewProjects.rows) {
        // 标准化URL
        const normalizedUrl = project.external_url?.replace(/\/$/, '');
        
        // 检查URL是否已存在
        const urlExists = Array.from(prodUrls).some(url => {
          return url.replace(/\/$/, '') === normalizedUrl;
        });
        
        if (urlExists) {
          console.log(`\n跳过已存在的项目: ${project.title} (${project.external_url})`);
          skippedCount++;
          continue;
        }
        
        console.log(`\n同步项目: ${project.title} (${project.external_url})`);
        
        try {
          // 插入项目数据
          await sql`
            INSERT INTO projects (
              id, title, description, files, main_file, is_public, 
              views, likes, external_url, external_embed, external_author, type,
              created_at, updated_at
            ) VALUES (
              ${project.id}, 
              ${project.title}, 
              ${project.description}, 
              ${JSON.stringify(project.files)}::jsonb, 
              ${project.main_file}, 
              ${project.is_public}, 
              ${project.views}, 
              ${project.likes}, 
              ${project.external_url}, 
              ${project.external_embed}, 
              ${project.external_author}, 
              ${project.type},
              ${project.created_at}, 
              ${project.updated_at}
            )
          `;
          
          console.log(`✓ 成功同步项目 "${project.title}" (ID: ${project.id})`);
          syncedCount++;
        } catch (error) {
          console.error(`✗ 同步项目 "${project.title}" 失败:`, error);
        }
      }
      
      console.log(`\n同步完成! 成功同步 ${syncedCount} 个项目，跳过 ${skippedCount} 个已存在项目`);
      return syncedCount > 0;
    } finally {
      // 恢复原始数据库URL
      process.env.POSTGRES_URL = originalDatabaseUrl;
    }
  } catch (error) {
    console.error('同步到生产环境失败:', error);
    return false;
  } finally {
    rl.close();
  }
}

// 主函数
async function main() {
  try {
    // 设置环境变量
    await setupEnvironment();
    
    // 添加外部项目到预发布环境
    const hasNewProjects = await addExternalProjects();
    
    // 如果有新项目，询问是否同步到生产环境
    if (hasNewProjects) {
      await syncToProduction();
    }
    
    console.log('\n所有操作已完成');
  } catch (error) {
    console.error('程序执行失败:', error);
    process.exit(1);
  }
}

// 执行主函数
main(); 