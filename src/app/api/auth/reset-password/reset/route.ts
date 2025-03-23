import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { token, password } = body

    if (!token || !password) {
      return NextResponse.json(
        { error: 'Token and password are required' },
        { status: 400 },
      )
    }

    // 使用Better Auth的API重置密码
    const response = await auth.api.resetPassword({
      body: {
        token,
        newPassword: password,
      },
      asResponse: true,
    })

    // 返回响应
    return response
  } catch (error) {
    console.error('密码重置错误:', error)
    return NextResponse.json(
      { error: 'Failed to reset password' },
      { status: 500 },
    )
  }
}
