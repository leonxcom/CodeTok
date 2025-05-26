import { db } from '@/db';
import { nanoid } from 'nanoid';
import { 
  likes, 
  comments, 
  favorites, 
  follows, 
  projects, 
  notifications,
  shares,
  users
} from '@/db/schema-drizzle';
import { and, eq, sql, desc, isNull } from 'drizzle-orm';

/**
 * 点赞项目
 */
export async function likeProject(userId: string, projectId: string): Promise<boolean> {
  try {
    // 检查是否已点赞
    const existingLike = await db.query.likes.findFirst({
      where: and(
        eq(likes.user_id, userId),
        eq(likes.project_id, projectId)
      )
    });

    if (existingLike) {
      // 已点赞，则取消点赞
      await db.delete(likes).where(
        and(
          eq(likes.user_id, userId),
          eq(likes.project_id, projectId)
        )
      );

      // 减少项目点赞数
      await db.update(projects)
        .set({ likes: sql`${projects.likes} - 1` })
        .where(eq(projects.id, projectId));

      return false;
    } else {
      // 未点赞，添加点赞
      await db.insert(likes).values({
        id: nanoid(10),
        user_id: userId,
        project_id: projectId,
        created_at: new Date()
      });

      // 增加项目点赞数
      await db.update(projects)
        .set({ likes: sql`${projects.likes} + 1` })
        .where(eq(projects.id, projectId));

      // 获取项目作者ID
      const project = await db.query.projects.findFirst({
        where: eq(projects.id, projectId),
        columns: { user_id: true }
      });

      // 如果项目有作者且作者不是当前用户，创建通知
      if (project?.user_id && project.user_id !== userId) {
        await db.insert(notifications).values({
          id: nanoid(10),
          user_id: project.user_id,
          type: 'like',
          actor_id: userId,
          entity_id: projectId,
          entity_type: 'project',
          is_read: false,
          created_at: new Date()
        });
      }

      return true;
    }
  } catch (error) {
    console.error('点赞项目失败:', error);
    throw error;
  }
}

/**
 * 检查用户是否已点赞项目
 */
export async function checkIfLiked(userId: string, projectId: string): Promise<boolean> {
  try {
    const existingLike = await db.query.likes.findFirst({
      where: and(
        eq(likes.user_id, userId),
        eq(likes.project_id, projectId)
      )
    });

    return !!existingLike;
  } catch (error) {
    console.error('检查点赞状态失败:', error);
    return false;
  }
}

/**
 * 添加评论
 */
export async function addComment(userId: string, projectId: string, content: string, parentId?: string): Promise<any> {
  try {
    const commentId = nanoid(10);
    
    // 添加评论
    await db.insert(comments).values({
      id: commentId,
      user_id: userId,
      project_id: projectId,
      parent_id: parentId || null,
      content,
      created_at: new Date(),
      updated_at: new Date()
    });

    // 增加项目评论数
    await db.update(projects)
      .set({ comments_count: sql`${projects.comments_count} + 1` })
      .where(eq(projects.id, projectId));

    // 获取项目作者ID
    const project = await db.query.projects.findFirst({
      where: eq(projects.id, projectId),
      columns: { user_id: true }
    });

    // 如果项目有作者且作者不是当前用户，创建通知
    if (project?.user_id && project.user_id !== userId) {
      await db.insert(notifications).values({
        id: nanoid(10),
        user_id: project.user_id,
        type: 'comment',
        actor_id: userId,
        entity_id: commentId,
        entity_type: 'comment',
        is_read: false,
        created_at: new Date()
      });
    }

    // 如果是回复评论，给评论作者发送通知
    if (parentId) {
      const parentComment = await db.query.comments.findFirst({
        where: eq(comments.id, parentId),
        columns: { user_id: true }
      });

      if (parentComment && parentComment.user_id !== userId) {
        await db.insert(notifications).values({
          id: nanoid(10),
          user_id: parentComment.user_id,
          type: 'reply',
          actor_id: userId,
          entity_id: commentId,
          entity_type: 'comment',
          is_read: false,
          created_at: new Date()
        });
      }
    }

    // 返回新创建的评论
    return await db.query.comments.findFirst({
      where: eq(comments.id, commentId),
      with: {
        user: {
          columns: {
            id: true,
            name: true,
            avatar: true
          }
        }
      }
    });
  } catch (error) {
    console.error('添加评论失败:', error);
    throw error;
  }
}

/**
 * 获取项目评论
 */
export async function getProjectComments(projectId: string): Promise<any[]> {
  try {
    // 获取所有顶级评论（没有父评论的评论）
    const topLevelComments = await db.query.comments.findMany({
      where: and(
        eq(comments.project_id, projectId),
        isNull(comments.parent_id)
      ),
      with: {
        user: {
          columns: {
            id: true,
            name: true,
            avatar: true
          }
        },
        replies: {
          with: {
            user: {
              columns: {
                id: true,
                name: true,
                avatar: true
              }
            }
          }
        }
      }
    });

    // 手动排序
    return topLevelComments.sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  } catch (error) {
    console.error('获取项目评论失败:', error);
    return [];
  }
}

/**
 * 收藏项目
 */
export async function favoriteProject(userId: string, projectId: string): Promise<boolean> {
  try {
    // 检查是否已收藏
    const existingFavorite = await db.query.favorites.findFirst({
      where: and(
        eq(favorites.user_id, userId),
        eq(favorites.project_id, projectId)
      )
    });

    if (existingFavorite) {
      // 已收藏，则取消收藏
      await db.delete(favorites).where(
        and(
          eq(favorites.user_id, userId),
          eq(favorites.project_id, projectId)
        )
      );
      return false;
    } else {
      // 未收藏，添加收藏
      await db.insert(favorites).values({
        user_id: userId,
        project_id: projectId,
        created_at: new Date()
      });

      // 获取项目作者ID
      const project = await db.query.projects.findFirst({
        where: eq(projects.id, projectId),
        columns: { user_id: true }
      });

      // 如果项目有作者且作者不是当前用户，创建通知
      if (project?.user_id && project.user_id !== userId) {
        await db.insert(notifications).values({
          id: nanoid(10),
          user_id: project.user_id,
          type: 'favorite',
          actor_id: userId,
          entity_id: projectId,
          entity_type: 'project',
          is_read: false,
          created_at: new Date()
        });
      }

      return true;
    }
  } catch (error) {
    console.error('收藏项目失败:', error);
    throw error;
  }
}

/**
 * 检查用户是否已收藏项目
 */
export async function checkIfFavorited(userId: string, projectId: string): Promise<boolean> {
  try {
    const existingFavorite = await db.query.favorites.findFirst({
      where: and(
        eq(favorites.user_id, userId),
        eq(favorites.project_id, projectId)
      )
    });

    return !!existingFavorite;
  } catch (error) {
    console.error('检查收藏状态失败:', error);
    return false;
  }
}

/**
 * 关注用户
 */
export async function followUser(followerId: string, followingId: string): Promise<boolean> {
  try {
    // 不能关注自己
    if (followerId === followingId) {
      throw new Error('不能关注自己');
    }

    // 检查是否已关注
    const existingFollow = await db.query.follows.findFirst({
      where: and(
        eq(follows.follower_id, followerId),
        eq(follows.following_id, followingId)
      )
    });

    if (existingFollow) {
      // 已关注，则取消关注
      await db.delete(follows).where(
        and(
          eq(follows.follower_id, followerId),
          eq(follows.following_id, followingId)
        )
      );
      return false;
    } else {
      // 未关注，添加关注
      await db.insert(follows).values({
        follower_id: followerId,
        following_id: followingId,
        created_at: new Date()
      });

      // 创建通知
      await db.insert(notifications).values({
        id: nanoid(10),
        user_id: followingId,
        type: 'follow',
        actor_id: followerId,
        entity_id: followingId,
        entity_type: 'user',
        is_read: false,
        created_at: new Date()
      });

      return true;
    }
  } catch (error) {
    console.error('关注用户失败:', error);
    throw error;
  }
}

/**
 * 检查用户是否已关注
 */
export async function checkIfFollowing(followerId: string, followingId: string): Promise<boolean> {
  try {
    const existingFollow = await db.query.follows.findFirst({
      where: and(
        eq(follows.follower_id, followerId),
        eq(follows.following_id, followingId)
      )
    });

    return !!existingFollow;
  } catch (error) {
    console.error('检查关注状态失败:', error);
    return false;
  }
}

/**
 * 记录分享操作
 */
export async function recordShare(userId: string, projectId: string, platform: string): Promise<void> {
  try {
    await db.insert(shares).values({
      id: nanoid(10),
      user_id: userId,
      project_id: projectId,
      platform,
      created_at: new Date()
    });
  } catch (error) {
    console.error('记录分享操作失败:', error);
    throw error;
  }
}

/**
 * 获取用户通知
 */
export async function getUserNotifications(userId: string, limit = 20, offset = 0): Promise<any[]> {
  try {
    const userNotifications = await db.query.notifications.findMany({
      where: eq(notifications.user_id, userId),
      limit,
      offset
    });
    
    // 手动排序
    userNotifications.sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    // 为每个通知添加相关的参与者信息
    const enrichedNotifications = await Promise.all(userNotifications.map(async (notification) => {
      const actor = await db.query.users.findFirst({
        where: eq(users.id, notification.actor_id),
        columns: {
          id: true,
          name: true,
          avatar: true
        }
      });

      let entityDetails = null;

      // 根据实体类型获取相关详情
      if (notification.entity_type === 'project') {
        entityDetails = await db.query.projects.findFirst({
          where: eq(projects.id, notification.entity_id),
          columns: {
            id: true,
            title: true,
            description: true
          }
        });
      } else if (notification.entity_type === 'comment') {
        entityDetails = await db.query.comments.findFirst({
          where: eq(comments.id, notification.entity_id),
          columns: {
            id: true,
            content: true,
            project_id: true
          }
        });
      }

      return {
        ...notification,
        actor,
        entityDetails
      };
    }));

    return enrichedNotifications;
  } catch (error) {
    console.error('获取用户通知失败:', error);
    return [];
  }
}

/**
 * 标记通知为已读
 */
export async function markNotificationAsRead(notificationId: string): Promise<void> {
  try {
    await db.update(notifications)
      .set({ is_read: true })
      .where(eq(notifications.id, notificationId));
  } catch (error) {
    console.error('标记通知为已读失败:', error);
    throw error;
  }
}

/**
 * 标记所有通知为已读
 */
export async function markAllNotificationsAsRead(userId: string): Promise<void> {
  try {
    await db.update(notifications)
      .set({ is_read: true })
      .where(eq(notifications.user_id, userId));
  } catch (error) {
    console.error('标记所有通知为已读失败:', error);
    throw error;
  }
} 