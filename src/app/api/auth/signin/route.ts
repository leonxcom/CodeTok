import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, rememberMe } = body

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 },
      )
    }

    // 使用Better Auth的API进行身份验证
    const response = await auth.api.signInEmail({
      body: {
        email,
        password,
        rememberMe: rememberMe || false,
      },
      asResponse: true, // 返回响应对象而不是数据
    })

    // 返回响应
    return response
  } catch (error) {
    console.error('登录错误:', error)
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 },
    )
  }
}
