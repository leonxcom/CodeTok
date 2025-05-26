import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import archiver from 'archiver';
import { ErrorTypes, logError, createErrorResponse, withErrorHandling } from '@/lib/error-handler';
import { logEnvironmentInfo } from '@/lib/env-config';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const { projectId } = await params;
    const url = new URL(request.url);
    const action = url.searchParams.get('action');
    const filename = url.searchParams.get('file');

    const projectDir = path.join(process.cwd(), 'tmp', 'generated-projects', projectId);
    
    // 检查项目是否存在
    if (!fs.existsSync(projectDir)) {
      return NextResponse.json({ error: '项目不存在' }, { status: 404 });
    }

    // 下载整个项目为ZIP
    if (action === 'download') {
      const metadataPath = path.join(projectDir, 'metadata.json');
      const metadata = fs.existsSync(metadataPath) 
        ? JSON.parse(fs.readFileSync(metadataPath, 'utf8'))
        : { title: `project-${projectId}` };

      return new Promise((resolve) => {
        const archive = archiver('zip', { zlib: { level: 9 } });
        const chunks: Buffer[] = [];

        archive.on('data', (chunk: Buffer) => chunks.push(chunk));
        archive.on('end', () => {
          const buffer = Buffer.concat(chunks);
          resolve(new NextResponse(buffer, {
            headers: {
              'Content-Type': 'application/zip',
              'Content-Disposition': `attachment; filename="${metadata.title}-${projectId}.zip"`,
            },
          }));
        });

        archive.on('error', (err: Error) => {
          console.error('Archive error:', err);
          resolve(NextResponse.json({ error: '创建ZIP文件失败' }, { status: 500 }));
        });

        // 添加项目文件到ZIP
        archive.directory(projectDir, false);
        archive.finalize();
      });
    }

    // 下载单个文件
    if (action === 'download-file' && filename) {
      const filePath = path.join(projectDir, filename);
      
      if (!fs.existsSync(filePath) || !filePath.startsWith(projectDir)) {
        return NextResponse.json({ error: '文件不存在或路径不安全' }, { status: 404 });
      }

      const content = fs.readFileSync(filePath);
      const ext = path.extname(filename);
      const mimeType = ext === '.json' ? 'application/json' :
                      ext === '.html' ? 'text/html' :
                      ext === '.js' || ext === '.jsx' ? 'application/javascript' :
                      ext === '.ts' ? 'application/typescript' :
                      ext === '.css' ? 'text/css' :
                      ext === '.md' ? 'text/markdown' :
                      'text/plain';

      return new NextResponse(content, {
        headers: {
          'Content-Type': mimeType,
          'Content-Disposition': `attachment; filename="${filename}"`,
        },
      });
    }

    // 获取文件列表和项目信息
    const metadataPath = path.join(projectDir, 'metadata.json');
    const metadata = fs.existsSync(metadataPath) 
      ? JSON.parse(fs.readFileSync(metadataPath, 'utf8'))
      : null;

    const files = fs.readdirSync(projectDir).map(filename => {
      const filePath = path.join(projectDir, filename);
      const stats = fs.statSync(filePath);
      
      let content = '';
      if (stats.isFile() && stats.size < 100 * 1024) { // 只读取小于100KB的文件
        try {
          content = fs.readFileSync(filePath, 'utf8');
        } catch (err) {
          content = '[二进制文件或读取失败]';
        }
      }

      return {
        name: filename,
        size: stats.size,
        isDirectory: stats.isDirectory(),
        modified: stats.mtime.toISOString(),
        content: stats.isFile() ? content : null,
        isEntry: metadata?.entryFile === filename,
      };
    });

    return NextResponse.json({
      projectId,
      metadata,
      files,
      actions: {
        download: `/api/file-manager/${projectId}?action=download`,
        preview: `/api/preview/${projectId}`,
      }
    });

  } catch (error) {
    console.error('文件管理器错误:', error);
    return NextResponse.json(
      { error: '文件管理器操作失败' },
      { status: 500 }
    );
  }
} 