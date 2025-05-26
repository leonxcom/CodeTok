'use client'

import { useParams } from 'next/navigation';
import { NotificationList } from '@/components/notification-list';
import { useSession } from '@/lib/auth-client';
import { Locale } from '../../../../i18n/config';
import { useEffect } from 'react';
import { redirect } from 'next/navigation';

export default function NotificationsPage() {
  const params = useParams<{ locale: string }>();
  const locale = params?.locale as Locale || 'zh-cn';
  const { data: session, isPending, error } = useSession();
  
  // 如果未登录，重定向到登录页
  useEffect(() => {
    if (!isPending && !session?.user) {
      redirect(`/${locale}/auth?redirect=notifications`);
    }
  }, [isPending, session, locale]);
  
  // 如果正在加载，显示加载状态
  if (isPending) {
    return (
      <div className="container mx-auto py-12 flex justify-center">
        <div className="w-12 h-12 border-b-2 border-primary rounded-full animate-spin"></div>
      </div>
    );
  }
  
  // 如果未登录，显示加载状态（正在重定向）
  if (!session?.user) {
    return (
      <div className="container mx-auto py-12 flex justify-center">
        <p className="text-muted-foreground">正在重定向到登录页面...</p>
      </div>
    );
  }
  
  // 已认证状态
  return (
    <div className="container mx-auto py-12">
      <div className="max-w-2xl mx-auto">
        <NotificationList locale={locale} limit={50} />
      </div>
    </div>
  );
} 