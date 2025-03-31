import { NextResponse } from 'next/server'
import { db, safeQuery, projects } from '@/db'
import { sql } from 'drizzle-orm'

export async function GET() {
  try {
    // 检查数据库连接
    const isConnected = !!db
    
    // 尝试执行一个简单的查询
    let queryResult = false
    
    if (isConnected && db) {
      try {
        // 尝试执行一个简单的SQL查询
        const result = await db.execute(sql`SELECT 1 as test`)
        // 安全地检查结果
        queryResult = Array.isArray(result) && 
                     result.length > 0 && 
                     typeof result[0] === 'object' && 
                     result[0] !== null &&
                     'test' in result[0] &&
                     result[0].test === 1
      } catch (error: any) {
        console.error('数据库查询测试失败:', error)
      }
    }
    
    // 获取环境变量（不显示敏感信息）
    const envStatus = {
      DATABASE_URL: !!process.env.DATABASE_URL,
      POSTGRES_URL: !!process.env.POSTGRES_URL,
      VERCEL_POSTGRES_URL: !!process.env.VERCEL_POSTGRES_URL,
      NODE_ENV: process.env.NODE_ENV
    }
    
    // 返回状态信息
    return NextResponse.json({
      isConnected,
      querySuccess: queryResult,
      environment: envStatus,
      timestamp: new Date().toISOString()
    })
  } catch (error: any) {
    console.error('Error checking database status:', error)
    return NextResponse.json(
      { error: 'Failed to check database status', details: error.message }, 
      { status: 500 }
    )
  }
} 