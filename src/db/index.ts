import { drizzle } from 'drizzle-orm/vercel-postgres';
import { sql } from '@vercel/postgres';
import * as schema from './schema';

// 数据库连接URL
const connectionString = process.env.DATABASE_URL || '';

// 检查环境变量
if (!connectionString) {
  console.warn('DATABASE_URL is not defined. Using mock database for development.');
}

// 创建drizzle ORM实例或模拟数据库
export const db = connectionString ? drizzle(sql) : null;

// 直接导出表模式
export { projects, users, favorites } from './schema';

// 模拟项目数据（仅用于开发环境）
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
  }
];

/**
 * 安全地执行数据库操作
 * 如果数据库未连接，将返回模拟数据或默认值
 */
export async function safeQuery<T>(
  queryFn: () => Promise<T>,
  defaultValue: T
): Promise<T> {
  if (!db) {
    console.warn('Using mock database. Real database queries will not execute.');
    
    // 返回模拟数据用于开发（仅用于项目查询）
    if (defaultValue === null && queryFn.toString().includes('projects')) {
      // @ts-ignore - 模拟数据用于开发环境
      return mockProjects[0];
    }
    
    return defaultValue;
  }

  try {
    return await queryFn();
  } catch (error) {
    console.error('Database query error:', error);
    return defaultValue;
  }
} 