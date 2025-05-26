'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from '@/lib/auth-client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { User, Mail, Calendar, LogOut } from 'lucide-react';

interface ProfilePageProps {
  params: Promise<{
    locale: string;
  }>;
}

export default function ProfilePage({ params }: ProfilePageProps) {
  const router = useRouter();
  const { data: session, isPending, error } = useSession();

  useEffect(() => {
    // 如果用户未登录，重定向到登录页面
    if (!isPending && !session?.user) {
      params.then(({ locale }) => {
        router.push(`/${locale}/auth`);
      });
    }
  }, [isPending, session, router, params]);

  const handleSignOut = async () => {
    try {
      await signOut();
      const { locale } = await params;
      router.push(`/${locale}`);
    } catch (error) {
      console.error('登出失败:', error);
    }
  };

  if (isPending) {
    return (
      <div className="container max-w-4xl mx-auto py-10">
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-t-transparent border-primary"></div>
        </div>
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="container max-w-4xl mx-auto py-10">
        <div className="flex items-center justify-center min-h-[50vh]">
          <p className="text-muted-foreground">正在重定向到登录页面...</p>
        </div>
      </div>
    );
  }

  const user = session.user;

  return (
    <div className="container max-w-4xl mx-auto py-10">
      <div className="space-y-6">
        {/* 页面标题 */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">个人资料</h1>
            <p className="text-muted-foreground">管理您的账户信息和设置</p>
          </div>
          <Button variant="outline" onClick={handleSignOut}>
            <LogOut className="mr-2 h-4 w-4" />
            退出登录
          </Button>
        </div>

        {/* 用户信息卡片 */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={user?.image || ''} alt={user?.name || ''} />
                <AvatarFallback className="text-lg">
                  {user?.name?.[0] || user?.email?.[0] || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <CardTitle className="text-2xl">
                  {user?.name || '未设置用户名'}
                </CardTitle>
                <CardDescription className="flex items-center">
                  <Mail className="mr-2 h-4 w-4" />
                  {user?.email}
                </CardDescription>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary">
                    <User className="mr-1 h-3 w-3" />
                    用户
                  </Badge>
                  {user?.createdAt && (
                    <Badge variant="outline">
                      <Calendar className="mr-1 h-3 w-3" />
                      加入于 {new Date(user.createdAt).toLocaleDateString('zh-CN')}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* 账户详情 */}
        <Card>
          <CardHeader>
            <CardTitle>账户详情</CardTitle>
            <CardDescription>您的账户基本信息</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">用户ID</label>
                <p className="text-sm font-mono bg-muted px-2 py-1 rounded mt-1">
                  {user?.id}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">邮箱地址</label>
                <p className="text-sm mt-1">{user?.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">显示名称</label>
                <p className="text-sm mt-1">{user?.name || '未设置'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">账户状态</label>
                <div className="mt-1">
                  <Badge variant="default">
                  活跃
                </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 会话信息 */}
        <Card>
          <CardHeader>
            <CardTitle>会话信息</CardTitle>
            <CardDescription>当前登录会话的详细信息</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div>
                <label className="text-sm font-medium text-muted-foreground">会话状态</label>
                <div className="text-sm mt-1">
                  <Badge variant="default">已认证</Badge>
                </div>
              </div>
              {session?.session?.expiresAt && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">会话过期时间</label>
                  <p className="text-sm mt-1">
                    {new Date(session.session.expiresAt).toLocaleString('zh-CN')}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* 调试信息（开发环境） */}
        {process.env.NODE_ENV === 'development' && (
          <Card>
            <CardHeader>
              <CardTitle>调试信息</CardTitle>
              <CardDescription>开发环境下的会话数据</CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="text-xs bg-muted p-4 rounded overflow-auto">
                {JSON.stringify(session, null, 2)}
              </pre>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
} 