import { NextRequest, NextResponse } from 'next/server';
import { addComment, getProjectComments } from '@/services/social-service';
import { auth } from '@/lib/auth';

// POST /api/social/comment - 添加评论
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
    const { projectId, content, parentId } = await request.json();
    
    if (!projectId || !content) {
      return NextResponse.json(
        { error: '项目ID和评论内容不能为空' },
        { status: 400 }
      );
    }
    
    // 添加评论
    const comment = await addComment(session.user.id, projectId, content, parentId);
    
    return NextResponse.json({
      success: true,
      comment
    });
  } catch (error) {
    console.error('添加评论失败:', error);
    return NextResponse.json(
      { error: '处理请求时出错' },
      { status: 500 }
    );
  }
}

// GET /api/social/comment?projectId=xxx - 获取项目评论
export async function GET(request: NextRequest) {
  try {
    // 获取项目ID
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');
    
    if (!projectId) {
      return NextResponse.json(
        { error: '项目ID不能为空' },
        { status: 400 }
      );
    }
    
    // 获取项目评论
    const comments = await getProjectComments(projectId);
    
    return NextResponse.json({
      comments
    });
  } catch (error) {
    console.error('获取项目评论失败:', error);
    return NextResponse.json(
      { error: '处理请求时出错' },
      { status: 500 }
    );
  }
} 