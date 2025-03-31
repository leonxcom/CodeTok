import { redirect } from 'next/navigation';
import { sql } from '@vercel/postgres';
import { Project } from '@/db/schema';
import { generateProjectId } from '@/lib/storage';

export const dynamic = 'force-dynamic';

/**
 * 首页组件 - 在这里始终重定向到一个随机项目
 */
export default async function IndexPage({
  params
}: {
  params: { locale: string };
}) {
  // 安全获取locale参数 - 需要await解析动态参数
  const resolvedParams = await params;
  const locale = resolvedParams.locale;
  let redirectUrl = `/${locale}/upload`;

  // 首先尝试获取所有可用的项目
  try {
    // 尝试从数据库中获取公开项目列表
    const result = await sql<Project>`
      SELECT id FROM projects 
      WHERE is_public = true 
      ORDER BY created_at DESC
    `;
    
    console.log(`找到 ${result.rowCount || 0} 个项目`);
    
    // 如果有项目，随机选择一个
    if (result.rowCount && result.rowCount > 0) {
      // 从数据库结果中获取所有项目ID
      const projectIds = result.rows.map(project => project.id);
      
      // 随机选择一个项目ID
      const randomIndex = Math.floor(Math.random() * projectIds.length);
      const randomProjectId = projectIds[randomIndex];
      
      console.log(`找到随机项目: ${randomProjectId}`);
      redirectUrl = `/${locale}/project/${randomProjectId}`;
    } else {
      // 如果没有找到项目，则创建一个示例项目
      console.log('未找到项目，创建示例项目');
      
      // 生成唯一项目ID
      const projectId = generateProjectId();
      
      // 创建一个示例外部项目
      const exampleProject = {
        id: projectId,
        title: 'ThreeJS 3D Demo',
        description: 'Interactive 3D scene built with Three.js',
        files: JSON.stringify([
          {
            url: 'https://threejs-demo.vercel.app',
            pathname: 'index.html',
            filename: 'index.html',
            size: 0,
            type: 'text/html',
            isEntryPoint: true
          }
        ]),
        main_file: 'index.html',
        is_public: true,
        external_url: 'https://threejs-demo.vercel.app',
        external_embed: true,
        external_author: 'ThreeJS Team',
        type: 'external'
      };
      
      // 插入示例项目到数据库
      await sql`
        INSERT INTO projects (
          id, title, description, files, main_file, is_public, 
          external_url, external_embed, external_author, type
        ) 
        VALUES (
          ${exampleProject.id}, 
          ${exampleProject.title}, 
          ${exampleProject.description}, 
          ${exampleProject.files}::jsonb, 
          ${exampleProject.main_file}, 
          ${exampleProject.is_public},
          ${exampleProject.external_url},
          ${exampleProject.external_embed},
          ${exampleProject.external_author},
          ${exampleProject.type}
        )
      `;
      
      console.log(`创建了示例项目，ID: ${projectId}`);
      redirectUrl = `/${locale}/project/${projectId}`;
    }
  } catch (error) {
    // 如果发生错误，记录错误并尝试获取任何可用的项目作为备用
    console.error('获取项目失败:', error);
    
    try {
      const fallbackResult = await sql<{ id: string }>`
        SELECT id FROM projects LIMIT 1
      `;
      
      if (fallbackResult.rowCount && fallbackResult.rowCount > 0) {
        const fallbackId = fallbackResult.rows[0].id;
        console.log(`使用备用项目: ${fallbackId}`);
        redirectUrl = `/${locale}/project/${fallbackId}`;
      } else {
        console.log('无法获取任何项目，将重定向到上传页面');
      }
    } catch (fallbackError) {
      console.error('获取备用项目失败:', fallbackError);
      console.log('将重定向到上传页面');
    }
  }

  // 最后执行重定向，不在try-catch块中
  console.log(`执行重定向到: ${redirectUrl}`);
  redirect(redirectUrl);
} 