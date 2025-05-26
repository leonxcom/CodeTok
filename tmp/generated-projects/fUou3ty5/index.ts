#!/usr/bin/env node
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
                text: `Current time (${format}): ${timeString}`,
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
              throw new Error(`Unknown operation: ${operation}`);
          }

          return {
            content: [
              {
                type: 'text',
                text: `${a} ${operation} ${b} = ${result}`,
              },
            ],
          };
        }

        throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${name}`);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        throw new McpError(ErrorCode.InternalError, `Tool execution failed: ${errorMessage}`);
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
        const status = `Server Status: Healthy
Uptime: ${process.uptime()} seconds
Memory Usage: ${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)} MB
Node Version: ${process.version}`;

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

      throw new McpError(ErrorCode.InvalidRequest, `Unknown resource: ${uri}`);
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
*/