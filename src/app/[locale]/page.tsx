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

export const dynamic = 'force-dynamic'

export default async function IndexPage({
  params: { locale }
}: {
  params: { locale: Locale }
}) {
  console.log('首页重定向 - 开始执行，区域设置:', locale)

  try {
    // 首先尝试获取示例项目
    const projectId = 'CAbUiIo='
    const result = await sql`
      SELECT project_id FROM projects 
      WHERE project_id = ${projectId}
    `

    if (result.rows.length > 0) {
      // 如果示例项目存在，重定向到该项目
      const redirectUrl = `/${locale}/project/${projectId}`
      console.log('示例项目存在，重定向到:', redirectUrl)
      redirect(redirectUrl)
    }

    // 如果示例项目不存在，尝试获取最新的公开项目
    const latestProject = await sql`
      SELECT project_id FROM projects
      WHERE is_public = true
      ORDER BY created_at DESC
      LIMIT 1
    `

    if (latestProject.rows.length > 0) {
      // 如果有公开项目，重定向到最新的项目
      const redirectUrl = `/${locale}/project/${latestProject.rows[0].project_id}`
      console.log('重定向到最新项目:', redirectUrl)
      redirect(redirectUrl)
    }

    // 如果没有任何项目，重定向到上传页面
    console.log('没有可用项目，重定向到上传页面')
    redirect(`/${locale}/upload`)
  } catch (error) {
    console.error('数据库查询错误:', error)
    // 发生错误时重定向到上传页面
    redirect(`/${locale}/upload`)
  }
}
