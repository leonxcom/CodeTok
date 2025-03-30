'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Locale } from '../../../i18n/config'

// 项目类型
interface Project {
  projectId: string
  files: string[]
  mainFile: string
  fileContents: Record<string, string>
}

export default function IndexPage() {
  const router = useRouter()
  const params = useParams()
  const locale = params.locale as Locale
  
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // 获取随机项目
  const fetchRandomProject = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/projects/random')
      
      if (!response.ok) {
        // 如果没有项目，不显示错误，只是不显示项目部分
        if (response.status === 404) {
          setProject(null)
          return
        }
        
        throw new Error(
          locale === 'zh-cn' 
            ? '无法加载随机项目'
            : 'Failed to load random project'
        )
      }
      
      const data = await response.json()
      setProject(data)
    } catch (error) {
      console.error('Error loading random project:', error)
      setError(
        typeof error === 'object' && error !== null && 'message' in error
          ? String(error.message)
          : locale === 'zh-cn' 
            ? '加载随机项目失败'
            : 'Failed to load random project'
      )
    } finally {
      setLoading(false)
    }
  }
  
  // 首次加载时获取随机项目
  useEffect(() => {
    fetchRandomProject()
  }, [locale])
  
  // 跳转到随机项目页面
  const handleRandomProject = async () => {
    try {
      const response = await fetch('/api/projects/random')
      
      if (!response.ok) {
        throw new Error(
          locale === 'zh-cn' 
            ? '无法加载随机项目'
            : 'Failed to load random project'
        )
      }
      
      const data = await response.json()
      router.push(`/${locale}/project/${data.projectId}`)
    } catch (error) {
      console.error('Error navigating to random project:', error)
      alert(
        locale === 'zh-cn' 
          ? '加载随机项目失败，请稍后再试'
          : 'Failed to load random project, please try again later'
      )
    }
  }
  
  // 获取文件类型
  const getFileType = (filename: string) => {
    const extension = filename.split('.').pop()?.toLowerCase()
    switch (extension) {
      case 'html': return 'HTML'
      case 'css': return 'CSS'
      case 'js': case 'jsx': case 'ts': case 'tsx': return 'JavaScript'
      default: return 'Code'
    }
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <header className="flex justify-between items-center mb-8">
        <div></div>
        <div className="flex space-x-4">
          {/* 上传按钮已移至导航栏 */}
        </div>
      </header>
      
      {!loading && !error && project && (
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">
              {locale === 'zh-cn' ? '精选项目' : 'Featured Project'}
            </h2>
            <Link href={`/${locale}/project/${project.projectId}`}>
              <Button variant="outline">
                {locale === 'zh-cn' ? '查看完整项目' : 'View Full Project'}
              </Button>
            </Link>
          </div>
          
          {/* 展示第一个文件的内容 */}
          {project.files.length > 0 && (
            <div className="border rounded-lg overflow-hidden">
              <div className="bg-gray-100 p-2 border-b flex justify-between items-center">
                <span className="text-sm font-medium">{project.mainFile}</span>
                <span className="text-xs bg-gray-200 px-2 py-1 rounded">
                  {getFileType(project.mainFile)}
                </span>
              </div>
              <pre className="p-4 overflow-x-auto bg-white text-sm max-h-80">
                <code>{project.fileContents[project.mainFile]}</code>
              </pre>
            </div>
          )}
        </div>
      )}
      
      {loading && (
        <div className="py-12 flex justify-center">
          <div className="w-12 h-12 border-4 border-t-blue-500 border-gray-200 rounded-full animate-spin"></div>
        </div>
      )}
      
      {error && (
        <div className="py-8 text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={fetchRandomProject}>
            {locale === 'zh-cn' ? '重试' : 'Retry'}
          </Button>
        </div>
      )}
      
      <div className="flex justify-center mt-12">
        <Button
          onClick={handleRandomProject}
          variant="outline"
          className="rounded-full p-6 transition-all duration-300 flex items-center justify-center text-2xl hover:bg-primary/10 group relative"
        >
          <span className="text-3xl group-hover:animate-spin">🎲</span>
          <span className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 whitespace-nowrap bg-black/80 text-white px-3 py-1 rounded-md text-sm opacity-0 group-hover:opacity-100 transition-opacity">
            {locale === 'zh-cn' ? '随机前往下一个项目' : 'Random Next Project'}
          </span>
        </Button>
      </div>
      
      <div className="text-center mt-4 text-gray-600">
        {locale === 'zh-cn' ? '点击骰子随机浏览项目' : 'Click the dice to browse random projects'}
      </div>
      
      <footer className="mt-16 pt-8 border-t text-center text-gray-500 text-sm">
        <p>{locale === 'zh-cn' ? '不要把代码藏起来 - 与世界分享它' : 'Don\'t Keep Your Code to Yourself - Share It With the World'}</p>
      </footer>
    </div>
  )
}
