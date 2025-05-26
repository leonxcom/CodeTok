import { sql } from '@/db';
import { nanoid } from 'nanoid';

export interface ProjectFile {
  filename: string;
  pathname: string;
  url?: string;
  size?: number;
  type?: string;
  isEntryPoint?: boolean;
}

export interface Project {
  id: string;
  title: string;
  description?: string;
  authorId?: string;
  authorName?: string;
  authorAvatar?: string;
  files?: ProjectFile[];
  mainFile?: string;
  previewUrl?: string;
  externalUrl?: string;
  views?: number;
  likes?: number;
  comments?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * 根据外部URL生成预览图URL
 */
function generatePreviewUrl(externalUrl: string): string {
  if (!externalUrl) {
    return '/images/code-preview-1.jpg';
  }

  try {
    const url = new URL(externalUrl);
    const hostname = url.hostname.toLowerCase();

    // CodePen 预览图
    if (hostname.includes('codepen.io')) {
      // CodePen URL 格式: https://codepen.io/username/pen/pen-id
      const match = externalUrl.match(/codepen\.io\/([^\/]+)\/pen\/([^\/]+)/);
      if (match) {
        const [, username, penId] = match;
        return `https://codepen.io/${username}/pen/${penId}/image/large.png`;
      }
    }

    // StackBlitz 预览图
    if (hostname.includes('stackblitz.com')) {
      // StackBlitz URL 格式: https://stackblitz.com/edit/project-name
      const match = externalUrl.match(/stackblitz\.com\/edit\/([^\/\?]+)/);
      if (match) {
        const [, projectId] = match;
        return `https://stackblitz.com/files/${projectId}/github/preview.png`;
      }
    }

    // CodeSandbox 预览图
    if (hostname.includes('codesandbox.io')) {
      // CodeSandbox URL 格式: https://codesandbox.io/s/sandbox-id
      const match = externalUrl.match(/codesandbox\.io\/s\/([^\/\?]+)/);
      if (match) {
        const [, sandboxId] = match;
        return `https://codesandbox.io/api/v1/sandboxes/${sandboxId}/screenshot.png`;
      }
    }

    // JSFiddle 预览图
    if (hostname.includes('jsfiddle.net')) {
      // 暂时没有直接的预览图API，使用默认图
      return '/images/code-preview-2.jpg';
    }

    // GitHub Pages 或其他，使用默认图
    return '/images/code-preview-3.jpg';

  } catch (error) {
    console.error('Error generating preview URL:', error);
    return '/images/code-preview-1.jpg';
  }
}

/**
 * 从数据库格式转换为Project接口格式
 */
function convertDatabaseToProject(dbProject: any): Project {
  return {
    id: dbProject.id,
    title: dbProject.title,
    description: dbProject.description,
    authorName: dbProject.external_author || '匿名用户',
    externalUrl: dbProject.external_url,
    views: dbProject.views || 0,
    likes: Math.floor((dbProject.views || 0) * 0.15), // 简单的点赞数计算：约为浏览量的15%
    comments: Math.floor((dbProject.views || 0) * 0.05), // 简单的评论数计算：约为浏览量的5%
    createdAt: new Date(dbProject.created_at),
    updatedAt: new Date(dbProject.updated_at || dbProject.created_at),
    previewUrl: generatePreviewUrl(dbProject.external_url) // 根据外部URL生成预览图
  };
}

/**
 * 获取推荐的项目列表 - 使用 Neon 数据库
 */
export async function getRecommendedProjects(limit = 10): Promise<Project[]> {
  try {
    console.log('[ProjectService] 从 Neon 数据库获取推荐项目');
    
    // 从数据库查询公开项目，按浏览量排序（推荐逻辑）
    const result = await sql`
      SELECT * FROM projects 
      WHERE is_public = true 
      ORDER BY views DESC, created_at DESC 
      LIMIT ${limit}
    `;

    if (result.rowCount === 0) {
      console.warn('[ProjectService] 没有找到推荐项目');
      return [];
    }

    const projects = result.rows.map(convertDatabaseToProject);
    console.log(`[ProjectService] 成功获取 ${projects.length} 个推荐项目`);
    
    return projects;
  } catch (error) {
    console.error('获取推荐项目失败:', error);
    return [];
  }
}

/**
 * 获取单个项目详情 - 使用 Neon 数据库
 */
export async function getProjectById(id: string): Promise<Project | null> {
  try {
    console.log(`[ProjectService] 从 Neon 数据库获取项目: ${id}`);
    
    const result = await sql`
      SELECT * FROM projects 
      WHERE id = ${id} AND is_public = true
    `;

    if (result.rowCount === 0) {
      console.warn(`项目 ${id} 未找到`);
      return null;
    }

    const project = convertDatabaseToProject(result.rows[0]);
    console.log(`[ProjectService] 找到项目: ${project.title}`);
    
    return project;
  } catch (error) {
    console.error(`获取项目 ${id} 失败:`, error);
    return null;
  }
}

/**
 * 获取热门项目列表 - 使用 Neon 数据库
 */
export async function getTrendingProjects(limit = 10): Promise<Project[]> {
  try {
    console.log('[ProjectService] 从 Neon 数据库获取热门项目');
    
    // 热门项目：最近创建的且有较高浏览量的项目
    const result = await sql`
      SELECT * FROM projects 
      WHERE is_public = true 
      ORDER BY (views * 0.7 + EXTRACT(EPOCH FROM (NOW() - created_at)) / -86400 * 0.3) DESC
      LIMIT ${limit}
    `;

    if (result.rowCount === 0) {
      console.warn('[ProjectService] 没有找到热门项目');
      return [];
    }

    const projects = result.rows.map(convertDatabaseToProject);
    console.log(`[ProjectService] 成功获取 ${projects.length} 个热门项目`);
    
    return projects;
  } catch (error) {
    console.error('获取热门项目失败:', error);
    return [];
  }
}

/**
 * 获取最新项目列表 - 使用 Neon 数据库
 */
export async function getLatestProjects(limit = 10): Promise<Project[]> {
  try {
    console.log('[ProjectService] 从 Neon 数据库获取最新项目');
    
    const result = await sql`
      SELECT * FROM projects 
      WHERE is_public = true 
      ORDER BY created_at DESC 
      LIMIT ${limit}
    `;

    if (result.rowCount === 0) {
      console.warn('[ProjectService] 没有找到最新项目');
      return [];
    }

    const projects = result.rows.map(convertDatabaseToProject);
    console.log(`[ProjectService] 成功获取 ${projects.length} 个最新项目`);
    
    return projects;
  } catch (error) {
    console.error('获取最新项目失败:', error);
    return [];
  }
}

/**
 * 获取随机项目 - 使用 Neon 数据库
 */
export async function getRandomProject(excludeId?: string): Promise<Project | null> {
  try {
    console.log('[ProjectService] 从 Neon 数据库获取随机项目');
    
    let result;
    if (excludeId) {
      result = await sql`
        SELECT * FROM projects 
        WHERE is_public = true AND id != ${excludeId}
        ORDER BY RANDOM() 
        LIMIT 1
      `;
    } else {
      result = await sql`
        SELECT * FROM projects 
        WHERE is_public = true 
        ORDER BY RANDOM() 
        LIMIT 1
      `;
    }
    
    if (result.rowCount === 0) {
      console.warn('[ProjectService] 没有找到随机项目');
      return null;
    }
    
    const project = convertDatabaseToProject(result.rows[0]);
    console.log(`[ProjectService] 获取随机项目: ${project.title}`);
    
    return project;
  } catch (error) {
    console.error('获取随机项目失败:', error);
    return null;
  }
}

/**
 * 创建新项目
 */
export async function createProject(projectData: Omit<Project, 'id'>): Promise<Project | null> {
  try {
    const id = nanoid(10);
    const newProject = {
      id,
      ...projectData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    // 实际项目中需要将数据插入到数据库
    // await sql`INSERT INTO projects (id, title, ...) VALUES (${id}, ${projectData.title}, ...)`;
    
    return newProject;
  } catch (error) {
    console.error('创建项目失败:', error);
    return null;
  }
} 