import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    console.log('开始数据库迁移...');

    // 1. 删除外键约束
    await sql`
      DO $$ 
      DECLARE
        r RECORD;
      BEGIN
        FOR r IN (SELECT tc.table_schema, tc.table_name, kcu.column_name, ccu.table_name AS foreign_table_name, ccu.column_name AS foreign_column_name
                 FROM information_schema.table_constraints tc
                 JOIN information_schema.key_column_usage kcu ON tc.constraint_name = kcu.constraint_name
                 JOIN information_schema.constraint_column_usage ccu ON ccu.constraint_name = tc.constraint_name
                 WHERE tc.constraint_type = 'FOREIGN KEY')
        LOOP
          EXECUTE format('ALTER TABLE %I.%I DROP CONSTRAINT %I', r.table_schema, r.table_name, r.table_name || '_' || r.column_name || '_fkey');
        END LOOP;
      END $$;
    `;
    console.log('外键约束已删除');

    // 2. 删除依赖表（如果存在）
    await sql`DROP TABLE IF EXISTS favorites;`;
    await sql`DROP TABLE IF EXISTS users;`;
    console.log('依赖表已删除');

    // 3. 删除旧表（如果存在）
    await sql`DROP TABLE IF EXISTS projects;`;
    console.log('旧表已删除');

    // 4. 创建 projects 表
    await sql`
      CREATE TABLE projects (
        id VARCHAR(255) PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        files JSONB NOT NULL,
        main_file TEXT NOT NULL,
        is_public BOOLEAN DEFAULT true,
        views INTEGER DEFAULT 0,
        likes INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        external_url TEXT,
        external_embed BOOLEAN DEFAULT false,
        external_author TEXT,
        type TEXT
      );
    `;
    console.log('projects 表创建成功');

    // 5. 插入示例项目
    await sql`
      INSERT INTO projects (
        id, title, description, files, main_file, is_public, 
        external_url, external_embed, external_author, type
      )
      VALUES (
        'BgCJR1nu', 
        'First-Person Shooter Game Demo', 
        'A basic first-person shooter game demo with movement and shooting mechanics',
        '[{"pathname":"index.html","url":"https://firebasestorage.googleapis.com/v0/b/firescript-577a2.appspot.com/o/imgs%2Fapp%2FJavaScriptSplash%2F4w27Zlllhu.html?alt=media&token=0ff1b855-644c-4a8b-b749-65e944ddb19a"}]'::jsonb, 
        'index.html', 
        true, 
        'https://threejs-fps.vercel.app/', 
        true, 
        'ThreeJS Demo', 
        'game'
      )
      ON CONFLICT (id) DO NOTHING;
    `;

    // 插入第二个示例项目
    await sql`
      INSERT INTO projects (
        id, title, description, files, main_file, is_public, 
        external_url, external_embed, external_author, type
      )
      VALUES (
        'CAbUiIo=', 
        '3D Character Simulator', 
        'Interactive 3D character with customizable appearance and animations',
        '[{"pathname":"index.html","url":"https://firebasestorage.googleapis.com/v0/b/firescript-577a2.appspot.com/o/imgs%2Fapp%2FJavaScriptSplash%2FMwh_2_8CPc.html?alt=media&token=93e91cee-fcec-4e26-824c-f61fd9ddc0c1"}]'::jsonb, 
        'index.html', 
        true, 
        'https://threejs-metaverse.vercel.app/', 
        true, 
        'Meta Character', 
        'character'
      )
      ON CONFLICT (id) DO NOTHING;
    `;
    console.log('示例项目已添加');

    // 6. 验证迁移
    const projectCount = await sql`SELECT COUNT(*) FROM projects`;

    console.log(`当前有 ${projectCount.rows[0].count} 个项目`);

    // 获取插入的项目
    const project = await sql`SELECT * FROM projects WHERE id = 'BgCJR1nu'`;
    console.log('示例项目:', project.rows.length > 0 ? '已存在' : '不存在');

    return NextResponse.json({
      status: 'success',
      message: '数据库迁移完成',
      projectCount: projectCount.rows[0].count
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