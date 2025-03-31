import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

/**
 * 获取数据库表结构
 */
export async function GET() {
  try {
    // 1. 检查数据库连接
    const testConnection = await sql`SELECT version();`;
    console.log('数据库连接成功:', testConnection.rows[0].version);

    // 2. 列出所有表
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public';
    `;
    console.log('数据库中的表:', tables.rows);

    // 3. 如果 projects 表存在，检查其结构
    const columns = await sql`
      SELECT column_name, data_type, column_default
      FROM information_schema.columns
      WHERE table_name = 'projects'
      ORDER BY ordinal_position;
    `;
    console.log('projects 表结构:', columns.rows);

    return NextResponse.json({
      status: 'success',
      version: testConnection.rows[0].version,
      tables: tables.rows,
      projectsColumns: columns.rows
    });

  } catch (error) {
    console.error('数据库检查错误:', error);
    return NextResponse.json(
      { 
        status: 'error',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 