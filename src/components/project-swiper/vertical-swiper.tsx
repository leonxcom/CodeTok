"use client";

import React, { useState, useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Mousewheel, Keyboard, Virtual, A11y, EffectCards } from "swiper/modules";
import { useGesture } from "@use-gesture/react";
import { ProjectCard, ProjectCardProps } from "./project-card";

// 导入 Swiper 样式
import "swiper/css";
import "swiper/css/virtual";
import "swiper/css/mousewheel";
import "swiper/css/effect-cards";

// 移除项目卡片属性中的 isActive 和 index，因为我们会在组件中动态添加
type ProjectData = Omit<ProjectCardProps, "isActive" | "index">;

interface VerticalSwiperProps {
  projects: ProjectData[];
  initialIndex?: number;
  locale: string;
  className?: string;
  onSlideChange?: (index: number) => void;
  onProjectClick?: (projectId: string) => void;
}

export function VerticalSwiper({
  projects = [],
  initialIndex = 0,
  locale = "zh-cn",
  className = "",
  onSlideChange,
  onProjectClick,
}: VerticalSwiperProps) {
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const [isSwiping, setIsSwiping] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const swiperRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // 使用 useGesture 监听触摸和鼠标手势
  const gestureBind = useGesture({
    onDrag: ({ direction: [, dy], distance, cancel }) => {
      if (!swiperRef.current?.swiper) return;
      
      // 垂直拖动超过50px触发滑动
      if (typeof distance === 'number' && distance > 50) {
        setIsSwiping(true);
        if (dy > 0 && activeIndex < projects.length - 1) {
          // 向下滑动
          swiperRef.current.swiper.slideNext();
          cancel();
        } else if (dy < 0 && activeIndex > 0) {
          // 向上滑动
          swiperRef.current.swiper.slidePrev();
          cancel();
        }
      }
    },
    onDragEnd: () => {
      setIsSwiping(false);
    },
  });

  // 处理滑动改变事件
  const handleSlideChange = (swiper: any) => {
    const newIndex = swiper.activeIndex;
    setActiveIndex(newIndex);
    onSlideChange?.(newIndex);
  };

  // 处理项目点击事件
  const handleProjectClick = (projectId: string) => {
    onProjectClick?.(projectId);
  };

  // 当项目数据变化时重置 Swiper
  useEffect(() => {
    if (swiperRef.current?.swiper) {
      setIsLoading(true);
      // 短暂延迟以确保 DOM 更新
      setTimeout(() => {
        swiperRef.current.swiper.update();
        setIsLoading(false);
      }, 300);
    }
  }, [projects]);

  // 监听窗口大小变化，更新swiper
  useEffect(() => {
    const handleResize = () => {
      if (swiperRef.current?.swiper) {
        swiperRef.current.swiper.update();
      }
    };

    window.addEventListener('resize', handleResize);
    
    // 组件加载后延迟更新一次，确保正确初始化
    setTimeout(() => {
      handleResize();
    }, 500);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // 适应屏幕大小设置滑动方向
  const isSmallScreen = typeof window !== 'undefined' && window.innerWidth < 768;
  const swiperDirection = isSmallScreen ? "vertical" : "vertical";

  return (
    <div 
      ref={containerRef}
      className={`relative h-full w-full overflow-hidden ${className}`}
      {...gestureBind()}
    >
      {isLoading && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-background bg-opacity-70">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-t-transparent border-primary"></div>
        </div>
      )}
      
      <Swiper
        ref={swiperRef}
        direction={swiperDirection}
        slidesPerView={1}
        spaceBetween={10}
        mousewheel={{
          sensitivity: 1,
          thresholdDelta: 30,
          forceToAxis: true
        }}
        keyboard={{ enabled: true }}
        initialSlide={initialIndex}
        modules={[Mousewheel, Keyboard, Virtual, A11y, EffectCards]}
        virtual
        className="h-full w-full"
        onSlideChange={handleSlideChange}
        speed={600}
        threshold={20}
        resistance={true}
        resistanceRatio={0.85}
        watchSlidesProgress={true}
        updateOnWindowResize={true}
        observer={true}
        observeParents={true}
        centeredSlides={true}
      >
        {projects.map((project, index) => (
          <SwiperSlide key={project.id} virtualIndex={index} className="h-full w-full flex justify-center">
            <div className="flex h-full w-full items-center justify-center px-2 py-2">
              <ProjectCard
                {...project}
                locale={locale}
                isActive={index === activeIndex}
                index={index}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      
      {/* 滑动指示器 */}
      <div className="absolute right-4 top-1/2 z-20 flex -translate-y-1/2 flex-col items-center space-y-1.5">
        {projects.map((_, index) => (
          <div
            key={index}
            className={`h-1.5 w-1.5 cursor-pointer rounded-full transition-all duration-300 ${
              index === activeIndex
                ? "h-4 w-1.5 bg-primary"
                : "bg-gray-400/50"
            }`}
            onClick={() => swiperRef.current?.swiper.slideTo(index)}
          />
        ))}
      </div>
    </div>
  );
} 