import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { token } = body

    if (!token) {
      return NextResponse.json(
        { error: 'Verification token is required' },
        { status: 400 },
      )
    }

    // Use Better Auth API to verify email
    const response = await auth.api.verifyEmail({
      query: {
        token,
      },
      asResponse: true,
    })

    // 返回响应
    return response
  } catch (error) {
    console.error('邮箱验证错误:', error)
    return NextResponse.json(
      { error: 'Email verification failed' },
      { status: 500 },
    )
  }
}
