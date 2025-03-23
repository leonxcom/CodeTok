import type { Config } from 'drizzle-kit'
import * as dotenv from 'dotenv'
import { defineConfig } from 'drizzle-kit'

// 加载环境变量
dotenv.config({ path: '.env.local' })

export default defineConfig({
  schema: './src/db/schema/*',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL || '',
  },
})
