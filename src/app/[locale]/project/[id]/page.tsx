'use client'

import { useState, useEffect, useRef } from 'react'
import { useParams, notFound, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Locale } from '../../../../../i18n/config'
import { renderTSX } from '@/lib/tsx-compiler'
import ExternalEmbed from './external-embed'
import { toast } from '@/components/ui/use-toast'

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
  
  // 加载项目数据 - 使用渐进式加载
  useEffect(() => {
    // 创建一个基本信息加载完成的标志
    let isMounted = true
    
    const fetchProjectData = async () => {
      try {
        const apiUrl = `/api/projects/${projectId}`;
        
        // 先显示加载状态
        setIsLoading(true)
        
        // 使用AbortController以便在组件卸载时取消请求
        const controller = new AbortController()
        const signal = controller.signal
        
        // 发起请求
        const response = await fetch(apiUrl, { signal })
        
        if (!isMounted) return
        
        if (response.status === 404) {
          notFound();
          return;
        }
        
        if (!response.ok) {
          throw new Error(
            locale === 'zh-cn' 
              ? '无法加载项目，请检查链接是否正确'
              : 'Failed to load project, please check if the link is correct'
          )
        }
        
        // 直接解析JSON数据，不要尝试同时使用getReader()和json()
        const data = await response.json()
        
        if (!isMounted) return
        
        // 设置基本项目信息，允许UI开始渲染核心内容
        setProjectData(data)
        setSelectedFile(data.mainFile)
        setBasicInfoLoaded(true)
        
        // 立即标记UI框架已加载完成，显示右侧工具栏
        setUiFrameworkLoaded(true)
        
        // 如果文件列表加载完成，也标记加载状态为完成
        if (data.fileContents && Object.keys(data.fileContents).length > 0) {
          setFilesLoaded(true)
          setIsLoading(false)
          
          // 在基本UI渲染完成后，延迟加载iframe内容
          setTimeout(() => {
            if (isMounted) {
              setShouldLoadIframe(true)
            }
          }, 500) // 延迟500ms让UI先渲染完成
        }
        
        // 预加载下一个推荐项目的数据
        prefetchNextProject()
        
      } catch (error) {
        if (!isMounted) return
        
        console.error('Error loading project:', error)
        setError(
          typeof error === 'object' && error !== null && 'message' in error
            ? String(error.message)
            : locale === 'zh-cn' 
              ? '加载项目失败'
              : 'Failed to load project'
        )
        setIsLoading(false)
      }
    }
    
    fetchProjectData()
    
    // 清理函数
    return () => {
      isMounted = false
    }
  }, [projectId, locale])
  
  // 预加载下一个推荐项目的数据
  const prefetchNextProject = async () => {
    try {
      // 使用 fetchPriority 降低此请求的优先级，不干扰当前页面加载
      const response = await fetch(`/api/projects/recommend?currentId=${projectId}`, {
        priority: 'low',
      } as RequestInit) // 使用类型断言
      
      // 只预取数据但不会处理，以便将其缓存在浏览器中
      if (response.ok) {
        const data = await response.json()
        
        // 预加载项目页面
        const nextPageUrl = `/${locale}/project/${data.projectId}`
        const link = document.createElement('link')
        link.rel = 'prefetch'
        link.href = nextPageUrl
        document.head.appendChild(link)
      }
    } catch (error) {
      // 静默失败，这只是优化
      console.warn('Error prefetching next project:', error)
    }
  }
  
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
  
  // 更新的上滑/上箭头函数 - 返回到历史项目
  const handlePreviousProject = async () => {
    try {
      // 检查是否有历史可以回退
      if (historyPosition > 0) {
        // 有历史可回退
        const previousPosition = historyPosition - 1;
        const previousProjectId = viewHistory[previousPosition];
        
        // 更新位置指针
        setHistoryPosition(previousPosition);
        sessionStorage.setItem('historyPosition', previousPosition.toString());
        
        // 使用router导航至历史项目
        router.push(`/${locale}/project/${previousProjectId}`);
      } else {
        // 无历史可回退，提示用户
        toast({
          title: locale === 'zh-cn' ? '已经是第一个项目' : 'This is the first project',
          description: locale === 'zh-cn' ? '当前已是浏览历史的第一项' : 'You are at the beginning of your browsing history',
          duration: 3000,
        });
      }
    } catch (error) {
      console.error('Error navigating to previous project:', error);
      // 显示错误提示
      alert(
        locale === 'zh-cn' 
          ? '返回上一个项目失败，请稍后再试'
          : 'Failed to go back to previous project, please try again later'
      );
    }
  };

  // 更新的下滑/下箭头函数 - 获取推荐的下一个项目
  const handleNextProject = async () => {
    try {
      // 先显示加载状态，同时保留当前页面
      setIsLoading(true);
      
      // 调用推荐API
      const response = await fetch(`/api/projects/recommend?currentId=${projectId}`);
      
      if (!response.ok) {
        throw new Error(
          locale === 'zh-cn' 
            ? '无法加载推荐项目'
            : 'Failed to load recommended project'
        );
      }
      
      const data = await response.json();
      
      // 使用history.pushState替代整页刷新，保持已加载的资源
      const nextUrl = `/${locale}/project/${data.projectId}`;
      window.history.pushState({}, '', nextUrl);
      
      // 更新历史记录
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
      console.error('Error loading next project:', error);
      setIsLoading(false);
      alert(
        locale === 'zh-cn' 
          ? '加载下一个项目失败，请稍后再试'
          : 'Failed to load next project, please try again later'
      );
    }
  };

  // 更新滑动手势处理
  useEffect(() => {
    let touchstartX = 0;
    let touchendX = 0;
    let touchstartY = 0;
    let touchendY = 0;
    
    const handleTouchStart = (e: TouchEvent) => {
      touchstartX = e.changedTouches[0].screenX;
      touchstartY = e.changedTouches[0].screenY;
    };
    
    const handleTouchEnd = (e: TouchEvent) => {
      touchendX = e.changedTouches[0].screenX;
      touchendY = e.changedTouches[0].screenY;
      handleSwipeGesture();
    };
    
    const handleSwipeGesture = () => {
      // 下滑超过50像素，加载下一个推荐项目
      if (touchendY > touchstartY + 50) {
        handleNextProject();
      }
      // 上滑超过50像素，返回到历史项目
      else if (touchendY < touchstartY - 50) {
        handlePreviousProject();
      }
    };
    
    // 添加滑动手势事件监听
    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchend', handleTouchEnd);
    
    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [projectId, historyPosition, viewHistory]);
  
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
  
  // 渲染函数改进，支持渐进式加载
  if (isLoading && !basicInfoLoaded) {
    return (
      <div className="flex flex-col h-screen">
        {/* 主体内容 - 左右8:2布局 */}
        <div className="flex flex-1 overflow-hidden">
          {/* 左侧主内容区 (80%) - 保持白色背景 */}
          <div className="w-4/5 flex flex-col relative overflow-hidden bg-white">
            <div className="flex h-screen items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-t-blue-500 border-gray-200 rounded-full animate-spin mx-auto mb-4"></div>
                <p>{locale === 'zh-cn' ? '加载中...' : 'Loading...'}</p>
              </div>
            </div>
          </div>
          
          {/* 右侧交互区 (20%) - 在加载阶段也显示框架 */}
          <div className="w-1/5 border-l border-gray-800 bg-black flex flex-col">
            {/* 项目信息区 */}
            <div className="p-4 border-b border-gray-800">
              <div className="h-6 bg-gray-800 rounded w-3/4 mb-3"></div>
              <div className="h-4 bg-gray-800 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-800 rounded w-4/5 mb-2"></div>
              <div className="h-4 bg-gray-800 rounded w-5/6 mb-3"></div>
              <div className="flex items-center text-xs mb-2">
                <div className="bg-gray-800 px-2 py-1 rounded w-16 h-5 mr-1"></div>
                <div className="bg-gray-800 w-24 h-5 rounded ml-1"></div>
              </div>
              <div className="h-3 bg-gray-800 rounded w-1/3 mt-2"></div>
            </div>
            
            {/* 文件选择区 */}
            <div className="p-4 border-b border-gray-800">
              <div className="h-4 bg-gray-800 rounded w-1/3 mb-2"></div>
              <div className="w-full bg-gray-800 border border-gray-700 rounded-md h-8"></div>
            </div>
            
            {/* 主要功能按钮区 */}
            <div className="p-4 border-b border-gray-800">
              <div className="flex flex-col gap-3">
                {/* 随机项目按钮 */}
                <div className="h-10 bg-gray-800 border border-gray-700 rounded-md"></div>
                
                {/* 切换代码/预览按钮 */}
                <div className="h-10 bg-gray-800 border border-gray-700 rounded-md"></div>
              </div>
            </div>
            
            {/* 交互按钮区 */}
            <div className="p-4 flex flex-col gap-3">
              {/* 点赞按钮 */}
              <div className="h-10 bg-gray-800/50 rounded-md"></div>
              
              {/* 评论按钮 */}
              <div className="h-10 bg-gray-800/50 rounded-md"></div>
              
              {/* 收藏按钮 */}
              <div className="h-10 bg-gray-800/50 rounded-md"></div>
              
              {/* 分享按钮 */}
              <div className="h-10 bg-gray-800/50 rounded-md"></div>
            </div>
          </div>
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
      {/* 主体内容 - 左右8:2布局 */}
      <div className="flex flex-1 overflow-hidden">
        {/* 左侧主内容区 (80%) - 保持白色背景 */}
        <div className="w-4/5 flex flex-col relative overflow-hidden bg-white">
          {/* 上下滑动按钮 - TikTok风格 */}
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 flex flex-col gap-3 items-center">
            {/* 上滑按钮 */}
            <button 
              className="group relative w-12 h-12 rounded-full bg-black/30 hover:bg-black/50 flex items-center justify-center text-white transition-colors backdrop-blur-sm"
              aria-label={locale === 'zh-cn' ? '上一个项目' : 'Previous project'}
              onClick={handlePreviousProject}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="18 15 12 9 6 15"></polyline>
              </svg>
              <span className="absolute right-14 top-1/2 -translate-y-1/2 whitespace-nowrap bg-black/70 text-white text-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                {locale === 'zh-cn' ? '上一个项目' : 'Previous project'}
              </span>
            </button>
            
            {/* 下滑按钮 */}
            <button 
              className="group relative w-12 h-12 rounded-full bg-black/30 hover:bg-black/50 flex items-center justify-center text-white transition-colors backdrop-blur-sm"
              aria-label={locale === 'zh-cn' ? '下一个项目' : 'Next project'}
              onClick={handleNextProject}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
              <span className="absolute right-14 top-1/2 -translate-y-1/2 whitespace-nowrap bg-black/70 text-white text-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                {locale === 'zh-cn' ? '下一个项目' : 'Next project'}
              </span>
            </button>
          </div>
          
          {/* 项目标题 - TikTok风格叠加在内容上 */}
          <div className="absolute left-4 bottom-8 z-10 max-w-lg">
            <h1 className="text-3xl font-bold text-white mb-2 drop-shadow-lg">{projectData?.title || 'Hello Neon DB and Vercel Blob'}</h1>
            {projectData?.description && (
              <p className="text-white text-sm drop-shadow-lg">{projectData?.description}</p>
            )}
            <div className="flex items-center mt-3">
              <div className="w-10 h-10 rounded-full bg-gray-700 text-white flex items-center justify-center mr-3">
                <span className="text-lg">👨‍💻</span>
              </div>
              <div>
                <div className="text-white font-medium">
                  {projectData?.externalAuthor || 'VibeTok Creator'}
                </div>
                <div className="text-white/70 text-xs">{new Date(projectData?.createdAt || Date.now()).toLocaleDateString()}</div>
              </div>
            </div>
          </div>
          
          {isExternalProject ? (
            <div className="w-full h-full relative">
              {/* 显示加载占位符 */}
              {!shouldLoadIframe && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                  <div className="text-center">
                    <div className="w-16 h-16 border-4 border-t-blue-500 border-gray-200 rounded-full animate-spin mx-auto mb-4"></div>
                    <p>{locale === 'zh-cn' ? '加载中...' : 'Loading...'}</p>
                  </div>
                </div>
              )}
              
              {/* 延迟加载ExternalEmbed组件 */}
              {shouldLoadIframe && (
                <ExternalEmbed 
                  url={projectData?.externalUrl || ''} 
                  locale={locale} 
                />
              )}
            </div>
          ) : (
            <>
              {/* 项目标题 - TikTok风格叠加在内容上 */}
              <div className="absolute left-4 bottom-8 z-10 max-w-lg">
                <h1 className="text-3xl font-bold text-white mb-2 drop-shadow-lg">{projectData?.title || 'Hello Neon DB and Vercel Blob'}</h1>
                {projectData?.description && (
                  <p className="text-white text-sm drop-shadow-lg">{projectData?.description}</p>
                )}
                <div className="flex items-center mt-3">
                  <div className="w-10 h-10 rounded-full bg-gray-700 text-white flex items-center justify-center mr-3">
                    <span className="text-lg">👨‍💻</span>
                  </div>
                  <div>
                    <div className="text-white font-medium">
                      {projectData?.externalAuthor || 'VibeTok Creator'}
                    </div>
                    <div className="text-white/70 text-xs">{new Date(projectData?.createdAt || Date.now()).toLocaleDateString()}</div>
                  </div>
                </div>
              </div>
              
              {showingFrame && projectData?.mainFile?.endsWith('.html') ? (
                // 普通HTML项目预览
                <div className="w-full h-full relative">
                  {/* 显示加载占位符 */}
                  {!shouldLoadIframe && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                      <div className="text-center">
                        <div className="w-16 h-16 border-4 border-t-blue-500 border-gray-200 rounded-full animate-spin mx-auto mb-4"></div>
                        <p>{locale === 'zh-cn' ? '加载中...' : 'Loading...'}</p>
                      </div>
                    </div>
                  )}
                  
                  {/* 延迟加载iframe */}
                  {shouldLoadIframe && (
                    <iframe
                      src={previewUrl}
                      className="w-full h-full border-0"
                      title="Code Preview"
                      sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals allow-pointer-lock"
                    />
                  )}
                </div>
              ) : (
                // 代码编辑器视图 - 日间模式
                <div className="flex flex-col h-full">
                  {selectedFile && (
                    <>
                      <div className="bg-gray-100 text-gray-800 py-2 px-4 text-sm font-mono flex justify-between items-center border-b border-gray-200">
                        <div>{selectedFile} - {getFileType(selectedFile)}</div>
                        {isTsxFile && (
                          <div className="flex space-x-2">
                            <span className="px-2 py-1 bg-blue-600 text-xs rounded text-white">TSX</span>
                          </div>
                        )}
                      </div>
                      
                      {isTsxFile ? (
                        // TSX文件预览模式 - 内容区保持亮色背景
                        <div className="flex flex-col h-full">
                          <div className="bg-white flex-1 overflow-auto">
                            {/* TSX编译预览区 */}
                            <div ref={tsxPreviewRef} className="h-full w-full"></div>
                          </div>
                          <div className="bg-gray-100 p-2 border-t border-gray-200">
                            <div className="font-mono text-xs p-2 bg-white rounded border border-gray-200 text-gray-800">
                              <pre className="whitespace-pre-wrap">{projectData?.fileContents?.[selectedFile] || ''}</pre>
                            </div>
                          </div>
                        </div>
                      ) : (
                        // 普通代码预览 - 日间模式
                        <pre className="flex-1 overflow-auto p-4 bg-white font-mono text-sm text-gray-900">
                          {projectData?.fileContents?.[selectedFile] || ''}
                        </pre>
                      )}
                    </>
                  )}
                </div>
              )}
            </>
          )}
        </div>
        
        {/* 右侧交互区 (20%) - 保持深色背景，一旦有基本数据就显示 */}
        <div className="w-1/5 border-l border-gray-800 bg-black flex flex-col">
          {/* 项目信息区 */}
          <div className="p-4 border-b border-gray-800">
            {projectData?.title && (
              <h2 className="font-medium text-lg mb-2 line-clamp-2 text-white">{projectData?.title}</h2>
            )}
            {projectData?.description && (
              <p className="text-sm text-gray-400 mb-3 line-clamp-3">{projectData?.description}</p>
            )}
            {isExternalProject && projectData?.externalUrl && (
              <div className="flex items-center text-xs text-gray-400 mb-2">
                <span className="bg-gray-800 text-gray-300 px-2 py-1 rounded mr-1">
                  {locale === 'zh-cn' ? '全屏打开' : 'Full Screen'}
                </span>
                <a href={projectData?.externalUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline ml-1">
                  {new URL(projectData?.externalUrl).hostname}
                </a>
              </div>
            )}
            {projectData?.createdAt && (
              <div className="text-xs text-gray-500">
                {new Date(projectData?.createdAt).toLocaleDateString()}
              </div>
            )}
          </div>
          
          {/* 文件选择区 - 只在非外部项目时显示 */}
          {!isExternalProject && projectData?.files?.length > 1 && (
            <div className="p-4 border-b border-gray-800">
              <label className="block text-sm font-medium text-gray-400 mb-1">
                {locale === 'zh-cn' ? '文件' : 'Files'}
              </label>
              <select 
                className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                value={selectedFile || ''}
                onChange={(e) => setSelectedFile(e.target.value)}
              >
                {projectData?.files?.map(file => (
                  <option key={file} value={file}>{file}</option>
                ))}
              </select>
            </div>
          )}
          
          {/* 主要功能按钮区域 - 清空内容，只保留分割线 */}
          <div className="border-b border-gray-800">
          </div>
          
          {/* 交互按钮区 */}
          <div className="p-4 flex flex-col gap-3">
            {/* 点赞按钮 */}
            <button 
              onClick={() => setIsLiked(!isLiked)}
              className="flex items-center justify-center gap-2 hover:bg-gray-800 rounded-md py-2 px-3 text-sm transition-colors text-white"
            >
              {isLiked ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#f43f5e" stroke="#f43f5e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
              )}
              <span>{locale === 'zh-cn' ? '点赞' : 'Like'}</span>
              <span className="text-gray-400">{likesCount > 0 ? likesCount : ''}</span>
            </button>
            
            {/* 评论按钮 */}
            <button 
              className="flex items-center justify-center gap-2 hover:bg-gray-800 rounded-md py-2 px-3 text-sm transition-colors text-white"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
              </svg>
              <span>{locale === 'zh-cn' ? '评论' : 'Comment'}</span>
              <span className="text-gray-400">{commentsCount > 0 ? commentsCount : ''}</span>
            </button>
            
            {/* 收藏按钮 */}
            <button 
              onClick={() => setIsBookmarked(!isBookmarked)}
              className="flex items-center justify-center gap-2 hover:bg-gray-800 rounded-md py-2 px-3 text-sm transition-colors text-white"
            >
              {isBookmarked ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#3b82f6" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                </svg>
              )}
              <span>{locale === 'zh-cn' ? '收藏' : 'Save'}</span>
            </button>
            
            {/* 分享按钮 */}
            <button 
              className="flex items-center justify-center gap-2 hover:bg-gray-800 rounded-md py-2 px-3 text-sm transition-colors text-white"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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