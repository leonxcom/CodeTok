# 移动导航组件

一个针对移动设备优化的响应式导航组件，基于 Shadcn UI 和 Next.js 构建。

## 概述

移动导航组件在较小屏幕上（低于 md 断点）显示一个可折叠的菜单按钮，点击后展开显示下拉菜单中的导航链接。该组件旨在为移动设备提供更好的导航体验，同时保持与整体 UI 设计的一致性。

## 特点

- 仅在移动屏幕上显示的响应式设计
- 带下拉导航的可折叠菜单
- 国际化支持
- 为屏幕阅读器提供的无障碍功能
- 与网站页头的无缝集成

## API

```typescript
interface MobileNavProps {
  items?: NavItem[] // 导航项列表
  locale: Locale // 当前语言环境
}
```

其中 `NavItem` 定义为：

```typescript
interface NavItem {
  title: string // 导航项标题
  href?: string // 导航项链接
  disabled?: boolean // 是否禁用
}
```

## 使用方式

```tsx
import { MobileNav } from '@/components/mobile-nav'

export function SiteHeader({ locale }) {
  // ...
  return (
    <header>
      {/* ... */}
      <MobileNav items={siteConfig.mainNav} locale={locale} />
    </header>
  )
}
```

## 实现细节

该组件使用：

- "use client" 指令用于支持客户端渲染
- React hooks (useState) 用于管理组件状态
- Shadcn UI 组件 (Button, DropdownMenu) 用于 UI
- 基于当前语言环境的动态文本
- 通过 Tailwind CSS 基于屏幕尺寸的条件显示

## 最佳实践

使用此组件时：

1. 始终传递当前语言环境以确保正确的翻译
2. 与 MainNav 组件一起使用，以提供完整的导航解决方案
3. 将其放置在网站页头内以保持一致的定位
4. 确保 MainNav 和 MobileNav 之间的导航项保持一致
