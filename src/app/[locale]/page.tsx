'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useParams } from 'next/navigation'
import { Locale } from '../../../i18n/config'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'
import { sql } from '@vercel/postgres'
import { safeQuery } from '@/db'

type IndexPageProps = {
  params: {
    locale: string
  }
}

// 定义项目查询结果类型，使其与sql查询结果兼容
interface ProjectQueryResult {
  rows: any[];
  rowCount: number;
}

// 主页组件 - 服务器端重定向
export default function IndexPage({ params }: IndexPageProps) {
  // 获取区域设置
  const locale = params.locale;
  
  console.log('首页重定向 - 开始执行，区域设置:', locale);
  
  // 使用角色样本项目ID (CAbUiIo=) 重定向
  const projectId = 'CAbUiIo=';
  const redirectUrl = `/${locale}/project/${projectId}`;
  console.log('使用角色样本项目ID:', projectId, '重定向到:', redirectUrl);
  
  // 重定向到项目页面
  redirect(redirectUrl);
}
