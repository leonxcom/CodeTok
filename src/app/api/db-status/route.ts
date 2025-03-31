import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // 1. 检查数据库连接
    const testConnection = await sql`SELECT version();`;
    const dbVersion = testConnection.rows[0].version;
    
    // 2. 列出所有表
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public';
    `;
    
    // 3. 检查 projects 表结构
    const columns = await sql`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'projects';
    `;
    
    // 4. 统计项目数量
    const projectCount = await sql`
      SELECT COUNT(*) as count FROM projects;
    `;
    
    // 5. 列出所有项目
    const projects = await sql`
      SELECT id, title, created_at, is_public 
      FROM projects 
      ORDER BY created_at DESC;
    `;
    
    // 检查 projects 表中的数据
    const projectsData = await sql`
      SELECT id, title, created_at, is_public
      FROM projects
      LIMIT 5;
    `;
    
    return NextResponse.json({
      status: 'connected',
      version: dbVersion,
      tables: tables.rows,
      projectsTable: {
        columns: columns.rows,
        totalProjects: projectCount.rows[0].count,
        projects: projects.rows
      }
    });
    
  } catch (error) {
    console.error('Database check error:', error);
    return NextResponse.json(
      { 
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 