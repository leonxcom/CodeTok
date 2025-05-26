import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Eye, Heart, MessageSquare, BookmarkIcon, Share2 } from 'lucide-react';
import { Locale } from '../../i18n/config';

interface ProjectStats {
  views: number;
  likes: number;
  comments: number;
  bookmarks: number;
  shares: number;
}

interface ProjectStatsProps {
  projectId: string;
  locale: Locale;
  className?: string;
}

export function ProjectStats({
  projectId,
  locale,
  className = '',
}: ProjectStatsProps) {
  const [stats, setStats] = useState<ProjectStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 获取项目统计数据
  useEffect(() => {
    async function fetchStats() {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await fetch(`/api/projects/${projectId}/stats`);
        
        if (!response.ok) {
          throw new Error('获取统计数据失败');
        }
        
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error('加载统计数据失败:', error);
        setError(
          locale === 'zh-cn' 
            ? '无法加载统计数据' 
            : 'Failed to load statistics'
        );
      } finally {
        setIsLoading(false);
      }
    }
    
    if (projectId) {
      fetchStats();
    }
  }, [projectId, locale]);
  
  // 获取最大值，用于计算进度条百分比
  const getMaxValue = () => {
    if (!stats) return 1;
    return Math.max(
      stats.views, 
      stats.likes * 5, // 给点赞加权
      stats.comments * 8, // 给评论加权
      stats.bookmarks * 5, // 给收藏加权
      stats.shares * 10, // 给分享加权
      1 // 至少为1，避免除以0
    );
  };
  
  // 计算百分比
  const calculatePercentage = (value: number, factor = 1) => {
    return (value * factor / getMaxValue()) * 100;
  };
  
  if (isLoading) {
    return (
      <div className={`animate-pulse space-y-3 ${className}`}>
        <div className="h-8 bg-muted rounded w-1/3"></div>
        <div className="space-y-2">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="h-10 bg-muted rounded"></div>
          ))}
        </div>
      </div>
    );
  }
  
  if (error || !stats) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="text-lg">
            {locale === 'zh-cn' ? '项目统计' : 'Project Statistics'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            {error || (locale === 'zh-cn' ? '无法加载统计数据' : 'Failed to load statistics')}
          </p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg">
          {locale === 'zh-cn' ? '项目统计' : 'Project Statistics'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">
                {locale === 'zh-cn' ? '浏览量' : 'Views'}
              </span>
            </div>
            <span className="text-sm">{stats.views}</span>
          </div>
          <Progress value={calculatePercentage(stats.views)} className="h-2" />
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Heart className="h-4 w-4 text-red-500" />
              <span className="text-sm font-medium">
                {locale === 'zh-cn' ? '点赞' : 'Likes'}
              </span>
            </div>
            <span className="text-sm">{stats.likes}</span>
          </div>
          <Progress value={calculatePercentage(stats.likes, 5)} className="h-2" />
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium">
                {locale === 'zh-cn' ? '评论' : 'Comments'}
              </span>
            </div>
            <span className="text-sm">{stats.comments}</span>
          </div>
          <Progress value={calculatePercentage(stats.comments, 8)} className="h-2" />
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookmarkIcon className="h-4 w-4 text-yellow-500" />
              <span className="text-sm font-medium">
                {locale === 'zh-cn' ? '收藏' : 'Bookmarks'}
              </span>
            </div>
            <span className="text-sm">{stats.bookmarks}</span>
          </div>
          <Progress value={calculatePercentage(stats.bookmarks, 5)} className="h-2" />
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Share2 className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium">
                {locale === 'zh-cn' ? '分享' : 'Shares'}
              </span>
            </div>
            <span className="text-sm">{stats.shares}</span>
          </div>
          <Progress value={calculatePercentage(stats.shares, 10)} className="h-2" />
        </div>
      </CardContent>
    </Card>
  );
} 