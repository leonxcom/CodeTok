import { NextResponse } from 'next/server'
import { db, sql } from '@/db'
import { getRandomProject } from '@/services/project-service'

// 添加缓存配置
export const revalidate = 300; // 5分钟缓存
export const runtime = 'nodejs'; // 指定运行时
export const dynamic = 'force-dynamic'; // 强制动态渲染

/**
 * 项目响应类型
 */
type ProjectResponse = {
  projectId: string;
  title?: string;
  description?: string;
  externalUrl?: string;
  externalEmbed?: boolean;
  externalAuthor?: string;
  type?: string;
  files: string[];
  mainFile: string;
  fileContents?: Record<string, string>;
  hasTsxFiles?: boolean;
  views?: number;
  createdAt?: Date | string;
}

// Simple in-memory cache for project IDs
// This significantly reduces database load by avoiding repeated project ID queries
const projectIdsCache = {
  ids: [] as string[],
  lastFetched: 0,
  ttl: 10000, // Cache time-to-live in ms (10 seconds)
  hits: 0,
  misses: 0,
  maxSize: 100 // Maximum number of IDs to cache
};

/**
 * GET handler for random project API endpoint
 * Enhanced with improved error handling, fallbacks, caching, and performance logging
 */
export async function GET() {
  // Performance measurement
  const startTime = Date.now();
  console.log(`[RandomAPI] Request received`);
  
  try {
    let project = null;
    
    try {
      // 尝试从数据库获取随机项目
      const result = await sql`
        SELECT * FROM projects 
        WHERE is_public = true 
        ORDER BY RANDOM() 
        LIMIT 1
      `;
      
      if (result.rowCount && result.rowCount > 0 && result.rows[0]) {
        project = result.rows[0];
        console.log(`[RandomAPI] Found random project from database: ${project.id} - ${project.title}`);
      }
    } catch (dbError) {
      console.warn(`[RandomAPI] Database query failed, falling back to mock data:`, dbError);
    }
    
    // 如果数据库查询失败，使用项目服务的模拟数据
    if (!project) {
      console.log(`[RandomAPI] Using mock data as fallback`);
      const mockProject = await getRandomProject();
      
      if (mockProject) {
        // 转换为数据库格式
        project = {
          id: mockProject.id,
          title: mockProject.title,
          description: mockProject.description,
          external_url: mockProject.externalUrl,
          external_embed: true,
          external_author: mockProject.authorName,
          type: 'external',
          files: JSON.stringify([{
            filename: 'index.html',
            pathname: 'index.html',
            type: 'text/html',
            url: mockProject.externalUrl
          }]),
          main_file: 'index.html',
          is_public: true,
          views: mockProject.views || 0,
          created_at: mockProject.createdAt
        };
        console.log(`[RandomAPI] Using mock project: ${project.title}`);
      }
    }
    
    if (!project) {
      throw new Error('No public projects found');
    }
    
    // 解析文件
    let fileArray = [];
    try {
      if (project.files) {
        const filesData = typeof project.files === 'string' ? JSON.parse(project.files) : project.files;
        fileArray = Array.isArray(filesData) ? filesData : [];
        
        // 如果不是数组，尝试从对象中提取数组
        if (fileArray.length === 0 && filesData && typeof filesData === 'object') {
          console.log('[RandomAPI] Trying to extract files from object');
          // 处理可能的对象格式
          if (filesData.files && Array.isArray(filesData.files)) {
            fileArray = filesData.files;
          } else {
            // 如果没有数组，创建一个只有index.html的默认文件数组
            fileArray = [{
              filename: 'index.html',
              pathname: 'index.html',
              type: 'text/html'
            }];
          }
        }
      } else {
        // 如果没有文件数据，创建默认文件
        fileArray = [{
          filename: 'index.html',
          pathname: 'index.html',
          type: 'text/html'
        }];
      }
    } catch (e) {
      console.error('[RandomAPI] Error parsing files:', e);
      // 出错时使用默认文件
      fileArray = [{
        filename: 'index.html',
        pathname: 'index.html',
        type: 'text/html'
      }];
    }
    
    // 准备文件内容
    const fileContents: Record<string, string> = {};
    if (fileArray.length > 0) {
      fileArray.forEach((file: any) => {
        const filename = file.filename || file.pathname;
        if (filename) {
          // 简单示例：对于外部链接，直接使用URL
          if (file.url) {
            fileContents[filename] = file.url;
          } else if (file.content) {
            fileContents[filename] = file.content;
          } else {
            fileContents[filename] = '// 文件内容将在项目详情页面加载';
          }
        }
      });
    }
    
    // 确定主文件
    const mainFile = project.main_file || 
                     (fileArray.length > 0 ? (fileArray[0].filename || fileArray[0].pathname || 'index.html') : 'index.html');
    
    // 转换为符合ProjectResponse类型的响应
    const responseData: ProjectResponse = {
      projectId: project.id,
      title: project.title,
      description: project.description,
      externalUrl: project.external_url,
      externalEmbed: project.external_embed,
      externalAuthor: project.external_author,
      type: project.type,
      files: fileArray.map((f: any) => f.filename || f.pathname || 'index.html'),
      mainFile: mainFile,
      fileContents: fileContents,
      hasTsxFiles: fileArray.some((f: any) => (f.filename || '').endsWith('.tsx') || (f.pathname || '').endsWith('.tsx')),
      views: project.views || 0,
      createdAt: project.created_at
    };
    
    // 异步更新浏览量，不等待结果
    updateViewCount(project.id, project.views || 0).catch(e => 
      console.error(`[RandomAPI] Error updating view count: ${e}`)
    );
    
    const duration = Date.now() - startTime;
    console.log(`[RandomAPI] Response prepared in ${duration}ms for: ${responseData.title}`);
    
    return NextResponse.json(responseData);
  } catch (error: any) {
    // Enhanced error logging with details
    console.error(`[RandomAPI] Error fetching random project:`, error);
    
    // Return a detailed error response
    const duration = Date.now() - startTime;
    console.log(`[RandomAPI] Error response prepared in ${duration}ms`);
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch random project',
        message: error?.message || 'An unexpected error occurred',
        status: 'error'
      }, 
      { 
        status: 500,
        headers: {
          'Cache-Control': 'no-store, max-age=0'
        }
      }
    );
  }
}

/**
 * Helper function to update view count asynchronously
 * This runs in the background and doesn't block the response
 */
async function updateViewCount(projectId: string, currentViews: number): Promise<void> {
  try {
    await sql`
      UPDATE projects
      SET views = ${currentViews + 1}
      WHERE id = ${projectId}
    `;
    console.log(`[RandomAPI] View count updated for project ${projectId}`);
  } catch (error) {
    console.error(`[RandomAPI] Error updating view count for project ${projectId}:`, error);
  }
}