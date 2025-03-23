import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    // 使用Better Auth的API退出登录
    const response = await auth.api.signOut({
      headers: request.headers,
      asResponse: true,
    })

    // 返回响应
    return response
  } catch (error) {
    console.error('退出登录错误:', error)
    return NextResponse.json({ error: 'Sign out failed' }, { status: 500 })
  }
}
