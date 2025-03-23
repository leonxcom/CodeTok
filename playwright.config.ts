import { defineConfig, devices } from '@playwright/test'

/**
 * 项目的Playwright配置
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './src/__tests__/e2e',
  /* 测试运行的最大超时 */
  timeout: 30 * 1000,
  /* 期望超时 */
  expect: {
    timeout: 5000,
  },
  /* 每个测试的并行、重试和超时行为 */
  fullyParallel: true,
  /* 失败重试 */
  retries: process.env.CI ? 2 : 0,
  /* 同时运行的测试工作线程数 */
  workers: process.env.CI ? 1 : undefined,
  /* 记者报告，可以是'html', 'json', 'dot' */
  reporter: [['html'], ['list']],
  /* 共享设置 */
  use: {
    /* 在每个测试上下文中自动收集所有跟踪 */
    trace: 'on-first-retry',
    /* 收集浏览器控制台输出 */
    launchOptions: {
      logger: {
        isEnabled: () => true,
        log: (name, severity, message) =>
          console.log(`${name} ${severity}: ${message}`),
      },
    },
    /* 在测试中捕获屏幕截图 */
    screenshot: 'only-on-failure',
    /* 测试前导航到的base URL */
    baseURL: process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:3000',
  },

  /* 运行特定项目的配置 */
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
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'mobile-safari',
      use: { ...devices['iPhone 12'] },
    },
  ],

  /* 本地开发web服务器 */
  webServer: {
    command: 'pnpm dev',
    port: 3000,
    reuseExistingServer: !process.env.CI,
    timeout: 60 * 1000,
  },
})
