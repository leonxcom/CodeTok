import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { cookies } from 'next/headers'
import { createHash } from 'crypto'

// CSRF令牌名称
const CSRF_TOKEN_NAME = 'nostudy_csrf_token'
// CSRF令牌过期时间（1小时）
const CSRF_TOKEN_EXPIRE = 60 * 60 * 1000

/**
 * 验证CSRF令牌
 */
async function validateCsrfToken(token: string): Promise<boolean> {
  // 从cookie中获取令牌
  const cookieStore = await cookies()
  const cookieToken = cookieStore.get(CSRF_TOKEN_NAME)

  // 如果没有令牌，验证失败
  if (!cookieToken) {
    return false
  }

  // 解析令牌和时间戳
  const [_, timestampStr] = cookieToken.value.split('.')
  const timestamp = parseInt(timestampStr, 10)

  // 检查令牌是否过期
  if (Date.now() - timestamp > CSRF_TOKEN_EXPIRE) {
    // 删除过期令牌
    cookieStore.delete(CSRF_TOKEN_NAME)
    return false
  }

  // 计算预期的散列值
  const expectedToken = createHash('sha256')
    .update(cookieToken.value)
    .digest('hex')

  // 比较提供的令牌与预期的令牌
  return token === expectedToken
}

export async function POST(request: NextRequest) {
  try {
    // 验证CSRF令牌
    const csrfToken = request.headers.get('X-CSRF-Token')
    if (!csrfToken || !(await validateCsrfToken(csrfToken))) {
      return NextResponse.json({ error: 'Invalid CSRF token' }, { status: 403 })
    }

    const body = await request.json()
    const { email, password, rememberMe } = body

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 },
      )
    }

    try {
      // 使用Better Auth的API进行身份验证
      const response = await auth.api.signInEmail({
        body: {
          email,
          password,
          rememberMe: rememberMe || false,
        },
        asResponse: true, // 返回响应对象而不是数据
      })

      // 提取响应数据
      const responseData = await response.json()

      // 检查是否有错误
      if (!response.ok) {
        // 检查特定错误类型
        if (responseData.error?.includes('password')) {
          return NextResponse.json(
            { error: 'Invalid credentials' },
            { status: 401 },
          )
        } else if (
          responseData.error?.includes('verify') ||
          responseData.error?.includes('verification')
        ) {
          return NextResponse.json(
            { error: 'Email not verified' },
            { status: 403 },
          )
        } else {
          return NextResponse.json(
            { error: responseData.error || 'Authentication failed' },
            { status: response.status },
          )
        }
      }

      // 成功响应，传递原始响应数据
      return NextResponse.json(responseData)
    } catch (authError) {
      console.error('认证服务错误:', authError)
      return NextResponse.json(
        { error: 'Authentication service error' },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error('登录错误:', error)
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 },
    )
  }
}
