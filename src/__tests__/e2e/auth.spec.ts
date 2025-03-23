import { test, expect } from '@playwright/test'

/**
 * 认证模块端到端测试
 */
test.describe('认证流程', () => {
  // 在每个测试前访问首页
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('用户应该能够注册', async ({ page }) => {
    // 点击注册按钮
    await page.getByRole('link', { name: '注册' }).click()

    // 填写注册表单
    await page.getByLabel('邮箱').fill('test@example.com')
    await page.getByLabel('密码').fill('Password123!')
    await page.getByLabel('确认密码').fill('Password123!')

    // 提交表单
    await page.getByRole('button', { name: '注册' }).click()

    // 验证成功信息
    await expect(page.getByText('验证邮件已发送')).toBeVisible()
  })

  test('用户应该能够登录', async ({ page }) => {
    // 点击登录按钮
    await page.getByRole('link', { name: '登录' }).click()

    // 填写登录表单
    await page.getByLabel('邮箱').fill('test@example.com')
    await page.getByLabel('密码').fill('Password123!')

    // 提交表单
    await page.getByRole('button', { name: '登录' }).click()

    // 验证登录成功
    await expect(page.getByText('欢迎回来')).toBeVisible()
  })

  test('用户应该能够请求密码重置', async ({ page }) => {
    // 点击登录按钮
    await page.getByRole('link', { name: '登录' }).click()

    // 点击忘记密码链接
    await page.getByText('忘记密码?').click()

    // 填写邮箱
    await page.getByLabel('邮箱').fill('test@example.com')

    // 提交表单
    await page.getByRole('button', { name: '发送重置链接' }).click()

    // 验证成功信息
    await expect(page.getByText('重置链接已发送到您的邮箱')).toBeVisible()
  })

  test('用户应该能够验证邮箱', async ({ page }) => {
    // 模拟访问验证链接
    await page.goto('/verify-email?token=test-token')

    // 验证成功信息
    await expect(page.getByText('邮箱验证成功')).toBeVisible()
  })
})

test.describe('响应式设计测试', () => {
  test('认证表单在移动设备上应正确显示', async ({ page }) => {
    // 设置移动设备尺寸
    await page.setViewportSize({ width: 375, height: 667 })

    // 访问登录页面
    await page.goto('/login')

    // 验证表单元素的布局
    await expect(page.getByRole('form')).toBeVisible()

    // 验证没有水平滚动条
    const pageWidth = await page.evaluate(
      () => document.documentElement.scrollWidth,
    )
    const viewportWidth = await page.evaluate(() => window.innerWidth)

    expect(pageWidth).toBeLessThanOrEqual(viewportWidth)
  })
})
