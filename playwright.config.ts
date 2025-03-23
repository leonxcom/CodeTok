import { defineConfig, devices } from '@playwright/test'

/**
 * 项目的Playwright配置
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './src/__tests__/e2e',
  /* 每次测试最大运行时间 */
  timeout: 30 * 1000,
  /* 失败后重试次数 */
  retries: process.env.CI ? 2 : 0,
  /* 并行运行测试的工作线程数 */
  workers: process.env.CI ? 1 : undefined,
  /* 测试报告器 */
  reporter: 'html',
  /* 共享全局设置 */
  use: {
    /* 基础URL */
    baseURL: 'http://localhost:3000',
    /* 默认收集追踪 */
    trace: 'on-first-retry',
    /* 自动截图 */
    screenshot: 'only-on-failure',
  },

  /* 项目配置 */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    /* 移动端测试 */
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],

  /* 启动Web服务器 */
  webServer: {
    command: 'pnpm dev',
    port: 3000,
    reuseExistingServer: !process.env.CI,
  },
})
