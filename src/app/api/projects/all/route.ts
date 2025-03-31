import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    console.log('获取所有项目（包括非公开项目）...');

    // 查询所有项目，按创建时间倒序排列
    const projects = await sql`
      SELECT * FROM projects 
      ORDER BY created_at DESC
    `;

    // 转换JSON字段并格式化响应
    const formattedProjects = projects.rows.map(project => ({
      id: project.id,
      title: project.title,
      description: project.description,
      files: project.files,
      mainFile: project.main_file,
      isPublic: project.is_public,
      views: project.views,
      likes: project.likes,
      externalUrl: project.external_url,
      externalEmbed: project.external_embed,
      externalAuthor: project.external_author,
      type: project.type,
      createdAt: project.created_at,
      updatedAt: project.updated_at
    }));

    return NextResponse.json(formattedProjects);
  } catch (error) {
    console.error('查询项目失败:', error);
    return NextResponse.json(
      { 
        status: 'error',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 