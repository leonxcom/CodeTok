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

    // 5. 验证迁移
    const projectCount = await sql`SELECT COUNT(*) FROM projects`;

    // 6. 确保没有任何数据
    await sql`TRUNCATE TABLE projects;`;
    console.log('清除所有数据');

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