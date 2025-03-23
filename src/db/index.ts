import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'

// Create database client - using the latest recommended approach
// Reference: https://neon.tech/docs
const sql = neon(process.env.DATABASE_URL || '')
export const db = drizzle(sql)

// Export database schema
export * from './schema/users'
