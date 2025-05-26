import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const { projectId } = await params;
    const projectDir = path.join(process.cwd(), 'tmp', 'generated-projects', projectId);
    
    // 检查项目是否存在
    if (!fs.existsSync(projectDir)) {
      return new NextResponse('项目不存在', { status: 404 });
    }

    // 读取项目元数据
    const metadataPath = path.join(projectDir, 'metadata.json');
    if (!fs.existsSync(metadataPath)) {
      return new NextResponse('项目元数据缺失', { status: 404 });
    }

    const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
    
    // 获取入口文件
    const entryFile = metadata.entryFile || 'index.html';
    const entryPath = path.join(projectDir, entryFile);
    
    if (!fs.existsSync(entryPath)) {
      return new NextResponse('入口文件不存在', { status: 404 });
    }

    // 读取文件内容
    const content = fs.readFileSync(entryPath, 'utf8');
    
    // 根据文件类型设置正确的Content-Type
    const getContentType = (filename: string) => {
      const ext = path.extname(filename).toLowerCase();
      switch (ext) {
        case '.html': return 'text/html; charset=utf-8';
        case '.js': return 'application/javascript; charset=utf-8';
        case '.jsx': return 'application/javascript; charset=utf-8';
        case '.ts': return 'application/typescript; charset=utf-8';
        case '.css': return 'text/css; charset=utf-8';
        case '.json': return 'application/json; charset=utf-8';
        case '.md': return 'text/markdown; charset=utf-8';
        case '.py': return 'text/plain; charset=utf-8';
        default: return 'text/plain; charset=utf-8';
      }
    };

    // 如果是HTML文件，直接返回内容进行预览
    if (entryFile.endsWith('.html')) {
      return new NextResponse(content, {
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'X-Frame-Options': 'SAMEORIGIN',
        },
      });
    }

    // 如果是React组件，生成一个HTML包装器
    if (metadata.language === 'react' || metadata.language === 'jsx') {
      const htmlWrapper = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${metadata.title}</title>
  <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <style>
    body { 
      margin: 0; 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif; 
      background: #f5f5f5;
    }
    #root { 
      min-height: 100vh; 
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .codetok-preview {
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      padding: 20px;
      margin: 20px;
      max-width: 600px;
      width: 100%;
    }
  </style>
</head>
<body>
  <div id="root"></div>
  <script type="text/babel">
    ${content}
    
    // 自动渲染组件
    const container = document.getElementById('root');
    const root = ReactDOM.createRoot(container);
    
    try {
      // 尝试找到默认导出的组件
      const lines = \`${content.replace(/`/g, '\\`')}\`.split('\\n');
      let ComponentName = null;
      
      // 查找 export default 或 const ComponentName
      for (const line of lines) {
        const defaultMatch = line.match(/export\\s+default\\s+(\\w+)/);
        const constMatch = line.match(/const\\s+(\\w+)\\s*=.*=>/);
        const functionMatch = line.match(/function\\s+(\\w+)/);
        
        if (defaultMatch) {
          ComponentName = defaultMatch[1];
          break;
        } else if (constMatch) {
          ComponentName = constMatch[1];
        } else if (functionMatch) {
          ComponentName = functionMatch[1];
        }
      }
      
      if (ComponentName && window[ComponentName]) {
        root.render(
          React.createElement('div', { className: 'codetok-preview' },
            React.createElement(window[ComponentName])
          )
        );
      } else {
        // 如果找不到组件，显示代码内容
        root.render(
          React.createElement('div', { 
            className: 'codetok-preview',
            style: { textAlign: 'center' }
          }, [
            React.createElement('h3', { key: 'title' }, '${metadata.title}'),
            React.createElement('p', { key: 'desc' }, '${metadata.description}'),
            React.createElement('pre', { 
              key: 'code',
              style: { 
                textAlign: 'left', 
                background: '#f8f9fa', 
                padding: '15px', 
                borderRadius: '5px',
                overflow: 'auto'
              }
            }, \`${content.replace(/`/g, '\\`')}\`)
          ])
        );
      }
    } catch (error) {
      root.render(
        React.createElement('div', { 
          className: 'codetok-preview',
          style: { color: 'red', textAlign: 'center' }
        }, [
          React.createElement('h3', { key: 'error' }, '组件渲染错误'),
          React.createElement('p', { key: 'msg' }, error.message),
          React.createElement('pre', { 
            key: 'code',
            style: { 
              textAlign: 'left', 
              background: '#f8f9fa', 
              padding: '15px', 
              borderRadius: '5px'
            }
          }, \`${content.replace(/`/g, '\\`')}\`)
        ])
      );
    }
  </script>
</body>
</html>`;
      
      return new NextResponse(htmlWrapper, {
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'X-Frame-Options': 'SAMEORIGIN',
        },
      });
    }

    // 对于其他类型的文件，返回带格式的文本预览
    const textPreview = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${metadata.title}</title>
  <style>
    body { 
      margin: 0; 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; 
      background: #f5f5f5;
      padding: 20px;
    }
    .preview-container {
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      padding: 20px;
      max-width: 800px;
      margin: 0 auto;
    }
    .header {
      border-bottom: 1px solid #eee;
      padding-bottom: 15px;
      margin-bottom: 20px;
    }
    .header h1 {
      margin: 0;
      color: #333;
    }
    .header p {
      margin: 5px 0 0 0;
      color: #666;
    }
    .code-block {
      background: #f8f9fa;
      border: 1px solid #e9ecef;
      border-radius: 5px;
      padding: 15px;
      overflow-x: auto;
      white-space: pre-wrap;
      font-family: 'Monaco', 'Consolas', monospace;
      font-size: 14px;
      line-height: 1.5;
    }
    .meta {
      margin-top: 15px;
      padding-top: 15px;
      border-top: 1px solid #eee;
      font-size: 12px;
      color: #666;
    }
  </style>
</head>
<body>
  <div class="preview-container">
    <div class="header">
      <h1>${metadata.title}</h1>
      <p>${metadata.description}</p>
    </div>
    <div class="code-block">${content.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>
    <div class="meta">
      <p><strong>语言:</strong> ${metadata.language}</p>
      <p><strong>文件:</strong> ${entryFile}</p>
      <p><strong>创建时间:</strong> ${new Date(metadata.createdAt).toLocaleString('zh-CN')}</p>
    </div>
  </div>
</body>
</html>`;

    return new NextResponse(textPreview, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'X-Frame-Options': 'SAMEORIGIN',
      },
    });

  } catch (error) {
    console.error('预览项目失败:', error);
    return new NextResponse('预览失败', { status: 500 });
  }
} 