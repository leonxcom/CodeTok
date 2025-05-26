import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { Pool } from "pg";

console.log('🔧 初始化 Better Auth...');

// 创建PostgreSQL连接池
const pool = new Pool({
  connectionString: "postgresql://neondb_owner:npg_K3Ayuov7JeFn@ep-sparkling-darkness-a1t0bvr2-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require",
  ssl: { rejectUnauthorized: false }
});

/**
 * 创建 Better Auth 实例 - 使用PostgreSQL数据库
 */
export const auth = betterAuth({
  // 基础配置
  secret: "6ff2a4ac85694f05e72a3659b2bec0b81df49de88b6cb324b8bf2cf644b3890f",
  baseURL: "http://localhost:3000",
  basePath: "/api/auth",
  
  // 数据库配置 - 直接传入Pool实例（Better Auth推荐方式）
  database: pool,
  
  // 启用邮箱密码登录
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  
  // 插件
  plugins: [
    nextCookies(),
  ],
});

console.log('✅ Better Auth 初始化完成');

/**
 * 获取当前用户会话的辅助函数
 */
export async function getSession(): Promise<any> {
  try {
    const response = await auth.handler(new Request('http://localhost/api/auth/session'));
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('获取会话失败:', error);
    return null;
  }
} 