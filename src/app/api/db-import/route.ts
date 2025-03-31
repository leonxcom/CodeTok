import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import { join } from 'path';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    console.log('开始导入数据...');

    // 读取导出的数据
    const dataPath = join(process.cwd(), 'src/db/data/projects.json');
    const projectsData = JSON.parse(readFileSync(dataPath, 'utf-8'));

    console.log(`读取到 ${projectsData.length} 个项目数据`);

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