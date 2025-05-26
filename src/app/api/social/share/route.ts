import { NextRequest, NextResponse } from 'next/server';
import { recordShare } from '@/services/social-service';
import { auth } from '@/lib/auth';

// POST /api/social/share - 记录分享操作
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
    const { projectId, platform } = await request.json();
    
    if (!projectId || !platform) {
      return NextResponse.json(
        { error: '项目ID和分享平台不能为空' },
        { status: 400 }
      );
    }
    
    // 记录分享操作
    await recordShare(session.user.id, projectId, platform);
    
    return NextResponse.json({
      success: true
    });
  } catch (error) {
    console.error('记录分享操作失败:', error);
    return NextResponse.json(
      { error: '处理请求时出错' },
      { status: 500 }
    );
  }
} 