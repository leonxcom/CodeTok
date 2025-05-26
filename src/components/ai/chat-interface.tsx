'use client';

import { useState, useEffect, useRef } from 'react';
import { experimental_useObject as useObject } from 'ai/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Send, 
  Code, 
  Square, 
  Loader2, 
  Terminal,
  Sparkles,
  X,
  Copy,
  ExternalLink,
  ChevronsRight,
  Download,
  FileText,
  ArrowUp,
  LoaderCircle
} from 'lucide-react';
import { fragmentSchema } from '@/lib/ai/schema';
import { FragmentSchema } from '@/lib/ai/schema';
import { getModelById } from '@/lib/ai/models';
import templates from '@/lib/ai/templates';
import { useToast } from '@/components/ui/use-toast';
import { DeepPartial } from 'ai';
import TextareaAutosize from 'react-textarea-autosize';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { FragmentPreview } from './fragment-preview';
import { CodeView } from './code-view';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: Array<{ type: 'text' | 'code'; text: string }>;
  timestamp: Date;
  object?: DeepPartial<FragmentSchema>;
  result?: ExecutionResult;
}

import { ExecutionResult } from './types';

interface ChatInterfaceProps {
  locale: string;
  onClose?: () => void;
}

export function ChatInterface({ locale, onClose }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<'auto' | string>('auto');
  const [currentFragment, setCurrentFragment] = useState<DeepPartial<FragmentSchema>>();
  const [currentResult, setCurrentResult] = useState<ExecutionResult>();
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'code' | 'fragment'>('code');
  const [showPreview, setShowPreview] = useState(false);
  
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const { object, submit, isLoading, stop, error } = useObject({
    api: '/api/ai/chat',
    schema: fragmentSchema,
    onError: (error) => {
      console.error('AI生成错误:', error);
      toast({
        title: locale === 'zh-cn' ? 'AI生成失败' : 'AI generation failed',
        description: locale === 'zh-cn' ? '请重试' : 'Please retry',
        type: 'error'
      });
    },
    onFinish: async ({ object: fragment, error }) => {
      if (!error && fragment) {
        console.log('生成的代码片段:', fragment);
        setCurrentFragment(fragment);
        
        // 创建沙盒并执行代码
        await executeFragment(fragment);
        
        // 显示预览
        setShowPreview(true);
        setSelectedTab('fragment');
        
        toast({
          title: locale === 'zh-cn' ? '代码生成成功！' : 'Code generated successfully!',
          type: 'success'
        });
      }
    },
  });

  // 执行代码片段
  const executeFragment = async (fragment: DeepPartial<FragmentSchema>) => {
    if (!fragment.code) return;
    
    setIsPreviewLoading(true);
    try {
      const response = await fetch('/api/ai/sandbox', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fragment }),
      });
      
      if (!response.ok) {
        throw new Error('执行失败');
      }
      
      const result = await response.json();
      console.log('执行结果:', result);
      setCurrentResult(result);
      
      // 更新最后一条消息，添加执行结果
      setMessages(prev => {
        const updated = [...prev];
        const lastMessage = updated[updated.length - 1];
        if (lastMessage && lastMessage.role === 'assistant') {
          lastMessage.result = result;
        }
        return updated;
      });
      
    } catch (error) {
      console.error('代码执行失败:', error);
      toast({
        title: locale === 'zh-cn' ? '代码执行失败' : 'Code execution failed',
        type: 'error'
      });
    } finally {
      setIsPreviewLoading(false);
    }
  };

  // 更新AI生成的内容
  useEffect(() => {
    if (object) {
      setCurrentFragment(object);
      
      const content = [
        { type: 'text' as const, text: object.commentary || '' },
        { type: 'code' as const, text: object.code || '' },
      ];

      setMessages(prev => {
        const lastMessage = prev[prev.length - 1];
        if (!lastMessage || lastMessage.role !== 'assistant') {
          // 创建新的助手消息
          return [...prev, {
            id: Date.now().toString(),
            timestamp: new Date(),
            role: 'assistant',
            content,
            object,
          }];
        } else {
          // 更新现有的助手消息
          const updated = [...prev];
          updated[updated.length - 1] = {
            ...updated[updated.length - 1],
            content,
            object,
          };
          return updated;
        }
      });
    }
  }, [object]);

  // 滚动到底部
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // 提交用户输入
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    // 添加用户消息
    const userMessage: Message = {
      id: Date.now().toString(),
      timestamp: new Date(),
      role: 'user',
      content: [{ type: 'text', text: input }],
    };
    
    setMessages(prev => [...prev, userMessage]);

    const model = getModelById('gpt-4o-mini');
    const currentTemplate = selectedTemplate === 'auto' ? templates : { [selectedTemplate]: templates[selectedTemplate as keyof typeof templates] };
    
    // 准备消息历史
    const messagesHistory = [...messages, userMessage].map(msg => ({
      role: msg.role,
      content: msg.content.map(c => c.text).join('\n'),
    }));

    // 提交给AI
    submit({
      messages: messagesHistory,
      template: currentTemplate,
      model,
      config: { temperature: 0.7 },
    });

    setInput('');
    setSelectedTab('code');
  };

  // 停止生成
  const handleStop = () => {
    stop();
    toast({
      title: locale === 'zh-cn' ? '已停止生成' : 'Generation stopped',
      type: 'info'
    });
  };

  // 重试生成
  const handleRetry = () => {
    if (messages.length > 0) {
      const lastUserMessage = [...messages].reverse().find(msg => msg.role === 'user');
      if (lastUserMessage) {
        setInput(lastUserMessage.content.find(c => c.type === 'text')?.text || '');
        // 移除最后的助手消息
        setMessages(prev => prev.filter(msg => !(msg.role === 'assistant' && msg.timestamp > lastUserMessage.timestamp)));
      }
    }
  };

  // 复制代码
  const handleCopyCode = async () => {
    if (currentFragment?.code) {
      await navigator.clipboard.writeText(currentFragment.code);
      toast({
        title: locale === 'zh-cn' ? '代码已复制' : 'Code copied',
        type: 'success'
      });
    }
  };

  // 下载代码
  const handleDownloadCode = () => {
    if (currentFragment?.code && currentFragment?.file_path) {
      const blob = new Blob([currentFragment.code], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = currentFragment.file_path;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    }
  };

  // 清空聊天
  const handleClearChat = () => {
    setMessages([]);
    setCurrentFragment(undefined);
    setCurrentResult(undefined);
    setShowPreview(false);
    setInput('');
  };

  // 设置当前预览
  const setCurrentPreview = (preview: {
    fragment: DeepPartial<FragmentSchema> | undefined;
    result: ExecutionResult | undefined;
  }) => {
    setCurrentFragment(preview.fragment);
    setCurrentResult(preview.result);
    if (preview.fragment) {
      setShowPreview(true);
    }
  };

  return (
    <main className="flex min-h-screen max-h-screen bg-background">
      <div className="grid w-full md:grid-cols-2">
        {/* 左侧聊天区域 */}
        <div className={`flex flex-col w-full max-h-full max-w-[800px] mx-auto px-4 overflow-hidden ${showPreview ? 'col-span-1' : 'col-span-2'}`}>
          {/* 导航栏 */}
          <div className="flex items-center justify-between py-4 border-b">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#FF8800]" />
              <h2 className="text-lg font-semibold">
                {locale === 'zh-cn' ? 'AI 代码生成器' : 'AI Code Generator'}
              </h2>
            </div>
            <div className="flex items-center gap-2">
              {messages.length > 0 && (
                <Button variant="ghost" size="sm" onClick={handleClearChat}>
                  {locale === 'zh-cn' ? '清空' : 'Clear'}
                </Button>
              )}
              {onClose && (
                <Button variant="ghost" size="icon" onClick={onClose}>
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>

          {/* 聊天消息区域 */}
          <div
            ref={chatContainerRef}
            className="flex flex-col pb-12 gap-2 overflow-y-auto max-h-full flex-1"
          >
            {messages.length === 0 && (
              <div className="text-center text-muted-foreground py-8 flex-1 flex items-center justify-center">
                <div>
                  <Sparkles className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>{locale === 'zh-cn' ? '描述你想要创建的项目或代码片段...' : 'Describe the project or code snippet you want to create...'}</p>
                </div>
              </div>
            )}
            
            {messages.map((message: Message, index: number) => (
              <div
                className={`flex flex-col px-4 shadow-sm whitespace-pre-wrap ${
                  message.role !== 'user' 
                    ? 'bg-accent dark:bg-white/5 border text-accent-foreground dark:text-muted-foreground py-4 rounded-2xl gap-4 w-full' 
                    : 'bg-gradient-to-b from-black/5 to-black/10 dark:from-black/30 dark:to-black/50 py-2 rounded-xl gap-2 w-fit ml-auto'
                } font-serif`}
                key={index}
              >
                {message.content.map((content, id) => {
                  if (content.type === 'text') {
                    return <div key={id}>{content.text}</div>;
                  }
                  return null;
                })}
                {message.object && (
                  <div
                    onClick={() =>
                      setCurrentPreview({
                        fragment: message.object,
                        result: message.result,
                      })
                    }
                    className="py-2 pl-2 w-full md:w-max flex items-center border rounded-xl select-none hover:bg-white dark:hover:bg-white/5 hover:cursor-pointer"
                  >
                    <div className="rounded-[0.5rem] w-10 h-10 bg-black/5 dark:bg-white/5 self-stretch flex items-center justify-center">
                      <Terminal strokeWidth={2} className="text-[#FF8800]" />
                    </div>
                    <div className="pl-2 pr-4 flex flex-col">
                      <span className="font-bold font-sans text-sm text-primary">
                        {message.object.title}
                      </span>
                      <span className="font-sans text-sm text-muted-foreground">
                        {locale === 'zh-cn' ? '点击查看代码片段' : 'Click to see fragment'}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ))}
            
            {isLoading && (
              <div className="flex items-center gap-1 text-sm text-muted-foreground px-4">
                <LoaderCircle strokeWidth={2} className="animate-spin w-4 h-4" />
                <span>{locale === 'zh-cn' ? '正在生成...' : 'Generating...'}</span>
              </div>
            )}
          </div>

          {/* 输入区域 */}
          <form
            onSubmit={handleSubmit}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                if (e.currentTarget.checkValidity()) {
                  handleSubmit(e);
                }
              }
            }}
            className="mb-2 mt-auto flex flex-col bg-background"
          >
            {error && (
              <div className="flex items-center p-1.5 text-sm font-medium mx-4 mb-4 rounded-xl bg-red-400/10 text-red-400">
                <span className="flex-1 px-1.5">{error.message}</span>
                <button
                  className="px-2 py-1 rounded-sm bg-red-400/20"
                  onClick={handleRetry}
                  type="button"
                >
                  {locale === 'zh-cn' ? '重试' : 'Try again'}
                </button>
              </div>
            )}
            
            <div className="shadow-md rounded-2xl relative z-10 bg-background border">
              <div className="flex items-center px-3 py-2 gap-1">
                <select
                  value={selectedTemplate}
                  onChange={(e) => setSelectedTemplate(e.target.value)}
                  className="px-2 py-1 border rounded-md text-sm bg-background text-muted-foreground"
                >
                  <option value="auto">{locale === 'zh-cn' ? '自动' : 'Auto'}</option>
                  <option value="nextjs-developer">Next.js</option>
                  <option value="react-developer">React</option>
                  <option value="vue-developer">Vue.js</option>
                  <option value="python-developer">Python</option>
                  <option value="html-developer">HTML</option>
                </select>
              </div>
              <TextareaAutosize
                autoFocus={true}
                minRows={1}
                maxRows={5}
                className="text-normal px-3 resize-none ring-0 bg-inherit w-full m-0 outline-none"
                required={true}
                placeholder={locale === 'zh-cn' ? '描述你想要的应用...' : 'Describe your app...'}
                disabled={error !== undefined}
                value={input}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setInput(e.target.value)}
              />
              <div className="flex p-3 gap-2 items-center justify-end">
                {!isLoading ? (
                  <TooltipProvider>
                    <Tooltip delayDuration={0}>
                      <TooltipTrigger asChild>
                        <Button
                          disabled={error !== undefined}
                          variant="default"
                          size="icon"
                          type="submit"
                          className="rounded-xl h-10 w-10"
                        >
                          <ArrowUp className="h-5 w-5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        {locale === 'zh-cn' ? '发送消息' : 'Send message'}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ) : (
                  <TooltipProvider>
                    <Tooltip delayDuration={0}>
                      <TooltipTrigger asChild>
                        <Button
                          variant="secondary"
                          size="icon"
                          className="rounded-xl h-10 w-10"
                          onClick={handleStop}
                          type="button"
                        >
                          <Square className="h-5 w-5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        {locale === 'zh-cn' ? '停止生成' : 'Stop generation'}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              {locale === 'zh-cn' ? 'CodeTok AI 代码生成器 - 基于' : 'CodeTok AI Code Generator - Powered by'}{' '}
              <span className="text-[#ff8800]">✶ E2B</span>
            </p>
          </form>
        </div>

        {/* 右侧预览区域 */}
        {showPreview && currentFragment && (
          <div className="absolute md:relative z-10 top-0 left-0 shadow-2xl md:rounded-tl-3xl md:rounded-bl-3xl md:border-l md:border-y bg-popover h-full w-full overflow-auto">
            <Tabs
              value={selectedTab}
              onValueChange={(value) => setSelectedTab(value as 'code' | 'fragment')}
              className="h-full flex flex-col items-start justify-start"
            >
              <div className="w-full p-2 grid grid-cols-3 items-center border-b">
                <TooltipProvider>
                  <Tooltip delayDuration={0}>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground"
                        onClick={() => setShowPreview(false)}
                      >
                        <ChevronsRight className="h-5 w-5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      {locale === 'zh-cn' ? '关闭侧边栏' : 'Close sidebar'}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <div className="flex justify-center">
                  <TabsList className="px-1 py-0 border h-8">
                    <TabsTrigger
                      className="font-normal text-xs py-1 px-2 gap-1 flex items-center"
                      value="code"
                    >
                      {isLoading && (
                        <LoaderCircle
                          strokeWidth={3}
                          className="h-3 w-3 animate-spin"
                        />
                      )}
                      {locale === 'zh-cn' ? '代码' : 'Code'}
                    </TabsTrigger>
                    <TabsTrigger
                      disabled={!currentResult}
                      className="font-normal text-xs py-1 px-2 gap-1 flex items-center"
                      value="fragment"
                    >
                      {locale === 'zh-cn' ? '预览' : 'Preview'}
                      {isPreviewLoading && (
                        <LoaderCircle
                          strokeWidth={3}
                          className="h-3 w-3 animate-spin"
                        />
                      )}
                    </TabsTrigger>
                  </TabsList>
                </div>
                {currentResult && (
                  <div className="flex items-center justify-end gap-2">
                    {currentResult.url && (
                      <TooltipProvider>
                        <Tooltip delayDuration={0}>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-muted-foreground"
                              onClick={() => window.open(currentResult.url, '_blank')}
                            >
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            {locale === 'zh-cn' ? '新窗口打开' : 'Open in new tab'}
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </div>
                )}
              </div>
              
              <div className="overflow-y-auto w-full h-full">
                <TabsContent value="code" className="h-full">
                  {currentFragment && (
                    <div className="flex flex-col h-full">
                      <div className="flex items-center px-2 pt-1 gap-2">
                        <div className="flex flex-1 gap-2 overflow-x-auto">
                          {currentFragment.file_path && (
                            <div className="flex gap-2 select-none items-center text-sm text-muted-foreground px-2 py-1 rounded-md bg-muted border">
                              <FileText className="h-4 w-4" />
                              {currentFragment.file_path}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <TooltipProvider>
                            <Tooltip delayDuration={0}>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-muted-foreground"
                                  onClick={handleCopyCode}
                                >
                                  <Copy className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent side="bottom">
                                {locale === 'zh-cn' ? '复制' : 'Copy'}
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          <TooltipProvider>
                            <Tooltip delayDuration={0}>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-muted-foreground"
                                  onClick={handleDownloadCode}
                                >
                                  <Download className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent side="bottom">
                                {locale === 'zh-cn' ? '下载' : 'Download'}
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </div>
                      <div className="flex flex-col flex-1 overflow-x-auto">
                        <CodeView 
                          code={currentFragment.code || ''} 
                          lang={currentFragment.file_path?.split('.').pop() || 'javascript'} 
                        />
                      </div>
                    </div>
                  )}
                </TabsContent>
                <TabsContent value="fragment" className="h-full">
                  {currentResult && (
                    <FragmentPreview result={currentResult} />
                  )}
                </TabsContent>
              </div>
            </Tabs>
          </div>
        )}
      </div>
    </main>
  );
} 