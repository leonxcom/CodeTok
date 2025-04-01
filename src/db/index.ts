import { sql } from '@vercel/postgres';
import { Project, User, Favorite } from './schema';

// 获取当前环境
const environment = process.env.NODE_ENV || 'development';
console.log(`当前环境: ${environment}`);

// 获取数据库连接URL - 根据环境选择合适的连接字符串
const connectionString = process.env.DATABASE_URL || 
                      process.env.POSTGRES_URL || 
                      process.env.VERCEL_POSTGRES_URL;

// 直接导出sql客户端
export { sql };

// 包装每个数据库调用，如果数据库未连接，使用模拟数据作为后备方案
let isConnected = false;

// 项目记录类型定义
export type { Project, User, Favorite } from './schema';
export type { ProjectFile } from './schema';

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
    main_file: 'index.html',
    is_public: true,
    views: 0,
    likes: 0,
    created_at: new Date(),
    updated_at: new Date()
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
    main_file: 'index.html',
    is_public: true,
    views: 0,
    likes: 0,
    created_at: new Date(),
    updated_at: new Date(),
    external_url: 'https://character-sample-project.netlify.app/',
    external_embed: true,
    external_author: 'CodeTok Sample',
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