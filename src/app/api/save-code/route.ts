import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { nanoid } from 'nanoid';
import { ErrorTypes, logError, createErrorResponse, withErrorHandling } from '@/lib/error-handler';
import { logEnvironmentInfo } from '@/lib/env-config';

// 包装主处理函数
const handleSaveCode = withErrorHandling(async (request: NextRequest) => {
  // 记录环境信息
  logEnvironmentInfo();

  const { 
    code, 
    language, 
    title, 
    description,
    prompt 
  } = await request.json();

  if (!code) {
    throw ErrorTypes.validation('缺少代码内容', { action: 'save_code' });
  }

  if (!title || !description) {
    throw ErrorTypes.validation('缺少标题或描述', { action: 'save_code' });
  }

  // 生成项目ID和文件夹
  const projectId = nanoid(8);
  const projectDir = path.join(process.cwd(), 'tmp', 'generated-projects', projectId);
  
  // 确保目录存在
  try {
    fs.mkdirSync(projectDir, { recursive: true });
  } catch (error) {
    throw ErrorTypes.file(`无法创建项目目录: ${error instanceof Error ? error.message : '未知错误'}`, 
      { action: 'create_directory', metadata: { projectId, projectDir } });
  }

  // 根据语言确定文件扩展名和结构
  let files: Array<{ name: string; content: string; isEntry: boolean }> = [];
  
  if (language === 'react' || language === 'jsx') {
    // React项目结构
    files = [
      {
        name: 'package.json',
        content: JSON.stringify({
          name: `codetok-${projectId}`,
          version: '1.0.0',
          type: 'module',
          scripts: {
            dev: 'vite',
            build: 'vite build',
            preview: 'vite preview'
          },
          dependencies: {
            react: '^18.2.0',
            'react-dom': '^18.2.0'
          },
          devDependencies: {
            '@vitejs/plugin-react': '^4.0.0',
            vite: '^5.0.0'
          }
        }, null, 2),
        isEntry: false
      },
      {
        name: 'index.html',
        content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <style>
    body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
    #root { min-height: 100vh; }
  </style>
</head>
<body>
  <div id="root"></div>
  <script type="text/babel">
    ${code}
    
    // 自动渲染组件
    const container = document.getElementById('root');
    const root = ReactDOM.createRoot(container);
    
    // 尝试找到并渲染默认导出的组件
    try {
      const ComponentName = Object.keys(window).find(key => 
        window[key] && 
        typeof window[key] === 'function' && 
        key !== 'React' && 
        key !== 'ReactDOM'
      );
      
      if (ComponentName) {
        root.render(React.createElement(window[ComponentName]));
      } else {
        // 如果没有找到组件，尝试直接渲染代码中的JSX
        root.render(React.createElement('div', {}, '组件加载中...'));
      }
    } catch (error) {
      root.render(React.createElement('div', { style: { padding: '20px', color: 'red' } }, 
        '组件渲染错误: ' + error.message
      ));
    }
  </script>
</body>
</html>`,
        isEntry: true
      },
      {
        name: 'App.jsx',
        content: code,
        isEntry: false
      }
    ];
  } else if (language === 'typescript' && code.includes('MCP')) {
    // MCP TypeScript项目
    files = [
      {
        name: 'package.json',
        content: JSON.stringify({
          name: `mcp-server-${projectId}`,
          version: '0.1.0',
          type: 'module',
          main: 'index.js',
          scripts: {
            start: 'node index.js',
            build: 'tsc',
            dev: 'tsc --watch'
          },
          dependencies: {
            '@modelcontextprotocol/sdk': '^0.5.0'
          },
          devDependencies: {
            '@types/node': '^20.0.0',
            typescript: '^5.0.0'
          }
        }, null, 2),
        isEntry: false
      },
      {
        name: 'tsconfig.json',
        content: JSON.stringify({
          compilerOptions: {
            target: 'ES2022',
            module: 'ESNext',
            moduleResolution: 'bundler',
            allowSyntheticDefaultImports: true,
            esModuleInterop: true,
            strict: true,
            skipLibCheck: true
          },
          include: ['*.ts']
        }, null, 2),
        isEntry: false
      },
      {
        name: 'index.ts',
        content: code,
        isEntry: true
      },
      {
        name: 'README.md',
        content: `# ${title}

${description}

## 安装依赖

\`\`\`bash
npm install
\`\`\`

## 编译和运行

\`\`\`bash
npm run build
npm start
\`\`\`

## 与 Claude Desktop 集成

在 Claude Desktop 配置文件中添加：

\`\`\`json
{
  "mcpServers": {
    "${projectId}": {
      "command": "node",
      "args": ["${path.join(projectDir, 'index.js')}"]
    }
  }
}
\`\`\`
`,
        isEntry: false
      }
    ];
  } else if (language === 'python') {
    // Python项目
    files = [
      {
        name: 'main.py',
        content: code,
        isEntry: true
      },
      {
        name: 'requirements.txt',
        content: '# Add your Python dependencies here\n',
        isEntry: false
      },
      {
        name: 'README.md',
        content: `# ${title}

${description}

## 运行

\`\`\`bash
python main.py
\`\`\`
`,
        isEntry: false
      }
    ];
  } else {
    // 通用文件
    const extension = language === 'javascript' ? 'js' : 
                     language === 'typescript' ? 'ts' :
                     language === 'html' ? 'html' :
                     language === 'css' ? 'css' : 'txt';
    
    files = [
      {
        name: `main.${extension}`,
        content: code,
        isEntry: true
      }
    ];
  }

  // 写入所有文件
  try {
    for (const file of files) {
      const filePath = path.join(projectDir, file.name);
      fs.writeFileSync(filePath, file.content, 'utf8');
    }
  } catch (error) {
    throw ErrorTypes.file(`无法写入项目文件: ${error instanceof Error ? error.message : '未知错误'}`, 
      { action: 'write_files', metadata: { projectId, projectDir } });
  }

  // 创建项目元数据
  const metadata = {
    id: projectId,
    title,
    description,
    language,
    prompt,
    createdAt: new Date().toISOString(),
    files: files.map(f => ({ name: f.name, isEntry: f.isEntry })),
    entryFile: files.find(f => f.isEntry)?.name || files[0].name
  };

  try {
    fs.writeFileSync(
      path.join(projectDir, 'metadata.json'),
      JSON.stringify(metadata, null, 2),
      'utf8'
    );
  } catch (error) {
    throw ErrorTypes.file(`无法写入元数据文件: ${error instanceof Error ? error.message : '未知错误'}`, 
      { action: 'write_metadata', metadata: { projectId, projectDir } });
  }

  console.log(`📁 代码已保存到本地: ${projectDir}`);

  // 返回本地预览URL
  const previewUrl = `/api/preview/${projectId}`;
  const fileManagerUrl = `/api/file-manager/${projectId}`;

  return NextResponse.json({
    success: true,
    projectId,
    projectDir,
    previewUrl,
    fileManagerUrl,
    metadata,
    message: `代码已成功保存到 tmp/generated-projects/${projectId}`
  });
}, { component: 'save-code-api', action: 'save_code' });

export async function POST(request: NextRequest) {
  try {
    return await handleSaveCode(request);
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    logError(err, { component: 'save-code-api', action: 'POST' });
    return createErrorResponse(err, 500);
  }
} 