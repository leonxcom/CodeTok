"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, BookmarkPlus, Share2, MessageSquare, Code, Terminal, Github, ExternalLink, Maximize, Minimize } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// 默认图片，当项目没有预览图时使用
const DEFAULT_IMAGE = '/images/code-preview-1.jpg';

// 示例技术栈标签
const TECH_STACKS = {
  "character-sample": ["Three.js", "JavaScript", "WebGL"],
  "visual-origins": ["React", "TypeScript", "API"],
  "game-fly": ["JavaScript", "Canvas", "Animation"],
  "react-hooks": ["React", "Hooks", "TypeScript"],
  "ai-prompt-generator": ["AI", "NLP", "Next.js"],
  "default": ["Code", "JavaScript", "Web"]
};

export interface ProjectCardProps {
  id: string;
  title: string;
  description?: string;
  author?: {
    name: string;
    avatar?: string;
    username?: string;
  };
  likes?: number;
  comments?: number;
  previewUrl?: string;
  externalUrl?: string;
  locale: string;
  isActive: boolean; // 是否是当前激活的卡片
  index: number; // 卡片索引，用于动画
}

export function ProjectCard({
  id,
  title,
  description,
  author = {
    name: "匿名用户",
    avatar: "",
    username: "anonymous",
  },
  likes = 0,
  comments = 0,
  previewUrl,
  externalUrl,
  locale = "zh-cn",
  isActive,
  index,
}: ProjectCardProps) {
  // 互动状态
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(likes);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [showIframe, setShowIframe] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [showCodeView, setShowCodeView] = useState(false);
  
  // 全屏状态
  const [isFullscreen, setIsFullscreen] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  
  // IntersectionObserver状态
  const [inView, setInView] = useState(false);

  // 设置IntersectionObserver
  useEffect(() => {
    if (!cardRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting && entry.intersectionRatio >= 0.5);
      },
      { threshold: 0.5 }
    );

    observer.observe(cardRef.current);

    return () => {
      observer.disconnect();
    };
  }, []);

  // 获取技术栈标签
  const techStack = TECH_STACKS[id as keyof typeof TECH_STACKS] || TECH_STACKS.default;

  // 确保有可用的预览图片
  const finalPreviewUrl = imageError || !previewUrl ? DEFAULT_IMAGE : previewUrl;

  // 监听激活状态变化
  useEffect(() => {
    // 如果组件变为激活状态，模拟加载过程
    if (isActive && !isLoaded) {
      const timer = setTimeout(() => setIsLoaded(true), 300);
      return () => clearTimeout(timer);
    }
    
    // 只有当卡片激活时才显示iframe
    if (isActive && externalUrl) {
      const timer = setTimeout(() => setShowIframe(true), 500);
      return () => clearTimeout(timer);
    } else {
      setShowIframe(false);
      setIframeLoaded(false);
      setShowCodeView(false);
    }
  }, [isActive, isLoaded, externalUrl]);

  // 监听全屏状态变化
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = document.fullscreenElement === cardRef.current;
      setIsFullscreen(isCurrentlyFullscreen);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      // ESC键退出全屏
      if (event.key === 'Escape' && isFullscreen) {
        handleExitFullscreen();
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isFullscreen]);

  // 进入全屏模式
  const handleEnterFullscreen = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (cardRef.current && !isFullscreen) {
      try {
        await cardRef.current.requestFullscreen();
        setIsFullscreen(true);
      } catch (error) {
        console.error('无法进入全屏模式:', error);
        // 降级方案：使用CSS全屏效果
        setIsFullscreen(true);
      }
    }
  };

  // 退出全屏模式
  const handleExitFullscreen = async (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    if (isFullscreen) {
      try {
        if (document.fullscreenElement) {
          await document.exitFullscreen();
        }
        setIsFullscreen(false);
      } catch (error) {
        console.error('无法退出全屏模式:', error);
        setIsFullscreen(false);
      }
    }
  };

  // 处理图片加载错误
  const handleImageError = () => {
    setImageError(true);
    setIsLoaded(true); // 确保加载状态正确
  };

  // 处理点赞事件
  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLiked(!isLiked);
    setLikesCount(isLiked ? likesCount - 1 : likesCount + 1);
    // TODO: 发送API请求更新点赞状态
  };

  // 处理收藏事件
  const handleBookmark = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsBookmarked(!isBookmarked);
    // TODO: 发送API请求更新收藏状态
  };

  // 处理分享事件
  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // 复制链接到剪贴板
    const projectUrl = `${window.location.origin}/${locale}/project/${id}`;
    navigator.clipboard.writeText(projectUrl);
    // TODO: 显示分享成功提示
  };

  // 处理iframe加载事件
  const handleIframeLoad = () => {
    setIframeLoaded(true);
  };

  // 切换代码视图
  const toggleCodeView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowCodeView(!showCodeView);
  };

  // 默认显示的代码预览
  const defaultCodePreview = `// ${title}
import React, { useState, useEffect } from 'react';

function ${title.replace(/\s+/g, '')}() {
  const [data, setData] = useState(null);
  
  useEffect(() => {
    // 获取数据
    async function fetchData() {
      const response = await fetch('/api/data');
      const result = await response.json();
      setData(result);
    }
    
    fetchData();
  }, []);
  
  return (
    <div className="project-container">
      <h1>${title}</h1>
      <p>${description || '探索这个精彩的代码项目'}</p>
      {data && (
        <div className="data-display">
          {/* 展示数据 */}
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default ${title.replace(/\s+/g, '')};`;

  // 确定是否有效的外部URL
  const hasValidExternalUrl = externalUrl && externalUrl.startsWith('http');

  return (
    <motion.div
      ref={cardRef}
      className={cn(
        "relative flex h-full w-full max-w-7xl flex-col overflow-hidden rounded-xl bg-card shadow-lg",
        isActive ? "z-10" : "z-0",
        isFullscreen && "fixed inset-0 z-50 max-w-none rounded-none h-screen w-screen"
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ 
        opacity: isActive ? 1 : 0.6, 
        y: 0,
        scale: isActive ? 1 : 0.9
      }}
      transition={{ 
        duration: 0.4,
        delay: index * 0.1,
        ease: "easeOut" 
      }}
    >
      {/* 项目标题区 - 减少padding */}
      <div className={cn(
        "flex items-center justify-between border-b bg-muted/30 px-3 py-1.5",
        isFullscreen && "bg-muted/90 backdrop-blur-md px-6 py-3"
      )}>
        <div className="flex items-center">
          <div className={cn(
            "mr-3 h-8 w-8 overflow-hidden rounded-full bg-primary/10 relative",
            isFullscreen && "h-12 w-12"
          )}>
            {author.avatar ? (
              <Image
                src={author.avatar}
                alt={author.name}
                fill
                className="h-full w-full object-cover"
                sizes="48px"
              />
            ) : (
              <div className={cn(
                "flex h-full w-full items-center justify-center bg-primary/20 text-xs font-bold",
                isFullscreen && "text-base"
              )}>
                {author.name[0]}
              </div>
            )}
          </div>
          <div>
            <h3 className={cn(
              "text-lg font-semibold",
              isFullscreen && "text-2xl"
            )}>{title}</h3>
            <div className={cn(
              "flex items-center text-xs text-muted-foreground",
              isFullscreen && "text-sm"
            )}>
              <span>{author.name}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex space-x-2">
            {techStack.map((tech, i) => (
              <Badge key={i} variant="outline" className={cn(
                "bg-background/50",
                isFullscreen && "text-sm px-3 py-1"
              )}>{tech}</Badge>
            ))}
          </div>
          
          {/* 全屏按钮 */}
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "h-8 w-8 rounded-full hover:bg-muted",
              isFullscreen && "h-10 w-10"
            )}
            onClick={isFullscreen ? handleExitFullscreen : handleEnterFullscreen}
            title={isFullscreen ? "退出全屏 (ESC)" : "全屏显示"}
          >
            {isFullscreen ? (
              <Minimize className="h-4 w-4" />
            ) : (
              <Maximize className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* 项目内容区 - 增大高度比例，更接近全屏 */}
      <div className={cn(
        "relative w-full flex-1 overflow-hidden bg-black",
        isFullscreen ? "h-[calc(100vh-120px)]" : "min-h-[70vh]"
      )}>
        {/* 项目预览图 */}
        <div className="relative h-full w-full overflow-hidden">
          <Image
            src={finalPreviewUrl}
            alt={title}
            fill
            className={cn(
              "object-cover transition-opacity duration-300",
              (hasValidExternalUrl && showIframe && iframeLoaded) || showCodeView ? "opacity-0" : "opacity-100"
            )}
            onLoad={() => setIsLoaded(true)}
            onError={handleImageError}
            priority={index < 3} // 优先加载前3个项目的图片
            quality={isFullscreen ? 100 : 80}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        
        {/* 加载状态指示器 */}
        {!isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70 z-10">
            <div className={cn(
              "h-10 w-10 animate-spin rounded-full border-4 border-t-transparent border-primary",
              isFullscreen && "h-16 w-16 border-8"
            )}></div>
          </div>
        )}
        
        {/* 代码视图 */}
        {showCodeView && isActive && (
          <div className="absolute inset-0 z-20 bg-gray-900 overflow-auto">
            <div className={cn(
              "flex items-center justify-between bg-gray-800 p-2 sticky top-0",
              isFullscreen && "p-4"
            )}>
              <div className="flex items-center">
                <Terminal className={cn(
                  "mr-2 h-4 w-4 text-green-400",
                  isFullscreen && "h-6 w-6"
                )} />
                <span className={cn(
                  "text-sm font-mono text-green-400",
                  isFullscreen && "text-lg"
                )}>代码预览</span>
              </div>
              <div className="flex space-x-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className={cn(
                    "h-7 px-2 text-xs text-white hover:bg-gray-700",
                    isFullscreen && "h-10 px-4 text-sm"
                  )}
                  onClick={toggleCodeView}
                >
                  关闭
                </Button>
                {hasValidExternalUrl && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "h-7 px-2 text-xs text-white hover:bg-gray-700",
                      isFullscreen && "h-10 px-4 text-sm"
                    )}
                    onClick={() => window.open(externalUrl, '_blank')}
                  >
                    <ExternalLink className={cn(
                      "mr-1 h-3 w-3",
                      isFullscreen && "h-4 w-4"
                    )} />
                    打开项目
                  </Button>
                )}
              </div>
            </div>
            <pre className={cn(
              "p-4 text-sm text-green-400 overflow-x-auto",
              isFullscreen && "p-8 text-base"
            )}>
              <code>{defaultCodePreview}</code>
            </pre>
          </div>
        )}

        {/* 外部链接iframe嵌入 */}
        {hasValidExternalUrl && showIframe && !showCodeView && (
          <div className="absolute inset-0 z-10">
            <iframe
              src={externalUrl}
              className={cn(
                "h-full w-full border-0 transition-opacity duration-500",
                iframeLoaded ? "opacity-100" : "opacity-0"
              )}
              title={title}
              sandbox="allow-scripts allow-same-origin"
              loading="lazy"
              onLoad={handleIframeLoad}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            />
            {!iframeLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-80">
                <div className="flex flex-col items-center">
                  <div className={cn(
                    "mb-3 h-10 w-10 animate-spin rounded-full border-4 border-t-transparent border-primary",
                    isFullscreen && "h-16 w-16 border-8"
                  )}></div>
                  <p className={cn(
                    "text-sm text-white",
                    isFullscreen && "text-lg"
                  )}>加载外部内容...</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 项目信息覆盖层 - 仅在预览状态显示 */}
        {!isActive && !isFullscreen && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-60 z-10">
            <span className="text-lg font-medium text-white">点击查看项目</span>
          </div>
        )}

        {/* 互动按钮 */}
        <div className={cn(
          "absolute bottom-4 right-4 z-20 flex flex-col space-y-4",
          isFullscreen && "bottom-8 right-8 space-y-6"
        )}>
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "h-10 w-10 rounded-full bg-black/50 backdrop-blur-sm hover:bg-black/70",
              isFullscreen && "h-14 w-14"
            )}
            onClick={handleLike}
          >
            <Heart 
              className={cn(
                "h-5 w-5 transition-colors",
                isFullscreen && "h-6 w-6",
                isLiked ? "fill-red-500 text-red-500" : "text-white"
              )} 
            />
            <span className={cn(
              "mt-1 text-xs font-medium text-white",
              isFullscreen && "text-sm"
            )}>{likesCount}</span>
          </Button>
          
          <Button
            variant="ghost"
            size="icon" 
            className={cn(
              "h-10 w-10 rounded-full bg-black/50 backdrop-blur-sm hover:bg-black/70",
              isFullscreen && "h-14 w-14"
            )}
            onClick={handleBookmark}
          >
            <BookmarkPlus 
              className={cn(
                "h-5 w-5 transition-colors",
                isFullscreen && "h-6 w-6",
                isBookmarked ? "fill-yellow-500 text-yellow-500" : "text-white"
              )}
            />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "h-10 w-10 rounded-full bg-black/50 backdrop-blur-sm hover:bg-black/70",
              isFullscreen && "h-14 w-14"
            )}
            onClick={toggleCodeView}
          >
            <Code className={cn(
              "h-5 w-5 text-white",
              isFullscreen && "h-6 w-6"
            )} />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "h-10 w-10 rounded-full bg-black/50 backdrop-blur-sm hover:bg-black/70",
              isFullscreen && "h-14 w-14"
            )}
            onClick={handleShare}
          >
            <Share2 className={cn(
              "h-5 w-5 text-white",
              isFullscreen && "h-6 w-6"
            )} />
          </Button>

          <Link href={`/${locale}/project/${id}#comments`}>
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "h-10 w-10 rounded-full bg-black/50 backdrop-blur-sm hover:bg-black/70",
                isFullscreen && "h-14 w-14"
              )}
            >
              <MessageSquare className={cn(
                "h-5 w-5 text-white",
                isFullscreen && "h-6 w-6"
              )} />
              <span className={cn(
                "mt-1 text-xs font-medium text-white",
                isFullscreen && "text-sm"
              )}>{comments}</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* 项目描述区 - 压缩高度 */}
      <div className={cn(
        "px-3 py-2",
        isFullscreen && "px-6 py-4"
      )}>
        <p className={cn(
          "text-sm text-muted-foreground line-clamp-2",
          isFullscreen && "text-base line-clamp-3"
        )}>
          {description || "探索这个精彩的代码项目"}
        </p>
      </div>

      {/* 项目操作区 - 压缩高度并简化 */}
      <div className={cn(
        "flex items-center justify-between border-t px-3 py-2",
        isFullscreen && "px-6 py-4"
      )}>
        <div className="flex items-center space-x-2">
          {hasValidExternalUrl && (
            <Button 
              size="sm"
              variant="outline"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                window.open(externalUrl, '_blank');
              }}
              className={cn(
                "flex items-center space-x-1 h-7 text-xs",
                isFullscreen && "h-10 text-sm px-4"
              )}
            >
              <ExternalLink className={cn(
                "h-3 w-3",
                isFullscreen && "h-4 w-4"
              )} />
              <span>查看项目</span>
            </Button>
          )}
          
          <Button
            size="sm"
            variant="outline"
            onClick={toggleCodeView}
            className={cn(
              "flex items-center space-x-1 h-7 text-xs",
              isFullscreen && "h-10 text-sm px-4"
            )}
          >
            <Code className={cn(
              "h-3 w-3",
              isFullscreen && "h-4 w-4"
            )} />
            <span>{showCodeView ? "隐藏代码" : "查看代码"}</span>
          </Button>
        </div>
        
        <div className="flex space-x-2">
          <Link href={`/${locale}/project/${id}`}>
            <Button size="sm" variant="default" className={cn(
              "h-7 text-xs",
              isFullscreen && "h-10 text-sm px-4"
            )}>
              项目详情
            </Button>
          </Link>
        </div>
      </div>

      {/* 全屏模式下的退出提示 */}
      {isFullscreen && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-30 bg-black/70 backdrop-blur-sm rounded-full px-4 py-2">
          <p className="text-white text-sm">
            按 ESC 键或点击 <Minimize className="inline h-4 w-4 mx-1" /> 退出全屏
          </p>
        </div>
      )}
    </motion.div>
  );
} 