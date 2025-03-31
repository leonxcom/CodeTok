import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

/**
 * 获取数据库表结构
 */
export async function GET() {
  try {
    const tableSchema = await sql`
      SELECT column_name, data_type, character_maximum_length
      FROM information_schema.columns
      WHERE table_name = 'projects'
      ORDER BY ordinal_position
    `;
    
    return NextResponse.json({
      columns: tableSchema.rows,
      count: tableSchema.rowCount
    });
  } catch (error: any) {
    console.error('Error fetching schema:', error);
    return NextResponse.json(
      { error: 'Failed to fetch database schema' },
      { status: 500 }
    );
  }
} 