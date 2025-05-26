import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { users, follows } from '@/db/schema-drizzle';
import { eq, count } from 'drizzle-orm';

// GET /api/users/:id - 获取用户资料
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
    
    // 查询用户基本信息
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
      columns: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        bio: true,
        created_at: true,
      }
    });
    
    if (!user) {
      return NextResponse.json(
        { error: '用户不存在' },
        { status: 404 }
      );
    }
    
    // 查询用户项目数量
    const projectsCountResult = await db.query.projects.findMany({
      where: eq(users.id, userId),
      columns: {
        id: true,
      }
    });
    
    const projectsCount = projectsCountResult.length;
    
    // 查询关注者数量
    const followersCountResult = await db.query.follows.findMany({
      where: eq(follows.following_id, userId),
      columns: {
        follower_id: true,
      }
    });
    
    const followersCount = followersCountResult.length;
    
    // 查询正在关注数量
    const followingCountResult = await db.query.follows.findMany({
      where: eq(follows.follower_id, userId),
      columns: {
        following_id: true,
      }
    });
    
    const followingCount = followingCountResult.length;
    
    // 构建用户资料响应
    const userProfile = {
      id: user.id,
      name: user.name || '',
      email: user.email,
      avatar: user.avatar,
      bio: user.bio,
      createdAt: user.created_at,
      projectsCount,
      followersCount,
      followingCount
    };
    
    return NextResponse.json(userProfile);
  } catch (error) {
    console.error('获取用户资料失败:', error);
    return NextResponse.json(
      { error: '处理请求时出错' },
      { status: 500 }
    );
  }
} 