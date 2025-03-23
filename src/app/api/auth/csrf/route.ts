import { NextRequest, NextResponse } from 'next/server'
import { randomBytes, createHash } from 'crypto'
import { cookies } from 'next/headers'

// CSRF令牌名称
const CSRF_TOKEN_NAME = 'nostudy_csrf_token'
// CSRF令牌过期时间（1小时）
const CSRF_TOKEN_EXPIRE = 60 * 60 * 1000

/**
 * 生成CSRF令牌的API路由
 */
export async function GET(request: NextRequest) {
  // 生成随机令牌
  const token = randomBytes(32).toString('hex')
  // 获取当前时间戳
  const timestamp = Date.now()
  // 将令牌和时间戳组合
  const tokenWithTimestamp = `${token}.${timestamp}`

  // 设置cookie
  const cookieStore = await cookies()
  cookieStore.set(CSRF_TOKEN_NAME, tokenWithTimestamp, {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'strict',
    path: '/',
    maxAge: CSRF_TOKEN_EXPIRE / 1000, // 转换为秒
  })

  // 返回散列值作为前端表单中使用的令牌
  const csrfToken = createHash('sha256')
    .update(tokenWithTimestamp)
    .digest('hex')

  return NextResponse.json({ csrfToken })
}
