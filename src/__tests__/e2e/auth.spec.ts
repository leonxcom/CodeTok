import { test, expect } from '@playwright/test'

test.describe('认证系统', () => {
  test.beforeEach(async ({ page }) => {
    // 每个测试之前都访问首页
    await page.goto('/')
  })

  test('用户可以注册新账号', async ({ page }) => {
    // 生成随机电子邮件，以便测试不冲突
    const randomEmail = `test${Math.floor(Math.random() * 10000)}@example.com`

    // 导航到注册页
    await page.goto('/auth/signup')

    // 验证页面标题包含"注册"
    await expect(page.locator('h2')).toContainText(/注册|Sign up/i)

    // 填写注册表单
    await page.getByLabel(/name|姓名/i).fill('Test User')
    await page.getByLabel(/email|邮箱/i).fill(randomEmail)
    await page.getByLabel(/password|密码/i).fill('Password123!')
    await page.getByLabel(/confirm|确认密码/i).fill('Password123!')

    // 提交表单
    await page.getByRole('button', { name: /sign up|注册/i }).click()

    // 检查成功消息
    await expect(page.getByText(/success|成功/i)).toBeVisible({ timeout: 5000 })
  })

  test('用户使用无效凭据登录会显示错误', async ({ page }) => {
    // 导航到登录页
    await page.goto('/auth/signin')

    // 验证页面标题包含"登录"
    await expect(page.locator('h2')).toContainText(/sign in|登录/i)

    // 填写登录表单（使用错误的凭据）
    await page.getByLabel(/email|邮箱/i).fill('wrong@example.com')
    await page.getByLabel(/password|密码/i).fill('WrongPassword123!')

    // 提交表单
    await page.getByRole('button', { name: /sign in|登录/i }).click()

    // 检查错误消息
    await expect(page.getByText(/invalid|失败|错误/i)).toBeVisible({
      timeout: 5000,
    })
  })

  test('用户可以请求重置密码', async ({ page }) => {
    // 导航到密码重置页面
    await page.goto('/auth/reset-password')

    // 验证页面标题包含"重置密码"
    await expect(page.locator('h2')).toContainText(/reset password|重置密码/i)

    // 填写邮箱
    await page.getByLabel(/email|邮箱/i).fill('test@example.com')

    // 点击发送重置链接按钮
    await page.getByRole('button', { name: /send|发送/i }).click()

    // 检查成功消息
    await expect(page.getByText(/check|查看|邮件/i)).toBeVisible({
      timeout: 5000,
    })
  })

  test('验证令牌过期或无效会显示错误', async ({ page }) => {
    // 导航到带有无效令牌的验证页面
    await page.goto('/auth/verify-email?token=invalid-token')

    // 检查错误消息
    await expect(page.getByText(/failed|失败|错误|无效/i)).toBeVisible({
      timeout: 5000,
    })
  })

  test('响应式设计在移动设备上正常工作', async ({ page }) => {
    // 设置视窗大小为移动设备尺寸
    await page.setViewportSize({ width: 375, height: 667 })

    // 导航到登录页
    await page.goto('/auth/signin')

    // 验证页面标题在移动视图中可见
    await expect(page.locator('h2')).toBeVisible()

    // 验证表单元素适配了移动尺寸并保持可见
    await expect(page.getByLabel(/email|邮箱/i)).toBeVisible()
    await expect(page.getByLabel(/password|密码/i)).toBeVisible()
    await expect(
      page.getByRole('button', { name: /sign in|登录/i }),
    ).toBeVisible()
  })
})
