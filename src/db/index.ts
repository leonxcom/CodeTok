import { neon, neonConfig } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'

// 配置Neon数据库连接
neonConfig.fetchConnectionCache = true

// 创建数据库客户端
const sql = neon(process.env.DATABASE_URL || '')
export const db = drizzle(sql)

// Export database schema
export * from './schema/users'
