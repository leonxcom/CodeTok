'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, notFound, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Locale } from '../../../../../i18n/config'
import { renderTSX } from '@/lib/tsx-compiler'
import ExternalEmbed from './external-embed'
import { toast } from '@/components/ui/use-toast'
import Image from 'next/image'
import * as React from 'react'
import { Progress } from '@/components/ui/progress'
import { ProjectInteraction } from '@/components/project-interaction'
import { ProjectComments } from '@/components/project-comments'
import { ShareDialog } from '@/components/share-dialog'
import { ProjectStats } from '@/components/project-stats'

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
  likes?: number
  comments_count?: number
}

export default function ProjectPage() {
  const params = useParams<{ locale: string; id: string }>();
  const locale = params?.locale as string || 'zh-cn';
  const id = params?.id as string || '';
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
  const isExternalProject = projectData?.externalUrl;
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [iframeError, setIframeError] = useState<string | null>(null);
  const [shouldLoadIframe, setShouldLoadIframe] = useState(false);
  
  // 添加浏览历史管理
  const [viewHistory, setViewHistory] = useState<string[]>([]);
  const [historyPosition, setHistoryPosition] = useState(-1);
  
  // 添加加载进度状态
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingStage, setLoadingStage] = useState<'initial' | 'metadata' | 'files' | 'iframe' | 'complete'>('initial');
  // 使用useRef替代state来存储API请求计数，避免重新渲染
  const apiRequestCount = useRef(0);
  const didInitialLoad = useRef(false);
  const isInitialMount = useRef(true);
  const cachedProjectData = useRef<ProjectData | null>(null); // 缓存项目数据
  
  // 在ProjectPage组件内添加状态
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  
  // 初始进度条动画
  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    
    if (isLoading && loadingProgress < 90) {
      interval = setInterval(() => {
        setLoadingProgress(prev => {
          // 基于加载阶段设置最大进度值
          const maxProgress = 
            loadingStage === 'initial' ? 30 : 
            loadingStage === 'metadata' ? 60 : 
            loadingStage === 'files' ? 85 : 90;
            
          // 缓慢接近阶段最大值
          if (prev < maxProgress) {
            return prev + (maxProgress - prev) * 0.1;
          }
          return prev;
        });
      }, 200);
    }
    
    if (!isLoading) {
      setLoadingProgress(100);
      if (interval) clearInterval(interval);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isLoading, loadingStage, loadingProgress]);
  
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
        const positionInHistory = parsedHistory.indexOf(id);
        
        if (positionInHistory >= 0) {
          // 如果当前项目在历史中，设置位置
          setHistoryPosition(positionInHistory);
        } else {
          // 如果当前项目不在历史中，添加到历史末尾
          const newHistory = [...parsedHistory, id];
          setViewHistory(newHistory);
          setHistoryPosition(newHistory.length - 1);
          sessionStorage.setItem('projectHistory', JSON.stringify(newHistory));
        }
      } else {
        // 没有历史记录，初始化为只包含当前项目的数组
        setViewHistory([id]);
        setHistoryPosition(0);
        sessionStorage.setItem('projectHistory', JSON.stringify([id]));
      }
      
      // 历史位置可能存在但不适用于新的历史数组，这里忽略
    } catch (e) {
      console.error('Error initializing project history:', e);
      // 出错时使用默认值
      setViewHistory([id]);
      setHistoryPosition(0);
    }
  }, [id]);
  
  // 处理iframe加载事件
  const handleIframeLoad = () => {
    console.log('iframe加载成功:', projectData?.externalUrl);
    setIframeLoaded(true);
    setIframeError(null);
    // 确保加载完成后进度条到达100%
    setLoadingProgress(100);
    setLoadingStage('complete');
  };
  
  // 处理iframe错误事件 - 与iframe-test完全一致
  const handleIframeError = useCallback(() => {
    console.error('iframe加载失败:', projectData?.externalUrl);
    setIframeError(locale === 'zh-cn' ? '无法加载iframe内容' : 'Failed to load iframe content');
    setIframeLoaded(false);
  }, [locale, projectData?.externalUrl, setIframeError, setIframeLoaded]);
  
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
  
  // 重置项目状态
  const resetProjectState = useCallback(() => {
    setProjectData(null)
    setSelectedFile(null)
    setIframeLoaded(false)
    setIframeError(null)
    setShouldLoadIframe(false)
    setIsLoading(true)
  }, [])

  // 获取项目数据
  const fetchProjectData = useCallback(async () => {
    if (!id) return null
    
    try {
      if (!didInitialLoad.current) {
        setIsLoading(true)
        setLoadingStage('initial')
        setLoadingProgress(10)
      }
      
      setError(null)
      
      // 限制API请求频率
      apiRequestCount.current++;
      if (apiRequestCount.current > 5 && didInitialLoad.current) {
        console.log('API请求频率过高，跳过此次请求');
        return cachedProjectData.current;
      }
      
      setLoadingStage('metadata')
      setLoadingProgress(30)
      
      const response = await fetch(`/api/projects/${id}`, {
        // 添加缓存控制
        cache: didInitialLoad.current ? 'force-cache' : 'no-store'
      })
      
      if (response.status === 404) {
        notFound()
        return
      }
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(
          locale === 'zh-cn' 
            ? errorData.error || '无法加载项目，请检查链接是否正确'
            : errorData.error || 'Failed to load project, please check if the link is correct'
        )
      }
      
      // 解析JSON数据
      const data = await response.json()
      
      if (!data || !data.projectId) {
        throw new Error(
          locale === 'zh-cn'
            ? '项目数据格式错误'
            : 'Invalid project data format'
        )
      }
      
      // 缓存项目数据到ref中
      cachedProjectData.current = data;
      
      // 设置项目数据
      setProjectData(data)
      setSelectedFile(data.mainFile || '')
      setBasicInfoLoaded(true)
      setUiFrameworkLoaded(true)
      
      setLoadingStage('files')
      setLoadingProgress(60)
      
      // 如果有外部URL，延迟加载iframe (延长到1.5秒)
      if (data.externalUrl) {
        setTimeout(() => {
          setShouldLoadIframe(true)
          setLoadingStage('iframe')
          setLoadingProgress(85)
        }, 1500)
      }
      
      // 标记加载完成
      setFilesLoaded(true)
      setLoadingStage('complete')
      setLoadingProgress(100)
      
      setTimeout(() => {
        setIsLoading(false)
        didInitialLoad.current = true
      }, 500)
      
      setError(null)
      
      return data
    } catch (error) {
      console.error('加载项目失败:', error)
      setError(
        locale === 'zh-cn' 
          ? error instanceof Error ? error.message : '加载项目失败'
          : error instanceof Error ? error.message : 'Failed to load project'
      )
      setIsLoading(false)
      return null
    }
  }, [id, locale])
  
  // 处理项目切换
  useEffect(() => {
    let isMounted = true
    let retryCount = 0
    const maxRetries = 3
    
    const loadProject = async () => {
      if (isInitialMount.current || didInitialLoad.current === false) {
        resetProjectState()
        isInitialMount.current = false
      }
      
      if (isMounted) {
        const result = await fetchProjectData()
        if (!result && retryCount < maxRetries) {
          retryCount++
          console.log(`重试加载项目 (${retryCount}/${maxRetries})...`)
          setTimeout(loadProject, 1000 * retryCount)
        }
      }
    }
    
    loadProject()
    
    return () => {
      isMounted = false
    }
  }, [id, fetchProjectData, resetProjectState])
  
  // 处理下一个项目
  const handleNextProject = async () => {
    try {
      const response = await fetch(`/api/projects/recommend?currentId=${id}`)
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
  const prefetchNextProject = useCallback(async () => {
    // 如果已经预取过，则跳过
    if (didInitialLoad.current) return;
    
    try {
      const response = await fetch(`/api/projects/recommend?currentId=${id}`, {
        cache: 'force-cache'
      })
      if (!response.ok) return
      
      const data = await response.json()
      if (data.projectId) {
        // 预取项目详情页面
        router.prefetch(`/${locale}/project/${data.projectId}`)
      }
    } catch (error) {
      console.error('Error prefetching next project:', error)
    }
  }, [id, locale, router])
  
  // 在ID变化时重置请求计数
  useEffect(() => {
    apiRequestCount.current = 0;
  }, [id]);
  
  // 在项目数据加载完成后预加载下一个项目
  useEffect(() => {
    if (projectData?.projectId && !didInitialLoad.current) {
      prefetchNextProject()
    }
  }, [projectData?.projectId, prefetchNextProject])
  
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
      
      // 直接导航到新项目，让Next.js路由系统处理加载
      router.push(`/${locale}/project/${data.projectId}`);
      
      // 重置加载请求次数
      apiRequestCount.current = 0;
      
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
    if (projectData?.externalUrl) {
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
  const showCodeView = !showingFrame || (showingFrame && !projectData?.mainFile.endsWith('.html') && !projectData?.externalUrl)
  
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

  // 修改项目详情页面中的分享按钮实现
  const handleShare = () => {
    setShareDialogOpen(true);
  };

  if (isLoading && !basicInfoLoaded) {
    return (
      <div className="container mx-auto py-8 flex flex-col">
        {/* 加载状态 */}
        <div className="flex h-[80vh] items-center justify-center flex-col">
          <div className="text-center">
            <div className="mb-8">
              <Image 
                src="/favicon.png" 
                alt="CodeTok Logo" 
                width={96} 
                height={96}
              />
            </div>
            <h1 className="text-3xl font-bold mb-4">
              CodeTok
            </h1>
            <div className="w-12 h-12 border-b-2 border-primary rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-muted-foreground">
              {(locale as string) === 'zh-cn' ? 
                loadingStage === 'initial' ? '正在初始化...' : 
                loadingStage === 'metadata' ? '正在加载项目信息...' : 
                loadingStage === 'files' ? '正在加载文件...' : 
                loadingStage === 'iframe' ? '正在加载外部内容...' : '正在加载精彩内容...'
                : 
                loadingStage === 'initial' ? 'Initializing...' : 
                loadingStage === 'metadata' ? 'Loading project information...' : 
                loadingStage === 'files' ? 'Loading files...' : 
                loadingStage === 'iframe' ? 'Loading external content...' : 'Loading amazing content...'
              }
            </p>
            <div className="mt-4 w-64 mx-auto">
              <Progress value={loadingProgress} className="h-1" />
              <div className="text-xs text-center mt-1 text-muted-foreground">
                {Math.round(loadingProgress)}%
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
  
  if (error || !projectData) {
    return (
      <div className="container mx-auto py-8 flex h-[80vh] items-center justify-center">
        <div className="text-center max-w-md p-6 bg-card rounded-lg border">
          <div className="mb-8">
            <Image 
              src="/favicon.png" 
              alt="CodeTok Logo" 
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
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{projectData?.title || '项目'}</h1>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handlePreviousProject}
            disabled={historyPosition <= 0}
          >
            上一个
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleNextProject}
          >
            下一个
          </Button>
        </div>
      </div>
      
      <div className="bg-card rounded-lg border shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="flex h-96 items-center justify-center">
            <div className="text-center">
              <div className="w-12 h-12 border-b-2 border-primary rounded-full animate-spin mx-auto"></div>
              <p className="mt-4 text-muted-foreground">
                {locale === 'zh-cn' ? '项目加载中...' : 'Loading project...'}
              </p>
            </div>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-96">
            <div className="text-red-500 mb-4">{error}</div>
            <Button onClick={() => fetchProjectData()}>
              {locale === 'zh-cn' ? '重试' : 'Retry'}
            </Button>
          </div>
        ) : (
          <div className="relative h-[80vh]">
            {projectData?.externalUrl ? (
              <div className="h-full w-full">
                <ExternalEmbed 
                  url={projectData.externalUrl} 
                  locale={locale}
                  title={projectData.title}
                  description={projectData.description}
                  author={projectData.externalAuthor}
                />
              </div>
            ) : (
              <div className="h-full">
                <div className="text-center py-20">
                  <p className="text-muted-foreground">
                    {locale === 'zh-cn' ? '项目内容加载中...' : 'Loading project content...'}
                  </p>
                </div>
              </div>
            )}
            
            {/* 互动按钮 */}
            <div className="absolute right-4 top-4">
              <ProjectInteraction 
                projectId={id}
                initialLikes={projectData?.likes || 0}
                initialComments={projectData?.comments_count || 0}
                locale={locale}
              />
            </div>
          </div>
        )}
      </div>
      
      <div className="mt-6 flex flex-col md:flex-row gap-6">
        {/* 项目详情 */}
        <div className="flex-1">
          <h2 className="text-xl font-semibold mb-4">{locale === 'zh-cn' ? '项目详情' : 'Project Details'}</h2>
          <p className="text-muted-foreground">{projectData?.description}</p>
          {projectData?.externalUrl && (
            <div className="mt-4">
              <h3 className="font-medium mb-2">{locale === 'zh-cn' ? '外部链接' : 'External Link'}</h3>
              <a 
                href={projectData.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                {getHostname(projectData.externalUrl)}
              </a>
            </div>
          )}
          {projectData?.createdAt && (
            <div className="mt-4">
              <h3 className="font-medium mb-2">{locale === 'zh-cn' ? '创建时间' : 'Created'}</h3>
              <p className="text-muted-foreground">
                {formatDate(projectData.createdAt)}
              </p>
            </div>
          )}
        </div>
        
        {/* 项目统计 */}
        <div className="md:w-1/3">
          <ProjectStats 
            projectId={id}
            locale={locale}
          />
        </div>
      </div>
      
      {/* 评论部分 */}
      <div className="mt-12" id="comments">
        <ProjectComments 
          projectId={id}
          locale={locale}
        />
      </div>

      {/* 在返回JSX中，添加ShareDialog组件 */}
      <ShareDialog
        projectId={id}
        projectTitle={projectData?.title || ''}
        open={shareDialogOpen}
        onOpenChange={setShareDialogOpen}
        locale={locale}
      />
    </div>
  )
} 