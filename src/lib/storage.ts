import { put, list, del, PutBlobResult, ListBlobResult, BlobObject } from '@vercel/blob';
import { nanoid } from 'nanoid';

// 最大文件大小 (10MB)
export const MAX_FILE_SIZE = 10 * 1024 * 1024;

// 文件接口，确保有name属性
interface FileWithName extends Blob {
  name: string;
}

/**
 * 上传单个文件到Vercel Blob
 */
export async function uploadFile(file: FileWithName, projectId: string, path: string = '') {
  try {
    const filename = path ? `${path}/${file.name}` : file.name;
    const { url } = await put(`projects/${projectId}/${filename}`, file, {
      access: 'public',
    });
    
    return { 
      url, 
      filename,
      size: file.size, 
      type: file.type || getMimeType(filename)
    };
  } catch (error) {
    console.error('Upload file error:', error);
    throw new Error('Failed to upload file');
  }
}

/**
 * 上传代码文本到Vercel Blob
 */
export async function uploadCode(code: string, projectId: string, filename: string = 'index.html') {
  try {
    const blob = new Blob([code], { type: getMimeType(filename) });
    
    const { url } = await put(`projects/${projectId}/${filename}`, blob, {
      access: 'public',
    });
    
    return { 
      url, 
      filename,
      size: blob.size, 
      type: getMimeType(filename)
    };
  } catch (error) {
    console.error('Upload code error:', error);
    throw new Error('Failed to upload code');
  }
}

// Blob项类型定义
interface BlobItem {
  url: string;
  pathname: string;
  size: number;
  uploadedAt: Date;
}

/**
 * 列出项目的所有文件
 */
export async function listProjectFiles(projectId: string): Promise<BlobItem[]> {
  try {
    const { blobs } = await list({ prefix: `projects/${projectId}/` });
    return blobs.map((blob: BlobObject) => ({
      url: blob.url,
      pathname: blob.pathname.replace(`projects/${projectId}/`, ''),
      size: blob.size,
      uploadedAt: blob.uploadedAt
    }));
  } catch (error) {
    console.error('List project files error:', error);
    throw new Error('Failed to list project files');
  }
}

/**
 * 删除项目的所有文件
 */
export async function deleteProject(projectId: string): Promise<boolean> {
  try {
    const { blobs } = await list({ prefix: `projects/${projectId}/` });
    
    for (const blob of blobs) {
      await del(blob.url);
    }
    
    return true;
  } catch (error) {
    console.error('Delete project error:', error);
    throw new Error('Failed to delete project');
  }
}

/**
 * 生成项目ID
 */
export function generateProjectId(): string {
  return nanoid(10);
}

/**
 * 获取文件MIME类型
 */
function getMimeType(filename: string): string {
  const extension = filename.split('.').pop()?.toLowerCase();
  
  const mimeTypes: Record<string, string> = {
    'html': 'text/html',
    'htm': 'text/html',
    'css': 'text/css',
    'js': 'application/javascript',
    'jsx': 'application/javascript',
    'ts': 'application/typescript',
    'tsx': 'application/typescript',
    'json': 'application/json',
    'txt': 'text/plain',
    'md': 'text/markdown',
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'png': 'image/png',
    'gif': 'image/gif',
    'svg': 'image/svg+xml',
    'ico': 'image/x-icon',
  };
  
  return extension && mimeTypes[extension] 
    ? mimeTypes[extension] 
    : 'application/octet-stream';
} 