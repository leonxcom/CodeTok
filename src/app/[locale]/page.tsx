import { redirect } from 'next/navigation';
import { sql } from '@vercel/postgres';
import { Project } from '@/db/schema';
import { generateProjectId } from '@/lib/storage';

export const dynamic = 'force-dynamic';

/**
 * 首页组件 - 在这里始终重定向到一个随机项目
 */
export default async function IndexPage({
  params: { locale }
}: {
  params: { locale: string };
}) {
  try {
    // 尝试从数据库中获取公开项目列表
    const result = await sql<Project>`
      SELECT id FROM projects 
      WHERE is_public = true 
      ORDER BY created_at DESC
    `;
    
    console.log(`找到 ${result.rowCount || 0} 个项目`);
    
    // 如果有项目，随机选择一个重定向
    if (result.rowCount && result.rowCount > 0) {
      // 从数据库结果中获取所有项目ID
      const projectIds = result.rows.map(project => project.id);
      
      // 随机选择一个项目ID
      const randomIndex = Math.floor(Math.random() * projectIds.length);
      const randomProjectId = projectIds[randomIndex];
      
      console.log(`重定向到随机项目: ${randomProjectId}`);
      
      // 重定向到随机项目
      redirect(`/${locale}/project/${randomProjectId}`);
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
      
      console.log(`创建了示例项目，ID: ${projectId}，重定向中...`);
      
      // 重定向到新创建的示例项目
      redirect(`/${locale}/project/${projectId}`);
    }
  } catch (error) {
    // 如果发生错误，记录错误并重定向到一个硬编码的备用项目
    console.error('重定向失败:', error);
    
    // 在发生错误的情况下，尝试获取任何可用的项目ID作为备用
    try {
      const fallbackResult = await sql<{ id: string }>`
        SELECT id FROM projects LIMIT 1
      `;
      
      if (fallbackResult.rowCount && fallbackResult.rowCount > 0) {
        const fallbackId = fallbackResult.rows[0].id;
        console.log(`使用备用项目: ${fallbackId}`);
        redirect(`/${locale}/project/${fallbackId}`);
      }
    } catch {
      // 如果连备用项目都获取失败，重定向到上传页面
      console.log('无法获取任何项目，重定向到上传页面');
      redirect(`/${locale}/upload`);
    }
  }
} 