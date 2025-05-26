"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { getRecommendedProjects, getTrendingProjects, getLatestProjects } from "@/services/project-service";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, BookmarkPlus, MessageSquare, ExternalLink, Code } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// 示例技术栈标签 - 包含数据库真实项目和AI模拟项目的技术栈
const TECH_STACKS = {
  // 数据库中的真实项目
  "dbjs2m89": ["JavaScript", "游戏开发", "第一人称", "创新"], // First Person Flappy
  "0qafg6d2": ["Three.js", "JavaScript", "3D动画", "角色控制"], // Character Sample Project
  "cievmsbh": ["游戏引擎", "FPS", "射击游戏", "3D"], // FPS Sample Project
  "hv2MyfkE": ["数据可视化", "图像处理", "溯源分析"], // Visual Origins
  "OUqkCPge": ["HTML5游戏", "Canvas", "交互设计"], // Fang Die Fliege
  "Kw6po9Rc": ["React", "动画", "互动体验", "熊猫"], // Red Panda Vibes
  "AuwigNZk": ["问答平台", "社区", "Web应用"], // Find Asks
  "sCGsO5Qk": ["游戏", "身份猜测", "社交"], // Secret Name Game
  "nrRjnASj": ["AI", "文本摘要", "自然语言处理"], // Summed Up AI
  
  // AI相关模拟项目（后备数据）
  "character-sample": ["Three.js", "JavaScript", "WebGL"],
  "visual-origins": ["React", "TypeScript", "API"],
  "vibe-coding-demo": ["AI", "Vibe Coding", "自然语言处理"],
  "ai-code-generator": ["AI", "LLM", "代码生成", "多语言"],
  "prompt-engineering-lab": ["Prompt Engineering", "AI", "优化技巧"],
  "game-fly": ["JavaScript", "Canvas", "Animation"],
  "react-vibe-hooks": ["React", "Hooks", "Vibe Coding", "TypeScript"],
  "vql-playground": ["VQL", "查询语言", "在线编辑器", "AI"],
  "ai-assistant-chat": ["AI助手", "聊天界面", "代码优化"],
  "neural-code-viewer": ["神经网络", "可视化", "AI模型"],
  "default": ["Code", "JavaScript", "Web", "创新"]
};

interface PageParams {
  locale: string;
}

interface PageProps {
  params: Promise<PageParams>;
}

export default function ProjectsPage({
  params,
}: PageProps) {
  const [locale, setLocale] = useState<string>("zh-cn");
  const t = useTranslations('Common');
  
  const [activeTab, setActiveTab] = useState("recommended");
  const [recommendedProjects, setRecommendedProjects] = useState<any[]>([]);
  const [trendingProjects, setTrendingProjects] = useState<any[]>([]);
  const [latestProjects, setLatestProjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // 解析异步params
  useEffect(() => {
    async function resolveParams() {
      const resolvedParams = await params;
      setLocale(resolvedParams.locale || "zh-cn");
    }
    resolveParams();
  }, [params]);
  
  useEffect(() => {
    async function loadProjects() {
      setIsLoading(true);
      try {
        const [recommended, trending, latest] = await Promise.all([
          getRecommendedProjects(12),
          getTrendingProjects(12),
          getLatestProjects(12)
        ]);
        
        // 格式化项目数据
        const formatProjects = (data: any[]) => data.map((project) => ({
          id: project.id,
          title: project.title,
          description: project.description,
          previewUrl: project.previewUrl,
          externalUrl: project.externalUrl,
          authorName: project.authorName || "匿名用户",
          authorAvatar: project.authorAvatar || "",
          likes: project.likes || 0,
          comments: project.comments || 0,
          createdAt: project.createdAt,
          techStack: TECH_STACKS[project.id as keyof typeof TECH_STACKS] || TECH_STACKS.default,
        }));
        
        setRecommendedProjects(formatProjects(recommended));
        setTrendingProjects(formatProjects(trending));
        setLatestProjects(formatProjects(latest));
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
  
  // 根据活动标签选择要显示的项目
  const projectsToShow = activeTab === "recommended" 
    ? recommendedProjects 
    : activeTab === "trending" 
      ? trendingProjects 
      : latestProjects;

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <h1 className="text-3xl font-bold mb-4 sm:mb-0">
          {locale === 'zh-cn' ? '项目库' : 'Projects'}
        </h1>
        
        <div>
          <Link href={`/${locale}/upload`}>
            <Button className="bg-primary">
              {locale === 'zh-cn' ? '上传项目' : 'Upload Project'}
            </Button>
          </Link>
        </div>
      </div>
      
      <Tabs
        defaultValue="recommended"
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full mb-8"
      >
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-3">
          <TabsTrigger value="recommended">
            {locale === 'zh-cn' ? '推荐' : 'Recommended'}
          </TabsTrigger>
          <TabsTrigger value="trending">
            {locale === 'zh-cn' ? '热门' : 'Trending'}
          </TabsTrigger>
          <TabsTrigger value="latest">
            {locale === 'zh-cn' ? '最新' : 'Latest'}
          </TabsTrigger>
        </TabsList>
      </Tabs>
      
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-t-transparent border-primary"></div>
          <p className="ml-4 text-muted-foreground">
            {t('loading')}
          </p>
        </div>
      ) : projectsToShow.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projectsToShow.map((project) => (
            <Link 
              key={project.id} 
              href={`/${locale}/project/${project.id}`}
              className="block group"
            >
              <div className="bg-card rounded-lg overflow-hidden border shadow-sm hover:shadow-md transition-shadow">
                <div className="relative aspect-video w-full bg-muted overflow-hidden">
                  <Image
                    src={project.previewUrl || '/images/code-preview-1.jpg'}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent">
                    <div className="absolute bottom-3 left-3 flex items-center">
                      <div className="h-6 w-6 rounded-full bg-primary/10 overflow-hidden mr-2">
                        {project.authorAvatar ? (
                          <Image
                            src={project.authorAvatar}
                            alt={project.authorName}
                            width={24}
                            height={24}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-primary/20 text-xs font-bold text-white">
                            {project.authorName[0]}
                          </div>
                        )}
                      </div>
                      <span className="text-sm font-medium text-white">{project.authorName}</span>
                    </div>
                  </div>
                  
                  {project.externalUrl && (
                    <div className="absolute top-3 right-3">
                      <Badge variant="secondary" className="flex items-center space-x-1 bg-black/50 text-white">
                        <ExternalLink className="h-3 w-3 mr-1" />
                        <span>{locale === 'zh-cn' ? '外部项目' : 'External'}</span>
                      </Badge>
                    </div>
                  )}
                </div>
                
                <div className="p-4">
                  <div className="flex gap-2 mb-2">
                    {project.techStack.map((tech: string, i: number) => (
                      <Badge key={i} variant="outline" className="bg-primary/5">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                  
                  <h3 className="text-lg font-semibold mb-2 line-clamp-1 group-hover:text-primary transition-colors">
                    {project.title}
                  </h3>
                  
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {project.description || (locale === 'zh-cn' ? '探索这个精彩的代码项目' : 'Explore this amazing code project')}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex space-x-4">
                      <div className="flex items-center">
                        <Heart className="h-4 w-4 mr-1" />
                        <span>{project.likes}</span>
                      </div>
                      <div className="flex items-center">
                        <MessageSquare className="h-4 w-4 mr-1" />
                        <span>{project.comments}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <Code className="h-4 w-4 mr-1" />
                      <span>{t('view_details')}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-muted-foreground text-lg">
            {locale === 'zh-cn' ? '暂无项目' : 'No projects found'}
          </p>
        </div>
      )}
    </div>
  );
} 