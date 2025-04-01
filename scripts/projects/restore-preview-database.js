// 从生产环境(main)恢复数据到预发布环境(preview)
require('dotenv').config({ path: '.env.local' });
const { sql } = require('@vercel/postgres');
const readline = require('readline');
const fs = require('fs');
const path = require('path');

// 检查.env.local文件
function checkEnvFile() {
  const envPath = path.join(process.cwd(), '.env.local');
  console.log('检查.env.local文件...');
  
  if (fs.existsSync(envPath)) {
    console.log('找到.env.local文件');
    try {
      const envContent = fs.readFileSync(envPath, 'utf-8');
      const hasPreviewUrl = envContent.includes('POSTGRES_URL_PREVIEW');
      const hasProductionUrl = envContent.includes('POSTGRES_URL_PRODUCTION');
      
      console.log('.env.local文件内容分析:');
      console.log(`- POSTGRES_URL_PREVIEW: ${hasPreviewUrl ? '已配置' : '未配置'}`);
      console.log(`- POSTGRES_URL_PRODUCTION: ${hasProductionUrl ? '已配置' : '未配置'}`);
      
      if (hasPreviewUrl) {
        console.log('环境变量中的预发布数据库URL:', process.env.POSTGRES_URL_PREVIEW ? '已读取' : '读取失败');
      }
      
      if (hasProductionUrl) {
        console.log('环境变量中的生产数据库URL:', process.env.POSTGRES_URL_PRODUCTION ? '已读取' : '读取失败');
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
  
  if (!process.env.POSTGRES_URL_PRODUCTION || !process.env.POSTGRES_URL_PREVIEW) {
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
          resolve();
        });
      });
    };
    
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

    if (!process.env.POSTGRES_URL_PRODUCTION) {
      await getProductionUrl();
    }
    
    if (!process.env.POSTGRES_URL_PREVIEW) {
      await getPreviewUrl();
    }
  } else {
    console.log('环境变量中已存在数据库URL配置，将使用这些配置');
  }
  
  // 验证URL
  if (process.env.POSTGRES_URL_PREVIEW && process.env.POSTGRES_URL_PRODUCTION) {
    console.log('验证数据库URL...');
    if (process.env.POSTGRES_URL_PREVIEW === process.env.POSTGRES_URL_PRODUCTION) {
      console.warn('警告: 预发布环境和生产环境使用了相同的数据库URL!');
    } else {
      console.log('预发布环境和生产环境使用了不同的数据库URL');
    }
  }
}

// 从生产环境获取项目数据
async function getProductionProjects() {
  console.log('\n从生产环境(main)获取项目数据...');
  
  // 保存原始数据库URL
  const originalDatabaseUrl = process.env.POSTGRES_URL || process.env.DATABASE_URL;
  
  try {
    // 切换到生产环境数据库
    console.log(`正在切换到生产环境数据库: ${process.env.POSTGRES_URL_PRODUCTION.substring(0, 30)}...`);
    process.env.POSTGRES_URL = process.env.POSTGRES_URL_PRODUCTION;
    
    // 测试连接
    try {
      await sql`SELECT 1`;
      console.log('成功连接到生产环境数据库');
    } catch (connError) {
      console.error('连接生产环境数据库失败:', connError);
      return [];
    }
    
    // 统计生产环境的项目数量
    const countResult = await sql`SELECT COUNT(*) FROM projects`;
    console.log(`生产环境中共有 ${countResult.rows[0].count} 个项目`);
    
    // 获取所有项目
    const allProjects = await sql`
      SELECT * FROM projects 
      ORDER BY created_at DESC
    `;
    
    console.log(`找到 ${allProjects.rows.length} 个项目`);
    
    // 统计外部项目
    const externalProjects = allProjects.rows.filter(p => p.external_url && p.external_url !== '');
    console.log(`其中包含 ${externalProjects.length} 个外部项目:`);
    
    externalProjects.forEach(project => {
      console.log(`- [${project.id}] ${project.title} (${project.external_url})`);
    });
    
    return allProjects.rows;
  } catch (error) {
    console.error('从生产环境获取项目失败:', error);
    return [];
  } finally {
    // 恢复原始数据库URL
    process.env.POSTGRES_URL = originalDatabaseUrl;
  }
}

// 清空预发布环境的数据并恢复
async function restoreToPreview(projects) {
  if (projects.length === 0) {
    console.log('没有项目需要恢复到预发布环境');
    return;
  }
  
  console.log(`\n准备将 ${projects.length} 个项目从生产环境恢复到预发布环境(preview)...`);
  
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
      return;
    }
    
    // 确认清空操作
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    const confirm = await new Promise((resolve) => {
      rl.question('警告: 此操作将清空预发布环境中的所有现有项目! 是否继续? (y/n): ', (answer) => {
        rl.close();
        resolve(answer.trim().toLowerCase() === 'y');
      });
    });
    
    if (!confirm) {
      console.log('操作已取消');
      return;
    }
    
    // 清空预发布环境中的项目表
    console.log('清空预发布环境中的现有项目...');
    await sql`TRUNCATE TABLE projects`;
    console.log('预发布环境项目表已清空');
    
    // 计数器
    let importedCount = 0;
    
    for (const project of projects) {
      try {
        console.log(`\n导入项目: [${project.id}] ${project.title}`);
        
        // 处理JSON字段，确保正确格式化
        let filesJson = null;
        if (project.files) {
          if (typeof project.files === 'string') {
            try {
              filesJson = JSON.stringify(JSON.parse(project.files));
              console.log('  - files字段JSON解析成功');
            } catch (e) {
              console.warn(`  - 无法解析项目文件JSON: ${e.message}`);
              filesJson = '{}';
            }
          } else {
            filesJson = JSON.stringify(project.files);
            console.log('  - files字段已是对象格式，转换为JSON字符串');
          }
        } else {
          filesJson = '{}';
          console.log('  - files字段为空，使用空对象');
        }
        
        // 使用原始的main_file值
        const mainFileValue = project.main_file || '';
        
        // 获取当前时间
        const currentDate = new Date().toISOString();
        
        // 导入项目到预发布环境
        await sql`
          INSERT INTO projects (
            id, title, description, files, main_file, is_public, 
            views, likes, external_url, external_embed, external_author, type,
            created_at, updated_at
          ) VALUES (
            ${project.id}, 
            ${project.title}, 
            ${project.description}, 
            ${filesJson}::jsonb, 
            ${mainFileValue}, 
            ${project.is_public}, 
            ${project.views || 0}, 
            ${project.likes || 0}, 
            ${project.external_url}, 
            ${project.external_embed}, 
            ${project.external_author}, 
            ${project.type || 'external'},
            ${project.created_at || currentDate}, 
            ${project.updated_at || currentDate}
          )
        `;
        
        console.log(`  ✓ 成功导入项目: ${project.title}`);
        importedCount++;
      } catch (error) {
        console.error(`  ✗ 导入项目 ${project.title} 失败:`, error);
      }
    }
    
    // 重新统计预发布环境的项目数
    const finalCount = await sql`SELECT COUNT(*) FROM projects`;
    
    console.log(`\n恢复完成! 成功导入 ${importedCount} 个项目到预发布环境`);
    console.log(`预发布环境现在共有 ${finalCount.rows[0].count} 个项目`);
    
  } catch (error) {
    console.error('恢复到预发布环境过程中出错:', error);
  } finally {
    // 恢复原始数据库URL
    process.env.POSTGRES_URL = originalDatabaseUrl;
  }
}

// 主函数
async function restorePreviewDatabase() {
  try {
    await setupEnvironment();
    const projects = await getProductionProjects();
    await restoreToPreview(projects);
    console.log('\n恢复完成! 数据已经从生产环境恢复到预发布环境。');
  } catch (error) {
    console.error('恢复过程发生错误:', error);
  }
}

restorePreviewDatabase(); 