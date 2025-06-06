import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { favorites, projects } from '@/db/schema-drizzle';
import { eq, desc } from 'drizzle-orm';
import { auth } from '@/lib/auth';

// GET /api/users/:id/bookmarked - 获取用户收藏的项目
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
    
    // 验证用户登录状态
    const authRequest = new Request('http://localhost/api/auth/session', {
      headers: {
        cookie: request.headers.get('cookie') || '',
      },
    });
    
    const response = await auth.handler(authRequest);
    const session = await response.json();
    
    // 只允许查看自己收藏的项目
    if (!session?.user?.id || session.user.id !== userId) {
      return NextResponse.json(
        { error: '没有权限查看' },
        { status: 403 }
      );
    }
    
    // 获取用户收藏的项目列表
    const bookmarkedProjects = await db.select({
      id: projects.id,
      title: projects.title,
      description: projects.description,
      main_file: projects.main_file,
      views: projects.views,
      likes: projects.likes,
      comments_count: projects.comments_count,
      created_at: projects.created_at,
      updated_at: projects.updated_at,
    })
    .from(favorites)
    .innerJoin(projects, eq(favorites.project_id, projects.id))
    .where(eq(favorites.user_id, userId))
    .orderBy(desc(favorites.created_at));
    
    return NextResponse.json({
      projects: bookmarkedProjects
    });
  } catch (error) {
    console.error('获取用户收藏项目失败:', error);
    return NextResponse.json(
      { error: '处理请求时出错' },
      { status: 500 }
    );
  }
} 