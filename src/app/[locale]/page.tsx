'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useParams } from 'next/navigation'
import { Locale } from '../../../i18n/config'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'
import { sql } from '@vercel/postgres'

export const dynamic = 'force-dynamic'

export default async function IndexPage({
  params
}: {
  params: { locale: Locale }
}) {
  // 正确处理params对象
  const resolvedParams = await params;
  const locale = resolvedParams.locale;
  console.log('首页重定向 - 开始执行，区域设置:', locale)

  try {
    // 获取所有公开项目
    const allProjects = await sql`
      SELECT id FROM projects
      WHERE is_public = true
      ORDER BY created_at DESC
    `;

    if (allProjects.rows.length > 0) {
      // 随机选择一个项目
      const randomIndex = Math.floor(Math.random() * allProjects.rows.length);
      const randomProjectId = allProjects.rows[randomIndex].id;
      
      // 重定向到随机项目
      const redirectUrl = `/${locale}/project/${randomProjectId}`;
      console.log('随机重定向到项目:', redirectUrl);
      
      redirect(redirectUrl);
    } else {
      // 如果没有项目，则创建一个固定的示例项目
      console.log('数据库中无项目，创建示例项目');
      
      // 插入示例项目
      const exampleProject = await sql`
        INSERT INTO projects (
          id, title, description, files, main_file, is_public, 
          external_url, external_embed, external_author, type
        )
        VALUES (
          'example-project', 
          'Example Project', 
          'A demonstration project for VibeTok',
          '[{"pathname":"index.html","url":"https://example.com/demo.html"}]'::jsonb, 
          'index.html', 
          true, 
          'https://example.com', 
          true, 
          'VibeTok Demo', 
          'demo'
        )
        ON CONFLICT (id) DO NOTHING
        RETURNING id
      `;
      
      // 重定向到示例项目或第一个可用项目
      const projectId = exampleProject.rows.length > 0 
        ? exampleProject.rows[0].id 
        : 'example-project';
        
      const redirectUrl = `/${locale}/project/${projectId}`;
      console.log('重定向到示例项目:', redirectUrl);
      
      redirect(redirectUrl);
    }
  } catch (error) {
    console.error('数据库查询错误:', error);
    
    // 即使出错也重定向到一个固定ID的项目
    // 注意：这个ID应该存在于数据库中，否则会导致404
    const fallbackProjectId = 'CAbUiIo=';
    console.log('出错，重定向到备用项目:', fallbackProjectId);
    
    redirect(`/${locale}/project/${fallbackProjectId}`);
  }
}
