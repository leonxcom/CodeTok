import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { SignInForm } from '@/components/auth/SignInForm'
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'

// 模拟 next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
  useSearchParams: () => ({
    get: vi.fn(),
  }),
}))

// 创建测试标签
const mockLabels = {
  signIn: '登录',
  email: '邮箱',
  password: '密码',
  forgotPassword: '忘记密码？',
  rememberMe: '记住我',
  noAccount: '还没有账号？',
  signUp: '注册',
  signingIn: '登录中...',
  errorTitle: '登录失败',
}

describe('SignInForm', () => {
  // 在每个测试前重置所有模拟
  beforeEach(() => {
    vi.clearAllMocks()

    // 模拟 fetch
    global.fetch = vi.fn()
  })

  // 在所有测试后还原所有模拟
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('渲染包含所有元素的登录表单', () => {
    render(<SignInForm locale="zh" labels={mockLabels} />)

    // 检查标题、输入字段和按钮是否存在
    expect(
      screen.getByRole('heading', { name: new RegExp(mockLabels.signIn, 'i') }),
    ).toBeInTheDocument()
    expect(
      screen.getByLabelText(new RegExp(mockLabels.email, 'i')),
    ).toBeInTheDocument()
    expect(
      screen.getByLabelText(new RegExp(mockLabels.password, 'i')),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: new RegExp(mockLabels.signIn, 'i') }),
    ).toBeInTheDocument()

    // 检查其他元素是否存在
    expect(
      screen.getByText(new RegExp(mockLabels.rememberMe, 'i')),
    ).toBeInTheDocument()
    expect(
      screen.getByText(new RegExp(mockLabels.forgotPassword, 'i')),
    ).toBeInTheDocument()
    expect(
      screen.getByText(new RegExp(mockLabels.noAccount, 'i')),
    ).toBeInTheDocument()
    expect(
      screen.getByText(new RegExp(mockLabels.signUp, 'i')),
    ).toBeInTheDocument()
  })

  it('验证表单输入', async () => {
    render(<SignInForm locale="zh" labels={mockLabels} />)

    // 不填写直接提交
    fireEvent.click(
      screen.getByRole('button', { name: new RegExp(mockLabels.signIn, 'i') }),
    )

    // 期望出现验证错误
    await waitFor(() => {
      // 检查是否显示错误信息（实际错误消息取决于组件内的验证逻辑）
      expect(
        screen.getByText(/邮箱是必填项/i) || screen.getByText(/请输入邮箱/i),
      ).toBeInTheDocument()
      expect(
        screen.getByText(/密码是必填项/i) || screen.getByText(/请输入密码/i),
      ).toBeInTheDocument()
    })
  })

  it('处理表单提交成功', async () => {
    // 模拟成功响应
    ;(global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        user: { id: '123', email: 'test@example.com' },
      }),
    })

    render(
      <SignInForm locale="zh" labels={mockLabels} callbackUrl="/dashboard" />,
    )

    // 填写表单
    fireEvent.change(screen.getByLabelText(new RegExp(mockLabels.email, 'i')), {
      target: { value: 'test@example.com' },
    })
    fireEvent.change(
      screen.getByLabelText(new RegExp(mockLabels.password, 'i')),
      {
        target: { value: 'Password123!' },
      },
    )

    // 提交表单
    fireEvent.click(
      screen.getByRole('button', { name: new RegExp(mockLabels.signIn, 'i') }),
    )

    // 验证 fetch 是否被正确调用
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1)
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/auth/signin',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
          }),
          body: JSON.stringify({
            email: 'test@example.com',
            password: 'Password123!',
            rememberMe: false,
          }),
        }),
      )
    })
  })

  it('处理表单提交失败', async () => {
    // 模拟失败响应
    ;(global.fetch as any).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'Invalid credentials' }),
    })

    render(<SignInForm locale="zh" labels={mockLabels} />)

    // 填写表单
    fireEvent.change(screen.getByLabelText(new RegExp(mockLabels.email, 'i')), {
      target: { value: 'test@example.com' },
    })
    fireEvent.change(
      screen.getByLabelText(new RegExp(mockLabels.password, 'i')),
      {
        target: { value: 'WrongPassword123!' },
      },
    )

    // 提交表单
    fireEvent.click(
      screen.getByRole('button', { name: new RegExp(mockLabels.signIn, 'i') }),
    )

    // 验证错误消息是否显示
    await waitFor(() => {
      expect(
        screen.getByText(/Invalid credentials/i) ||
          screen.getByText(/登录失败/i),
      ).toBeInTheDocument()
    })
  })

  it('记住我选项正确工作', async () => {
    // 模拟成功响应
    ;(global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        user: { id: '123', email: 'test@example.com' },
      }),
    })

    render(<SignInForm locale="zh" labels={mockLabels} />)

    // 填写表单
    fireEvent.change(screen.getByLabelText(new RegExp(mockLabels.email, 'i')), {
      target: { value: 'test@example.com' },
    })
    fireEvent.change(
      screen.getByLabelText(new RegExp(mockLabels.password, 'i')),
      {
        target: { value: 'Password123!' },
      },
    )

    // 勾选"记住我"选项
    fireEvent.click(screen.getByText(new RegExp(mockLabels.rememberMe, 'i')))

    // 提交表单
    fireEvent.click(
      screen.getByRole('button', { name: new RegExp(mockLabels.signIn, 'i') }),
    )

    // 验证 fetch 是否包含 rememberMe: true
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/auth/signin',
        expect.objectContaining({
          body: JSON.stringify({
            email: 'test@example.com',
            password: 'Password123!',
            rememberMe: true,
          }),
        }),
      )
    })
  })
})
