import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    console.log('开始数据库迁移...');

    // 1. 创建 projects 表
    await sql`
      CREATE TABLE IF NOT EXISTS projects (
        project_id VARCHAR(255) PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        files JSONB NOT NULL,
        main_file VARCHAR(255) NOT NULL,
        is_public BOOLEAN DEFAULT true,
        views INTEGER DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        external_url TEXT,
        external_embed BOOLEAN DEFAULT false,
        external_author VARCHAR(255)
      );
    `;
    console.log('projects 表创建成功');

    // 2. 插入示例项目
    const exampleProject = {
      project_id: 'CAbUiIo=',
      title: '示例项目',
      description: '这是一个示例项目',
      files: JSON.stringify([{
        filename: 'index.html',
        content: '<h1>Hello World</h1>',
        isEntryPoint: true
      }]),
      main_file: 'index.html',
      is_public: true,
      external_embed: false
    };

    await sql`
      INSERT INTO projects (
        project_id, title, description, files, main_file, 
        is_public, external_embed
      ) 
      VALUES (
        ${exampleProject.project_id},
        ${exampleProject.title},
        ${exampleProject.description},
        ${exampleProject.files}::jsonb,
        ${exampleProject.main_file},
        ${exampleProject.is_public},
        ${exampleProject.external_embed}
      )
      ON CONFLICT (project_id) DO NOTHING;
    `;
    console.log('示例项目创建成功');

    // 3. 验证迁移
    const projectCount = await sql`SELECT COUNT(*) FROM projects;`;
    const exampleProjectCheck = await sql`
      SELECT * FROM projects WHERE project_id = ${exampleProject.project_id};
    `;

    return NextResponse.json({
      status: 'success',
      message: '数据库迁移完成',
      projectCount: projectCount.rows[0].count,
      exampleProject: exampleProjectCheck.rows[0]
    });

  } catch (error) {
    console.error('迁移失败:', error);
    return NextResponse.json(
      { 
        status: 'error',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 