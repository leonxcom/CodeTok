'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'next/navigation'
import { Locale } from '../../../../i18n/config'
import { Button } from '@/components/ui/button'
import * as React from 'react'

// 添加动态加载标记，防止静态预渲染
export const dynamic = 'force-dynamic'

export default function IframeTestPage() {
  // 在Next.js 15中直接访问params属性
  const params = useParams()
  const locale = (params.locale as string) || 'zh-cn'
  
  const [url, setUrl] = useState('https://character-sample-project.netlify.app/')
  const [iframeLoaded, setIframeLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showLoadSuccess, setShowLoadSuccess] = useState(false)
  
  const handleUrlChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value)
    setIframeLoaded(false)
    setShowLoadSuccess(false)
    setError(null)
  }, [setUrl, setIframeLoaded, setShowLoadSuccess, setError])
  
  const handleIframeLoad = useCallback(() => {
    setIframeLoaded(true)
    setShowLoadSuccess(true)
    setError(null)
    
    // 2秒后隐藏成功提示
    setTimeout(() => {
      setShowLoadSuccess(false)
    }, 2000)
  }, [setIframeLoaded, setShowLoadSuccess, setError])
  
  const handleIframeError = useCallback(() => {
    setError(locale === 'zh-cn' ? '无法加载iframe内容' : 'Failed to load iframe content')
    setIframeLoaded(false)
    setShowLoadSuccess(false)
  }, [locale, setError, setIframeLoaded, setShowLoadSuccess])
  
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">
        {locale === 'zh-cn' ? 'iframe测试工具' : 'iframe Test Tool'}
      </h1>
      
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">
          {locale === 'zh-cn' ? '网址' : 'URL'}
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={url}
            onChange={handleUrlChange}
            className="flex-1 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="https://example.com"
          />
          <Button onClick={() => {
            setIframeLoaded(false)
            setShowLoadSuccess(false)
            setError(null)
            // 触发重新加载
            setTimeout(() => {
              const iframe = document.getElementById('test-iframe') as HTMLIFrameElement
              if (iframe) {
                iframe.src = url
              }
            }, 100)
          }}>
            {locale === 'zh-cn' ? '加载' : 'Load'}
          </Button>
        </div>
      </div>
      
      {showLoadSuccess && (
        <div className="mb-4 p-2 bg-green-100 text-green-800 rounded">
          {locale === 'zh-cn' ? '加载成功！' : 'Loaded successfully!'}
        </div>
      )}
      
      {error && (
        <div className="mb-4 p-2 bg-red-100 text-red-800 rounded">
          {error}
        </div>
      )}
      
      <div className="border rounded overflow-hidden h-[600px] relative">
        <iframe
          id="test-iframe"
          src={url}
          className="w-full h-full border-none"
          onLoad={handleIframeLoad}
          onError={handleIframeError}
        />
        
        {!iframeLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-800 mx-auto"></div>
              <p className="mt-4 text-gray-600">
                {locale === 'zh-cn' ? '加载中...' : 'Loading...'}
              </p>
            </div>
          </div>
        )}
      </div>
      
      <div className="mt-6 bg-gray-50 p-4 rounded text-sm">
        <h2 className="font-medium mb-2">
          {locale === 'zh-cn' ? '使用说明' : 'Instructions'}
        </h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>
            {locale === 'zh-cn' 
              ? '输入要测试的URL，点击加载按钮' 
              : 'Enter the URL you want to test and click the Load button'}
          </li>
          <li>
            {locale === 'zh-cn'
              ? '如果页面成功加载，将显示绿色成功提示'
              : 'If the page loads successfully, a green success message will be shown'}
          </li>
          <li>
            {locale === 'zh-cn'
              ? '如果出现错误，将显示红色错误提示'
              : 'If there is an error, a red error message will be shown'}
          </li>
        </ul>
      </div>
    </div>
  )
}