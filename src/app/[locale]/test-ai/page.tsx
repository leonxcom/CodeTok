'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Copy, ExternalLink } from 'lucide-react';

export default function TestAIPage() {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const testAIGeneration = async () => {
    if (!prompt.trim()) return;

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/generate-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          language: 'react',
          modelId: 'deepseek-reasoner'
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || '代码生成失败');
      }

      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '未知错误');
    } finally {
      setIsLoading(false);
    }
  };

  const copyCode = () => {
    if (result?.code) {
      navigator.clipboard.writeText(result.code);
    }
  };

  return (
    <div className="container max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">DeepSeek R1 AI 代码生成测试</h1>
        <p className="text-muted-foreground">测试 DeepSeek R1 模型的代码生成能力</p>
      </div>

      {/* 输入区域 */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>输入您的需求</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <Input
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="例如：创建一个React待办事项组件"
              className="flex-1"
              onKeyDown={(e) => e.key === 'Enter' && testAIGeneration()}
            />
            <Button 
              onClick={testAIGeneration} 
              disabled={!prompt.trim() || isLoading}
              className="bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  生成中...
                </>
              ) : (
                'AI一下'
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 快速测试按钮 */}
      <div className="mb-6">
        <p className="text-sm text-muted-foreground mb-3">快速测试：</p>
        <div className="flex flex-wrap gap-2">
          {[
            '创建一个React计数器组件',
            '用Python写一个斐波那契函数',
            '制作一个CSS动画按钮',
            '创建一个Vue.js待办事项列表'
          ].map((testPrompt, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              onClick={() => setPrompt(testPrompt)}
              className="text-xs"
            >
              {testPrompt}
            </Button>
          ))}
        </div>
      </div>

      {/* 错误显示 */}
      {error && (
        <Card className="mb-6 border-red-200">
          <CardContent className="pt-6">
            <div className="text-red-600">
              <h3 className="font-semibold mb-2">❌ 生成失败</h3>
              <p className="text-sm">{error}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 结果显示 */}
      {result && (
        <Card className="border-green-200">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-green-700">✅ 生成成功</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">{result.title}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{result.language}</Badge>
                <Badge variant="default" className="bg-green-600">DeepSeek R1</Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* AI说明 */}
            <div className="mb-4 p-3 bg-muted/50 rounded-lg">
              <p className="text-sm whitespace-pre-line">{result.explanation}</p>
            </div>

            {/* 代码展示 */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">生成的代码：</span>
                <Button variant="outline" size="sm" onClick={copyCode}>
                  <Copy className="h-3 w-3 mr-1" />
                  复制
                </Button>
              </div>
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                <code>{result.code}</code>
              </pre>
            </div>

            {/* 操作按钮 */}
            <div className="flex gap-3">
              <Button
                onClick={() => window.open(result.e2bUrl, '_blank')}
                className="flex-1"
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                在E2B中运行
              </Button>
              <Button
                variant="outline"
                onClick={() => window.open('https://fragments.e2b.dev/', '_blank')}
                className="flex-1"
              >
                在Fragments中编辑
              </Button>
            </div>

            {/* Token使用情况 */}
            {result.usage && (
              <div className="mt-4 text-xs text-muted-foreground">
                <p>Token使用: 提示 {result.usage.promptTokens} + 完成 {result.usage.completionTokens} = 总计 {result.usage.totalTokens}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
} 