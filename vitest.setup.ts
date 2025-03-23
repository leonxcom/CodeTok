import '@testing-library/jest-dom/vitest'
import { beforeAll, afterEach, afterAll, vi } from 'vitest'
import { cleanup } from '@testing-library/react'

// 在所有测试之前的全局设置
beforeAll(() => {
  // 禁用控制台错误来减少测试噪音
  vi.spyOn(console, 'error').mockImplementation(() => {})
})

// 在每个测试后清理
afterEach(() => {
  cleanup()
})

// 在所有测试之后的全局清理
afterAll(() => {
  vi.restoreAllMocks()
})
