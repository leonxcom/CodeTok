import * as fs from 'fs/promises';
import * as path from 'path';
import dotenv from 'dotenv';

// 加载环境变量
function loadEnv() {
  const environment = process.env.NODE_ENV || 'development';
  console.log(`当前环境: ${environment}`);
  
  if (environment === 'production') {
    dotenv.config({ path: path.resolve(process.cwd(), '.env.production') });
    console.log('已加载生产环境配置');
  } else {
    dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
    console.log('已加载开发环境配置');
  }
}

// 执行前加载环境变量
loadEnv();

// 确定源环境和目标环境
const sourceEnv = process.argv[2] || 'development';
const targetEnv = process.env.NODE_ENV || 'development';

async function importData() {
  try {
    console.log(`开始将 ${sourceEnv} 环境的数据导入到 ${targetEnv} 环境...`);

    // 读取导出的数据
    const dataPath = path.join(process.cwd(), `src/db/data/projects-${sourceEnv}.json`);
    console.log(`从文件读取数据: ${dataPath}`);
    
    const projectsData = JSON.parse(await fs.readFile(dataPath, 'utf-8'));
    console.log(`读取到 ${projectsData.length} 个项目数据`);

    // 确定目标URL
    let targetUrl = 'http://localhost:3000/api/db-import';
    if (targetEnv === 'production') {
      targetUrl = 'https://codetok.vercel.app/api/db-import';
    }
    console.log(`导入数据到: ${targetUrl}`);

    // 发送数据到导入 API
    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(projectsData),
    });

    const result = await response.json();
    console.log('导入结果:', result);

    if (result.status === 'success') {
      console.log('数据导入成功！');
    } else {
      console.error('数据导入失败:', result.message);
    }

  } catch (error) {
    console.error('导入数据失败:', error);
    throw error;
  }
}

// 执行导入
importData()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 