'use client'

import { useState, useEffect, useRef } from 'react'
import { useParams, notFound, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Locale } from '../../../../../i18n/config'
import { renderTSX } from '@/lib/tsx-compiler'
import ExternalEmbed from './external-embed'
import { toast } from '@/components/ui/use-toast'
import Image from 'next/image'

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
  externalEmbed?: boolean
  externalUrl?: string
  externalAuthor?: string
}

export default function ProjectPage() {
  const params = useParams()
  const locale = params.locale as Locale
  const projectId = params.id as string
  const router = useRouter()
  
  const [projectData, setProjectData] = useState<ProjectData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<string | null>(null)
  const [showingFrame, setShowingFrame] = useState(true)
  const tsxPreviewRef = useRef<HTMLDivElement>(null)
  
  // 互动状态
  const [isLiked, setIsLiked] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [likesCount, setLikesCount] = useState(0)
  const [commentsCount, setCommentsCount] = useState(0)
  
  // 渐进式加载状态
  const [basicInfoLoaded, setBasicInfoLoaded] = useState(false)
  const [filesLoaded, setFilesLoaded] = useState(false)
  const [uiFrameworkLoaded, setUiFrameworkLoaded] = useState(false)
  
  // 处理外部项目显示逻辑
  const isExternalProject = projectData?.externalEmbed && projectData?.externalUrl;
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [iframeError, setIframeError] = useState<string | null>(null);
  const [shouldLoadIframe, setShouldLoadIframe] = useState(false);
  
  // 添加浏览历史管理
  const [viewHistory, setViewHistory] = useState<string[]>([]);
  const [historyPosition, setHistoryPosition] = useState(-1);
  
  // 初始化历史记录
  useEffect(() => {
    // 从 sessionStorage 恢复历史记录，如果有的话
    try {
      const savedHistory = sessionStorage.getItem('projectHistory');
      const savedPosition = sessionStorage.getItem('historyPosition');
      
      if (savedHistory) {
        const parsedHistory = JSON.parse(savedHistory);
        setViewHistory(parsedHistory);
        
        // 找到当前项目在历史中的位置
        const positionInHistory = parsedHistory.indexOf(projectId);
        
        if (positionInHistory >= 0) {
          // 如果当前项目在历史中，设置位置
          setHistoryPosition(positionInHistory);
        } else {
          // 如果当前项目不在历史中，添加到历史末尾
          const newHistory = [...parsedHistory, projectId];
          setViewHistory(newHistory);
          setHistoryPosition(newHistory.length - 1);
          sessionStorage.setItem('projectHistory', JSON.stringify(newHistory));
        }
      } else {
        // 没有历史记录，初始化为只包含当前项目的数组
        setViewHistory([projectId]);
        setHistoryPosition(0);
        sessionStorage.setItem('projectHistory', JSON.stringify([projectId]));
      }
      
      // 历史位置可能存在但不适用于新的历史数组，这里忽略
    } catch (e) {
      console.error('Error initializing project history:', e);
      // 出错时使用默认值
      setViewHistory([projectId]);
      setHistoryPosition(0);
    }
  }, [projectId]);
  
  // 处理iframe加载事件 - 与iframe-test完全一致
  const handleIframeLoad = () => {
    console.log('iframe加载成功:', projectData?.externalUrl);
    setIframeLoaded(true);
    setIframeError(null);
  };
  
  // 处理iframe错误事件 - 与iframe-test完全一致
  const handleIframeError = () => {
    console.log('iframe加载失败:', projectData?.externalUrl);
    setIframeError(locale === 'zh-cn' ? '无法加载iframe内容' : 'Failed to load iframe content');
    setIframeLoaded(false);
  };
  
  // 强制刷新iframe - 与iframe-test完全一致
  const refreshIframe = () => {
    console.log('强制刷新iframe');
    setIframeLoaded(false);
    setIframeError(null);
    setTimeout(() => {
      const iframe = document.getElementById('external-project-iframe') as HTMLIFrameElement;
      if (iframe) {
        // 重新加载iframe的方式与iframe-test完全一致
        iframe.src = iframe.src;
      }
    }, 100);
  };
  
  // 直接访问外部链接
  const openDirectLink = () => {
    if (projectData?.externalUrl) {
      window.open(projectData.externalUrl, '_blank');
    }
  };
  
  // 提取域名用于显示
  const getHostname = (url: string) => {
    try {
      return new URL(url).hostname;
    } catch (e) {
      return url;
    }
  };
  
  // 加载项目数据
  const fetchProjectData = async () => {
    try {
      const apiUrl = `/api/projects/${projectId}`
      
      // 先显示加载状态
      setIsLoading(true)
      
      // 使用AbortController以便在组件卸载时取消请求
      const controller = new AbortController()
      const signal = controller.signal
      
      // 发起请求
      const response = await fetch(apiUrl, { signal })
      
      if (response.status === 404) {
        notFound()
        return
      }
      
      if (!response.ok) {
        throw new Error(
          locale === 'zh-cn' 
            ? '无法加载项目，请检查链接是否正确'
            : 'Failed to load project, please check if the link is correct'
        )
      }
      
      // 解析JSON数据
      const data = await response.json()
      
      // 设置项目数据
      setProjectData(data)
      setSelectedFile(data.mainFile)
      setBasicInfoLoaded(true)
      setUiFrameworkLoaded(true)
      
      // 如果是外部项目，延迟加载iframe
      if (data.externalEmbed && data.externalUrl) {
        setTimeout(() => {
          setShouldLoadIframe(true)
        }, 500)
      }
      
      // 标记加载完成
      setFilesLoaded(true)
      setIsLoading(false)
      setError(null)
      
      return data
    } catch (error) {
      console.error('加载项目失败:', error)
      setError(locale === 'zh-cn' ? '加载项目失败' : 'Failed to load project')
      setIsLoading(false)
      return null
    }
  }
  
  // 处理项目切换
  useEffect(() => {
    let isMounted = true
    
    const loadProject = async () => {
      resetProjectState()
      if (isMounted) {
        await fetchProjectData()
      }
    }
    
    loadProject()
    
    return () => {
      isMounted = false
    }
  }, [projectId])
  
  // 处理下一个项目
  const handleNextProject = async () => {
    try {
      const response = await fetch(`/api/projects/recommend?currentId=${projectId}`)
      if (!response.ok) throw new Error('Failed to fetch next project')
      
      const data = await response.json()
      if (!data.projectId) throw new Error('No project found')
      
      // 更新历史记录
      const newHistory = [...viewHistory.slice(0, historyPosition + 1), data.projectId]
      setViewHistory(newHistory)
      setHistoryPosition(newHistory.length - 1)
      sessionStorage.setItem('projectHistory', JSON.stringify(newHistory))
      
      // 导航到新项目
      router.push(`/${locale}/project/${data.projectId}`)
    } catch (error) {
      console.error('Error fetching next project:', error)
      toast({
        title: locale === 'zh-cn' ? '加载失败' : 'Loading Failed',
        description: locale === 'zh-cn' ? '无法加载下一个项目' : 'Failed to load next project'
      })
    }
  }
  
  // 处理上一个项目
  const handlePreviousProject = () => {
    if (historyPosition <= 0) {
      toast({
        title: locale === 'zh-cn' ? '已经是第一个项目' : 'First Project',
        description: locale === 'zh-cn' ? '没有更早的浏览记录' : 'No earlier history available'
      })
      return
    }
    
    const previousProjectId = viewHistory[historyPosition - 1]
    setHistoryPosition(historyPosition - 1)
    sessionStorage.setItem('historyPosition', String(historyPosition - 1))
    
    // 导航到上一个项目
    router.push(`/${locale}/project/${previousProjectId}`)
  }
  
  // 预加载下一个推荐项目
  const prefetchNextProject = async () => {
    try {
      const response = await fetch(`/api/projects/recommend?currentId=${projectId}`)
      if (!response.ok) return
      
      const data = await response.json()
      if (data.projectId) {
        // 预取项目详情页面
        router.prefetch(`/${locale}/project/${data.projectId}`)
      }
    } catch (error) {
      console.error('Error prefetching next project:', error)
    }
  }
  
  // 在项目数据加载完成后预加载下一个项目
  useEffect(() => {
    if (projectData?.projectId) {
      prefetchNextProject()
    }
  }, [projectData?.projectId])
  
  // 添加iframe加载超时处理
  useEffect(() => {
    let timeoutId: NodeJS.Timeout | null = null;
    
    if (shouldLoadIframe && !iframeLoaded && !iframeError) {
      // 设置10秒超时
      timeoutId = setTimeout(() => {
        if (!iframeLoaded) {
          setIframeError(locale === 'zh-cn' ? '加载超时，请点击重试' : 'Loading timeout, please retry');
          setIsLoading(false);
        }
      }, 10000);
    }
    
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [shouldLoadIframe, iframeLoaded, iframeError, locale]);
  
  // 添加全局加载超时保护
  useEffect(() => {
    let globalTimeoutId: NodeJS.Timeout | null = null;
    
    if (isLoading) {
      // 设置15秒全局加载超时
      globalTimeoutId = setTimeout(() => {
        if (isLoading) {
          setIsLoading(false);
          console.error('项目加载超时');
          
          // 如果没有任何错误信息，添加一个
          if (!error) {
            setError(locale === 'zh-cn' 
              ? '加载超时，请刷新页面或尝试访问其他项目' 
              : 'Loading timeout, please refresh or try another project');
          }
        }
      }, 15000);
    }
    
    return () => {
      if (globalTimeoutId) {
        clearTimeout(globalTimeoutId);
      }
    };
  }, [isLoading, locale, error]);
  
  // 渲染加载状态的骨架屏
  const renderSkeleton = () => {
    return (
      <div className="animate-pulse">
        <div className="flex flex-1 overflow-hidden">
          {/* 文件列表骨架 */}
          <div className="w-64 bg-gray-100 p-4 border-r">
            <div className="h-5 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="space-y-2">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="h-4 bg-gray-200 rounded w-full"></div>
              ))}
            </div>
          </div>
          
          {/* 主内容区骨架 */}
          <div className="flex-1 flex flex-col overflow-hidden relative p-4">
            <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="flex-1 bg-gray-100 rounded"></div>
          </div>
        </div>
      </div>
    )
  }
  
  // 跳转到随机项目 - 优化为使用URL替换而不是整页刷新
  const handleRandomProject = async () => {
    try {
      // 先显示加载状态，同时保留当前页面
      setIsLoading(true);
      
      const response = await fetch('/api/projects/random');
      
      if (!response.ok) {
        throw new Error(
          locale === 'zh-cn' 
            ? '无法加载随机项目'
            : 'Failed to load random project'
        );
      }
      
      const data = await response.json();
      
      // 使用history.pushState替代整页刷新，保持已加载的资源
      const nextUrl = `/${locale}/project/${data.projectId}`;
      window.history.pushState({}, '', nextUrl);
      
      // 更新浏览历史
      if (historyPosition === viewHistory.length - 1) {
        // 在历史末尾，添加新记录
        const newHistory = [...viewHistory, data.projectId];
        setViewHistory(newHistory);
        setHistoryPosition(newHistory.length - 1);
        // 保存到sessionStorage
        sessionStorage.setItem('projectHistory', JSON.stringify(newHistory));
        sessionStorage.setItem('historyPosition', (newHistory.length - 1).toString());
      } else {
        // 不在历史末尾，截断历史并添加新记录
        const newHistory = viewHistory.slice(0, historyPosition + 1);
        newHistory.push(data.projectId);
        setViewHistory(newHistory);
        setHistoryPosition(newHistory.length - 1);
        // 保存到sessionStorage
        sessionStorage.setItem('projectHistory', JSON.stringify(newHistory));
        sessionStorage.setItem('historyPosition', (newHistory.length - 1).toString());
      }
      
      // 重新加载项目数据
      setProjectData(data);
      setSelectedFile(data.mainFile);
      setBasicInfoLoaded(true);
      
      // 如果文件列表加载完成，标记加载状态为完成
      if (data.fileContents && Object.keys(data.fileContents).length > 0) {
        setFilesLoaded(true);
        setIsLoading(false);
      } else {
        setFilesLoaded(false);
      }
    } catch (error) {
      console.error('Error loading random project:', error);
      setIsLoading(false);
      alert(
        locale === 'zh-cn' 
          ? '加载随机项目失败，请稍后再试'
          : 'Failed to load random project, please try again later'
      );
    }
  };
  
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
  
  // 获取文件的MIME类型
  const getMimeType = (filename: string): string => {
    const extension = filename.split('.').pop()?.toLowerCase()
    switch (extension) {
      case 'html': return 'text/html'
      case 'css': return 'text/css'
      case 'js': return 'application/javascript'
      case 'jsx': case 'ts': case 'tsx': return 'application/javascript'
      case 'json': return 'application/json'
      case 'xml': return 'application/xml'
      case 'svg': return 'image/svg+xml'
      case 'png': return 'image/png'
      case 'jpg': case 'jpeg': return 'image/jpeg'
      case 'gif': return 'image/gif'
      default: return 'text/plain'
    }
  }
  
  // 为HTML内容创建完整的HTML结构
  const createFullHtml = (content: string, filename: string): string => {
    // 如果是HTML文件且不包含DOCTYPE或HTML标签，添加基本结构
    if (filename.endsWith('.html') && !content.toLowerCase().includes('<!doctype') && !content.toLowerCase().includes('<html')) {
      return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${filename}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
  </style>
</head>
<body>
${content}
</body>
</html>`;
    }
    return content;
  }
  
  // 构建预览URL
  const previewUrl = (() => {
    if (!showingFrame || !projectData?.mainFile) return '';
    
    // 处理外部嵌入项目
    if (projectData?.externalEmbed && projectData?.externalUrl) {
      return projectData?.externalUrl;
    }
    
    // 处理常规项目
    if (projectData?.fileContents?.[projectData?.mainFile]?.startsWith('http')) {
      return projectData?.fileContents?.[projectData?.mainFile];
    }
    
    if (projectData?.mainFile?.endsWith('.html')) {
      return `data:${getMimeType(projectData?.mainFile)};charset=utf-8,${encodeURIComponent(createFullHtml(projectData?.fileContents?.[projectData?.mainFile] || '', projectData?.mainFile))}`;
    }
    
    return '';
  })();
    
  // 是否显示代码编辑器视图（在带框架模式中非HTML文件也显示为代码）
  const showCodeView = !showingFrame || (showingFrame && !projectData?.mainFile.endsWith('.html') && !projectData?.externalEmbed)
  
  // 添加工具栏按钮
  const renderToolbarButtons = () => {
    return (
      <div className="flex flex-col gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full"
          onClick={() => setIsLiked(!isLiked)}
          title={locale === 'zh-cn' ? '点赞' : 'Like'}
        >
          {isLiked ? '❤️' : '🤍'}
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full"
          onClick={() => setIsBookmarked(!isBookmarked)}
          title={locale === 'zh-cn' ? '收藏' : 'Bookmark'}
        >
          {isBookmarked ? '⭐' : '☆'}
        </Button>
        
        {projectData?.externalUrl && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              onClick={openDirectLink}
              title={locale === 'zh-cn' ? '访问源站' : 'Visit Source'}
            >
              🔗
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              onClick={() => window.open(projectData.externalUrl, '_blank')}
              title={locale === 'zh-cn' ? '全屏打开' : 'Open Fullscreen'}
            >
              📺
            </Button>
          </>
        )}
        
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full"
          onClick={() => {/* TODO: 实现分享功能 */}}
          title={locale === 'zh-cn' ? '分享' : 'Share'}
        >
          📤
        </Button>
      </div>
    )
  }

  // 格式化日期显示
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return new Intl.DateTimeFormat('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      }).format(date)
    } catch (e) {
      return dateString
    }
  }

  // 重置项目状态
  const resetProjectState = () => {
    setIframeLoaded(false)
    setIframeError(null)
    setShouldLoadIframe(false)
    setIsLoading(true)
    setError(null)
  }

  // 渲染函数改进，支持渐进式加载
  if (isLoading && !basicInfoLoaded) {
    return (
      <div className="flex flex-col h-screen">
        {/* 主体内容 - 左右7:3布局 */}
        <div className="flex flex-1 overflow-hidden">
          {/* 左侧主内容区 (70%) */}
          <div className="w-[70%] flex flex-col relative overflow-hidden bg-background">
            {/* 上下滑动按钮 - TikTok风格 */}
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 flex flex-col gap-3">
              <button
                className="group relative w-12 h-12 rounded-full bg-black/30 hover:bg-black/50 flex items-center justify-center text-white transition-colors backdrop-blur-sm"
                onClick={handlePreviousProject}
                title={locale === 'zh-cn' ? '上一个项目' : 'Previous project'}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="18 15 12 9 6 15"></polyline>
                </svg>
                <span className="absolute right-14 top-1/2 -translate-y-1/2 whitespace-nowrap bg-black/70 text-white text-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  {locale === 'zh-cn' ? '上一个项目' : 'Previous project'}
                </span>
              </button>
              
              <button
                className="group relative w-12 h-12 rounded-full bg-black/30 hover:bg-black/50 flex items-center justify-center text-white transition-colors backdrop-blur-sm"
                onClick={handleNextProject}
                title={locale === 'zh-cn' ? '下一个项目' : 'Next project'}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
                <span className="absolute right-14 top-1/2 -translate-y-1/2 whitespace-nowrap bg-black/70 text-white text-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  {locale === 'zh-cn' ? '下一个项目' : 'Next project'}
                </span>
              </button>
            </div>

            {/* 主要内容区域 */}
            <div className="flex-1 relative">
              {isLoading ? (
                <div className="flex h-screen items-center justify-center">
                  <div className="text-center">
                    <div className="mb-8">
                      <Image 
                        src="/favicon.png" 
                        alt="VibeTok Logo" 
                        width={96} 
                        height={96}
                      />
                    </div>
                    <h1 className="text-3xl font-bold mb-4">VibeTok</h1>
                    <div className="w-12 h-12 border-b-2 border-primary rounded-full animate-spin mx-auto"></div>
                    <p className="mt-4 text-muted-foreground">
                      {locale === 'zh-cn' ? '正在加载精彩内容...' : 'Loading amazing content...'}
                    </p>
                  </div>
                </div>
              ) : error ? (
                <div className="flex flex-col items-center justify-center h-full">
                  <div className="mb-8">
                    <Image 
                      src="/favicon.png" 
                      alt="VibeTok Logo" 
                      width={96} 
                      height={96}
                      className="mx-auto grayscale opacity-50"
                    />
                  </div>
                  <div className="text-red-500 mb-4">{error}</div>
                  <Button onClick={() => fetchProjectData()}>
                    {locale === 'zh-cn' ? '重试' : 'Retry'}
                  </Button>
                </div>
              ) : (
                <div className="h-full">
                  {projectData?.externalEmbed && projectData?.externalUrl ? (
                    <div className="relative h-full">
                      {shouldLoadIframe && (
                        <iframe
                          id="external-project-iframe"
                          src={projectData.externalUrl}
                          className="w-full h-full border-none"
                          onLoad={handleIframeLoad}
                          onError={handleIframeError}
                        />
                      )}
                      {!iframeLoaded && (
                        <div className="absolute inset-0 flex items-center justify-center bg-background">
                          <div className="text-center">
                            <div className="mb-8">
                              <Image 
                                src="/favicon.png" 
                                alt="VibeTok Logo" 
                                width={96} 
                                height={96}
                                className="mx-auto"
                              />
                            </div>
                            <h1 className="text-3xl font-bold mb-4">VibeTok</h1>
                            <div className="w-12 h-12 border-b-2 border-primary rounded-full animate-spin mx-auto"></div>
                            <p className="mt-4 text-muted-foreground">
                              {locale === 'zh-cn' ? '项目加载中...' : 'Loading project...'}
                            </p>
                          </div>
                        </div>
                      )}
                      {iframeError && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-background">
                          <div className="mb-8">
                            <Image 
                              src="/favicon.png" 
                              alt="VibeTok Logo" 
                              width={96} 
                              height={96}
                              className="mx-auto grayscale opacity-50"
                            />
                          </div>
                          <h1 className="text-3xl font-bold mb-4">VibeTok</h1>
                          <div className="text-red-500 mb-4">{iframeError}</div>
                          <div className="flex gap-4">
                            <Button onClick={refreshIframe}>
                              {locale === 'zh-cn' ? '重试' : 'Retry'}
                            </Button>
                            <Button onClick={openDirectLink}>
                              {locale === 'zh-cn' ? '在新窗口打开' : 'Open in New Window'}
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="h-full">
                      {/* 其他项目类型的渲染逻辑保持不变 */}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* 右侧工具栏 (30%) */}
          <div className="w-[30%] border-l border-border bg-black text-white">
            {/* 项目信息区 */}
            <div className="p-6">
              <h1 className="text-2xl font-bold mb-2">{projectData?.title || '加载中...'}</h1>
              <p className="text-gray-300 mb-4">{projectData?.description}</p>
              <div className="flex items-center gap-2 text-gray-400">
                <span>全屏打开</span>
                <a 
                  href={projectData?.externalUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:underline overflow-hidden text-ellipsis"
                >
                  {projectData?.externalUrl && getHostname(projectData.externalUrl)}
                </a>
              </div>
              {projectData?.createdAt && (
                <p className="text-gray-400 mt-2">
                  {formatDate(projectData.createdAt)}
                </p>
              )}
            </div>

            {/* 交互按钮区 */}
            <div className="p-6 flex flex-col gap-6">
              <button className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
                <span>{locale === 'zh-cn' ? '点赞' : 'Like'}</span>
              </button>
              
              <button className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
                <span>{locale === 'zh-cn' ? '评论' : 'Comment'}</span>
              </button>
              
              <button className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                </svg>
                <span>{locale === 'zh-cn' ? '收藏' : 'Bookmark'}</span>
              </button>
              
              <button className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="18" cy="5" r="3"></circle>
                  <circle cx="6" cy="12" r="3"></circle>
                  <circle cx="18" cy="19" r="3"></circle>
                  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                  <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                </svg>
                <span>{locale === 'zh-cn' ? '分享' : 'Share'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }
  
  if (error || !projectData) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center max-w-md p-6 bg-white">
          <div className="mb-8">
            <Image 
              src="/favicon.png" 
              alt="VibeTok Logo" 
              width={96} 
              height={96}
              className="mx-auto grayscale opacity-50"
            />
          </div>
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
      {/* 主体内容 - 左右7:3布局 */}
      <div className="flex flex-1 overflow-hidden">
        {/* 左侧主内容区 (70%) */}
        <div className="w-[70%] flex flex-col relative overflow-hidden bg-background">
          {/* 上下滑动按钮 - TikTok风格 */}
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 flex flex-col gap-3">
            <button
              className="group relative w-12 h-12 rounded-full bg-black/30 hover:bg-black/50 flex items-center justify-center text-white transition-colors backdrop-blur-sm"
              onClick={handlePreviousProject}
              title={locale === 'zh-cn' ? '上一个项目' : 'Previous project'}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="18 15 12 9 6 15"></polyline>
              </svg>
              <span className="absolute right-14 top-1/2 -translate-y-1/2 whitespace-nowrap bg-black/70 text-white text-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                {locale === 'zh-cn' ? '上一个项目' : 'Previous project'}
              </span>
            </button>
            
            <button
              className="group relative w-12 h-12 rounded-full bg-black/30 hover:bg-black/50 flex items-center justify-center text-white transition-colors backdrop-blur-sm"
              onClick={handleNextProject}
              title={locale === 'zh-cn' ? '下一个项目' : 'Next project'}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
              <span className="absolute right-14 top-1/2 -translate-y-1/2 whitespace-nowrap bg-black/70 text-white text-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                {locale === 'zh-cn' ? '下一个项目' : 'Next project'}
              </span>
            </button>
          </div>

          {/* 主要内容区域 */}
          <div className="flex-1 relative">
            {isLoading ? (
              <div className="flex h-screen items-center justify-center">
                <div className="text-center">
                  <div className="mb-8">
                    <Image 
                      src="/favicon.png" 
                      alt="VibeTok Logo" 
                      width={96} 
                      height={96}
                    />
                  </div>
                  <h1 className="text-3xl font-bold mb-4">VibeTok</h1>
                  <div className="w-12 h-12 border-b-2 border-primary rounded-full animate-spin mx-auto"></div>
                  <p className="mt-4 text-muted-foreground">
                    {locale === 'zh-cn' ? '正在加载精彩内容...' : 'Loading amazing content...'}
                  </p>
                </div>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center h-full">
                <div className="mb-8">
                  <Image 
                    src="/favicon.png" 
                    alt="VibeTok Logo" 
                    width={96} 
                    height={96}
                    className="mx-auto grayscale opacity-50"
                  />
                </div>
                <div className="text-red-500 mb-4">{error}</div>
                <Button onClick={() => fetchProjectData()}>
                  {locale === 'zh-cn' ? '重试' : 'Retry'}
                </Button>
              </div>
            ) : (
              <div className="h-full">
                {projectData?.externalEmbed && projectData?.externalUrl ? (
                  <div className="relative h-full">
                    {shouldLoadIframe && (
                      <iframe
                        id="external-project-iframe"
                        src={projectData.externalUrl}
                        className="w-full h-full border-none"
                        onLoad={handleIframeLoad}
                        onError={handleIframeError}
                      />
                    )}
                    {!iframeLoaded && (
                      <div className="absolute inset-0 flex items-center justify-center bg-background">
                        <div className="text-center">
                          <div className="mb-8">
                            <Image 
                              src="/favicon.png" 
                              alt="VibeTok Logo" 
                              width={96} 
                              height={96}
                              className="mx-auto"
                            />
                          </div>
                          <h1 className="text-3xl font-bold mb-4">VibeTok</h1>
                          <div className="w-12 h-12 border-b-2 border-primary rounded-full animate-spin mx-auto"></div>
                          <p className="mt-4 text-muted-foreground">
                            {locale === 'zh-cn' ? '项目加载中...' : 'Loading project...'}
                          </p>
                        </div>
                      </div>
                    )}
                    {iframeError && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-background">
                        <div className="mb-8">
                          <Image 
                            src="/favicon.png" 
                            alt="VibeTok Logo" 
                            width={96} 
                            height={96}
                            className="mx-auto grayscale opacity-50"
                          />
                        </div>
                        <h1 className="text-3xl font-bold mb-4">VibeTok</h1>
                        <div className="text-red-500 mb-4">{iframeError}</div>
                        <div className="flex gap-4">
                          <Button onClick={refreshIframe}>
                            {locale === 'zh-cn' ? '重试' : 'Retry'}
                          </Button>
                          <Button onClick={openDirectLink}>
                            {locale === 'zh-cn' ? '在新窗口打开' : 'Open in New Window'}
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="h-full">
                    {/* 其他项目类型的渲染逻辑保持不变 */}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* 右侧工具栏 (30%) */}
        <div className="w-[30%] border-l border-border bg-black text-white">
          {/* 项目信息区 */}
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-2">{projectData?.title || '加载中...'}</h1>
            <p className="text-gray-300 mb-4">{projectData?.description}</p>
            <div className="flex items-center gap-2 text-gray-400">
              <span>全屏打开</span>
              <a 
                href={projectData?.externalUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline overflow-hidden text-ellipsis"
              >
                {projectData?.externalUrl && getHostname(projectData.externalUrl)}
              </a>
            </div>
            {projectData?.createdAt && (
              <p className="text-gray-400 mt-2">
                {formatDate(projectData.createdAt)}
              </p>
            )}
          </div>

          {/* 交互按钮区 */}
          <div className="p-6 flex flex-col gap-6">
            <button className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
              <span>{locale === 'zh-cn' ? '点赞' : 'Like'}</span>
            </button>
            
            <button className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
              <span>{locale === 'zh-cn' ? '评论' : 'Comment'}</span>
            </button>
            
            <button className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
              </svg>
              <span>{locale === 'zh-cn' ? '收藏' : 'Bookmark'}</span>
            </button>
            
            <button className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="18" cy="5" r="3"></circle>
                <circle cx="6" cy="12" r="3"></circle>
                <circle cx="18" cy="19" r="3"></circle>
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
              </svg>
              <span>{locale === 'zh-cn' ? '分享' : 'Share'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 