import { useState, useEffect } from 'react';
import { useSession } from '@/lib/auth-client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Bell, Heart, MessageSquare, UserPlus, BookmarkPlus } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { zhCN, enUS } from 'date-fns/locale';
import { Locale } from '../../i18n/config';
import { toast } from '@/components/ui/use-toast';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';

interface NotificationItem {
  id: string;
  type: string;
  actor: {
    id: string;
    name: string;
    avatar: string;
  };
  entityDetails?: any;
  is_read: boolean;
  created_at: string;
}

interface NotificationListProps {
  locale: Locale;
  limit?: number;
  className?: string;
}

export function NotificationList({ 
  locale, 
  limit = 20, 
  className = '' 
}: NotificationListProps) {
  const { data: session, isPending } = useSession();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // 加载通知
  const loadNotifications = async () => {
    if (!session?.user?.id) return;
    
    setIsLoading(true);
    
    try {
      const response = await fetch(`/api/notifications?limit=${limit}`);
      
      if (response.ok) {
        const data = await response.json();
        setNotifications(data.notifications || []);
      } else {
        throw new Error('获取通知失败');
      }
    } catch (error) {
      console.error('加载通知失败:', error);
      toast({
        title: locale === 'zh-cn' ? '加载失败' : 'Loading Failed',
        description: String(error),
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // 初始加载
  useEffect(() => {
    if (session?.user?.id) {
      loadNotifications();
    }
  }, [session?.user?.id]);
  
  // 标记通知为已读
  const markAsRead = async (notificationId: string) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}/read`, {
        method: 'PATCH',
      });
      
      if (response.ok) {
        setNotifications(prev => 
          prev.map(notification => 
            notification.id === notificationId 
              ? { ...notification, is_read: true }
              : notification
          )
        );
      }
    } catch (error) {
      console.error('标记已读失败:', error);
    }
  };
  
  // 标记所有通知为已读
  const markAllAsRead = async () => {
    try {
      await fetch('/api/social/notification/read', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ readAll: true }),
      });
      
      // 更新本地状态
      setNotifications(prev => 
        prev.map(item => ({ ...item, is_read: true }))
      );
      
      toast({
        title: locale === 'zh-cn' ? '所有通知已标记为已读' : 'All notifications marked as read',
        variant: 'default',
      });
      
    } catch (error) {
      console.error('标记所有通知为已读失败:', error);
      toast({
        title: locale === 'zh-cn' ? '操作失败' : 'Operation failed',
        description: String(error),
        variant: 'destructive',
      });
    }
  };
  
  // 格式化时间
  const formatTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return formatDistanceToNow(date, {
        addSuffix: true,
        locale: locale === 'zh-cn' ? zhCN : enUS
      });
    } catch (error) {
      return dateString;
    }
  };
  
  // 获取通知图标
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'like':
        return <Heart size={16} className="text-red-500" />;
      case 'comment':
      case 'reply':
        return <MessageSquare size={16} className="text-blue-500" />;
      case 'follow':
        return <UserPlus size={16} className="text-green-500" />;
      case 'favorite':
        return <BookmarkPlus size={16} className="text-yellow-500" />;
      default:
        return <Bell size={16} />;
    }
  };
  
  // 获取通知内容
  const getNotificationContent = (notification: NotificationItem) => {
    const { type, actor, entityDetails } = notification;
    
    switch (type) {
      case 'like':
        return (
          <span>
            <strong>{actor.name}</strong>
            {locale === 'zh-cn' ? ' 赞了你的项目 ' : ' liked your project '}
            {entityDetails && (
              <Link href={`/${locale}/project/${entityDetails.id}`} className="font-medium hover:underline">
                {entityDetails.title || '项目'}
              </Link>
            )}
          </span>
        );
      case 'comment':
        return (
          <span>
            <strong>{actor.name}</strong>
            {locale === 'zh-cn' ? ' 评论了你的项目 ' : ' commented on your project '}
            {entityDetails && entityDetails.project_id && (
              <Link href={`/${locale}/project/${entityDetails.project_id}#comments`} className="font-medium hover:underline">
                查看评论
              </Link>
            )}
          </span>
        );
      case 'reply':
        return (
          <span>
            <strong>{actor.name}</strong>
            {locale === 'zh-cn' ? ' 回复了你的评论 ' : ' replied to your comment '}
            {entityDetails && entityDetails.project_id && (
              <Link href={`/${locale}/project/${entityDetails.project_id}#comments`} className="font-medium hover:underline">
                查看回复
              </Link>
            )}
          </span>
        );
      case 'follow':
        return (
          <span>
            <strong>{actor.name}</strong>
            {locale === 'zh-cn' ? ' 关注了你' : ' followed you'}
          </span>
        );
      case 'favorite':
        return (
          <span>
            <strong>{actor.name}</strong>
            {locale === 'zh-cn' ? ' 收藏了你的项目 ' : ' bookmarked your project '}
            {entityDetails && (
              <Link href={`/${locale}/project/${entityDetails.id}`} className="font-medium hover:underline">
                {entityDetails.title || '项目'}
              </Link>
            )}
          </span>
        );
      default:
        return <span>新通知</span>;
    }
  };
  
  if (!session?.user) {
    return null;
  }
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">
          {locale === 'zh-cn' ? '通知' : 'Notifications'}
        </h2>
        
        {notifications.length > 0 && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={markAllAsRead}
            disabled={notifications.every(n => n.is_read)}
          >
            {locale === 'zh-cn' ? '全部标为已读' : 'Mark all as read'}
          </Button>
        )}
      </div>
      
      {isLoading ? (
        <div className="py-8 text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
          <p className="mt-2 text-sm text-muted-foreground">
            {locale === 'zh-cn' ? '加载通知中...' : 'Loading notifications...'}
          </p>
        </div>
      ) : notifications.length > 0 ? (
        <div className="space-y-3">
          {notifications.map(notification => (
            <Card
              key={notification.id}
              className={`p-4 transition-colors ${!notification.is_read ? 'bg-muted/50' : ''}`}
              onClick={() => !notification.is_read && markAsRead(notification.id)}
            >
              <div className="flex gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={notification.actor.avatar} alt={notification.actor.name} />
                  <AvatarFallback>{notification.actor.name?.[0] || '?'}</AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      {getNotificationIcon(notification.type)}
                      <div>{getNotificationContent(notification)}</div>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {formatTime(notification.created_at)}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
          
          {limit < 10 && notifications.length >= limit && (
            <Link href={`/${locale}/notifications`}>
              <Button variant="ghost" className="w-full">
                {locale === 'zh-cn' ? '查看更多通知' : 'View more notifications'}
              </Button>
            </Link>
          )}
        </div>
      ) : (
        <div className="py-8 text-center">
          <Bell className="mx-auto h-12 w-12 text-muted-foreground" />
          <p className="mt-2 text-muted-foreground">
            {locale === 'zh-cn' ? '暂无通知' : 'No notifications yet'}
          </p>
        </div>
      )}
    </div>
  );
} 