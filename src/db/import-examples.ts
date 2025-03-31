import { sql } from '@vercel/postgres';
import * as crypto from 'crypto';
import dotenv from 'dotenv';
import * as path from 'path';

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

// 生成项目ID
function generateProjectId(): string {
  const buffer = crypto.randomBytes(6);
  return buffer.toString('base64');
}

async function importExampleProjects() {
  try {
    // 加载环境变量
    loadEnv();
    
    const environment = process.env.NODE_ENV || 'development';
    console.log(`开始导入示例项目到${environment}环境...`);

    // 示例项目1: 角色示例项目
    const characterProject = {
      id: generateProjectId(),
      title: "3D角色第一人称模拟器",
      description: "一个3D角色动画模拟器，支持动作、表情和姿势的调整。通过简单的控制可以实现角色的各种动作演示。",
      files: JSON.stringify([
        {
          filename: "index.html",
          content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>3D角色第一人称模拟器</title>
  <style>
    body { margin: 0; overflow: hidden; }
    iframe { width: 100%; height: 100vh; border: none; }
  </style>
</head>
<body>
  <iframe src="https://character-sample-project.netlify.app/" allow="fullscreen"></iframe>
</body>
</html>`,
          isEntryPoint: true
        }
      ]),
      main_file: "index.html",
      is_public: true,
      views: 0,
      likes: 0,
      external_url: "https://character-sample-project.netlify.app/",
      external_embed: true,
      external_author: "VibeTok Team",
      type: "3d-character"
    };

    // 示例项目2: FPS示例项目
    const fpsProject = {
      id: generateProjectId(),
      title: "第一人称射击游戏演示",
      description: "一个基于WebGL的第一人称射击游戏演示，展示了基本的射击、移动和交互机制。使用WASD移动，鼠标瞄准和射击。",
      files: JSON.stringify([
        {
          filename: "index.html",
          content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>第一人称射击游戏演示</title>
  <style>
    body { margin: 0; overflow: hidden; }
    iframe { width: 100%; height: 100vh; border: none; }
  </style>
</head>
<body>
  <iframe src="https://fps-sample-project.netlify.app/" allow="fullscreen"></iframe>
</body>
</html>`,
          isEntryPoint: true
        }
      ]),
      main_file: "index.html",
      is_public: true,
      views: 0,
      likes: 0,
      external_url: "https://fps-sample-project.netlify.app/",
      external_embed: true,
      external_author: "VibeTok Team",
      type: "fps-game"
    };

    // 导入角色项目
    await sql`
      INSERT INTO projects (
        id, title, description, files, main_file,
        is_public, views, likes, external_url, external_embed, external_author, type
      ) VALUES (
        ${characterProject.id},
        ${characterProject.title},
        ${characterProject.description},
        ${characterProject.files}::jsonb,
        ${characterProject.main_file},
        ${characterProject.is_public},
        ${characterProject.views},
        ${characterProject.likes},
        ${characterProject.external_url},
        ${characterProject.external_embed},
        ${characterProject.external_author},
        ${characterProject.type}
      )
      ON CONFLICT (id) DO NOTHING;
    `;
    console.log(`导入角色项目成功，ID: ${characterProject.id}`);

    // 导入FPS项目
    await sql`
      INSERT INTO projects (
        id, title, description, files, main_file,
        is_public, views, likes, external_url, external_embed, external_author, type
      ) VALUES (
        ${fpsProject.id},
        ${fpsProject.title},
        ${fpsProject.description},
        ${fpsProject.files}::jsonb,
        ${fpsProject.main_file},
        ${fpsProject.is_public},
        ${fpsProject.views},
        ${fpsProject.likes},
        ${fpsProject.external_url},
        ${fpsProject.external_embed},
        ${fpsProject.external_author},
        ${fpsProject.type}
      )
      ON CONFLICT (id) DO NOTHING;
    `;
    console.log(`导入FPS项目成功，ID: ${fpsProject.id}`);

    // 验证导入
    const projects = await sql`SELECT * FROM projects ORDER BY created_at DESC`;
    console.log(`当前数据库中有 ${projects.rowCount} 个项目`);
    
    return projects.rows;
  } catch (error) {
    console.error('导入示例项目失败:', error);
    throw error;
  }
}

// 执行导入
importExampleProjects()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 