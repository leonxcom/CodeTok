import { NextRequest, NextResponse } from 'next/server';
import { getUserNotifications, markNotificationAsRead, markAllNotificationsAsRead } from '@/services/social-service';
import { auth } from '@/lib/auth';

// GET /api/social/notification - 获取用户通知
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
        { error: '您需要登录才能执行此操作' },
        { status: 401 }
      );
    }
    
    // 获取分页参数
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);
    
    // 获取用户通知
    const notifications = await getUserNotifications(session.user.id, limit, offset);
    
    return NextResponse.json({
      notifications
    });
  } catch (error) {
    console.error('获取用户通知失败:', error);
    return NextResponse.json(
      { error: '处理请求时出错' },
      { status: 500 }
    );
  }
}

// POST /api/social/notification/read - 标记通知为已读
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
    const { notificationId, readAll } = await request.json();
    
    if (readAll) {
      // 标记所有通知为已读
      await markAllNotificationsAsRead(session.user.id);
    } else if (notificationId) {
      // 标记单个通知为已读
      await markNotificationAsRead(notificationId);
    } else {
      return NextResponse.json(
        { error: '请提供通知ID或指定标记所有通知为已读' },
        { status: 400 }
      );
    }
    
    return NextResponse.json({
      success: true
    });
  } catch (error) {
    console.error('标记通知已读失败:', error);
    return NextResponse.json(
      { error: '处理请求时出错' },
      { status: 500 }
    );
  }
} 