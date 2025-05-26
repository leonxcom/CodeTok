import { NextResponse } from 'next/server';
import { sql } from '@/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // 检查环境变量
    const envStatus = {
      NODE_ENV: process.env.NODE_ENV,
      POSTGRES_URL: process.env.POSTGRES_URL ? '已设置' : '未设置',
      DATABASE_URL: process.env.DATABASE_URL ? '已设置' : '未设置',
      VERCEL: process.env.VERCEL ? '是' : '否',
      VERCEL_ENV: process.env.VERCEL_ENV || '未设置',
    };

    // 测试数据库连接
    let dbConnection = '未知';
    let projectCount = 0;
    let sampleProjects: any[] = [];
    
    try {
      // 测试简单查询
      const testResult = await sql`SELECT NOW() as current_time`;
      dbConnection = '连接成功';
      
      // 获取项目数量
      const countResult = await sql`SELECT COUNT(*) as count FROM projects WHERE is_public = true`;
      projectCount = parseInt(countResult.rows[0].count);
      
      // 获取前3个项目作为示例
      const projectsResult = await sql`
        SELECT id, title, external_url, views, created_at 
        FROM projects 
        WHERE is_public = true 
        ORDER BY created_at DESC 
        LIMIT 3
      `;
      sampleProjects = projectsResult.rows;
      
    } catch (dbError: any) {
      dbConnection = `连接失败: ${dbError.message}`;
    }

    return NextResponse.json({
      status: 'ok',
      environment: envStatus,
      database: {
        connection: dbConnection,
        projectCount,
        sampleProjects,
      },
      timestamp: new Date().toISOString(),
    });
    
  } catch (error: any) {
    return NextResponse.json({
      status: 'error',
      error: error.message,
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
} 