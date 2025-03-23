import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import { vi, describe, test, expect, beforeEach } from 'vitest'
import { VerifyEmailForm } from '@/components/auth/VerifyEmailForm'

// 模拟路由导航和useSearchParams
const mockPush = vi.fn()
const mockGet = vi.fn()

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: vi.fn(),
  }),
  useSearchParams: () => ({
    get: mockGet,
  }),
}))

// 邮箱验证函数模拟
const mockVerifyEmail = vi.fn()
vi.mock('@/lib/auth', () => ({
  verifyEmail: (...args: any[]) => mockVerifyEmail(...args),
}))

// 模拟toast通知
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}))

describe('VerifyEmailForm', () => {
  beforeEach(() => {
    mockVerifyEmail.mockReset()
    mockPush.mockReset()
    mockGet.mockReset()
    vi.clearAllMocks()
  })

  test('成功验证邮箱时显示成功信息', async () => {
    // 模拟token参数
    mockGet.mockReturnValue('valid-token')

    // 模拟验证成功
    mockVerifyEmail.mockResolvedValue({ success: true })

    render(<VerifyEmailForm />)

    // 验证加载过程中显示加载状态
    expect(screen.getByText(/正在验证/i)).toBeInTheDocument()

    // 等待验证完成后显示成功信息
    await waitFor(() => {
      expect(screen.getByText(/验证成功/i)).toBeInTheDocument()
      expect(screen.getByText(/您的邮箱已成功验证/i)).toBeInTheDocument()
      expect(
        screen.getByRole('button', { name: /去登录/i }),
      ).toBeInTheDocument()
    })
  })

  test('验证失败时显示错误信息', async () => {
    // 模拟token参数
    mockGet.mockReturnValue('invalid-token')

    // 模拟验证失败
    mockVerifyEmail.mockResolvedValue({
      success: false,
      error: '验证链接已过期或无效',
    })

    render(<VerifyEmailForm />)

    // 等待验证完成后显示错误信息
    await waitFor(() => {
      expect(screen.getByText(/验证失败/i)).toBeInTheDocument()
      expect(screen.getByText(/验证链接已过期或无效/i)).toBeInTheDocument()
      expect(
        screen.getByRole('button', { name: /重新发送/i }),
      ).toBeInTheDocument()
    })
  })

  test('无token参数时显示错误信息', async () => {
    // 模拟无token参数
    mockGet.mockReturnValue(null)

    render(<VerifyEmailForm />)

    // 应该直接显示错误信息
    expect(screen.getByText(/验证失败/i)).toBeInTheDocument()
    expect(screen.getByText(/缺少验证令牌/i)).toBeInTheDocument()
  })

  test('点击去登录按钮导航到登录页面', async () => {
    // 模拟token参数
    mockGet.mockReturnValue('valid-token')

    // 模拟验证成功
    mockVerifyEmail.mockResolvedValue({ success: true })

    render(<VerifyEmailForm />)

    // 等待验证完成后显示成功信息
    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /去登录/i }),
      ).toBeInTheDocument()
    })

    // 点击去登录按钮
    screen.getByRole('button', { name: /去登录/i }).click()

    // 验证导航到登录页面
    expect(mockPush).toHaveBeenCalledWith('/login')
  })

  test('网络错误时显示错误信息', async () => {
    // 模拟token参数
    mockGet.mockReturnValue('valid-token')

    // 模拟网络错误
    mockVerifyEmail.mockRejectedValue(new Error('网络错误'))

    render(<VerifyEmailForm />)

    // 等待验证完成后显示错误信息
    await waitFor(() => {
      expect(screen.getByText(/验证失败/i)).toBeInTheDocument()
      expect(screen.getByText(/验证过程中发生错误/i)).toBeInTheDocument()
    })
  })
})
