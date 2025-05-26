import { NextRequest } from 'next/server';
import { getModelById } from '@/lib/ai/models';
import { getModelClient } from '@/lib/ai/providers';
import { streamText } from 'ai';

export async function POST(request: NextRequest) {
  try {
    const { prompt, language = 'react', modelId } = await request.json();

    if (!prompt) {
      return new Response('Missing prompt', { status: 400 });
    }

    // 优先使用OpenRouter的更快模型
    const preferredModels = [
      'deepseek/deepseek-chat',  // 更快的Chat模型
      'openai/gpt-4o-mini',      // GPT-4o Mini更快
      'deepseek/deepseek-r1',    // R1作为备选
    ];
    
    let selectedModel = null;
    for (const mid of preferredModels) {
      const model = getModelById(mid);
      if (model) {
        selectedModel = model;
        break;
      }
    }

    if (!selectedModel) {
      return new Response('No suitable model found', { status: 500 });
    }

    const aiModel = getModelClient(selectedModel, {});

    // 构建优化的代码生成提示 - 支持MCP服务
    let codePrompt;
    const lowerPrompt = prompt.toLowerCase();
    
    if (lowerPrompt.includes('mcp') || lowerPrompt.includes('model context protocol')) {
      codePrompt = `Generate a complete MCP (Model Context Protocol) server for: ${prompt}

Please create a TypeScript/Node.js MCP server that includes:
- Server setup with proper MCP SDK imports
- Tool handlers for useful functionality
- Resource handlers for data access
- Proper error handling and type safety
- Clear documentation and comments

Return format:
\`\`\`typescript
[your MCP server code here]
\`\`\`

Brief description: [what the MCP server does and its capabilities]`;
    } else {
      codePrompt = `Generate ${language} code for: ${prompt}

Return format:
\`\`\`${language === 'react' ? 'jsx' : language}
[your code here]
\`\`\`

Brief description: [what the code does]`;
    }

    console.log(`🚀 使用${selectedModel.name}进行流式代码生成...`);

    const result = await streamText({
      model: aiModel,
      prompt: codePrompt,
      maxTokens: 1500,
      temperature: 0.7,
    });

    // 创建流式响应
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          // 发送开始信号
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({
            type: 'start',
            model: selectedModel.name,
            message: '代码生成开始...'
          })}\n\n`));

          let fullText = '';
          let chunkCount = 0;

          for await (const chunk of result.textStream) {
            fullText += chunk;
            chunkCount++;

            // 每5个chunk发送一次进度更新
            if (chunkCount % 5 === 0) {
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({
                type: 'progress',
                chunk,
                progress: Math.min(95, chunkCount * 2), // 估算进度
                message: '正在生成代码...'
              })}\n\n`));
            }
          }

          // 解析最终结果
          const codeMatch = fullText.match(/```(?:jsx|javascript|js|tsx|ts|typescript|python|html|css)?\n([\s\S]*?)\n```/);
          const code = codeMatch ? codeMatch[1].trim() : fullText;
          
          const descMatch = fullText.match(/(?:Brief description|说明):\s*(.*?)(?:\n|$)/i);
          const description = descMatch ? descMatch[1].trim() : '由AI生成的代码实现';

          // 智能检测语言类型 - 特别处理MCP服务
          let finalLanguage = language;
          if (lowerPrompt.includes('mcp') || lowerPrompt.includes('model context protocol')) {
            finalLanguage = 'typescript';
          }

          // 保存代码到本地文件系统
          let localUrls = null;
          try {
            // 动态导入环境配置工具
            const { createAPIURL } = await import('@/lib/env-config');
            const saveResponse = await fetch(createAPIURL('/api/save-code'), {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                code,
                language: finalLanguage,
                title: `${finalLanguage.toUpperCase()} - ${prompt}`,
                description,
                prompt: prompt
              }),
            });

            if (saveResponse.ok) {
              const saveData = await saveResponse.json();
              localUrls = {
                preview: saveData.previewUrl,
                fileManager: saveData.fileManagerUrl,
                projectId: saveData.projectId
              };
              console.log('📁 流式代码已保存到本地:', saveData.projectId);
            }
          } catch (saveError) {
            console.warn('⚠️ 保存流式代码到本地时出错:', saveError);
          }

          // 发送完成信号
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({
            type: 'complete',
            code,
            description,
            language: finalLanguage,
            fullText,
            model: selectedModel.name,
            title: `${finalLanguage.toUpperCase()} - ${prompt}`,
            e2bUrl: localUrls?.preview || `https://fragments.e2b.dev/?prompt=${encodeURIComponent(prompt)}`,
            localUrls,
            isTemplate: false
          })}\n\n`));

          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();

        } catch (error) {
          console.error('❌ 流式生成失败:', error);
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({
            type: 'error',
            error: error instanceof Error ? error.message : 'Unknown error'
          })}\n\n`));
          controller.close();
        }
      }
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error) {
    console.error('流式代码生成API失败:', error);
    return new Response('Internal server error', { status: 500 });
  }
} 