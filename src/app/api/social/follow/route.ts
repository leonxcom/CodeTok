import { NextRequest, NextResponse } from 'next/server';
import { followUser, checkIfFollowing } from '@/services/social-service';
import { auth } from '@/lib/auth';

// POST /api/social/follow - 关注或取消关注用户
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
    const { targetUserId } = await request.json();
    
    if (!targetUserId) {
      return NextResponse.json(
        { error: '目标用户ID不能为空' },
        { status: 400 }
      );
    }
    
    // 不能关注自己
    if (session.user.id === targetUserId) {
      return NextResponse.json(
        { error: '不能关注自己' },
        { status: 400 }
      );
    }
    
    // 执行关注/取消关注操作
    const isFollowing = await followUser(session.user.id, targetUserId);
    
    return NextResponse.json({
      success: true,
      isFollowing
    });
  } catch (error) {
    console.error('关注操作失败:', error);
    return NextResponse.json(
      { error: '处理请求时出错' },
      { status: 500 }
    );
  }
}

// GET /api/social/follow?targetUserId=xxx - 检查关注状态
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
        { isFollowing: false },
        { status: 200 }
      );
    }
    
    // 获取目标用户ID
    const { searchParams } = new URL(request.url);
    const targetUserId = searchParams.get('targetUserId');
    
    if (!targetUserId) {
      return NextResponse.json(
        { error: '目标用户ID不能为空' },
        { status: 400 }
      );
    }
    
    // 自己不能关注自己
    if (session.user.id === targetUserId) {
      return NextResponse.json(
        { isFollowing: false },
        { status: 200 }
      );
    }
    
    // 检查关注状态
    const isFollowing = await checkIfFollowing(session.user.id, targetUserId);
    
    return NextResponse.json({
      isFollowing
    });
  } catch (error) {
    console.error('检查关注状态失败:', error);
    return NextResponse.json(
      { error: '处理请求时出错' },
      { status: 500 }
    );
  }
} 