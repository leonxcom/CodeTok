import '@testing-library/jest-dom/vitest'
import { beforeAll, afterEach, afterAll, vi } from 'vitest'
import { cleanup } from '@testing-library/react'

// 添加ResizeObserver模拟
class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

// @ts-ignore - 忽略类型错误，这只是测试环境
global.ResizeObserver = ResizeObserverMock as unknown as typeof ResizeObserver

// 添加IntersectionObserver模拟
const mockIntersectionObserver = vi.fn()
mockIntersectionObserver.mockReturnValue({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
  takeRecords: vi.fn(),
  root: null,
  rootMargin: '',
  thresholds: [],
})

// @ts-ignore - 忽略类型错误，这只是测试环境
global.IntersectionObserver = mockIntersectionObserver

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
