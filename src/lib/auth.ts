import { betterAuth } from "better-auth";
import { PostgresDialect } from 'kysely';
import { Pool } from 'pg';

// 创建PostgreSQL连接池
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || process.env.POSTGRES_URL,
  ssl: { rejectUnauthorized: false }
});

// 创建PostgreSQL方言
const dialect = new PostgresDialect({
  pool
});

/**
 * 创建 Better Auth 实例
 * 使用 PostgresDialect 和连接池
 */
export const auth = betterAuth({
  // 使用 Kysely PostgreSQL 方言
  database: {
    dialect,
    type: "postgres"
  },
  // 启用邮箱密码登录
  emailAndPassword: {
    enabled: true,
  },
  // 配置社交登录提供商
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }
  }
}); 