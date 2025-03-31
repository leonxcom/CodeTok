import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // 1. 测试连接
    const testResult = await sql`SELECT version();`;
    console.log('数据库连接成功:', testResult.rows[0].version);

    // 2. 检查 projects 表是否存在
    const tableExists = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'projects'
      );
    `;
    console.log('projects 表是否存在:', tableExists.rows[0].exists);

    // 3. 如果表存在，获取项目数量
    let projectCount = 0;
    if (tableExists.rows[0].exists) {
      const countResult = await sql`SELECT COUNT(*) FROM projects;`;
      projectCount = parseInt(countResult.rows[0].count);
      console.log('项目数量:', projectCount);
    }

    return NextResponse.json({
      status: 'connected',
      postgres_version: testResult.rows[0].version,
      projects_table_exists: tableExists.rows[0].exists,
      project_count: projectCount
    });

  } catch (error) {
    console.error('PostgreSQL test error:', error);
    return NextResponse.json(
      { 
        status: 'error',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}