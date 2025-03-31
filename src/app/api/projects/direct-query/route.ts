import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // 从URL获取项目ID
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'Project ID is required' }, { status: 400 });
    }
    
    console.log('使用直接查询获取项目，ID:', id);
    
    // 执行简单查询
    const result = await sql`SELECT * FROM projects WHERE id = ${id}`;
    
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }
    
    return NextResponse.json({
      success: true,
      project: result.rows[0]
    });
    
  } catch (error) {
    console.error('查询失败:', error);
    return NextResponse.json(
      { error: 'Query failed', details: error instanceof Error ? error.message : 'Unknown error' }, 
      { status: 500 }
    );
  }
} 