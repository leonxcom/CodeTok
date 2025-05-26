'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { VerticalSwiper } from "@/components/project-swiper/vertical-swiper";
import { getRecommendedProjects, getTrendingProjects } from "@/services/project-service";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChatInterface } from "@/components/ai/chat-interface";
import { 
  Sparkles, 
  TrendingUp, 
  Search, 
  Code2, 
  Zap, 
  Globe,
  Cpu,
  Layers,
  ArrowRight
} from "lucide-react";

// 简单的代码高亮函数
const highlightCode = (code: string) => {
  return code
    .replace(/(import|export|const|let|var|function|return|if|else|for|while|class|extends)/g, '<span class="text-purple-300">$1</span>')
    .replace(/('.*?'|".*?")/g, '<span class="text-green-300">$1</span>')
    .replace(/(\/\/.*$)/gm, '<span class="text-gray-400">$1</span>')
    .replace(/(\{|\}|\(|\)|\[|\])/g, '<span class="text-yellow-300">$1</span>')
    .replace(/(React|useState|useEffect|Component)/g, '<span class="text-blue-300">$1</span>');
};
import { Badge } from "@/components/ui/badge";

interface PageParams {
  locale: string;
}

interface PageProps {
  params: Promise<PageParams>;
}

export default function IndexPage({
  params,
}: PageProps) {
  const [locale, setLocale] = useState<string>("zh-cn");
  const router = useRouter();
  
  const [activeTab, setActiveTab] = useState("for-you");
  const [forYouProjects, setForYouProjects] = useState<any[]>([]);
  const [trendingProjects, setTrendingProjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [windowWidth, setWindowWidth] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAiGenerator, setShowAiGenerator] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [generatedCode, setGeneratedCode] = useState<any>(null);
  const [aiResponse, setAiResponse] = useState<string>('');
  const [abortController, setAbortController] = useState<AbortController | null>(null);
  const [conversationHistory, setConversationHistory] = useState<Array<{role: 'user' | 'assistant', content: string}>>([]);
  const [streamingProgress, setStreamingProgress] = useState<{progress: number, message: string} | null>(null);
  
  // 解析异步params
  useEffect(() => {
    async function resolveParams() {
      try {
        const resolvedParams = await params;
        setLocale(resolvedParams.locale || "zh-cn");
        console.log('[IndexPage] Locale设置为:', resolvedParams.locale || "zh-cn");
      } catch (error) {
        console.error('[IndexPage] 解析params失败:', error);
        setLocale("zh-cn"); // 使用默认值
      }
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
  
  // 根据屏幕宽度计算内容高度 - 增加更多可用空间
  const contentHeight = windowWidth < 768 
    ? "calc(100vh - 80px)"    // 移动设备 - 减少顶部间距
    : "calc(100vh - 100px)";  // 桌面设备 - 减少顶部间距
  
  // 加载项目数据
  useEffect(() => {
    async function loadProjects() {
      setIsLoading(true);
      setError(null);
      try {
        console.log('[IndexPage] 开始加载项目数据...');
        
        const [recommendedData, trendingData] = await Promise.all([
          getRecommendedProjects(10).catch(err => {
            console.error('[IndexPage] 加载推荐项目失败:', err);
            return [];
          }),
          getTrendingProjects(10).catch(err => {
            console.error('[IndexPage] 加载热门项目失败:', err);
            return [];
          })
        ]);
        
        console.log('[IndexPage] 推荐项目数量:', recommendedData.length);
        console.log('[IndexPage] 热门项目数量:', trendingData.length);
        
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
        
        const formattedRecommended = formatProjects(recommendedData);
        const formattedTrending = formatProjects(trendingData);
        
        setForYouProjects(formattedRecommended);
        setTrendingProjects(formattedTrending);
        
        console.log('[IndexPage] 项目数据加载完成');
      } catch (error) {
        console.error("[IndexPage] 加载项目失败:", error);
        setError("加载项目失败，请刷新页面重试");
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
    try {
      router.push(`/${locale}/project/${projectId}`);
    } catch (error) {
      console.error('[IndexPage] 导航失败:', error);
    }
  };
  
  // 处理滑动改变
  const handleSlideChange = (index: number) => {
    console.log("[IndexPage] Current slide:", index);
  };

  // 处理搜索（流式版本，更快响应）
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    setGeneratedCode(null);
    setAiResponse('');
    setStreamingProgress({ progress: 0, message: '初始化AI模型...' });
    
    try {
      // 使用流式API获得实时反馈
      const response = await fetch('/api/generate-code-stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: searchQuery,
          language: 'react',
        }),
      });

      if (!response.ok) {
        throw new Error('代码生成服务不可用');
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error('无法读取响应流');
      }

      // 处理流式数据
      while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;
        
        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            
            if (data === '[DONE]') {
              setStreamingProgress(null);
              continue;
            }
            
            try {
              const parsed = JSON.parse(data);
              
              switch (parsed.type) {
                case 'start':
                  setStreamingProgress({ progress: 5, message: `使用 ${parsed.model} 开始生成...` });
                  setAiResponse(`🚀 使用 ${parsed.model} 为您生成代码...`);
                  break;
                  
                case 'progress':
                  setStreamingProgress({ 
                    progress: parsed.progress, 
                    message: parsed.message || '正在生成代码...' 
                  });
                  break;
                  
                case 'complete':
                  // 代码生成完成
                  setAiResponse(`🧠 AI代码生成完成！使用 ${parsed.model} 为您生成了以下代码实现：\n\n${parsed.description}`);
                  
                  setGeneratedCode({
                    id: Date.now().toString(),
                    title: parsed.title,
                    code: parsed.code,
                    language: parsed.language,
                    description: parsed.description,
                    runnable: true,
                    e2bUrl: parsed.e2bUrl,
                    isTemplate: parsed.isTemplate,
                  });
                  
                  // 更新对话历史
                  setConversationHistory(prev => [
                    ...prev,
                    { role: 'user', content: searchQuery },
                    { role: 'assistant', content: `${parsed.description}\n\n\`\`\`${parsed.language}\n${parsed.code}\n\`\`\`` }
                  ]);
                  
                  setStreamingProgress({ progress: 100, message: '生成完成!' });
                  setTimeout(() => setStreamingProgress(null), 1000);
                  break;
                  
                case 'error':
                  throw new Error(parsed.error);
              }
            } catch (parseError) {
              console.warn('解析流数据失败:', parseError);
            }
          }
        }
      }
      
    } catch (error) {
      console.error('流式代码生成失败:', error);
      
      setStreamingProgress(null);
      setAiResponse(`生成失败：${error instanceof Error ? error.message : '未知错误'}

💡 您可以尝试：
• 点击快速模板按钮获得即时结果
• 简化问题描述后重试
• 稍后再试，AI服务可能比较繁忙`);
      
    } finally {
      setIsSearching(false);
    }
  };

  // 检测是否为简单请求
  const isSimpleRequest = (query: string) => {
    const simpleKeywords = ['简单', 'basic', '按钮', 'button', '计数', 'counter', '基本', '简单的'];
    const lowerQuery = query.toLowerCase();
    return query.length < 20 || simpleKeywords.some(keyword => lowerQuery.includes(keyword));
  };

  // 快速生成模板代码
  const handleQuickGenerate = async (query: string) => {
    setSearchQuery(query);
    setIsSearching(true);
    setGeneratedCode(null);
    setAiResponse('');
    
    try {
      const response = await fetch('/api/generate-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: query,
          language: 'react',
          quickMode: true, // 明确使用快速模式
        }),
      });
      
      if (!response.ok) {
        throw new Error('模板生成失败');
      }
      
      const data = await response.json();
      
      setAiResponse(`⚡ 快速模板生成完成！基于"${query}"为您生成了React组件模板。

💡 这是预设的高质量模板，如需AI深度定制，请点击下方"AI深度生成"按钮。`);
      
      setGeneratedCode({
        id: Date.now().toString(),
        title: data.title,
        code: data.code,
        language: data.language,
        description: data.description,
        runnable: true,
        e2bUrl: data.e2bUrl,
        isTemplate: true, // 标记为模板
      });
      
    } catch (error) {
      console.error('快速生成失败:', error);
      setAiResponse('快速生成失败，请重试或选择AI深度生成。');
    } finally {
      setIsSearching(false);
    }
  };

  // 取消搜索（流式版本）
  const handleCancelSearch = () => {
    setIsSearching(false);
    setStreamingProgress(null);
    setAiResponse('搜索已取消。您可以重新输入问题或尝试其他查询。');
  };

  // 处理搜索输入变化
  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    // 清空之前的搜索结果
    if (!value.trim()) {
      setSearchResults([]);
    }
  };

  // 热门搜索关键词
  const trendingSearches = [
    { text: locale === 'zh-cn' ? 'React 组件' : 'React Components', icon: Code2 },
    { text: locale === 'zh-cn' ? 'Vue 应用' : 'Vue Apps', icon: Globe },
    { text: locale === 'zh-cn' ? 'Python 脚本' : 'Python Scripts', icon: Cpu },
    { text: locale === 'zh-cn' ? 'CSS 动画' : 'CSS Animations', icon: Layers },
  ];

  // 特色功能
  const features = [
    {
      title: locale === 'zh-cn' ? 'AI 代码生成' : 'AI Code Generation',
      description: locale === 'zh-cn' ? '用自然语言描述需求，AI 为你生成代码' : 'Describe your needs in natural language, AI generates code for you',
      icon: Zap,
      action: () => setShowAiGenerator(true),
      color: 'bg-gradient-to-br from-purple-500 to-blue-600'
    },
    {
      title: locale === 'zh-cn' ? '实时预览' : 'Live Preview',
      description: locale === 'zh-cn' ? '生成的代码立即运行，实时查看效果' : 'Generated code runs immediately with live preview',
      icon: Globe,
      action: () => setActiveTab('discover'),
      color: 'bg-gradient-to-br from-green-500 to-emerald-600'
    },
    {
      title: locale === 'zh-cn' ? '开源项目' : 'Open Source',
      description: locale === 'zh-cn' ? '浏览和发现优秀的开源代码项目' : 'Browse and discover excellent open source projects',
      icon: Code2,
      action: () => setActiveTab('discover'),
      color: 'bg-gradient-to-br from-orange-500 to-red-600'
    }
  ];

  // 错误状态
  if (error) {
    return (
      <div className="flex flex-col w-full h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-red-500 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
          >
            重新加载
          </button>
        </div>
      </div>
    );
  }

  // AI生成器弹窗
  if (showAiGenerator) {
    return (
      <div className="fixed inset-0 bg-background z-50">
        <ChatInterface 
          locale={locale} 
          onClose={() => setShowAiGenerator(false)} 
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full">
      {/* 标签页切换 */}
      <div className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-30">
        <div className="mx-auto max-w-full w-full px-2">
          <Tabs
            defaultValue="for-you"
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full py-1"
          >
            <TabsList className="grid w-full max-w-lg mx-auto grid-cols-3">
              <TabsTrigger value="for-you" className="flex items-center justify-center">
                <Sparkles className="mr-2 h-4 w-4" />
                <span>{locale === 'zh-cn' ? '推荐' : 'Recommended'}</span>
              </TabsTrigger>
              <TabsTrigger value="search" className="flex items-center justify-center">
                <Search className="mr-2 h-4 w-4" />
                <span>{locale === 'zh-cn' ? 'AI Super Mode' : 'AI Super Mode'}</span>
              </TabsTrigger>
              <TabsTrigger value="trending" className="flex items-center justify-center">
                <TrendingUp className="mr-2 h-4 w-4" />
                <span>{locale === 'zh-cn' ? '热门' : 'Trending'}</span>
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
        <Tabs value={activeTab} className="w-full h-full">
          {/* AI Super Mode页面 */}
          <TabsContent value="search" className="h-full m-0">
            <div className="h-full flex flex-col">
              {/* AI搜索主界面 */}
              {!generatedCode && !aiResponse && !isSearching && (
                <div className="flex-1 flex flex-col items-center justify-center px-4">
                  <div className="text-center mb-12 max-w-3xl">
                    <div className="flex items-center justify-center mb-6">
                                             <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-violet-600 rounded-2xl flex items-center justify-center mr-4">
                        <Sparkles className="h-8 w-8 text-white" />
                      </div>
                                             <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                         AI Super Mode
                       </h1>
                    </div>
                    
                    
                    {/* AI搜索框 */}
                    <form onSubmit={handleSearch} className="relative max-w-3xl mx-auto mb-12">
                      <Input
                        type="text"
                        placeholder={locale === 'zh-cn' ? '问我任何问题，比如：如何用React构建一个待办事项应用？' : 'Ask me anything, like: How to build a todo app with React?'}
                        value={searchQuery}
                        onChange={handleSearchInputChange}
                                                 className="text-lg h-16 pl-6 pr-20 rounded-2xl border-2 bg-background/50 backdrop-blur text-center placeholder:text-center"
                      />
                                             <Button 
                         type="submit" 
                         size="sm" 
                         className="absolute right-3 top-3 h-10 px-3 rounded-xl bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700 shadow-lg border border-purple-400/50"
                         disabled={isSearching || !searchQuery.trim()}
                       >
                                                 {isSearching ? (
                           <div className="h-5 w-5 animate-spin rounded-full border-2 border-b-transparent border-white" />
                         ) : (
                           <span className="text-sm font-medium">AI一下</span>
                         )}
                      </Button>
                    </form>

                    {/* 示例问题 */}
                    <div className="mb-12">
                      <p className="text-sm text-muted-foreground mb-2">
                        {locale === 'zh-cn' ? '⚡ 快速响应（含"简单"、"按钮"、"计数"、"MCP"关键词）：' : '⚡ Quick response (keywords: "simple", "button", "counter", "MCP"):'}
                      </p>
                      <div className="flex flex-wrap justify-center gap-2 mb-4">
                        {[
                          locale === 'zh-cn' ? '创建一个简单的按钮' : 'Create a simple button',
                          locale === 'zh-cn' ? '创建一个计数器' : 'Create a counter',
                          locale === 'zh-cn' ? '创建一个MCP服务' : 'Create an MCP server',
                        ].map((question, index) => (
                          <Button
                            key={`quick-${index}`}
                            variant="outline"
                            size="sm"
                            onClick={() => handleQuickGenerate(question)}
                            className="h-auto py-2 px-4 rounded-full bg-green-50 hover:bg-green-100 border-green-200 text-green-700 text-sm whitespace-nowrap"
                          >
                            ⚡ {question}
                          </Button>
                        ))}
                      </div>
                      <p className="text-sm text-muted-foreground mb-4">
                        {locale === 'zh-cn' ? '🧠 智能AI分析（需要1-2分钟）：' : '🧠 AI Deep Analysis (1-2 minutes):'}
                      </p>
                      <div className="flex flex-wrap justify-center gap-3">
                        {[
                          locale === 'zh-cn' ? '如何用React构建一个聊天应用？' : 'How to build a chat app with React?',
                          locale === 'zh-cn' ? 'Vue 3和React有什么区别？' : 'What are the differences between Vue 3 and React?'
                        ].map((question, index) => (
                          <Button
                            key={`complex-${index}`}
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSearchQuery(question);
                            }}
                            className="h-auto py-2 px-4 rounded-full bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-700 text-sm whitespace-nowrap"
                          >
                            🧠 {question}
                          </Button>
                        ))}
                      </div>
                    </div>

                    {/* 特色介绍 */}
                    <div className="grid md:grid-cols-3 gap-6">
                                             <div className="text-center p-6 rounded-xl bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20">
                         <Zap className="h-8 w-8 mx-auto mb-3 text-purple-600" />
                         <h3 className="font-semibold mb-2">
                           {locale === 'zh-cn' ? '最懂你的AI理解' : 'AI Understanding That Knows You'}
                         </h3>
                         <p className="text-sm text-muted-foreground">
                           {locale === 'zh-cn' ? '深度理解你的编程风格和需求，提供个性化解决方案' : 'Deeply understand your coding style and needs, provide personalized solutions'}
                         </p>
                       </div>
                                             <div className="text-center p-6 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20">
                         <Globe className="h-8 w-8 mx-auto mb-3 text-green-600" />
                         <h3 className="font-semibold mb-2">
                           {locale === 'zh-cn' ? '支持实时渲染生成' : 'Real-time Rendering Generation'}
                         </h3>
                         <p className="text-sm text-muted-foreground">
                           {locale === 'zh-cn' ? '实时生成和渲染代码，即时查看运行效果' : 'Generate and render code in real-time, see results instantly'}
                         </p>
                       </div>
                                             <div className="text-center p-6 rounded-xl bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20">
                         <Code2 className="h-8 w-8 mx-auto mb-3 text-orange-600" />
                         <h3 className="font-semibold mb-2">
                           {locale === 'zh-cn' ? '一键部署，解决最后n公里' : 'One-Click Deploy, Last Mile Solution'}
                         </h3>
                         <p className="text-sm text-muted-foreground">
                           {locale === 'zh-cn' ? '无缝部署到云端，从代码到生产环境一步到位' : 'Seamless cloud deployment, from code to production in one step'}
                         </p>
                       </div>
                    </div>
                  </div>
                </div>
              )}

              {/* AI搜索结果 */}
              {(isSearching || generatedCode || aiResponse) && (
                <div className="flex-1 px-4 py-6 overflow-y-auto">
                  <div className="max-w-4xl mx-auto">
                                        {/* 搜索查询显示 */}
                    <div className="mb-6 p-4 bg-muted/50 rounded-xl">
                      <div className="flex items-center gap-3">
                         <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-violet-600 rounded-lg flex items-center justify-center">
                          <Search className="h-4 w-4 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{searchQuery}</p>
                          <div className="text-sm text-muted-foreground">
                            {isSearching ? (
                              <div className="space-y-2">
                                <p>
                                  {streamingProgress 
                                    ? streamingProgress.message 
                                    : (locale === 'zh-cn' ? '正在生成代码...' : 'Generating code...')
                                  }
                                </p>
                                {streamingProgress && (
                                  <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div 
                                      className="bg-gradient-to-r from-purple-500 to-violet-600 h-2 rounded-full transition-all duration-300 ease-out"
                                      style={{ width: `${streamingProgress.progress}%` }}
                                    />
                                  </div>
                                )}
                                {streamingProgress && (
                                  <p className="text-xs text-muted-foreground">
                                    {streamingProgress.progress}% 完成
                                  </p>
                                )}
                              </div>
                            ) : (
                              <p>{locale === 'zh-cn' ? 'AI搜索完成' : 'AI search completed'}</p>
                            )}
                          </div>
                        </div>
                        {!isSearching && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setGeneratedCode(null);
                              setAiResponse('');
                              setSearchQuery('');
                              setConversationHistory([]); // 清空对话历史
                            }}
                            className="h-8 px-3 text-xs"
                          >
                            {locale === 'zh-cn' ? '新对话' : 'New Chat'}
                          </Button>
                        )}
                        {isSearching && (
                          <div className="flex items-center gap-2">
                            <div className="h-6 w-6 animate-spin rounded-full border-2 border-b-transparent border-primary" />
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={handleCancelSearch}
                              className="h-8 px-3 text-xs"
                            >
                              {locale === 'zh-cn' ? '取消' : 'Cancel'}
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* AI生成的回答 */}
                    {!isSearching && (generatedCode || aiResponse) && (
                      <div className="mb-8">
                        <div className="bg-background border rounded-xl p-6 mb-6">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                              <Sparkles className="h-4 w-4 text-white" />
                            </div>
                            <h3 className="font-semibold">
                              {locale === 'zh-cn' ? 'AI代码生成' : 'AI Code Generation'}
                            </h3>
                          </div>
                          <div className="prose prose-sm max-w-none dark:prose-invert">
                            <div className="whitespace-pre-line text-sm">
                              {aiResponse}
                            </div>
                          </div>
                        </div>

                        {/* 生成的代码 */}
                        {generatedCode && (
                          <div>
                            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                              <Code2 className="h-5 w-5" />
                              {locale === 'zh-cn' ? '生成的代码' : 'Generated Code'}
                            </h3>
                            <Card className="overflow-hidden border-l-4 border-l-primary">
                              <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <CardTitle className="text-lg">{generatedCode.title}</CardTitle>
                                    <p className="text-sm text-muted-foreground mt-1">
                                      {generatedCode.description}
                                    </p>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Badge variant="secondary" className="text-xs">
                                      {generatedCode.language}
                                    </Badge>
                                    {generatedCode.isTemplate ? (
                                      <Badge variant="outline" className="text-xs bg-orange-50 border-orange-200 text-orange-700">
                                        ⚡ {locale === 'zh-cn' ? '快速模板' : 'Quick Template'}
                                      </Badge>
                                    ) : (
                                      <Badge variant="default" className="text-xs bg-purple-600">
                                        🧠 {locale === 'zh-cn' ? 'AI生成' : 'AI Generated'}
                                      </Badge>
                                    )}
                                    {generatedCode.runnable && (
                                      <Badge variant="default" className="text-xs bg-green-600">
                                        {locale === 'zh-cn' ? '可运行' : 'Runnable'}
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              </CardHeader>
                              <CardContent className="pt-0">
                                {/* 代码展示 */}
                                <div className="bg-muted/50 rounded-lg p-4 mb-4">
                                  <div className="flex items-center justify-between mb-3">
                                    <span className="text-sm font-medium text-muted-foreground">
                                      {generatedCode.language.toUpperCase()} Code
                                    </span>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => navigator.clipboard.writeText(generatedCode.code)}
                                      className="h-7 px-3 text-xs"
                                    >
                                      {locale === 'zh-cn' ? '复制' : 'Copy'}
                                    </Button>
                                  </div>
                                  <div className="bg-slate-800 rounded-lg border border-slate-600 p-4 overflow-x-auto">
                                    <pre className="text-sm leading-6 m-0 font-mono">
                                      <code 
                                        className="text-slate-200 block whitespace-pre"
                                        dangerouslySetInnerHTML={{ 
                                          __html: highlightCode(generatedCode.code) 
                                        }}
                                      />
                                    </pre>
                                  </div>
                                </div>
                                
                                {/* AI深度生成选项 */}
                                {generatedCode.isTemplate && (
                                  <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                                    <div className="flex items-center justify-between">
                                      <div>
                                        <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                                          🧠 {locale === 'zh-cn' ? '想要AI深度定制？' : 'Want AI deep customization?'}
                                        </p>
                                        <p className="text-xs text-blue-600 dark:text-blue-400">
                                          {locale === 'zh-cn' ? '使用DeepSeek R1获得更智能、更个性化的代码' : 'Use DeepSeek R1 for smarter, more personalized code'}
                                        </p>
                                      </div>
                                      <Button
                                        onClick={() => {
                                          setGeneratedCode(null);
                                          setAiResponse('');
                                          handleSearch({ preventDefault: () => {} } as React.FormEvent);
                                        }}
                                        size="sm"
                                        className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
                                        disabled={isSearching}
                                      >
                                        {isSearching ? (
                                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-b-transparent border-white" />
                                        ) : (
                                          <>🧠 {locale === 'zh-cn' ? 'AI深度生成' : 'AI Generate'}</>
                                        )}
                                      </Button>
                                    </div>
                                  </div>
                                )}

                                {/* 运行按钮和预览 */}
                                <div className="flex gap-3">
                                  {generatedCode.e2bUrl && (
                                    <Button
                                      onClick={() => window.open(generatedCode.e2bUrl, '_blank')}
                                      className="flex-1 bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700"
                                    >
                                      <Globe className="mr-2 h-4 w-4" />
                                      一键运行Ship！
                                    </Button>
                                  )}
                                  <Button
                                    variant="outline"
                                    onClick={() => window.open('https://fragments.e2b.dev/', '_blank')}
                                    className="flex-1"
                                  >
                                    <Code2 className="mr-2 h-4 w-4" />
                                    {locale === 'zh-cn' ? '在Fragments中编辑' : 'Edit in Fragments'}
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          </div>
                        )}

                        {/* 继续对话 */}
                        <div className="mt-8 p-4 bg-muted/30 rounded-xl">
                          <div className="flex items-center gap-3 mb-3">
                                                         <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-violet-600 rounded-lg flex items-center justify-center">
                              <ArrowRight className="h-3 w-3 text-white" />
                            </div>
                            <p className="font-medium text-sm">
                              {locale === 'zh-cn' ? '继续提问' : 'Ask More Questions'}
                            </p>
                          </div>
                          <form onSubmit={handleSearch} className="relative">
                            <Input
                              type="text"
                              placeholder={locale === 'zh-cn' ? '还有其他问题吗？继续问我...' : 'Any other questions? Keep asking...'}
                              value={searchQuery}
                              onChange={handleSearchInputChange}
                                                             className="pr-16 bg-background"
                            />
                                                         <Button 
                               type="submit" 
                               size="sm" 
                               className="absolute right-2 top-2 h-7 px-3 bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700 text-white shadow-md border border-purple-400/50"
                               disabled={isSearching || !searchQuery.trim()}
                             >
                                                             {isSearching ? (
                                 <div className="h-3 w-3 animate-spin rounded-full border border-b-transparent border-white" />
                               ) : (
                                 <span className="text-xs">AI一下</span>
                               )}
                            </Button>
                          </form>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          {/* 推荐页面 */}
          <TabsContent value="for-you" className="h-full m-0">
            {isLoading ? (
              <div className="flex h-full w-full items-center justify-center">
                <div className="h-16 w-16 animate-spin rounded-full border-4 border-t-transparent border-primary"></div>
                <p className="ml-4 text-muted-foreground">
                  {locale === 'zh-cn' ? '正在加载精彩内容...' : 'Loading amazing content...'}
                </p>
              </div>
            ) : error ? (
              <div className="flex flex-col w-full h-full items-center justify-center">
                <div className="text-center">
                  <p className="text-lg text-red-500 mb-4">{error}</p>
                  <Button onClick={() => window.location.reload()}>
                    {locale === 'zh-cn' ? '重新加载' : 'Reload'}
                  </Button>
                </div>
              </div>
            ) : (
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
                      {locale === 'zh-cn' ? '暂无推荐项目' : 'No recommended projects yet'}
                    </p>
                  </div>
                )}
              </div>
            )}
          </TabsContent>

          {/* 热门页面 */}
          <TabsContent value="trending" className="h-full m-0">
            {isLoading ? (
              <div className="flex h-full w-full items-center justify-center">
                <div className="h-16 w-16 animate-spin rounded-full border-4 border-t-transparent border-primary"></div>
                <p className="ml-4 text-muted-foreground">
                  {locale === 'zh-cn' ? '正在加载精彩内容...' : 'Loading amazing content...'}
                </p>
              </div>
            ) : error ? (
              <div className="flex flex-col w-full h-full items-center justify-center">
                <div className="text-center">
                  <p className="text-lg text-red-500 mb-4">{error}</p>
                  <Button onClick={() => window.location.reload()}>
                    {locale === 'zh-cn' ? '重新加载' : 'Reload'}
                  </Button>
                </div>
              </div>
            ) : (
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
                      {locale === 'zh-cn' ? '暂无热门项目' : 'No trending projects yet'}
                    </p>
                  </div>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
} 
