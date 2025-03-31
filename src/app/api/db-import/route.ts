import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    console.log('开始导入数据...');

    // 从请求体获取数据
    const body = await request.text();
    console.log('接收到的请求体:', body);

    if (!body) {
      throw new Error('请求体为空');
    }

    const projectsData = JSON.parse(body);
    console.log(`接收到 ${projectsData.length} 个项目数据`);

    // 导入每个项目
    for (const project of projectsData) {
      await sql`
        INSERT INTO projects (
          id, title, description, files, main_file,
          is_public, views, likes, created_at, updated_at,
          external_url, external_embed, external_author, type
        ) VALUES (
          ${project.id},
          ${project.title},
          ${project.description},
          ${JSON.stringify(project.files)}::jsonb,
          ${project.main_file},
          ${project.is_public},
          ${project.views},
          ${project.likes},
          ${project.created_at},
          ${project.updated_at},
          ${project.external_url},
          ${project.external_embed},
          ${project.external_author},
          ${project.type}
        )
        ON CONFLICT (id) DO UPDATE SET
          title = EXCLUDED.title,
          description = EXCLUDED.description,
          files = EXCLUDED.files,
          main_file = EXCLUDED.main_file,
          is_public = EXCLUDED.is_public,
          views = EXCLUDED.views,
          likes = EXCLUDED.likes,
          updated_at = EXCLUDED.updated_at,
          external_url = EXCLUDED.external_url,
          external_embed = EXCLUDED.external_embed,
          external_author = EXCLUDED.external_author,
          type = EXCLUDED.type
      `;
      console.log(`导入项目: ${project.id}`);
    }

    // 验证导入
    const importedCount = await sql`SELECT COUNT(*) FROM projects`;

    return NextResponse.json({
      status: 'success',
      message: '数据导入完成',
      importedCount: importedCount.rows[0].count,
      projects: projectsData.length
    });

  } catch (error) {
    console.error('导入失败:', error);
    return NextResponse.json(
      { 
        status: 'error',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 