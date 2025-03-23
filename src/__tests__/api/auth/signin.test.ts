import { NextRequest, NextResponse } from 'next/server'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { POST } from '@/app/api/auth/signin/route'

// 模拟 auth 库
vi.mock('@/lib/auth', () => ({
  auth: {
    api: {
      signInEmail: vi.fn(),
    },
  },
}))

// 导入模拟的 auth
import { auth } from '@/lib/auth'

describe('登录 API', () => {
  // 在每个测试前重置所有模拟
  beforeEach(() => {
    vi.clearAllMocks()
  })

  // 在所有测试后还原所有模拟
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('当缺少邮箱或密码时应返回 400', async () => {
    // 创建请求对象
    const request = new NextRequest('http://localhost:3000/api/auth/signin', {
      method: 'POST',
      body: JSON.stringify({}),
    })

    // 调用 API 路由处理函数
    const response = await POST(request)
    const responseData = await response.json()

    // 验证响应
    expect(response.status).toBe(400)
    expect(responseData).toHaveProperty(
      'error',
      'Email and password are required',
    )
  })

  it('当身份验证失败时应返回错误', async () => {
    // 模拟 auth.api.signInEmail 返回错误
    ;(auth.api.signInEmail as any).mockResolvedValueOnce(
      NextResponse.json({ error: 'Invalid credentials' }, { status: 401 }),
    )

    // 创建请求对象
    const request = new NextRequest('http://localhost:3000/api/auth/signin', {
      method: 'POST',
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'wrongpassword',
      }),
    })

    // 调用 API 路由处理函数
    const response = await POST(request)

    // 验证响应
    expect(response.status).toBe(401)
    expect(await response.json()).toHaveProperty('error', 'Invalid credentials')

    // 验证 auth.api.signInEmail 被正确调用
    expect(auth.api.signInEmail).toHaveBeenCalledWith({
      body: {
        email: 'test@example.com',
        password: 'wrongpassword',
        rememberMe: false,
      },
      asResponse: true,
    })
  })

  it('当身份验证成功时应返回用户数据', async () => {
    // 模拟 auth.api.signInEmail 返回成功
    const mockResponseData = {
      success: true,
      user: {
        id: '123',
        email: 'test@example.com',
      },
    }
    ;(auth.api.signInEmail as any).mockResolvedValueOnce(
      NextResponse.json(mockResponseData, { status: 200 }),
    )

    // 创建请求对象
    const request = new NextRequest('http://localhost:3000/api/auth/signin', {
      method: 'POST',
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'Password123!',
        rememberMe: true,
      }),
    })

    // 调用 API 路由处理函数
    const response = await POST(request)
    const responseData = await response.json()

    // 验证响应
    expect(response.status).toBe(200)
    expect(responseData).toEqual(mockResponseData)

    // 验证 auth.api.signInEmail 被正确调用，并且 rememberMe 参数被传递
    expect(auth.api.signInEmail).toHaveBeenCalledWith({
      body: {
        email: 'test@example.com',
        password: 'Password123!',
        rememberMe: true,
      },
      asResponse: true,
    })
  })

  it('当抛出异常时应返回 500 错误', async () => {
    // 模拟 auth.api.signInEmail 抛出异常
    ;(auth.api.signInEmail as any).mockRejectedValueOnce(
      new Error('Server error'),
    )

    // 创建请求对象
    const request = new NextRequest('http://localhost:3000/api/auth/signin', {
      method: 'POST',
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'Password123!',
      }),
    })

    // 调用 API 路由处理函数
    const response = await POST(request)
    const responseData = await response.json()

    // 验证响应
    expect(response.status).toBe(500)
    expect(responseData).toHaveProperty('error', 'Authentication failed')
  })
})
