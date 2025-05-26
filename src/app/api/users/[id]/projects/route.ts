import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { projects, users } from '@/db/schema-drizzle';
import { eq, desc } from 'drizzle-orm';

// GET /api/users/:id/projects - 获取用户的项目
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = params.id;
    
    if (!userId) {
      return NextResponse.json(
        { error: '用户ID不能为空' },
        { status: 400 }
      );
    }
    
    // 获取项目列表，按创建时间倒序排列
    const userProjects = await db.query.projects.findMany({
      where: eq(projects.user_id, userId),
      orderBy: [desc(projects.created_at)],
      columns: {
        id: true,
        title: true,
        description: true,
        main_file: true,
        views: true,
        likes: true,
        comments_count: true,
        created_at: true,
        updated_at: true,
      },
    });
    
    return NextResponse.json({
      projects: userProjects
    });
  } catch (error) {
    console.error('获取用户项目失败:', error);
    return NextResponse.json(
      { error: '处理请求时出错' },
      { status: 500 }
    );
  }
} 