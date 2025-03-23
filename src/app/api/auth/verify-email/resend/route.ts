import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, locale } = body

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    // 使用Better Auth的API重新发送验证邮件
    const response = await auth.api.sendVerificationEmail({
      body: {
        email,
        locale: locale || 'zh',
      },
      asResponse: true,
    })

    // 返回响应
    return response
  } catch (error) {
    console.error('重新发送验证邮件错误:', error)
    return NextResponse.json(
      { error: 'Failed to resend verification email' },
      { status: 500 },
    )
  }
}
