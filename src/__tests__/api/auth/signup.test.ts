import { NextRequest, NextResponse } from 'next/server'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { POST } from '@/app/api/auth/signup/route'

// 模拟 auth 库
vi.mock('@/lib/auth', () => ({
  auth: {
    api: {
      signUpEmail: vi.fn(),
    },
  },
}))

// 导入模拟的 auth
import { auth } from '@/lib/auth'

describe('注册 API', () => {
  // 在每个测试前重置所有模拟
  beforeEach(() => {
    vi.clearAllMocks()
  })

  // 在所有测试后还原所有模拟
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('当缺少必要字段时应返回 400', async () => {
    // 测试缺少邮箱
    const requestNoEmail = new NextRequest(
      'http://localhost:3000/api/auth/signup',
      {
        method: 'POST',
        body: JSON.stringify({
          password: 'Password123!',
          name: 'Test User',
        }),
      },
    )

    const responseNoEmail = await POST(requestNoEmail)
    const dataNoEmail = await responseNoEmail.json()

    expect(responseNoEmail.status).toBe(400)
    expect(dataNoEmail).toHaveProperty(
      'error',
      'Email, password and name are required',
    )

    // 测试缺少密码
    const requestNoPassword = new NextRequest(
      'http://localhost:3000/api/auth/signup',
      {
        method: 'POST',
        body: JSON.stringify({
          email: 'test@example.com',
          name: 'Test User',
        }),
      },
    )

    const responseNoPassword = await POST(requestNoPassword)
    expect(responseNoPassword.status).toBe(400)

    // 测试缺少姓名
    const requestNoName = new NextRequest(
      'http://localhost:3000/api/auth/signup',
      {
        method: 'POST',
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'Password123!',
        }),
      },
    )

    const responseNoName = await POST(requestNoName)
    expect(responseNoName.status).toBe(400)
  })

  it('当注册成功时应返回用户数据', async () => {
    // 模拟 auth.api.signUpEmail 返回成功
    const mockResponseData = {
      success: true,
      user: {
        id: '123',
        email: 'test@example.com',
        name: 'Test User',
      },
    }
    ;(auth.api.signUpEmail as any).mockResolvedValueOnce(
      NextResponse.json(mockResponseData, { status: 200 }),
    )

    // 创建请求对象
    const request = new NextRequest('http://localhost:3000/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'Password123!',
        name: 'Test User',
      }),
    })

    // 调用 API 路由处理函数
    const response = await POST(request)
    const responseData = await response.json()

    // 验证响应
    expect(response.status).toBe(200)
    expect(responseData).toEqual(mockResponseData)

    // 验证 auth.api.signUpEmail 被正确调用
    expect(auth.api.signUpEmail).toHaveBeenCalledWith({
      body: {
        email: 'test@example.com',
        password: 'Password123!',
        name: 'Test User',
      },
      asResponse: true,
    })
  })

  it('当注册失败时应返回错误', async () => {
    // 模拟 auth.api.signUpEmail 返回错误
    ;(auth.api.signUpEmail as any).mockResolvedValueOnce(
      NextResponse.json({ error: 'Email already exists' }, { status: 409 }),
    )

    // 创建请求对象
    const request = new NextRequest('http://localhost:3000/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify({
        email: 'existing@example.com',
        password: 'Password123!',
        name: 'Existing User',
      }),
    })

    // 调用 API 路由处理函数
    const response = await POST(request)

    // 验证响应
    expect(response.status).toBe(409)
    expect(await response.json()).toHaveProperty(
      'error',
      'Email already exists',
    )
  })

  it('当抛出异常时应返回 500 错误', async () => {
    // 模拟 auth.api.signUpEmail 抛出异常
    ;(auth.api.signUpEmail as any).mockRejectedValueOnce(
      new Error('Server error'),
    )

    // 创建请求对象
    const request = new NextRequest('http://localhost:3000/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'Password123!',
        name: 'Test User',
      }),
    })

    // 调用 API 路由处理函数
    const response = await POST(request)
    const responseData = await response.json()

    // 验证响应
    expect(response.status).toBe(500)
    expect(responseData).toHaveProperty('error', 'Registration failed')
  })
})
