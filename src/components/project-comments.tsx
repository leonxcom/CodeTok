import { useState, useEffect } from 'react';
import { useSession } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card';
import { Heart, Reply, MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from '@/components/ui/use-toast';
import { formatDistanceToNow } from 'date-fns';
import { zhCN, enUS } from 'date-fns/locale';
import { Locale } from '../../i18n/config';

interface CommentData {
  id: string;
  content: string;
  user: {
    id: string;
    name: string;
    avatar: string;
  };
  replies?: CommentData[];
  created_at: string;
}

interface ProjectCommentsProps {
  projectId: string;
  locale: Locale;
  className?: string;
}

export function ProjectComments({
  projectId,
  locale,
  className = '',
}: ProjectCommentsProps) {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  
  const [comments, setComments] = useState<CommentData[]>([]);
  const [commentText, setCommentText] = useState('');
  const [replyToId, setReplyToId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  
  // 加载评论
  useEffect(() => {
    async function loadComments() {
      setIsFetching(true);
      try {
        const response = await fetch(`/api/social/comment?projectId=${projectId}`);
        const data = await response.json();
        
        if (response.ok) {
          setComments(data.comments || []);
        } else {
          throw new Error(data.error || '获取评论失败');
        }
      } catch (error) {
        console.error('加载评论失败:', error);
        toast({
          title: locale === 'zh-cn' ? '加载评论失败' : 'Failed to load comments',
          description: String(error),
        });
      } finally {
        setIsFetching(false);
      }
    }
    
    if (projectId) {
      loadComments();
    }
  }, [projectId, locale]);
  
  // 提交评论
  const handleSubmitComment = async () => {
    if (!commentText.trim()) return;
    
    if (!session) {
      // 未登录，引导用户登录
      toast({
        title: locale === 'zh-cn' ? '请先登录' : 'Please sign in first',
        description: locale === 'zh-cn' ? '您需要登录才能评论' : 'You need to sign in to comment',
      });
      router.push(`/${locale}/login`);
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/social/comment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          projectId,
          content: commentText,
        }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // 添加新评论到列表顶部
        setComments(prev => [data.comment, ...prev]);
        setCommentText(''); // 清空输入框
        toast({
          title: locale === 'zh-cn' ? '评论已发布' : 'Comment published',
        });
      } else {
        throw new Error(data.error || '发布评论失败');
      }
    } catch (error) {
      console.error('发布评论失败:', error);
      toast({
        title: locale === 'zh-cn' ? '发布评论失败' : 'Failed to publish comment',
        description: String(error),
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // 提交回复
  const handleSubmitReply = async (parentId: string) => {
    if (!replyText.trim() || !parentId) return;
    
    if (!session) {
      // 未登录，引导用户登录
      toast({
        title: locale === 'zh-cn' ? '请先登录' : 'Please sign in first',
        description: locale === 'zh-cn' ? '您需要登录才能回复' : 'You need to sign in to reply',
      });
      router.push(`/${locale}/login`);
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/social/comment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          projectId,
          content: replyText,
          parentId,
        }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // 更新评论列表中的回复
        setComments(prev => prev.map(comment => {
          if (comment.id === parentId) {
            return {
              ...comment,
              replies: [...(comment.replies || []), data.comment]
            };
          }
          return comment;
        }));
        
        setReplyToId(null); // 关闭回复框
        setReplyText(''); // 清空输入框
        
        toast({
          title: locale === 'zh-cn' ? '回复已发布' : 'Reply published',
        });
      } else {
        throw new Error(data.error || '发布回复失败');
      }
    } catch (error) {
      console.error('发布回复失败:', error);
      toast({
        title: locale === 'zh-cn' ? '发布回复失败' : 'Failed to publish reply',
        description: String(error),
      });
    } finally {
      setIsLoading(false);
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
  
  return (
    <div className={cn('space-y-6', className)}>
      <h2 className="text-xl font-semibold mb-4">
        {locale === 'zh-cn' ? '评论' : 'Comments'}
        {comments.length > 0 && ` (${comments.length})`}
      </h2>
      
      {/* 评论输入框 */}
      <div className="flex gap-4">
        <Avatar className="h-10 w-10">
          <AvatarImage src={session?.user?.image || ''} alt={session?.user?.name || ''} />
          <AvatarFallback>{session?.user?.name?.[0] || '?'}</AvatarFallback>
        </Avatar>
        
        <div className="flex-1 space-y-2">
          <Textarea
            placeholder={locale === 'zh-cn' ? '写下你的评论...' : 'Write your comment...'}
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            className="min-h-24 resize-none"
          />
          
          <div className="flex justify-end">
            <Button 
              onClick={handleSubmitComment}
              disabled={isLoading || !commentText.trim()}
            >
              {isLoading 
                ? (locale === 'zh-cn' ? '发布中...' : 'Publishing...') 
                : (locale === 'zh-cn' ? '发布评论' : 'Post Comment')}
            </Button>
          </div>
        </div>
      </div>
      
      {/* 评论列表 */}
      {isFetching ? (
        <div className="py-8 text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em]"></div>
          <p className="mt-2 text-sm text-muted-foreground">
            {locale === 'zh-cn' ? '加载评论中...' : 'Loading comments...'}
          </p>
        </div>
      ) : comments.length > 0 ? (
        <div className="space-y-4">
          {comments.map((comment) => (
            <Card key={comment.id} className="border bg-card">
              <CardHeader className="p-4 pb-2 flex flex-row items-start space-y-0">
                <div className="flex flex-1 gap-4 items-start">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={comment.user.avatar} alt={comment.user.name} />
                    <AvatarFallback>{comment.user.name[0]}</AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{comment.user.name}</h4>
                      <span className="text-xs text-muted-foreground">
                        {formatTime(comment.created_at)}
                      </span>
                    </div>
                    
                    <p className="mt-1 text-sm">{comment.content}</p>
                  </div>
                </div>
              </CardHeader>
              
              <CardFooter className="p-4 pt-2 flex justify-between">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-xs gap-1"
                  onClick={() => setReplyToId(replyToId === comment.id ? null : comment.id)}
                >
                  <Reply className="h-3.5 w-3.5" />
                  {locale === 'zh-cn' ? '回复' : 'Reply'}
                </Button>
                
                <div className="flex items-center gap-4">
                  <Button variant="ghost" size="sm" className="text-xs gap-1">
                    <Heart className="h-3.5 w-3.5" />
                    0
                  </Button>
                  
                  <Button variant="ghost" size="sm" className="text-xs">
                    <MoreHorizontal className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </CardFooter>
              
              {/* 回复输入框 */}
              {replyToId === comment.id && (
                <div className="p-4 pt-0 border-t">
                  <div className="flex gap-4">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={session?.user?.image || ''} alt={session?.user?.name || ''} />
                      <AvatarFallback>{session?.user?.name?.[0] || '?'}</AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 space-y-2">
                      <Textarea
                        placeholder={locale === 'zh-cn' ? '回复评论...' : 'Reply to comment...'}
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        className="min-h-16 resize-none text-sm"
                      />
                      
                      <div className="flex justify-end">
                        <Button 
                          size="sm"
                          onClick={() => handleSubmitReply(comment.id)}
                          disabled={isLoading || !replyText.trim()}
                        >
                          {isLoading 
                            ? (locale === 'zh-cn' ? '发布中...' : 'Publishing...') 
                            : (locale === 'zh-cn' ? '发布回复' : 'Post Reply')}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* 回复列表 */}
              {comment.replies && comment.replies.length > 0 && (
                <div className="p-4 pt-0">
                  <div className="border-l-2 pl-4 space-y-3 mt-2">
                    {comment.replies.map((reply) => (
                      <div key={reply.id} className="flex gap-3">
                        <Avatar className="h-7 w-7">
                          <AvatarImage src={reply.user.avatar} alt={reply.user.name} />
                          <AvatarFallback>{reply.user.name[0]}</AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h5 className="text-sm font-medium">{reply.user.name}</h5>
                            <span className="text-xs text-muted-foreground">
                              {formatTime(reply.created_at)}
                            </span>
                          </div>
                          
                          <p className="text-sm mt-0.5">{reply.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      ) : (
        <div className="py-8 text-center">
          <p className="text-muted-foreground">
            {locale === 'zh-cn' ? '暂无评论，来发表第一条评论吧！' : 'No comments yet. Be the first to comment!'}
          </p>
        </div>
      )}
    </div>
  );
} 