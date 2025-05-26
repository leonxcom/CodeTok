'use client'

import { useState, useEffect, useCallback } from 'react'
import { Locale } from '../../../../../i18n/config'
import { Button } from '@/components/ui/button'
import { ExternalLink, RefreshCw, AlertCircle, Globe } from 'lucide-react'

interface ExternalEmbedProps {
  url: string
  locale: Locale
  title?: string
  description?: string
  author?: string
}

export default function ExternalEmbed({ url, locale, title, description, author }: ExternalEmbedProps) {
  const [iframeLoaded, setIframeLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showLoadSuccess, setShowLoadSuccess] = useState(false)
  const [retryCount, setRetryCount] = useState(0)
  const [showAlternativeView, setShowAlternativeView] = useState(false)
  
  // 获取域名
  const getDomain = (url: string) => {
    try {
      return new URL(url).hostname
    } catch {
      return url
    }
  }
  
  // 检查是否是已知的不支持iframe的网站
  const isKnownNonEmbeddable = (url: string) => {
    const nonEmbeddableDomains = [
      'chat.openai.com',
      'chatgpt.com',
      'github.com',
      'x.com',
      'twitter.com',
      'facebook.com',
      'instagram.com',
      'linkedin.com',
      'stackoverflow.com',
      'cursor.com',
      'www.cursor.com',
      'cursor.sh',
      'www.cursor.sh',
      'figma.com',
      'www.figma.com',
      'vercel.com',
      'console.cloud.google.com',
      'aws.amazon.com',
      'portal.azure.com'
    ]
    const domain = getDomain(url)
    return nonEmbeddableDomains.some(d => domain.includes(d) || d.includes(domain))
  }
  
  const handleIframeLoad = useCallback(() => {
    console.log('iframe加载成功:', url)
    setIframeLoaded(true)
    setShowLoadSuccess(true)
    setError(null)
    
    // 2秒后隐藏成功提示
    setTimeout(() => {
      setShowLoadSuccess(false)
    }, 2000)
  }, [url])
  
  const handleIframeError = useCallback(() => {
    console.log('iframe加载失败:', url)
    setError(locale === 'zh-cn' ? '无法在iframe中加载此网站' : 'Cannot load this website in iframe')
    setIframeLoaded(false)
    setShowLoadSuccess(false)
    
    // 如果是已知不支持iframe的网站，直接显示替代方案
    if (isKnownNonEmbeddable(url)) {
      setTimeout(() => {
        setShowAlternativeView(true)
      }, 1000)
    }
  }, [url, locale])
  
  const refreshIframe = useCallback(() => {
    setRetryCount(prev => prev + 1)
    setIframeLoaded(false)
    setError(null)
    setShowLoadSuccess(false)
    setShowAlternativeView(false)
    
    setTimeout(() => {
      const iframe = document.getElementById('external-iframe') as HTMLIFrameElement
      if (iframe) {
        iframe.src = iframe.src + (iframe.src.includes('?') ? '&' : '?') + 'retry=' + Date.now()
      }
    }, 100)
  }, [])
  
  const openInNewWindow = useCallback(() => {
    window.open(url, '_blank', 'noopener,noreferrer')
  }, [url])
  
  // 如果重试次数过多或显示替代视图，显示友好的界面
  if (showAlternativeView || retryCount >= 2) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 border rounded-lg">
        <div className="max-w-md text-center p-8">
          <div className="mb-6">
            <Globe className="w-16 h-16 text-blue-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {title || (locale === 'zh-cn' ? '外部项目' : 'External Project')}
            </h3>
            {description && (
              <p className="text-gray-600 mb-4">{description}</p>
            )}
            {author && (
              <p className="text-sm text-gray-500 mb-4">
                {locale === 'zh-cn' ? '作者: ' : 'Author: '}{author}
              </p>
            )}
          </div>
          
          <div className="bg-white/80 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-center mb-3">
              <AlertCircle className="w-5 h-5 text-amber-500 mr-2" />
              <span className="text-sm font-medium text-gray-700">
                {locale === 'zh-cn' ? '无法嵌入显示' : 'Cannot display embedded'}
              </span>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              {locale === 'zh-cn' 
                ? `${getDomain(url)} 不允许在iframe中显示其内容。这是为了安全考虑的常见做法。`
                : `${getDomain(url)} doesn't allow its content to be displayed in an iframe. This is a common security practice.`
              }
            </p>
          </div>
          
          <div className="space-y-3">
            <Button 
              onClick={openInNewWindow}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              size="lg"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              {locale === 'zh-cn' ? '在新窗口中访问' : 'Visit in New Window'}
            </Button>
            
            <Button 
              onClick={refreshIframe}
              variant="outline"
              className="w-full"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              {locale === 'zh-cn' ? '重试嵌入显示' : 'Retry Embedding'}
            </Button>
          </div>
          
          <div className="mt-4 text-xs text-gray-500">
            {locale === 'zh-cn' ? '项目链接: ' : 'Project URL: '}
            <span className="font-mono bg-white/50 px-2 py-1 rounded">
              {getDomain(url)}
            </span>
          </div>
        </div>
      </div>
    )
  }
  
  return (
    <div className="w-full h-full border rounded bg-white relative">
      {!iframeLoaded && !error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-sm text-gray-600">
            {locale === 'zh-cn' ? '正在加载项目...' : 'Loading project...'}
          </p>
          <p className="text-xs text-gray-400 mt-2">
            {getDomain(url)}
          </p>
        </div>
      )}
      
      <iframe
        id="external-iframe"
        src={url}
        className="w-full h-full border-0"
        onLoad={handleIframeLoad}
        onError={handleIframeError}
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals allow-pointer-lock"
        allow="accelerometer; camera; encrypted-media; geolocation; gyroscope; microphone; midi"
        loading="lazy"
      ></iframe>
      
      {/* 状态指示区 */}
      <div className="absolute top-4 right-4 z-30">
        <div className="flex gap-2">
          {showLoadSuccess ? (
            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium shadow-sm">
              {locale === 'zh-cn' ? '✓ 加载成功' : '✓ Loaded Successfully'}
            </span>
          ) : error ? (
            <div className="flex gap-2">
              <Button 
                onClick={() => setShowAlternativeView(true)}
                size="sm"
                variant="outline"
                className="bg-white/90 backdrop-blur-sm"
              >
                {locale === 'zh-cn' ? '查看详情' : 'View Details'}
              </Button>
              <Button 
                onClick={openInNewWindow}
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <ExternalLink className="w-3 h-3 mr-1" />
                {locale === 'zh-cn' ? '打开' : 'Open'}
              </Button>
            </div>
          ) : !iframeLoaded && (
            <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium shadow-sm">
              {locale === 'zh-cn' ? '⏳ 加载中...' : '⏳ Loading...'}
            </span>
          )}
        </div>
      </div>
    </div>
  )
} 