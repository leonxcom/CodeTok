'use client'

import { useState, useEffect, useRef } from 'react'
import { useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Locale } from '../../../../../i18n/config'
import { renderTSX } from '@/lib/tsx-compiler'

interface ProjectData {
  projectId: string
  title?: string
  description?: string
  files: string[]
  mainFile: string
  fileContents: Record<string, string>
  hasTsxFiles?: boolean
  views?: number
  createdAt?: string
}

export default function ProjectPage() {
  const params = useParams()
  const locale = params.locale as Locale
  const projectId = params.id as string
  
  const [projectData, setProjectData] = useState<ProjectData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<string | null>(null)
  const [showingFrame, setShowingFrame] = useState(true)
  const tsxPreviewRef = useRef<HTMLDivElement>(null)
  
  // 加载项目数据
  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        const response = await fetch(`/api/projects/${projectId}`)
        
        if (!response.ok) {
          throw new Error(
            locale === 'zh-cn' 
              ? '无法加载项目，请检查链接是否正确'
              : 'Failed to load project, please check if the link is correct'
          )
        }
        
        const data = await response.json()
        setProjectData(data)
        setSelectedFile(data.mainFile)
      } catch (error) {
        console.error('Error loading project:', error)
        setError(
          typeof error === 'object' && error !== null && 'message' in error
            ? String(error.message)
            : locale === 'zh-cn' 
              ? '加载项目失败'
              : 'Failed to load project'
        )
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchProjectData()
  }, [projectId, locale])
  
  // 渲染TSX文件
  useEffect(() => {
    if (
      !isLoading && 
      projectData && 
      selectedFile && 
      selectedFile.endsWith('.tsx') && 
      !showingFrame && 
      tsxPreviewRef.current
    ) {
      const tsxCode = projectData.fileContents[selectedFile]
      renderTSX(tsxCode, tsxPreviewRef.current)
    }
  }, [isLoading, projectData, selectedFile, showingFrame])
  
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
      window.location.href = `/${locale}/project/${data.projectId}`
    } catch (error) {
      console.error('Error loading random project:', error)
      alert(
        locale === 'zh-cn' 
          ? '加载随机项目失败，请稍后再试'
          : 'Failed to load random project, please try again later'
      )
    }
  }
  
  const toggleFrame = () => {
    setShowingFrame(!showingFrame)
  }
  
  const getFileType = (filename: string) => {
    const extension = filename.split('.').pop()?.toLowerCase()
    switch (extension) {
      case 'html': return 'HTML'
      case 'css': return 'CSS'
      case 'js': case 'jsx': case 'ts': case 'tsx': return 'JavaScript'
      default: return 'Code'
    }
  }
  
  // 是否为TSX文件
  const isTsxFile = selectedFile?.endsWith('.tsx')
  
  // 构建预览URL
  const previewUrl = showingFrame && projectData?.mainFile
    ? projectData.fileContents[projectData.mainFile].startsWith('http')
      ? projectData.fileContents[projectData.mainFile]
      : `/api/preview/${projectId}/${projectData.mainFile}`
    : ''
  
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-blue-500 border-gray-200 rounded-full animate-spin mx-auto mb-4"></div>
          <p>{locale === 'zh-cn' ? '加载中...' : 'Loading...'}</p>
        </div>
      </div>
    )
  }
  
  if (error || !projectData) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center max-w-md p-6 bg-white rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold text-red-500 mb-4">
            {locale === 'zh-cn' ? '错误' : 'Error'}
          </h1>
          <p className="mb-6">{error}</p>
          <Link href={`/${locale}`}>
            <Button>
              {locale === 'zh-cn' ? '返回首页' : 'Back to Home'}
            </Button>
          </Link>
        </div>
      </div>
    )
  }
  
  return (
    <div className="flex flex-col h-screen">
      {/* 顶部导航 */}
      <div className="bg-white shadow-sm p-4 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Link href={`/${locale}`}>
            <Button variant="outline">
              {locale === 'zh-cn' ? '首页' : 'Home'}
            </Button>
          </Link>
          <Button 
            onClick={handleRandomProject} 
            variant="outline"
            className="group relative"
          >
            <span className="text-2xl group-hover:animate-spin">🎲</span>
            <span className="sr-only">{locale === 'zh-cn' ? '随机项目' : 'Random Project'}</span>
          </Button>
          
          {projectData.title && (
            <h1 className="text-lg font-medium ml-2">{projectData.title}</h1>
          )}
        </div>
        
        <div className="flex items-center space-x-4">
          {projectData.views !== undefined && (
            <span className="text-sm text-gray-500">
              👁️ {projectData.views}
            </span>
          )}
          <Button 
            variant="outline" 
            onClick={toggleFrame}
          >
            {showingFrame 
              ? (locale === 'zh-cn' ? '移除边框' : 'Remove Frame') 
              : (locale === 'zh-cn' ? '显示边框' : 'Show Frame')}
          </Button>
        </div>
      </div>
      
      {/* 项目描述 */}
      {projectData.description && (
        <div className="bg-gray-50 px-4 py-2 border-b">
          <p className="text-sm text-gray-700">{projectData.description}</p>
        </div>
      )}
      
      {/* 主内容区 */}
      <div className="flex flex-1 overflow-hidden">
        {/* 左侧：文件列表 */}
        <div className="w-64 bg-gray-100 overflow-y-auto p-4 border-r">
          <h2 className="font-semibold mb-3">
            {locale === 'zh-cn' ? '项目文件' : 'Project Files'}
          </h2>
          <ul className="space-y-1">
            {projectData.files.map((file) => (
              <li key={file}>
                <button
                  className={`w-full text-left py-1 px-2 rounded text-sm hover:bg-gray-200 truncate ${
                    selectedFile === file ? 'bg-gray-200 font-medium' : ''
                  }`}
                  onClick={() => setSelectedFile(file)}
                >
                  {file}
                </button>
              </li>
            ))}
          </ul>
        </div>
        
        {/* 主内容区 */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {showingFrame ? (
            // 代码预览
            <iframe
              src={previewUrl}
              className="w-full h-full border-0"
              title="Code Preview"
              sandbox="allow-scripts allow-same-origin"
            />
          ) : (
            // 代码编辑器视图
            <div className="flex flex-col h-full">
              {selectedFile && (
                <>
                  <div className="bg-gray-800 text-white py-2 px-4 text-sm font-mono flex justify-between items-center">
                    <div>{selectedFile} - {getFileType(selectedFile)}</div>
                    {isTsxFile && (
                      <div className="flex space-x-2">
                        <span className="px-2 py-1 bg-blue-600 text-xs rounded">TSX</span>
                      </div>
                    )}
                  </div>
                  
                  {isTsxFile ? (
                    // TSX文件预览模式
                    <div className="flex flex-col h-full">
                      <div className="bg-gray-50 flex-1 overflow-auto">
                        {/* TSX编译预览区 */}
                        <div ref={tsxPreviewRef} className="h-full w-full"></div>
                      </div>
                      <div className="bg-gray-100 p-2 border-t">
                        <div className="font-mono text-xs p-2 bg-white rounded border">
                          <pre className="whitespace-pre-wrap">{projectData.fileContents[selectedFile]}</pre>
                        </div>
                      </div>
                    </div>
                  ) : (
                    // 普通代码预览
                    <pre className="flex-1 overflow-auto p-4 bg-gray-50 font-mono text-sm">
                      {projectData.fileContents[selectedFile]}
                    </pre>
                  )}
                </>
              )}
            </div>
          )}
        </div>
        
        {/* 右侧交互按钮 */}
        <div className="fixed right-4 top-1/2 transform -translate-y-1/2 flex flex-col space-y-3">
          <button
            className="w-12 h-12 rounded-full bg-white shadow-md flex items-center justify-center text-gray-700 hover:bg-gray-100"
            title={locale === 'zh-cn' ? '点赞' : 'Like'}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
          <button
            className="w-12 h-12 rounded-full bg-white shadow-md flex items-center justify-center text-gray-700 hover:bg-gray-100"
            title={locale === 'zh-cn' ? '评论' : 'Comment'}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </button>
          <button
            className="w-12 h-12 rounded-full bg-white shadow-md flex items-center justify-center text-gray-700 hover:bg-gray-100"
            title={locale === 'zh-cn' ? '收藏' : 'Favorite'}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          </button>
          <button
            className="w-12 h-12 rounded-full bg-white shadow-md flex items-center justify-center text-gray-700 hover:bg-gray-100"
            title={locale === 'zh-cn' ? '分享' : 'Share'}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
} 