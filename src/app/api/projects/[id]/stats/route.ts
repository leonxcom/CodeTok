import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { projects, likes, comments, favorites, shares } from '@/db/schema-drizzle';
import { eq, count } from 'drizzle-orm';

// GET /api/projects/:id/stats - 获取项目统计数据
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const projectId = params.id;
    
    if (!projectId) {
      return NextResponse.json(
        { error: '项目ID不能为空' },
        { status: 400 }
      );
    }
    
    // 获取项目基本信息
    const project = await db.query.projects.findFirst({
      where: eq(projects.id, projectId),
      columns: {
        views: true,
        likes: true,
        comments_count: true,
      }
    });
    
    if (!project) {
      return NextResponse.json(
        { error: '项目不存在' },
        { status: 404 }
      );
    }
    
    // 获取收藏数量
    const bookmarksResult = await db.query.favorites.findMany({
      where: eq(favorites.project_id, projectId)
    });
    
    const bookmarks = bookmarksResult.length;
    
    // 获取分享数量
    const sharesResult = await db.query.shares.findMany({
      where: eq(shares.project_id, projectId)
    });
    
    const sharesCount = sharesResult.length;
    
    // 构建统计数据
    const stats = {
      views: project.views || 0,
      likes: project.likes || 0,
      comments: project.comments_count || 0,
      bookmarks,
      shares: sharesCount
    };
    
    return NextResponse.json(stats);
  } catch (error) {
    console.error('获取项目统计数据失败:', error);
    return NextResponse.json(
      { error: '处理请求时出错' },
      { status: 500 }
    );
  }
} 