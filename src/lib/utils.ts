import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * 合并多个类名，并使用 tailwind-merge 解决类名冲突
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// 生成项目URL的辅助函数
export function getProjectUrl(projectId: string, locale: string = 'zh-cn'): string {
  return `/${locale}/project/${projectId}`;
}
