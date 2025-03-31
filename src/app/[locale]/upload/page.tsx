'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useParams } from 'next/navigation'
import { Locale } from '../../../../i18n/config'

// 添加动态加载标记，防止静态预渲染
export const dynamic = 'force-dynamic'

// 扩展Input HTML属性类型以支持webkitdirectory
declare module 'react' {
  interface InputHTMLAttributes<T> extends HTMLAttributes<T> {
    webkitdirectory?: string;
    directory?: string;
  }
}

export default function UploadPage() {
  const router = useRouter()
  const params = useParams()
  const [locale, setLocale] = useState<Locale>('zh-cn')
  
  // 安全地处理locale参数
  useEffect(() => {
    if (params && typeof params.locale === 'string') {
      setLocale(params.locale as Locale)
    }
  }, [params])
  
  const [isDragging, setIsDragging] = useState(false)
  const [codeInput, setCodeInput] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const folderInputRef = useRef<HTMLInputElement>(null)
  
  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])
  
  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])
  
  const onDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const items = e.dataTransfer.items
    if (!items) return
    
    setIsUploading(true)
    setErrorMessage('')
    
    try {
      const formData = new FormData()
      
      // 处理文件或目录
      for (let i = 0; i < items.length; i++) {
        const item = items[i]
        
        // 如果是文件，直接添加
        if (item.kind === 'file') {
          const file = item.getAsFile()
          if (file) {
            formData.append('files', file)
          }
        }
      }
      
      // 发送到API
      const response = await fetch('/api/projects', {
        method: 'POST',
        body: formData
      })
      
      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.error || 'Upload failed')
      }
      
      // 导航到项目页面
      router.push(`/${locale}/project/${result.projectId}`)
    } catch (error) {
      console.error('Upload error:', error)
      setErrorMessage(typeof error === 'object' && error !== null && 'message' in error
        ? String(error.message)
        : locale === 'zh-cn' ? '上传失败，请重试' : 'Upload failed, please try again')
    } finally {
      setIsUploading(false)
    }
  }, [router, locale])
  
  const handleFileSelect = useCallback(async () => {
    fileInputRef.current?.click()
  }, [])
  
  const handleFolderSelect = useCallback(async () => {
    folderInputRef.current?.click()
  }, [])
  
  const handleFileInputChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return
    
    setIsUploading(true)
    setErrorMessage('')
    
    try {
      const formData = new FormData()
      
      // 添加所有文件到表单数据
      for (let i = 0; i < files.length; i++) {
        formData.append('files', files[i])
      }
      
      // 发送到API
      const response = await fetch('/api/projects', {
        method: 'POST',
        body: formData
      })
      
      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.error || 'Upload failed')
      }
      
      // 导航到项目页面
      router.push(`/${locale}/project/${result.projectId}`)
    } catch (error) {
      console.error('Upload error:', error)
      setErrorMessage(typeof error === 'object' && error !== null && 'message' in error
        ? String(error.message)
        : locale === 'zh-cn' ? '上传失败，请重试' : 'Upload failed, please try again')
    } finally {
      setIsUploading(false)
    }
  }, [router, locale])
  
  const handleSubmitCode = useCallback(async () => {
    if (!codeInput.trim()) {
      setErrorMessage(locale === 'zh-cn' ? '请输入代码' : 'Please enter code')
      return
    }
    
    setIsUploading(true)
    setErrorMessage('')
    
    try {
      // 发送到API
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          code: codeInput,
          filename: 'index.html' // 默认文件名
        })
      })
      
      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.error || 'Upload failed')
      }
      
      // 导航到项目页面
      router.push(`/${locale}/project/${result.projectId}`)
    } catch (error) {
      console.error('Upload error:', error)
      setErrorMessage(typeof error === 'object' && error !== null && 'message' in error
        ? String(error.message)
        : locale === 'zh-cn' ? '上传失败，请重试' : 'Upload failed, please try again')
    } finally {
      setIsUploading(false)
    }
  }, [codeInput, router, locale])
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-3xl font-bold text-center mb-8">
        {locale === 'zh-cn' ? '分享你的代码' : 'Share Your Code'}
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* 左侧：直接粘贴代码 */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">
            {locale === 'zh-cn' ? '粘贴代码' : 'Paste Code'}
          </h2>
          <textarea
            className="w-full h-64 p-3 border rounded-md font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder={locale === 'zh-cn' ? '在此粘贴你的代码...' : 'Paste your code here...'}
            value={codeInput}
            onChange={(e) => setCodeInput(e.target.value)}
          />
          <Button 
            className="w-full mt-4" 
            onClick={handleSubmitCode}
            disabled={isUploading}
          >
            {isUploading ? 
              (locale === 'zh-cn' ? '处理中...' : 'Processing...') : 
              (locale === 'zh-cn' ? '提交' : 'Submit')}
          </Button>
        </div>
        
        {/* 右侧：拖放上传 */}
        <div 
          className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center ${
            isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
          }`}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
        >
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-4">
              {locale === 'zh-cn' ? '拖放你的创作' : 'Drag & Drop Your Creation'}
            </h2>
            <p className="text-gray-600 mb-6">
              {locale === 'zh-cn' 
                ? 'HTML或TSX文件 | 包含HTML、CSS和JS文件的文件夹（＜10 MB）' 
                : 'HTML or TSX file | Folder with HTML, CSS, and JS files (＜10 MB)'}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="outline" onClick={handleFileSelect} disabled={isUploading}>
                {locale === 'zh-cn' ? '选择文件' : 'Select File'}
              </Button>
              <Button variant="outline" onClick={handleFolderSelect} disabled={isUploading}>
                {locale === 'zh-cn' ? '选择文件夹' : 'Select Folder'}
              </Button>
            </div>
            
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept=".html,.tsx,.css,.js"
              onChange={handleFileInputChange}
            />
            <input 
              type="file" 
              ref={folderInputRef} 
              className="hidden" 
              // @ts-ignore - 这些是标准但TypeScript不识别的属性
              webkitdirectory=""
              directory=""
              multiple
              onChange={handleFileInputChange}
            />
          </div>
        </div>
      </div>
      
      {/* 错误信息 */}
      {errorMessage && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {errorMessage}
        </div>
      )}
      
      {/* 上传状态 */}
      {isUploading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-sm w-full">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
              <h3 className="text-lg font-medium mb-2">
                {locale === 'zh-cn' ? '处理中...' : 'Processing...'}
              </h3>
              <p className="text-gray-600">
                {locale === 'zh-cn' ? '请稍候，我们正在处理您的文件' : 'Please wait while we process your files'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 