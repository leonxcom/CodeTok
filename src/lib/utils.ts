import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * 合并类名工具函数
 * 结合clsx和tailwind-merge的优点
 * 可以处理条件类名和合并tailwind类名
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * 延迟函数
 * @param ms 延迟毫秒数
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// 生成项目URL的辅助函数
export function getProjectUrl(projectId: string, locale: string = 'zh-cn'): string {
  return `/${locale}/project/${projectId}`;
}
