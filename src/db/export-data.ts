import { sql } from '@vercel/postgres';
import * as fs from 'fs/promises';
import * as path from 'path';
import dotenv from 'dotenv';

// 加载开发环境变量
dotenv.config({ path: '.env.local' });

async function exportData() {
  try {
    console.log('开始导出开发环境数据...');

    // 查询所有项目
    const projects = await sql`
      SELECT * FROM projects 
      ORDER BY created_at DESC
    `;

    // 将数据保存到文件
    const exportPath = path.join(process.cwd(), 'src/db/data');
    await fs.mkdir(exportPath, { recursive: true });
    
    const exportFile = path.join(exportPath, 'projects.json');
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