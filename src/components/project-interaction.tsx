import { useState, useEffect } from 'react';
import { Heart, BookmarkPlus, MessageSquare, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useSession } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import { Locale } from '../../i18n/config';
import { toast } from '@/components/ui/use-toast';

interface ProjectInteractionProps {
  projectId: string;
  initialLikes?: number;
  initialComments?: number;
  className?: string;
  orientation?: 'horizontal' | 'vertical';
  locale: Locale;
  onCommentClick?: () => void;
}

export function ProjectInteraction({
  projectId,
  initialLikes = 0,
  initialComments = 0,
  className = '',
  orientation = 'vertical',
  locale,
  onCommentClick
}: ProjectInteractionProps) {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [likesCount, setLikesCount] = useState(initialLikes);
  const [commentsCount, setCommentsCount] = useState(initialComments);
  const [isLoading, setIsLoading] = useState({
    like: false,
    bookmark: false,
    share: false
  });

  // 获取初始状态
  useEffect(() => {
    if (session?.user?.id) {
      // 检查点赞状态
      fetch(`/api/social/like?projectId=${projectId}`)
        .then(res => res.json())
        .then(data => {
          setIsLiked(data.isLiked);
        })
        .catch(error => {
          console.error('获取点赞状态失败:', error);
        });

      // 检查收藏状态
      fetch(`/api/social/bookmark?projectId=${projectId}`)
        .then(res => res.json())
        .then(data => {
          setIsBookmarked(data.isBookmarked);
        })
        .catch(error => {
          console.error('获取收藏状态失败:', error);
        });
    }
  }, [projectId, session?.user?.id]);

  // 处理点赞
  const handleLike = async () => {
    if (!session?.user) {
      // 未登录，引导用户登录
      toast({
        title: locale === 'zh-cn' ? '请先登录' : 'Please sign in first',
        description: locale === 'zh-cn' ? '您需要登录才能点赞' : 'You need to sign in to like this project',
        variant: 'default',
      });
      router.push(`/${locale}/auth`);
      return;
    }

    setIsLoading(prev => ({ ...prev, like: true }));
    
    try {
      const response = await fetch('/api/social/like', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ projectId }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setIsLiked(data.isLiked);
        setLikesCount(prev => data.isLiked ? prev + 1 : prev - 1);
      } else {
        throw new Error(data.error || '操作失败');
      }
    } catch (error) {
      console.error('点赞操作失败:', error);
      toast({
        title: locale === 'zh-cn' ? '操作失败' : 'Operation Failed',
        description: String(error),
        variant: 'destructive',
      });
    } finally {
      setIsLoading(prev => ({ ...prev, like: false }));
    }
  };

  // 处理收藏
  const handleBookmark = async () => {
    if (!session?.user) {
      // 未登录，引导用户登录
      toast({
        title: locale === 'zh-cn' ? '请先登录' : 'Please sign in first',
        description: locale === 'zh-cn' ? '您需要登录才能收藏' : 'You need to sign in to bookmark this project',
        variant: 'default',
      });
      router.push(`/${locale}/auth`);
      return;
    }

    setIsLoading(prev => ({ ...prev, bookmark: true }));
    
    try {
      const response = await fetch('/api/social/bookmark', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ projectId }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setIsBookmarked(data.isBookmarked);
        toast({
          title: data.isBookmarked 
            ? (locale === 'zh-cn' ? '已收藏' : 'Bookmarked') 
            : (locale === 'zh-cn' ? '已取消收藏' : 'Removed from bookmarks'),
          variant: 'default',
        });
      } else {
        throw new Error(data.error || '操作失败');
      }
    } catch (error) {
      console.error('收藏操作失败:', error);
      toast({
        title: locale === 'zh-cn' ? '操作失败' : 'Operation Failed',
        description: String(error),
        variant: 'destructive',
      });
    } finally {
      setIsLoading(prev => ({ ...prev, bookmark: false }));
    }
  };

  // 处理分享
  const handleShare = async () => {
    setIsLoading(prev => ({ ...prev, share: true }));
    
    try {
      // 构建项目URL
      const projectUrl = `${window.location.origin}/${locale}/project/${projectId}`;
      
      // 使用Navigator Share API（如果可用）
      if (navigator.share) {
        await navigator.share({
          title: locale === 'zh-cn' ? '分享CodeTok项目' : 'Share CodeTok Project',
          url: projectUrl
        });
      } else {
        // 回退到复制链接
        await navigator.clipboard.writeText(projectUrl);
        toast({
          title: locale === 'zh-cn' ? '链接已复制' : 'Link copied',
          description: locale === 'zh-cn' ? '项目链接已复制到剪贴板' : 'Project link copied to clipboard',
          variant: 'default',
        });
      }
      
      // 如果用户已登录，记录分享操作
      if (session?.user) {
        fetch('/api/social/share', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            projectId, 
            platform: 'copy_link' 
          }),
        }).catch(error => {
          console.error('记录分享操作失败:', error);
        });
      }
    } catch (error) {
      console.error('分享操作失败:', error);
      toast({
        title: locale === 'zh-cn' ? '分享失败' : 'Sharing Failed',
        description: String(error),
        variant: 'destructive',
      });
    } finally {
      setIsLoading(prev => ({ ...prev, share: false }));
    }
  };

  // 处理评论点击
  const handleCommentClick = () => {
    if (onCommentClick) {
      onCommentClick();
    } else {
      router.push(`/${locale}/project/${projectId}#comments`);
    }
  };

  const isVertical = orientation === 'vertical';
  
  return (
    <div className={cn(
      'flex',
      isVertical ? 'flex-col space-y-4' : 'flex-row space-x-4',
      className
    )}>
      {/* 点赞按钮 */}
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          "h-10 w-10 rounded-full bg-black/50 backdrop-blur-sm hover:bg-black/70",
          isLoading.like && "opacity-50 cursor-not-allowed"
        )}
        onClick={handleLike}
        disabled={isLoading.like}
      >
        <Heart 
          className={cn(
            "h-5 w-5 transition-colors", 
            isLiked ? "fill-red-500 text-red-500" : "text-white"
          )} 
        />
        <span className="mt-1 text-xs font-medium text-white">{likesCount}</span>
      </Button>
      
      {/* 评论按钮 */}
      <Button
        variant="ghost"
        size="icon"
        className="h-10 w-10 rounded-full bg-black/50 backdrop-blur-sm hover:bg-black/70"
        onClick={handleCommentClick}
      >
        <MessageSquare className="h-5 w-5 text-white" />
        <span className="mt-1 text-xs font-medium text-white">{commentsCount}</span>
      </Button>
      
      {/* 收藏按钮 */}
      <Button
        variant="ghost"
        size="icon" 
        className={cn(
          "h-10 w-10 rounded-full bg-black/50 backdrop-blur-sm hover:bg-black/70",
          isLoading.bookmark && "opacity-50 cursor-not-allowed"
        )}
        onClick={handleBookmark}
        disabled={isLoading.bookmark}
      >
        <BookmarkPlus 
          className={cn(
            "h-5 w-5 transition-colors", 
            isBookmarked ? "fill-yellow-500 text-yellow-500" : "text-white"
          )}
        />
      </Button>
      
      {/* 分享按钮 */}
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          "h-10 w-10 rounded-full bg-black/50 backdrop-blur-sm hover:bg-black/70",
          isLoading.share && "opacity-50 cursor-not-allowed"
        )}
        onClick={handleShare}
        disabled={isLoading.share}
      >
        <Share2 className="h-5 w-5 text-white" />
      </Button>
    </div>
  );
} 