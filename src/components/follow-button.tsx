import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useSession } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import { Locale } from '../../i18n/config';
import { toast } from '@/components/ui/use-toast';
import { UserPlus, UserCheck } from 'lucide-react';

interface FollowButtonProps {
  targetUserId: string;
  className?: string;
  locale: Locale;
  size?: 'sm' | 'default';
  variant?: 'default' | 'outline' | 'ghost';
}

export function FollowButton({
  targetUserId,
  className = '',
  locale,
  size = 'default',
  variant = 'default'
}: FollowButtonProps) {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // 获取初始关注状态
  useEffect(() => {
    if (session?.user?.id && targetUserId) {
      setIsLoading(true);
      
      fetch(`/api/social/follow?targetUserId=${targetUserId}`)
        .then(res => res.json())
        .then(data => {
          setIsFollowing(data.isFollowing);
        })
        .catch(error => {
          console.error('获取关注状态失败:', error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [targetUserId, session?.user?.id]);
  
  // 处理关注/取消关注
  const handleFollow = async () => {
    if (!session?.user) {
      // 未登录，引导用户登录
      toast({
        title: locale === 'zh-cn' ? '请先登录' : 'Please sign in first',
        description: locale === 'zh-cn' ? '您需要登录才能关注用户' : 'You need to sign in to follow this user',
        variant: 'default',
      });
      router.push(`/${locale}/auth`);
      return;
    }
    
    // 自己不能关注自己
    if (session?.user?.id === targetUserId) {
      toast({
        title: locale === 'zh-cn' ? '无法关注' : 'Cannot follow',
        description: locale === 'zh-cn' ? '您不能关注自己' : 'You cannot follow yourself',
        variant: 'default',
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/social/follow', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ targetUserId }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setIsFollowing(data.isFollowing);
        toast({
          title: data.isFollowing 
            ? (locale === 'zh-cn' ? '已关注' : 'Following') 
            : (locale === 'zh-cn' ? '已取消关注' : 'Unfollowed'),
          variant: 'default',
        });
      } else {
        throw new Error(data.error || '操作失败');
      }
    } catch (error) {
      console.error('关注操作失败:', error);
      toast({
        title: locale === 'zh-cn' ? '操作失败' : 'Operation Failed',
        description: String(error),
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Button
      onClick={handleFollow}
      disabled={isLoading}
      size={size}
      variant={variant}
      className={className}
    >
      {isFollowing ? (
        <>
          <UserCheck className="mr-2 h-4 w-4" />
          {locale === 'zh-cn' ? '已关注' : 'Following'}
        </>
      ) : (
        <>
          <UserPlus className="mr-2 h-4 w-4" />
          {locale === 'zh-cn' ? '关注' : 'Follow'}
        </>
      )}
    </Button>
  );
} 