'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { VerticalSwiper } from "@/components/project-swiper/vertical-swiper";
import { getRecommendedProjects, getTrendingProjects } from "@/services/project-service";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles, TrendingUp } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";

export default function ExplorePage() {
  const locale = useLocale();
  const router = useRouter();
  const tExplore = useTranslations('ExplorePage');
  const tNav = useTranslations('Navigation');
  
  const [activeTab, setActiveTab] = useState("for-you");
  const [forYouProjects, setForYouProjects] = useState<any[]>([]);
  const [trendingProjects, setTrendingProjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [windowWidth, setWindowWidth] = useState(0);

  useEffect(() => {
    const updateWidth = () => {
      setWindowWidth(window.innerWidth);
    };
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  const contentHeight = windowWidth < 768 
    ? "calc(100vh - 80px)" 
    : "calc(100vh - 100px)";
  
  useEffect(() => {
    async function loadProjects() {
      setIsLoading(true);
      setError(null);
      try {
        const [recommendedData, trendingData] = await Promise.all([
          getRecommendedProjects(10).catch(err => { console.error('Failed to load recommended projects:', err); return []; }),
          getTrendingProjects(10).catch(err => { console.error('Failed to load trending projects:', err); return []; })
        ]);
        
        const formatProjects = (data: any[]) => data.map((project) => ({
          id: project.id,
          title: project.title,
          description: project.description,
          previewUrl: project.previewUrl,
          externalUrl: project.externalUrl,
          author: {
            name: project.authorName || tExplore('anonymousUser'),
            avatar: project.authorAvatar || "",
          },
          likes: project.likes || 0,
          comments: project.comments || 0,
          locale,
        }));
        
        setForYouProjects(formatProjects(recommendedData));
        setTrendingProjects(formatProjects(trendingData));
      } catch (error) {
        console.error("[ExplorePage] Failed to load projects:", error);
        setError(tExplore('loadProjectsError'));
      } finally {
        setIsLoading(false);
      }
    }
    
    if (locale) {
      loadProjects();
    }
  }, [locale, tExplore]);
  
  const handleProjectClick = (projectId: string) => {
    try {
      router.push(`/${locale}/project/${projectId}`);
    } catch (error) {
      console.error('[ExplorePage] Navigation failed:', error);
    }
  };
  
  const handleSlideChange = (index: number) => {
    // console.log("[ExplorePage] Current slide:", index);
  };

  if (error) {
    return (
      <div className="flex flex-col w-full h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-red-500 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
          >
            {tExplore('reloadButton')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full">
      <div className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-30">
        <div className="mx-auto max-w-full w-full px-2">
          <Tabs
            defaultValue="for-you"
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full py-1"
          >
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
              <TabsTrigger value="for-you" className="flex items-center justify-center">
                <Sparkles className="mr-2 h-4 w-4" />
                <span>{tNav('for_you')}</span>
              </TabsTrigger>
              <TabsTrigger value="trending" className="flex items-center justify-center">
                <TrendingUp className="mr-2 h-4 w-4" />
                <span>{tNav('trending')}</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      <div 
        className="w-full mx-auto flex justify-center"
        style={{ height: contentHeight }}
          >
        {isLoading ? (
          <div className="flex h-full w-full items-center justify-center">
            <div className="h-16 w-16 animate-spin rounded-full border-4 border-t-transparent border-primary"></div>
            <p className="ml-4 text-muted-foreground">
              {tExplore('loadingFeed')}
            </p>
          </div>
        ) : (
          <div className="h-full w-full max-w-none mx-auto">
            {activeTab === "for-you" && (
              <div className="h-full w-full">
                {forYouProjects.length > 0 ? (
                  <VerticalSwiper
                    projects={forYouProjects}
                    locale={locale}
                    onProjectClick={handleProjectClick}
                    onSlideChange={handleSlideChange}
                    className="h-full"
                  />
                ) : (
                  <div className="flex h-full flex-col items-center justify-center">
                    <p className="text-lg text-muted-foreground">
                      {tExplore('noRecommendedProjects')}
                    </p>
                  </div>
                )}
                </div>
            )}

            {activeTab === "trending" && (
              <div className="h-full w-full">
                {trendingProjects.length > 0 ? (
                  <VerticalSwiper
                    projects={trendingProjects}
                    locale={locale}
                    onProjectClick={handleProjectClick}
                    onSlideChange={handleSlideChange}
                    className="h-full"
                  />
                ) : (
                  <div className="flex h-full flex-col items-center justify-center">
                    <p className="text-lg text-muted-foreground">
                      {tExplore('noTrendingProjects')}
                    </p>
                  </div>
                )}
              </div>
            )}
                </div>
        )}
      </div>
    </div>
  );
} 