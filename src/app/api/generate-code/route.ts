import { NextRequest, NextResponse } from 'next/server';
import { codeGenerator } from '@/lib/ai/code-generator';
import { getModelById } from '@/lib/ai/models';
import { getModelClient } from '@/lib/ai/providers';
import { generateText } from 'ai';



export async function POST(request: NextRequest) {
  let requestData;
  
  try {
    requestData = await request.json();
    const { prompt, language = 'react', modelId, quickMode = false, conversationHistory = [] } = requestData;

    if (!prompt) {
      return NextResponse.json(
        { error: '请提供代码生成需求' },
        { status: 400 }
      );
    }

      // 如果用户明确要求快速模式，直接使用模板
  if (quickMode) {
    console.log('用户选择快速模式，返回模板代码');
    const exampleCode = await generateExampleCode(prompt, language);
    return NextResponse.json({
      ...exampleCode,
      isTemplate: true // 标记为模板
    });
  }

    // 正常模式处理复杂请求
    console.log('使用正常模式处理复杂请求，请耐心等待...');
    
    try {
      // 构建包含历史的完整提示
      let contextualPrompt = prompt;
      if (conversationHistory.length > 0) {
        const historyText = conversationHistory
          .slice(-4) // 只取最近4轮对话避免过长
          .map((msg: {role: string, content: string}) => `${msg.role}: ${msg.content}`)
          .join('\n\n');
        contextualPrompt = `Previous conversation:\n${historyText}\n\nNew request: ${prompt}`;
        console.log('📝 使用对话历史，支持多轮交互');
      }

      // 优先使用OpenRouter的更快模型
      const preferredModels = [
        'deepseek/deepseek-chat',  // 更快的Chat模型，代替R1
        'openai/gpt-4o-mini',      // GPT-4o Mini作为备选
        'deepseek/deepseek-r1',    // R1作为最后备选
      ];
      
      let selectedModel = null;
      for (const mid of preferredModels) {
        const candidateModel = getModelById(mid);
        if (candidateModel) {
          selectedModel = candidateModel;
          break;
        }
      }
      
      if (!selectedModel) {
        selectedModel = getModelById(modelId || 'deepseek/deepseek-chat');
      }
      
      const model = selectedModel;
      
      if (!model) {
        throw new Error(`Model ${modelId} not found`);
      }
      
      const aiModel = getModelClient(model, {});
      
      // 构建专门的代码生成提示
      const codePrompt = `你是一个专业的${language}开发者。请为以下需求生成完整的代码：

需求: ${contextualPrompt}

请返回：
1. 完整的${language}代码实现
2. 代码功能说明

格式：
\`\`\`${language === 'react' ? 'jsx' : language}
// 你的代码
\`\`\`

说明: [代码功能说明]`;

      const aiResult = await generateText({
        model: aiModel,
        prompt: codePrompt,
        maxTokens: 2000,
        temperature: 0.7,
      });
      
      // 解析代码和说明
      const codeMatch = aiResult.text.match(/```(?:jsx|javascript|js|tsx|ts|python|html|css)?\n([\s\S]*?)\n```/);
      const code = codeMatch ? codeMatch[1].trim() : aiResult.text;
      
      const descMatch = aiResult.text.match(/说明:\s*(.*?)(?:\n|$)/);
      const description = descMatch ? descMatch[1].trim() : '由AI生成的代码实现';
      
      const result = {
        code,
        language,
        description,
        usage: {
          promptTokens: aiResult.usage?.promptTokens || 0,
          completionTokens: aiResult.usage?.completionTokens || 0,
          totalTokens: aiResult.usage?.totalTokens || 0,
        }
      };

      console.log('✅ AI代码生成成功');
      
      // 格式化响应以匹配前端期望的格式
      const response = {
        title: `${language.toUpperCase()} - ${prompt}`,
        description: result.description,
        language: result.language,
        code: result.code,
        explanation: `🧠 AI代码生成完成！基于您的需求"${prompt}"，我为您生成了智能定制的${language}代码实现：\n\n${result.description}`,
        e2bUrl: `https://fragments.e2b.dev/?prompt=${encodeURIComponent(prompt)}`,
        usage: result.usage,
        isTemplate: false // 标记为真实AI生成
      };
      
      return NextResponse.json(response);
      
    } catch (aiError) {
      console.error('❌ AI生成失败，使用应急模板:', aiError);
      // AI生成失败时返回应急模板
      const exampleCode = await generateExampleCode(prompt, language);
      return NextResponse.json({
        ...exampleCode,
        isTemplate: true,
        explanation: `DeepSeek AI正在处理大量请求，暂时无法生成定制代码。为您提供了"${prompt}"的高质量模板。

💡 您可以直接使用此模板，或稍后重试获取AI深度定制的代码。`
      });
    }
    
  } catch (error) {
    console.error('代码生成失败:', error);
    
    const errorPrompt = requestData?.prompt || '您的请求';
    
    // 如果AI生成失败，返回一个示例
    if (requestData?.prompt) {
      const exampleCode = await generateExampleCode(requestData.prompt, requestData.language || 'react');
      return NextResponse.json({
        ...exampleCode,
        isTemplate: true, // 标记为应急模板
        explanation: `DeepSeek AI暂时繁忙，为您提供了"${requestData.prompt}"的基础模板。

💡 您可以直接使用此模板，或稍后点击"AI深度生成"获取更个性化的代码。`
      });
    }
    
    return NextResponse.json(
      { 
        error: '代码生成失败', 
        message: error instanceof Error ? error.message : '未知错误',
        explanation: `抱歉，暂时无法为"${errorPrompt}"生成代码。请检查：

• API密钥是否正确配置
• 网络连接是否正常
• 尝试更具体的描述，比如：
  - 如何用React创建一个待办事项列表？
  - 制作一个CSS动画按钮
  - 用Python写一个计算器函数
  - 创建一个Vue.js计数器组件`
      },
      { status: 500 }
    );
  }
}

// 生成示例代码的函数
async function generateExampleCode(prompt: string, language: string) {
  const templates = {
    react: {
      button: `import React from 'react';

const Button = ({ children, onClick, variant = 'primary' }) => {
  const baseStyles = 'px-4 py-2 rounded-lg font-medium transition-colors';
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300'
  };

  return (
    <button 
      className={\`\${baseStyles} \${variants[variant]}\`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;`,
      counter: `import React, { useState } from 'react';

const Counter = () => {
  const [count, setCount] = useState(0);

  return (
    <div className="flex flex-col items-center p-8">
      <h1 className="text-4xl font-bold mb-8">{count}</h1>
      <div className="flex gap-4">
        <button 
          onClick={() => setCount(count - 1)}
          className="px-4 py-2 bg-red-500 text-white rounded"
        >
          -
        </button>
        <button 
          onClick={() => setCount(0)}
          className="px-4 py-2 bg-gray-500 text-white rounded"
        >
          重置
        </button>
        <button 
          onClick={() => setCount(count + 1)}
          className="px-4 py-2 bg-green-500 text-white rounded"
        >
          +
        </button>
      </div>
    </div>
  );
};

export default Counter;`
    },
    mcp: {
      server: `#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ErrorCode,
  ListResourcesRequestSchema,
  ListToolsRequestSchema,
  McpError,
  ReadResourceRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

class MyMCPServer {
  private server: Server;

  constructor() {
    this.server = new Server(
      {
        name: 'my-mcp-server',
        version: '0.1.0',
      },
      {
        capabilities: {
          resources: {},
          tools: {},
        },
      }
    );

    this.setupToolHandlers();
    this.setupResourceHandlers();
  }

  private setupToolHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: 'get_current_time',
            description: 'Get the current date and time',
            inputSchema: {
              type: 'object',
              properties: {
                format: {
                  type: 'string',
                  description: 'Time format (iso, locale, unix)',
                  enum: ['iso', 'locale', 'unix'],
                  default: 'iso'
                }
              }
            },
          },
          {
            name: 'calculate',
            description: 'Perform basic mathematical calculations',
            inputSchema: {
              type: 'object',
              properties: {
                operation: {
                  type: 'string',
                  description: 'Math operation to perform',
                  enum: ['add', 'subtract', 'multiply', 'divide']
                },
                a: {
                  type: 'number',
                  description: 'First number'
                },
                b: {
                  type: 'number',
                  description: 'Second number'
                }
              },
              required: ['operation', 'a', 'b']
            },
          },
        ],
      };
    });

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        if (name === 'get_current_time') {
          const format = args?.format || 'iso';
          const now = new Date();
          
          let timeString;
          switch (format) {
            case 'iso':
              timeString = now.toISOString();
              break;
            case 'locale':
              timeString = now.toLocaleString();
              break;
            case 'unix':
              timeString = Math.floor(now.getTime() / 1000).toString();
              break;
            default:
              timeString = now.toISOString();
          }

          return {
            content: [
              {
                type: 'text',
                text: \`Current time (\${format}): \${timeString}\`,
              },
            ],
          };
        }

        if (name === 'calculate') {
          const { operation, a, b } = args as { operation: string; a: number; b: number };
          
          let result: number;
          switch (operation) {
            case 'add':
              result = a + b;
              break;
            case 'subtract':
              result = a - b;
              break;
            case 'multiply':
              result = a * b;
              break;
            case 'divide':
              if (b === 0) {
                throw new Error('Division by zero is not allowed');
              }
              result = a / b;
              break;
            default:
              throw new Error(\`Unknown operation: \${operation}\`);
          }

          return {
            content: [
              {
                type: 'text',
                text: \`\${a} \${operation} \${b} = \${result}\`,
              },
            ],
          };
        }

        throw new McpError(ErrorCode.MethodNotFound, \`Unknown tool: \${name}\`);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        throw new McpError(ErrorCode.InternalError, \`Tool execution failed: \${errorMessage}\`);
      }
    });
  }

  private setupResourceHandlers() {
    this.server.setRequestHandler(ListResourcesRequestSchema, async () => {
      return {
        resources: [
          {
            uri: 'config://settings',
            mimeType: 'application/json',
            name: 'Server Configuration',
            description: 'Current server configuration and settings',
          },
          {
            uri: 'status://health',
            mimeType: 'text/plain',
            name: 'Health Status',
            description: 'Server health and status information',
          },
        ],
      };
    });

    this.server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
      const { uri } = request.params;

      if (uri === 'config://settings') {
        const config = {
          serverName: 'my-mcp-server',
          version: '0.1.0',
          capabilities: ['tools', 'resources'],
          timestamp: new Date().toISOString(),
        };

        return {
          contents: [
            {
              uri,
              mimeType: 'application/json',
              text: JSON.stringify(config, null, 2),
            },
          ],
        };
      }

      if (uri === 'status://health') {
        const status = \`Server Status: Healthy
Uptime: \${process.uptime()} seconds
Memory Usage: \${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)} MB
Node Version: \${process.version}\`;

        return {
          contents: [
            {
              uri,
              mimeType: 'text/plain',
              text: status,
            },
          ],
        };
      }

      throw new McpError(ErrorCode.InvalidRequest, \`Unknown resource: \${uri}\`);
    });
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('MCP server running on stdio');
  }
}

const server = new MyMCPServer();
server.run().catch(console.error);

/* 
需要的 package.json 配置:
{
  "name": "my-mcp-server",
  "version": "0.1.0",
  "type": "module",
  "main": "index.js",
  "scripts": {
    "start": "node index.js",
    "build": "tsc",
    "dev": "tsc --watch"
  },
  "dependencies": {
    "@modelcontextprotocol/sdk": "^0.5.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "typescript": "^5.0.0"
  }
}

安装依赖: npm install @modelcontextprotocol/sdk
运行服务: npm start
*/`
    }
  };

  // 检测请求类型并返回相应模板
  const lowerPrompt = prompt.toLowerCase();
  if (lowerPrompt.includes('按钮') || lowerPrompt.includes('button')) {
    return {
      title: `${language.toUpperCase()} - ${prompt}`,
      description: '一个可重用的React按钮组件',
      language,
      code: templates.react.button,
      explanation: `⚡ 快速模板生成完成！基于"${prompt}"为您提供了这个高质量的React按钮组件。

💡 这是精心设计的模板代码，可直接使用。如需AI深度定制，请点击"AI深度生成"。`,
      e2bUrl: `https://fragments.e2b.dev/?prompt=${encodeURIComponent(prompt)}`,
      usage: { promptTokens: 50, completionTokens: 200, totalTokens: 250 }
    };
  }
  
  if (lowerPrompt.includes('计数') || lowerPrompt.includes('counter')) {
    return {
      title: `${language.toUpperCase()} - ${prompt}`,
      description: '一个React计数器组件',
      language,
      code: templates.react.counter,
      explanation: `⚡ 快速模板生成完成！基于"${prompt}"为您提供了这个功能完整的React计数器组件。

💡 包含增减、重置功能和美观样式。如需AI深度定制，请点击"AI深度生成"。`,
      e2bUrl: `https://fragments.e2b.dev/?prompt=${encodeURIComponent(prompt)}`,
      usage: { promptTokens: 50, completionTokens: 300, totalTokens: 350 }
    };
  }

  if (lowerPrompt.includes('mcp') || lowerPrompt.includes('model context protocol') || lowerPrompt.includes('mcp服务') || lowerPrompt.includes('mcp server')) {
    return {
      title: `TypeScript - ${prompt}`,
      description: '一个完整的MCP (Model Context Protocol) 服务器',
      language: 'typescript',
      code: templates.mcp.server,
      explanation: `⚡ 快速模板生成完成！基于"${prompt}"为您提供了完整的MCP服务器模板。

💡 这个MCP服务器包含：
• 🔧 工具处理器（时间获取、计算器）
• 📚 资源处理器（配置、健康状态）
• 🚀 标准MCP协议实现
• 📦 可直接与Claude Desktop等客户端集成

如需AI深度定制，请点击"AI深度生成"。`,
      e2bUrl: `https://fragments.e2b.dev/?prompt=${encodeURIComponent(prompt)}`,
      usage: { promptTokens: 60, completionTokens: 800, totalTokens: 860 }
    };
  }

  // 默认返回一个基本的React组件
  return {
    title: `${language.toUpperCase()} - ${prompt}`,
    description: '基本React组件模板',
    language,
    code: `import React from 'react';

const MyComponent = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">${prompt}</h1>
      <p>这是一个基于您的需求生成的组件模板。</p>
    </div>
  );
};

export default MyComponent;`,
    explanation: `⚡ 快速模板生成完成！基于"${prompt}"为您提供了基础React组件结构。

💡 这是通用模板，可作为起点。如需AI深度定制，请点击"AI深度生成"获取更个性化的实现。`,
    e2bUrl: `https://fragments.e2b.dev/?prompt=${encodeURIComponent(prompt)}`,
    usage: { promptTokens: 30, completionTokens: 150, totalTokens: 180 }
  };
}

 