'use client'

import { useState } from 'react'
import { Locale } from '../../../../../i18n/config'

interface ExternalEmbedProps {
  url: string
  locale: Locale
}

export default function ExternalEmbed({ url, locale }: ExternalEmbedProps) {
  const [iframeLoaded, setIframeLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const handleIframeLoad = () => {
    console.log('iframe加载成功:', url)
    setIframeLoaded(true)
    setError(null)
  }
  
  const handleIframeError = () => {
    console.log('iframe加载失败:', url)
    setError(locale === 'zh-cn' ? '无法加载iframe内容' : 'Failed to load iframe content')
    setIframeLoaded(false)
  }
  
  const refreshIframe = () => {
    setIframeLoaded(false)
    setError(null)
    setTimeout(() => {
      const iframe = document.getElementById('external-iframe') as HTMLIFrameElement
      if (iframe) {
        iframe.src = iframe.src // 重新加载iframe
      }
    }, 100)
  }
  
  const openInNewWindow = () => {
    window.open(url, '_blank')
  }
  
  return (
    <div className="w-full h-full border rounded bg-white relative">
      {!iframeLoaded && !error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
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
      ></iframe>
      
      {/* 状态指示区 */}
      <div className="absolute top-2 right-2 z-30">
        <div className="flex gap-2">
          {iframeLoaded ? (
            <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
              {locale === 'zh-cn' ? '加载成功' : 'Loaded Successfully'}
            </span>
          ) : error ? (
            <div className="flex gap-2">
              <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">
                {error}
              </span>
              <button 
                onClick={refreshIframe}
                className="px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded-full text-xs"
              >
                {locale === 'zh-cn' ? '重试' : 'Retry'}
              </button>
              <button 
                onClick={openInNewWindow}
                className="px-2 py-1 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-full text-xs"
              >
                {locale === 'zh-cn' ? '在新窗口打开' : 'Open in new window'}
              </button>
            </div>
          ) : (
            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
              {locale === 'zh-cn' ? '加载中...' : 'Loading...'}
            </span>
          )}
        </div>
      </div>
    </div>
  )
} 