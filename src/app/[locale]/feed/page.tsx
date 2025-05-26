"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { VerticalSwiper } from "@/components/project-swiper/vertical-swiper";
import { getRecommendedProjects, getTrendingProjects } from "@/services/project-service";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Code, TrendingUp } from "lucide-react";

interface PageParams {
  locale: string;
}

interface PageProps {
  params: Promise<PageParams>;
}

export default function FeedPage({
  params,
}: PageProps) {
  const [locale, setLocale] = useState<string>("zh-cn");
  const router = useRouter();
  
  const [activeTab, setActiveTab] = useState("for-you");
  const [forYouProjects, setForYouProjects] = useState<any[]>([]);
  const [trendingProjects, setTrendingProjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [windowWidth, setWindowWidth] = useState(0);
  
  // 解析异步params
  useEffect(() => {
    async function resolveParams() {
      const resolvedParams = await params;
      setLocale(resolvedParams.locale || "zh-cn");
    }
    resolveParams();
  }, [params]);
  
  // 监听窗口大小变化
  useEffect(() => {
    const updateWidth = () => {
      setWindowWidth(window.innerWidth);
    };
    
    // 初始化
    updateWidth();
    
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);
  
  // 根据屏幕宽度计算内容高度
  const contentHeight = windowWidth < 768 
    ? "calc(100vh - 120px)"   // 移动设备
    : "calc(100vh - 150px)";  // 桌面设备
  
  // 加载项目数据
  useEffect(() => {
    async function loadProjects() {
      setIsLoading(true);
      try {
        const recommendedData = await getRecommendedProjects(10);
        const trendingData = await getTrendingProjects(10);
        
        // 将数据格式化为ProjectCard组件所需格式
        const formatProjects = (data: any[]) => data.map((project) => ({
          id: project.id,
          title: project.title,
          description: project.description,
          previewUrl: project.previewUrl,
          externalUrl: project.externalUrl,
          author: {
            name: project.authorName || "匿名用户",
            avatar: project.authorAvatar || "",
          },
          likes: project.likes || 0,
          comments: project.comments || 0,
          locale,
        }));
        
        setForYouProjects(formatProjects(recommendedData));
        setTrendingProjects(formatProjects(trendingData));
      } catch (error) {
        console.error("加载项目失败:", error);
      } finally {
        setIsLoading(false);
      }
    }
    
    if (locale) {
      loadProjects();
    }
  }, [locale]);
  
  // 处理项目点击
  const handleProjectClick = (projectId: string) => {
    router.push(`/${locale}/project/${projectId}`);
  };
  
  // 处理滑动改变
  const handleSlideChange = (index: number) => {
    console.log("Current slide:", index);
  };

  return (
    <div className="flex flex-col w-full">
      {/* 标签页切换 */}
      <div className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-30">
        <div className="mx-auto max-w-7xl w-full px-4">
          <Tabs
            defaultValue="for-you"
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full py-2"
          >
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
              <TabsTrigger value="for-you" className="flex items-center justify-center">
                <Code className="mr-2 h-4 w-4" />
                <span>为你推荐</span>
              </TabsTrigger>
              <TabsTrigger value="trending" className="flex items-center justify-center">
                <TrendingUp className="mr-2 h-4 w-4" />
                <span>热门</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* 内容区域 */}
      <div 
        className="w-full mx-auto flex justify-center"
        style={{ height: contentHeight }}
      >
        {isLoading ? (
          <div className="flex h-full w-full items-center justify-center">
            <div className="h-16 w-16 animate-spin rounded-full border-4 border-t-transparent border-primary"></div>
          </div>
        ) : (
          <div className="h-full w-full max-w-7xl mx-auto">
            {activeTab === "for-you" && forYouProjects.length > 0 && (
              <div className="h-full w-full">
                <VerticalSwiper
                  projects={forYouProjects}
                  locale={locale}
                  onProjectClick={handleProjectClick}
                  onSlideChange={handleSlideChange}
                  className="h-full"
                />
              </div>
            )}

            {activeTab === "trending" && trendingProjects.length > 0 && (
              <div className="h-full w-full">
                <VerticalSwiper
                  projects={trendingProjects}
                  locale={locale}
                  onProjectClick={handleProjectClick}
                  onSlideChange={handleSlideChange}
                  className="h-full"
                />
              </div>
            )}

            {activeTab === "for-you" && forYouProjects.length === 0 && (
              <div className="flex h-full flex-col items-center justify-center">
                <p className="text-lg text-muted-foreground">暂无推荐项目</p>
              </div>
            )}

            {activeTab === "trending" && trendingProjects.length === 0 && (
              <div className="flex h-full flex-col items-center justify-center">
                <p className="text-lg text-muted-foreground">暂无热门项目</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 