'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Locale } from '../../../../../i18n/config'
import { useEffect } from 'react'

export default function ProjectError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const params = useParams()
  const locale = (params.locale as string || 'zh-cn') as Locale
  
  useEffect(() => {
    // 记录错误到日志系统
    console.error('Project page error:', error)
  }, [error])
  
  const isZhCN = locale === 'zh-cn'
  
  return (
    <div className="flex h-screen items-center justify-center p-4">
      <div className="text-center max-w-md p-6 bg-white">
        <h1 className="text-2xl font-bold text-red-500 mb-4">
          {isZhCN ? '加载项目时出错' : 'Error Loading Project'}
        </h1>
        <p className="mb-6">
          {isZhCN 
            ? '加载项目数据时发生了问题。这可能是临时性问题，请尝试重新加载页面。' 
            : 'There was a problem loading the project data. This might be a temporary issue, please try reloading the page.'}
        </p>
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 justify-center">
          <Button onClick={reset} variant="default">
            {isZhCN ? '重试' : 'Try Again'}
          </Button>
          <Link href={`/${locale}`}>
            <Button variant="outline">
              {isZhCN ? '返回首页' : 'Back to Home'}
            </Button>
          </Link>
        </div>
        
        {error.message && (
          <p className="mt-6 text-sm text-gray-500 bg-gray-100 p-2 rounded">
            {error.message}
          </p>
        )}
      </div>
    </div>
  )
} 