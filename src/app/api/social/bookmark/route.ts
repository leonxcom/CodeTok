import { NextRequest, NextResponse } from 'next/server';
import { favoriteProject, checkIfFavorited } from '@/services/social-service';
import { auth } from '@/lib/auth';

// POST /api/social/bookmark - 收藏或取消收藏项目
export async function POST(request: NextRequest) {
  try {
    // 验证用户登录状态
    const authRequest = new Request('http://localhost/api/auth/session', {
      headers: {
        cookie: request.headers.get('cookie') || '',
      },
    });
    
    const response = await auth.handler(authRequest);
    const session = await response.json();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: '您需要登录才能执行此操作' },
        { status: 401 }
      );
    }
    
    // 解析请求体
    const { projectId } = await request.json();
    
    if (!projectId) {
      return NextResponse.json(
        { error: '项目ID不能为空' },
        { status: 400 }
      );
    }
    
    // 执行收藏/取消收藏操作
    const isBookmarked = await favoriteProject(session.user.id, projectId);
    
    return NextResponse.json({
      success: true,
      isBookmarked
    });
  } catch (error) {
    console.error('收藏操作失败:', error);
    return NextResponse.json(
      { error: '处理请求时出错' },
      { status: 500 }
    );
  }
}

// GET /api/social/bookmark?projectId=xxx - 检查项目收藏状态
export async function GET(request: NextRequest) {
  try {
    // 验证用户登录状态
    const authRequest = new Request('http://localhost/api/auth/session', {
      headers: {
        cookie: request.headers.get('cookie') || '',
      },
    });
    
    const response = await auth.handler(authRequest);
    const session = await response.json();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { isBookmarked: false },
        { status: 200 }
      );
    }
    
    // 获取项目ID
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');
    
    if (!projectId) {
      return NextResponse.json(
        { error: '项目ID不能为空' },
        { status: 400 }
      );
    }
    
    // 检查收藏状态
    const isBookmarked = await checkIfFavorited(session.user.id, projectId);
    
    return NextResponse.json({
      isBookmarked
    });
  } catch (error) {
    console.error('检查收藏状态失败:', error);
    return NextResponse.json(
      { error: '处理请求时出错' },
      { status: 500 }
    );
  }
} 