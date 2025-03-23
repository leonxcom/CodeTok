import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'

// Create database client
const sql = neon(process.env.DATABASE_URL || '')
export const db = drizzle(sql)

// Export database schema
export * from './schema/users'
