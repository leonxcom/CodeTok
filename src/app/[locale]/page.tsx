'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useParams } from 'next/navigation'
import { Locale } from '../../../i18n/config'

export default function IndexPage() {
  const router = useRouter()
  const params = useParams()
  const locale = params.locale as Locale
  
  useEffect(() => {
    const redirectToRandomProject = async () => {
      try {
        const response = await fetch('/api/projects/random')
        
        if (response.ok) {
          const data = await response.json()
          router.push(`/${locale}/project/${data.projectId}`)
        } else {
          // 如果没有随机项目可用，保持在首页但显示空白加载状态
          console.error('No random projects available')
        }
      } catch (error) {
        console.error('Error navigating to random project:', error)
      }
    }
    
    redirectToRandomProject()
  }, [locale, router])
  
  // 返回一个加载指示器，直到重定向完成
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-t-blue-500 border-gray-200 rounded-full animate-spin mx-auto mb-4"></div>
        <p>{locale === 'zh-cn' ? '加载中...' : 'Loading...'}</p>
      </div>
    </div>
  )
}
