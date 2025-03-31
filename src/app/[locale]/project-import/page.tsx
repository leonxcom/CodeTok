'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Locale } from '../../../../i18n/config'
import Link from 'next/link'

// 添加动态加载标记，防止静态预渲染
export const dynamic = 'force-dynamic'

export default function ProjectImportPage() {
  // 在组件顶层调用useParams，但不立即使用它
  const params = useParams()
  
  // 默认值作为后备方案
  const [locale, setLocale] = useState<Locale>('zh-cn')
  const [url, setUrl] = useState('https://character-sample-project.netlify.app/')
  const [projectName, setProjectName] = useState('Character Controller Sample')
  const [description, setDescription] = useState('Simple character controller sample projects with customizable GUIs controls')
  const [author, setAuthor] = useState('I▲N CURTIS')
  const [iframeLoaded, setIframeLoaded] = useState(false)
  const [isImporting, setIsImporting] = useState(false)
  const [importSuccess, setImportSuccess] = useState(false)
  const [importedProjectId, setImportedProjectId] = useState('')
  const [error, setError] = useState<string | null>(null)
  
  // 使用useEffect以确保在客户端运行时安全地访问params
  useEffect(() => {
    if (params && typeof params.locale === 'string') {
      setLocale(params.locale as Locale)
    }
  }, [params])
  
  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value)
    setIframeLoaded(false)
    setError(null)
  }
  
  const handleIframeLoad = () => {
    setIframeLoaded(true)
    setError(null)
  }
  
  const handleIframeError = () => {
    setError(locale === 'zh-cn' ? '无法加载iframe内容' : 'Failed to load iframe content')
    setIframeLoaded(false)
  }
  
  const handleImport = async () => {
    setIsImporting(true)
    setError(null)
    
    try {
      // 这里模拟导入过程，实际项目中应该调用API
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // 模拟成功导入
      setImportSuccess(true)
      setImportedProjectId('imported-project-' + Math.floor(Math.random() * 1000))
    } catch (err) {
      setError(locale === 'zh-cn' ? '导入失败' : 'Import failed')
    } finally {
      setIsImporting(false)
    }
  }
  
  return (
    <div className="container mx-auto p-4 max-w-5xl">
      <h1 className="text-2xl font-bold mb-6">
        {locale === 'zh-cn' ? '导入外部项目' : 'Import External Project'}
      </h1>
      
      {importSuccess ? (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
          <div className="text-5xl mb-4">🎉</div>
          <h2 className="text-xl font-bold text-green-700 mb-2">
            {locale === 'zh-cn' ? '项目导入成功！' : 'Project Imported Successfully!'}
          </h2>
          <p className="mb-6 text-green-600">
            {locale === 'zh-cn' 
              ? '项目已成功添加到VibeTok平台'
              : 'The project has been added to the VibeTok platform'}
          </p>
          <div className="flex justify-center gap-4">
            <Link 
              href={`/${locale}/project/${importedProjectId}`}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              {locale === 'zh-cn' ? '查看项目' : 'View Project'}
            </Link>
            <button
              onClick={() => {
                setImportSuccess(false)
                setUrl('')
                setProjectName('')
                setDescription('')
                setIframeLoaded(false)
              }}
              className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
            >
              {locale === 'zh-cn' ? '导入另一个项目' : 'Import Another Project'}
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">
                {locale === 'zh-cn' ? '项目信息' : 'Project Information'}
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block mb-1 font-medium text-gray-700">
                    {locale === 'zh-cn' ? '项目URL' : 'Project URL'}
                  </label>
                  <input
                    type="text"
                    value={url}
                    onChange={handleUrlChange}
                    className="w-full p-2 border rounded"
                    placeholder="https://example.netlify.app"
                  />
                </div>
                
                <div>
                  <label className="block mb-1 font-medium text-gray-700">
                    {locale === 'zh-cn' ? '项目名称' : 'Project Name'}
                  </label>
                  <input
                    type="text"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    className="w-full p-2 border rounded"
                  />
                </div>
                
                <div>
                  <label className="block mb-1 font-medium text-gray-700">
                    {locale === 'zh-cn' ? '项目描述' : 'Project Description'}
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    className="w-full p-2 border rounded"
                  />
                </div>
                
                <div>
                  <label className="block mb-1 font-medium text-gray-700">
                    {locale === 'zh-cn' ? '作者' : 'Author'}
                  </label>
                  <input
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="w-full p-2 border rounded"
                  />
                </div>
                
                <button
                  onClick={handleImport}
                  disabled={isImporting || !iframeLoaded}
                  className={`w-full py-2 px-4 rounded-md text-white font-medium ${
                    isImporting || !iframeLoaded
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700'
                  } transition-colors`}
                >
                  {isImporting ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {locale === 'zh-cn' ? '导入中...' : 'Importing...'}
                    </span>
                  ) : (
                    locale === 'zh-cn' ? '导入到VibeTok' : 'Import to VibeTok'
                  )}
                </button>
              </div>
            </div>
            
            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md">
                {error}
              </div>
            )}
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-4">
              {locale === 'zh-cn' ? '项目预览' : 'Project Preview'}
            </h2>
            
            <div className="relative bg-white rounded-lg shadow-md overflow-hidden">
              <div className="aspect-video relative">
                {!iframeLoaded && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-50 z-10">
                    <div className="text-center">
                      <div className="animate-spin inline-block h-8 w-8 border-b-2 border-blue-600 rounded-full mb-2"></div>
                      <div className="text-sm text-gray-500">
                        {locale === 'zh-cn' ? '加载预览...' : 'Loading preview...'}
                      </div>
                    </div>
                  </div>
                )}
                
                <iframe
                  src={url}
                  className="w-full h-full border-0"
                  onLoad={handleIframeLoad}
                  onError={handleIframeError}
                  sandbox="allow-scripts allow-same-origin allow-forms"
                  allow="accelerometer; camera; encrypted-media; geolocation; gyroscope; microphone; midi"
                ></iframe>
              </div>
              
              <div className="p-4 border-t">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-medium">{projectName}</div>
                  <div className="text-xs text-gray-500">netlify.app</div>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <span className="mr-2">
                    {locale === 'zh-cn' ? '作者:' : 'By:'}
                  </span>
                  <span>{author}</span>
                </div>
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-100 text-yellow-800 rounded-md text-sm">
              <div className="font-medium mb-1">
                {locale === 'zh-cn' ? '注意:' : 'Note:'}
              </div>
              <p>
                {locale === 'zh-cn'
                  ? '只有公开可访问且允许嵌入的网站才能被导入。某些功能可能在VibeTok平台上受限。'
                  : 'Only publicly accessible websites that allow embedding can be imported. Some features may be limited on the VibeTok platform.'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 