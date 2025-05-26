import { NextRequest, NextResponse } from 'next/server';
import { likeProject, checkIfLiked } from '@/services/social-service';
import { auth } from '@/lib/auth';
import { cookies } from 'next/headers';

// POST /api/social/like - 点赞或取消点赞项目
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
    
    // 执行点赞/取消点赞操作
    const isLiked = await likeProject(session.user.id, projectId);
    
    return NextResponse.json({
      success: true,
      isLiked
    });
  } catch (error) {
    console.error('点赞操作失败:', error);
    return NextResponse.json(
      { error: '处理请求时出错' },
      { status: 500 }
    );
  }
}

// GET /api/social/like?projectId=xxx - 检查项目点赞状态
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
        { isLiked: false },
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
    
    // 检查点赞状态
    const isLiked = await checkIfLiked(session.user.id, projectId);
    
    return NextResponse.json({
      isLiked
    });
  } catch (error) {
    console.error('检查点赞状态失败:', error);
    return NextResponse.json(
      { error: '处理请求时出错' },
      { status: 500 }
    );
  }
} 