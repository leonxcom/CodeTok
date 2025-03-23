import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, name } = body

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Email, password and name are required' },
        { status: 400 },
      )
    }

    // 使用Better Auth的API进行用户注册
    const response = await auth.api.signUpEmail({
      body: {
        email,
        password,
        name,
        // 可添加其他用户信息
      },
      asResponse: true, // 返回响应对象而不是数据
    })

    // 返回响应
    return response
  } catch (error) {
    console.error('注册错误:', error)
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 })
  }
}
