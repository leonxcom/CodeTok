import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    console.log('获取所有项目列表');
    
    // 使用SQL直接查询获取所有项目
    const { rows } = await sql`
      SELECT * FROM projects 
      ORDER BY created_at DESC
    `;
    
    console.log(`找到 ${rows.length} 个项目`);
    
    return NextResponse.json(rows);
    
  } catch (error) {
    console.error('获取项目列表失败:', error);
    return NextResponse.json(
      { error: 'Failed to fetch projects', details: error instanceof Error ? error.message : 'Unknown error' }, 
      { status: 500 }
    );
  }
} 