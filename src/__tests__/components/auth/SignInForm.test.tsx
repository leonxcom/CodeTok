import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { vi, describe, test, expect, beforeEach } from 'vitest'
import userEvent from '@testing-library/user-event'
import { SignInForm } from '@/components/auth/SignInForm'

// 模拟路由导航
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
  }),
}))

// 登录验证函数模拟
const mockSignIn = vi.fn()
vi.mock('@/lib/auth', () => ({
  signIn: (...args: any[]) => mockSignIn(...args),
}))

// 模拟toast通知
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}))

describe('SignInForm', () => {
  beforeEach(() => {
    mockSignIn.mockReset()
  })

  test('渲染包含所有元素的登录表单', () => {
    render(<SignInForm />)

    // 检查表单元素是否正确渲染
    expect(screen.getByLabelText(/邮箱/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/密码/i)).toBeInTheDocument()
    expect(
      screen.getByRole('checkbox', { name: /记住我/i }),
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /登录/i })).toBeInTheDocument()
    expect(screen.getByText(/忘记密码/i)).toBeInTheDocument()
  })

  test('验证表单输入', async () => {
    const user = userEvent.setup()
    render(<SignInForm />)

    // 不填表单直接提交
    await user.click(screen.getByRole('button', { name: /登录/i }))

    // 等待验证消息出现
    await waitFor(() => {
      expect(screen.getByText(/邮箱是必填项/i)).toBeInTheDocument()
    })

    // 填写无效邮箱
    await user.type(screen.getByLabelText(/邮箱/i), 'invalid-email')
    await user.click(screen.getByRole('button', { name: /登录/i }))

    // 等待验证消息
    await waitFor(() => {
      expect(screen.getByText(/请输入有效的邮箱地址/i)).toBeInTheDocument()
    })
  })

  test('处理表单提交成功', async () => {
    mockSignIn.mockResolvedValue({ success: true })

    const user = userEvent.setup()
    render(<SignInForm />)

    // 填写表单
    await user.type(screen.getByLabelText(/邮箱/i), 'test@example.com')
    await user.type(screen.getByLabelText(/密码/i), 'password123')

    // 提交表单
    await user.click(screen.getByRole('button', { name: /登录/i }))

    // 检查登录函数是否被调用
    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
        remember: false,
      })
    })
  })

  test('处理表单提交失败', async () => {
    mockSignIn.mockResolvedValue({
      success: false,
      error: '邮箱或密码不正确',
    })

    const user = userEvent.setup()
    render(<SignInForm />)

    // 填写表单
    await user.type(screen.getByLabelText(/邮箱/i), 'test@example.com')
    await user.type(screen.getByLabelText(/密码/i), 'wrongpassword')

    // 提交表单
    await user.click(screen.getByRole('button', { name: /登录/i }))

    // 检查错误消息
    await waitFor(() => {
      expect(screen.getByText(/邮箱或密码不正确/i)).toBeInTheDocument()
    })
  })

  test('记住我选项正确工作', async () => {
    mockSignIn.mockResolvedValue({ success: true })

    const user = userEvent.setup()
    render(<SignInForm />)

    // 填写表单
    await user.type(screen.getByLabelText(/邮箱/i), 'test@example.com')
    await user.type(screen.getByLabelText(/密码/i), 'password123')

    // 勾选"记住我"
    await user.click(screen.getByRole('checkbox', { name: /记住我/i }))

    // 提交表单
    await user.click(screen.getByRole('button', { name: /登录/i }))

    // 检查登录函数是否被调用，并且remember参数为true
    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
        remember: true,
      })
    })
  })
})
