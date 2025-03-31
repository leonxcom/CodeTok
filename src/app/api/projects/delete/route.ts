import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function DELETE(request: Request) {
  try {
    // 删除所有项目
    await sql`DELETE FROM projects;`;

    return NextResponse.json({
      status: 'success',
      message: '所有项目已删除'
    });

  } catch (error) {
    console.error('删除失败:', error);
    return NextResponse.json(
      { 
        status: 'error',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 