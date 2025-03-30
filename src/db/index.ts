import { drizzle } from 'drizzle-orm/vercel-postgres';
import { sql } from '@vercel/postgres';
import * as schema from './schema';

// 数据库连接函数
function createDbConnection() {
  try {
    // 尝试获取数据库连接URL（支持多种环境变量名称）
    const connectionString = process.env.DATABASE_URL || 
                          process.env.POSTGRES_URL || 
                          process.env.VERCEL_POSTGRES_URL;
    
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

// 直接导出表模式
export { projects, users, favorites } from './schema';

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
    console.warn('使用模拟数据。实际数据库查询将不会执行。');
    
    // 返回模拟数据用于开发/构建（仅用于项目查询）
    if (defaultValue === null && queryFn.toString().includes('projects')) {
      // @ts-ignore - 模拟数据用于开发环境
      return mockProjects[0];
    }
    
    return defaultValue;
  }

  try {
    return await queryFn();
  } catch (error) {
    console.error('数据库查询错误:', error);
    return defaultValue;
  }
} 