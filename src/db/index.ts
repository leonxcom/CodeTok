import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'

// 创建数据库客户端
const sql = neon(process.env.DATABASE_URL || '')
export const db = drizzle(sql)

// 导出数据库模式
export * from './schema/users'
