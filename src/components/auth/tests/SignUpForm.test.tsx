import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import { vi, describe, test, expect, beforeEach } from 'vitest'
import userEvent from '@testing-library/user-event'
import { SignUpForm } from '@/components/auth/SignUpForm'

// 模拟路由导航
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
  }),
}))

// 注册验证函数模拟
const mockSignUp = vi.fn()
vi.mock('@/lib/auth', () => ({
  signUp: (...args: any[]) => mockSignUp(...args),
}))

// 模拟toast通知
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}))

describe('SignUpForm', () => {
  beforeEach(() => {
    mockSignUp.mockReset()
  })

  test('渲染包含所有元素的注册表单', () => {
    render(<SignUpForm />)

    // 检查表单元素是否正确渲染
    expect(screen.getByLabelText(/邮箱/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/密码/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/确认密码/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /注册/i })).toBeInTheDocument()
    expect(screen.getByText(/已有账号/i)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /登录/i })).toBeInTheDocument()
  })

  test('表单验证功能', async () => {
    const user = userEvent.setup()
    render(<SignUpForm />)

    // 不填表单直接提交
    await user.click(screen.getByRole('button', { name: /注册/i }))

    // 检查错误提示
    await waitFor(() => {
      expect(screen.getByText(/邮箱是必填项/i)).toBeInTheDocument()
      expect(screen.getByText(/密码是必填项/i)).toBeInTheDocument()
    })

    // 填写无效邮箱
    await user.type(screen.getByLabelText(/邮箱/i), 'invalid-email')
    await user.click(screen.getByRole('button', { name: /注册/i }))

    await waitFor(() => {
      expect(screen.getByText(/请输入有效的邮箱地址/i)).toBeInTheDocument()
    })

    // 填写不匹配的密码
    await user.clear(screen.getByLabelText(/邮箱/i))
    await user.type(screen.getByLabelText(/邮箱/i), 'valid@example.com')
    await user.type(screen.getByLabelText(/密码/i), 'Password123!')
    await user.type(screen.getByLabelText(/确认密码/i), 'DifferentPassword123!')
    await user.click(screen.getByRole('button', { name: /注册/i }))

    await waitFor(() => {
      expect(screen.getByText(/两次输入的密码不一致/i)).toBeInTheDocument()
    })
  })

  test('处理表单提交成功', async () => {
    mockSignUp.mockResolvedValue({ success: true })

    const user = userEvent.setup()
    render(<SignUpForm />)

    // 正确填写表单
    await user.type(screen.getByLabelText(/邮箱/i), 'test@example.com')
    await user.type(screen.getByLabelText(/密码/i), 'Password123!')
    await user.type(screen.getByLabelText(/确认密码/i), 'Password123!')

    // 提交表单
    await user.click(screen.getByRole('button', { name: /注册/i }))

    // 检查注册函数是否被调用
    await waitFor(() => {
      expect(mockSignUp).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'Password123!',
      })
    })
  })

  test('处理表单提交失败', async () => {
    mockSignUp.mockResolvedValue({
      success: false,
      error: '该邮箱已被注册',
    })

    const user = userEvent.setup()
    render(<SignUpForm />)

    // 填写表单
    await user.type(screen.getByLabelText(/邮箱/i), 'existing@example.com')
    await user.type(screen.getByLabelText(/密码/i), 'Password123!')
    await user.type(screen.getByLabelText(/确认密码/i), 'Password123!')

    // 提交表单
    await user.click(screen.getByRole('button', { name: /注册/i }))

    // 检查错误消息
    await waitFor(() => {
      expect(screen.getByText(/该邮箱已被注册/i)).toBeInTheDocument()
    })
  })
})
