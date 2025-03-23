import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import { vi, describe, test, expect, beforeEach } from 'vitest'
import userEvent from '@testing-library/user-event'
import { PasswordResetForm } from '@/components/auth/PasswordResetForm'

// 模拟路由导航
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
  }),
}))

// 密码重置函数模拟
const mockResetPassword = vi.fn()
vi.mock('@/lib/auth', () => ({
  resetPassword: (...args: any[]) => mockResetPassword(...args),
}))

// 模拟toast通知
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}))

describe('PasswordResetForm', () => {
  beforeEach(() => {
    mockResetPassword.mockReset()
  })

  test('渲染包含所有元素的密码重置表单', () => {
    render(<PasswordResetForm />)

    // 检查表单元素是否正确渲染
    expect(screen.getByLabelText(/邮箱/i)).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /发送重置链接/i }),
    ).toBeInTheDocument()
    expect(screen.getByText(/返回登录/i)).toBeInTheDocument()
  })

  test('表单验证功能', async () => {
    const user = userEvent.setup()
    render(<PasswordResetForm />)

    // 不填表单直接提交
    await user.click(screen.getByRole('button', { name: /发送重置链接/i }))

    // 检查错误提示
    await waitFor(() => {
      expect(screen.getByText(/邮箱是必填项/i)).toBeInTheDocument()
    })

    // 填写无效邮箱
    await user.type(screen.getByLabelText(/邮箱/i), 'invalid-email')
    await user.click(screen.getByRole('button', { name: /发送重置链接/i }))

    await waitFor(() => {
      expect(screen.getByText(/请输入有效的邮箱地址/i)).toBeInTheDocument()
    })
  })

  test('处理表单提交成功', async () => {
    mockResetPassword.mockResolvedValue({ success: true })

    const user = userEvent.setup()
    render(<PasswordResetForm />)

    // 填写表单
    await user.type(screen.getByLabelText(/邮箱/i), 'test@example.com')

    // 提交表单
    await user.click(screen.getByRole('button', { name: /发送重置链接/i }))

    // 检查重置密码函数是否被调用
    await waitFor(() => {
      expect(mockResetPassword).toHaveBeenCalledWith({
        email: 'test@example.com',
      })
    })
  })

  test('处理表单提交失败', async () => {
    mockResetPassword.mockResolvedValue({
      success: false,
      error: '邮箱不存在',
    })

    const user = userEvent.setup()
    render(<PasswordResetForm />)

    // 填写表单
    await user.type(screen.getByLabelText(/邮箱/i), 'nonexistent@example.com')

    // 提交表单
    await user.click(screen.getByRole('button', { name: /发送重置链接/i }))

    // 检查错误消息
    await waitFor(() => {
      expect(screen.getByText(/邮箱不存在/i)).toBeInTheDocument()
    })
  })

  test('处理表单提交过程中的加载状态', async () => {
    // 创建一个可控的Promise
    let resolvePromise!: (value: any) => void
    const promise = new Promise((resolve) => {
      resolvePromise = resolve
    })

    mockResetPassword.mockReturnValue(promise)

    const user = userEvent.setup()
    render(<PasswordResetForm />)

    // 填写表单
    await user.type(screen.getByLabelText(/邮箱/i), 'test@example.com')

    // 提交表单
    await user.click(screen.getByRole('button', { name: /发送重置链接/i }))

    // 验证加载状态
    expect(screen.getByRole('button', { name: /发送中/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /发送中/i })).toBeDisabled()

    // 解决Promise
    resolvePromise({ success: true })

    // 验证加载状态结束
    await waitFor(() => {
      expect(
        screen.queryByRole('button', { name: /发送中/i }),
      ).not.toBeInTheDocument()
    })
  })
})
