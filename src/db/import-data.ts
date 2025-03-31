import * as fs from 'fs/promises';
import * as path from 'path';

async function importData() {
  try {
    console.log('开始导入数据到生产环境...');

    // 读取导出的数据
    const dataPath = path.join(process.cwd(), 'src/db/data/projects.json');
    const projectsData = JSON.parse(await fs.readFile(dataPath, 'utf-8'));

    console.log(`读取到 ${projectsData.length} 个项目数据`);

    // 发送数据到导入 API
    const response = await fetch('https://vibetok.vercel.app/api/db-import', {
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