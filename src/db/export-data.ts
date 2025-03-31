import { sql } from '@vercel/postgres';
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

async function exportData() {
  try {
    const environment = process.env.NODE_ENV || 'development';
    console.log(`开始导出${environment}环境数据...`);

    // 查询所有项目
    const projects = await sql`
      SELECT * FROM projects 
      ORDER BY created_at DESC
    `;

    // 将数据保存到文件
    const exportPath = path.join(process.cwd(), 'src/db/data');
    await fs.mkdir(exportPath, { recursive: true });
    
    const exportFile = path.join(exportPath, `projects-${environment}.json`);
    await fs.writeFile(
      exportFile,
      JSON.stringify(projects.rows, null, 2),
      'utf-8'
    );

    console.log(`成功导出 ${projects.rowCount} 个项目到 ${exportFile}`);
    return projects.rows;

  } catch (error) {
    console.error('导出数据失败:', error);
    throw error;
  }
}

// 执行导出
exportData()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 