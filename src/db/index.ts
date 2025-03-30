import { drizzle } from 'drizzle-orm/vercel-postgres';
import { sql } from '@vercel/postgres';
import * as schema from './schema';

// 获取数据库连接URL
const connectionString = process.env.DATABASE_URL || 
                      process.env.POSTGRES_URL || 
                      process.env.VERCEL_POSTGRES_URL;

// 数据库连接函数
function createDbConnection() {
  try {    
    if (!connectionString) {
      console.warn('数据库连接URL未定义。使用模拟数据库进行开发/构建。');
      return null;
    }
    
    return drizzle(sql);
  } catch (error) {
    console.error('数据库连接初始化失败:', error);
    return null;
  }
}

// 创建drizzle ORM实例或使用模拟数据库
export const db = createDbConnection();

// 直接导出sql客户端
export { sql };

// 直接导出表模式
export { projects, users, favorites } from './schema';

// 包装每个数据库调用，如果数据库未连接，使用模拟数据作为后备方案
let isConnected = false;

// 项目记录类型定义
export interface Project {
  id: string;
  title: string;
  description: string;
  files: any[];
  mainFile: string;
  isPublic: boolean;
  views: number;
  likes: number;
  createdAt: Date;
  updatedAt: Date;
  // 可选字段
  externalUrl?: string;
  externalEmbed?: boolean;
  externalAuthor?: string;
  type?: string;
}

// 用于vercel/postgres查询的结果类型
export interface QueryResult<T> {
  rows: T[];
  rowCount?: number;
}

// 模拟项目数据（用于开发环境和构建）
const mockProjects = [
  {
    id: 'demo-project',
    title: 'Demo Project',
    description: 'A sample project for development',
    files: [
      {
        url: 'https://example.com/demo.html',
        filename: 'index.html',
        pathname: 'index.html',
        size: 1024,
        type: 'text/html',
        isEntryPoint: true
      }
    ],
    mainFile: 'index.html',
    isPublic: true,
    views: 0,
    likes: 0,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'character-sample',
    title: 'Character Controller Sample',
    description: 'Interactive character sample project with animations and controls',
    files: [
      {
        url: 'https://character-sample-project.netlify.app/',
        filename: 'index.html',
        pathname: 'index.html',
        size: 0,
        type: 'text/html',
        isEntryPoint: true
      }
    ],
    mainFile: 'index.html',
    isPublic: true,
    views: 0,
    likes: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
    externalUrl: 'https://character-sample-project.netlify.app/',
    externalEmbed: true,
    externalAuthor: 'VibeTok Sample',
    type: 'external'
  }
];

/**
 * 安全地执行数据库操作
 * 如果数据库未连接，将返回模拟数据或默认值
 * 使用@vercel/postgres的sql标签函数直接执行SQL语句
 */
export async function safeQuery<T>(
  queryFn: () => Promise<T>,
  defaultValue: T
): Promise<T> {
  // 检查数据库连接
  if (!connectionString) {
    console.warn('使用模拟数据。实际数据库查询将不会执行。');
    
    // 返回模拟数据用于开发/构建（仅用于项目查询）
    if (defaultValue === null && queryFn.toString().includes('projects')) {
      // @ts-ignore - 模拟数据用于开发环境
      return mockProjects[0];
    }
    
    return defaultValue;
  }

  try {
    // 执行查询
    const result = await queryFn();
    
    // 检查结果是否为空数组且查询涉及项目
    if (Array.isArray(result) && result.length === 0 && queryFn.toString().includes('projects')) {
      console.log('数据库查询返回空结果集，但查询涉及项目。');
      return defaultValue;
    }
    
    return result;
  } catch (error) {
    console.error('数据库查询错误:', error);
    return defaultValue;
  }
} 