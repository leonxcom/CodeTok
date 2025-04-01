// 使用DrizzleORM进行数据库同步
// 提供更好的事务支持和数据一致性
require('dotenv').config({ path: '.env.local' });
const { drizzle } = require('drizzle-orm/postgres-js');
const { eq } = require('drizzle-orm');
const postgres = require('postgres');
const fs = require('fs');
const path = require('path');

// 项目ID列表
const projectIdsToSync = [
  'hv2MyfkE',  // Visual Origins
  'OUqkCPge',  // Fang Die Fliege
  'Kw6po9Rc',  // Red Panda Vibes
  'AuwigNZk',  // Find Asks
  'sCGsO5Qk',  // Secret Name Game
  'nrRjnASj'   // Summed Up AI
];

// 定义简化版项目表结构
// 注意：真正的DrizzleORM集成应该使用src/db/schema.ts中的完整定义
const schema = {
  projects: {
    id: { name: 'id' },
    title: { name: 'title' },
    description: { name: 'description' },
    files: { name: 'files' },
    main_file: { name: 'main_file' },
    is_public: { name: 'is_public' },
    views: { name: 'views' },
    likes: { name: 'likes' },
    external_url: { name: 'external_url' },
    external_embed: { name: 'external_embed' },
    external_author: { name: 'external_author' },
    type: { name: 'type' },
    created_at: { name: 'created_at' },
    updated_at: { name: 'updated_at' }
  }
};

// 获取项目数据
async function getProjectsFromPreview() {
  console.log('\n从预览环境获取项目数据...');
  
  try {
    // 使用postgres.js客户端连接到预览环境
    const previewUrl = process.env.POSTGRES_URL_PREVIEW;
    if (!previewUrl) {
      throw new Error('预览环境数据库URL未设置');
    }
    
    console.log(`连接到预览环境: ${previewUrl.substring(0, 30)}...`);
    const previewClient = postgres(previewUrl, { ssl: 'require' });
    const previewDb = drizzle(previewClient, { schema });
    
    // 测试连接
    const testResult = await previewClient`SELECT 1 as test`;
    if (testResult[0].test === 1) {
      console.log('预览环境连接成功');
    }
    
    // 获取预览环境中的项目数量
    const allProjects = await previewClient`SELECT COUNT(*) FROM projects`;
    console.log(`预览环境中共有 ${allProjects[0].count} 个项目`);
    
    // 收集要同步的项目数据
    const projects = [];
    
    for (const id of projectIdsToSync) {
      console.log(`查询项目ID: ${id}`);
      
      // 使用原生SQL查询而不是DrizzleORM的query builder
      // 因为我们使用的是简化的schema定义
      const result = await previewClient`
        SELECT * FROM projects WHERE id = ${id}
      `;
      
      if (result.length > 0) {
        console.log(`✓ 找到项目: "${result[0].title}" (${id})`);
        projects.push(result[0]);
      } else {
        console.log(`✗ 未找到项目: ${id}`);
      }
    }
    
    console.log(`\n成功找到 ${projects.length}/${projectIdsToSync.length} 个项目`);
    
    // 关闭连接
    await previewClient.end();
    
    return projects;
  } catch (error) {
    console.error('获取预览环境项目数据失败:', error);
    throw error;
  }
}

// 同步到生产环境
async function syncToProduction(projects) {
  console.log('\n开始同步到生产环境...');
  
  if (projects.length === 0) {
    console.log('没有项目需要同步');
    return { success: true, syncedCount: 0 };
  }
  
  try {
    // 连接到生产环境
    const productionUrl = process.env.POSTGRES_URL_PRODUCTION;
    if (!productionUrl) {
      throw new Error('生产环境数据库URL未设置');
    }
    
    console.log(`连接到生产环境: ${productionUrl.substring(0, 30)}...`);
    // 使用正确的事务标志创建客户端
    const productionClient = postgres(productionUrl, { 
      ssl: 'require',
      max: 10 // 允许更多连接
    });
    
    // 测试连接
    const testResult = await productionClient`SELECT 1 as test`;
    if (testResult[0].test === 1) {
      console.log('生产环境连接成功');
    }
    
    // 获取生产环境中的项目数量
    const beforeCount = await productionClient`SELECT COUNT(*) FROM projects`;
    console.log(`同步前生产环境有 ${beforeCount[0].count} 个项目`);
    
    // 使用postgres.js的事务API
    console.log('\n开始事务处理...');
    
    // 使用正确的事务API
    await productionClient.begin(async sql => {
      console.log('事务开始');
      
      for (const project of projects) {
        // 检查项目是否已存在
        const existingProject = await sql`
          SELECT id FROM projects WHERE id = ${project.id}
        `;
        
        if (existingProject.length > 0) {
          console.log(`删除已存在的项目: ${project.id}`);
          await sql`DELETE FROM projects WHERE id = ${project.id}`;
        }
        
        // 处理files字段
        let filesValue = project.files;
        if (typeof filesValue === 'string') {
          try {
            filesValue = JSON.parse(filesValue);
          } catch (e) {
            console.warn(`无法解析files字段的JSON: ${e.message}`);
            filesValue = [];
          }
        }
        
        // 插入项目
        console.log(`插入项目: ${project.title} (${project.id})`);
        
        await sql`
          INSERT INTO projects (
            id, title, description, files, main_file, 
            is_public, views, likes, external_url, external_embed, 
            external_author, type, created_at, updated_at
          ) VALUES (
            ${project.id},
            ${project.title},
            ${project.description || ''},
            ${JSON.stringify(filesValue)}::jsonb,
            ${project.main_file || 'index.html'},
            ${project.is_public === false ? false : true},
            ${project.views || 0},
            ${project.likes || 0},
            ${project.external_url || ''},
            ${project.external_embed === true ? true : false},
            ${project.external_author || 'CodeTok'},
            ${project.type || 'external'},
            ${project.created_at || new Date().toISOString()},
            ${project.updated_at || new Date().toISOString()}
          )
        `;
      }
      
      console.log('所有项目已处理，事务将自动提交');
    });
    
    console.log('事务已成功提交');
    
    // 验证结果 - 在事务外部查询结果
    const afterCount = await productionClient`SELECT COUNT(*) FROM projects`;
    console.log(`\n同步后生产环境有 ${afterCount[0].count} 个项目`);
    
    // 验证特定项目
    console.log('\n验证同步结果:');
    let syncedCount = 0;
    
    for (const id of projectIdsToSync) {
      const result = await productionClient`
        SELECT id, title FROM projects WHERE id = ${id}
      `;
      
      if (result.length > 0) {
        console.log(`✓ 项目已同步: "${result[0].title}" (${id})`);
        syncedCount++;
      } else {
        console.log(`✗ 项目未同步: ${id}`);
      }
    }
    
    console.log(`\n验证结果: ${syncedCount}/${projectIdsToSync.length} 个项目已成功同步`);
    
    // 关闭连接
    await productionClient.end();
    
    return { success: true, syncedCount };
  } catch (error) {
    console.error('同步到生产环境失败:', error);
    return { success: false, error: error.message };
  }
}

// 导出同步结果到文件
async function saveResultToFile(result) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `sync-result-${timestamp}.json`;
  const filePath = path.join(__dirname, filename);
  
  const data = {
    timestamp: new Date().toISOString(),
    result,
    projectIds: projectIdsToSync
  };
  
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  console.log(`\n同步结果已保存到: ${filePath}`);
}

// 主函数
async function main() {
  console.log('====== 使用DrizzleORM进行数据库同步 ======');
  
  try {
    // 获取项目数据
    const projects = await getProjectsFromPreview();
    
    // 确认同步
    if (projects.length === 0) {
      console.log('没有可同步的项目，操作终止');
      process.exit(0);
    }
    
    const { stdin, stdout } = process;
    stdout.write(`\n是否将 ${projects.length} 个项目同步到生产环境? (y/n): `);
    
    // 设置输入模式
    stdin.setRawMode(true);
    stdin.resume();
    stdin.setEncoding('utf8');
    
    // 处理用户输入
    const answer = await new Promise(resolve => {
      stdin.once('data', (data) => {
        const key = data.toString().toLowerCase();
        stdout.write(key + '\n');
        stdin.setRawMode(false);
        stdin.pause();
        resolve(key);
      });
    });
    
    if (answer !== 'y') {
      console.log('操作已取消');
      process.exit(0);
    }
    
    // 执行同步
    const result = await syncToProduction(projects);
    
    // 保存结果
    await saveResultToFile(result);
    
    // 结束
    if (result.success) {
      console.log('====== 同步操作成功完成 ======');
    } else {
      console.error('====== 同步操作失败 ======');
      console.error(`错误: ${result.error}`);
      process.exit(1);
    }
  } catch (error) {
    console.error('操作过程中发生错误:', error);
    process.exit(1);
  }
}

// 执行主函数
main(); 