import { drizzle } from 'drizzle-orm/vercel-postgres';
import { sql as vercelSql, createPool } from '@vercel/postgres';
import * as schema from './schema-drizzle';
import { Project, User, Favorite } from './schema';

// 获取当前环境
const environment = process.env.NODE_ENV || 'development';
console.log(`当前环境: ${environment}`);

// 使用硬编码的连接字符串避免环境变量换行问题
const connectionString = "postgresql://neondb_owner:npg_K3Ayuov7JeFn@ep-sparkling-darkness-a1t0bvr2-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require";

// 检查数据库连接并在本地开发时设置环境变量
if (environment === 'development' && !process.env.POSTGRES_URL) {
  // 设置环境变量，确保vercel/postgres包可以找到
  process.env.POSTGRES_URL = connectionString;
  console.log('已为开发环境设置POSTGRES_URL环境变量');
}

// 创建本地环境的数据库池（使用硬编码连接字符串）
const localPool = createPool({ connectionString });

// 使用带有数据库连接配置的sql函数
export const sql = vercelSql;

// 导出直接可用的db对象，包含查询方法和sql模板标签
export const db = drizzle(sql, { schema });

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