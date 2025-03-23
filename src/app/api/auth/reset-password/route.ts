import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, locale } = body

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    // 使用Better Auth的API发送密码重置邮件
    const response = await auth.api.forgetPassword({
      body: {
        email,
        locale: locale || 'zh',
      },
      asResponse: true,
    })

    // 返回响应
    return response
  } catch (error) {
    console.error('发送重置邮件错误:', error)
    return NextResponse.json(
      { error: 'Failed to send reset email' },
      { status: 500 },
    )
  }
}
