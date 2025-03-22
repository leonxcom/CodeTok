# 组件开发指南

本文档概述了 Nostudy.ai 项目中组件开发的标准和最佳实践。

## 组件结构

### 简单组件

对于简单的单文件组件：

```
src/components/
└── component-name.tsx
```

### 复杂组件

对于包含多个文件的复杂组件：

```
src/components/
└── component-name/
    ├── index.tsx       # 主组件导出
    ├── sub-component.tsx  # 需要时的子组件
    ├── utils.ts        # 组件特定的工具函数
    ├── README.md       # 英文文档
    └── README-zh-CN.md # 中文文档
```

## 文档要求

每个组件或组件目录必须包含：

1. **英文文档** (README.md)：

   - 组件概述
   - API/Props 接口
   - 使用示例
   - 实现细节
   - 最佳实践

2. **中文文档** (README-zh-CN.md)：
   - 与英文文档相同的结构，翻译成中文

## 编码标准

### 一般指南

- 所有组件使用 TypeScript
- 包含适当的 props 类型定义
- 为复杂函数添加 JSDoc 注释
- 遵循 DRY（不要重复自己）原则
- 保持组件专注于单一职责

### 命名约定

- **组件**：PascalCase（例如，`ButtonGroup`）
- **文件**：kebab-case（例如，`button-group.tsx`）
- **文件夹**：kebab-case（例如，`button-group/`）
- **事件处理程序**：camelCase 并带有 "handle" 前缀（例如，`handleClick`）
- **Props 接口**：PascalCase 并带有 "Props" 后缀（例如，`ButtonProps`）

### 组件结构

```tsx
// 导入
import * as React from 'react'
// ... 其他导入

// 类型
interface ComponentProps {
  // props 定义
}

// 组件
export function Component({ prop1, prop2 }: ComponentProps) {
  // 实现
  return (
    // JSX
  )
}
```

### 样式

- 使用 Tailwind CSS 进行样式设计
- 遵循项目的设计系统（Shadcn UI + MagicUI）
- 使用 `cn()` 工具函数处理条件类名
- 优先使用组合而非继承

### 无障碍性

- 包含适当的 ARIA 属性
- 确保键盘导航正常工作
- 支持焦点管理
- 添加适当的 `tabIndex` 值
- 在必要处包含屏幕阅读器文本

## 测试

对于复杂组件，考虑添加：

- 工具函数的单元测试
- UI 行为的组件测试
- UI 外观的快照测试

## 示例

### 按钮组件示例

```tsx
// button.tsx
import * as React from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'default',
      size = 'md',
      isLoading,
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <button
        className={cn(
          'rounded-md font-medium focus:outline-none focus:ring-2',
          // 变体样式
          variant === 'default' &&
            'bg-primary text-primary-foreground hover:bg-primary/90',
          variant === 'outline' &&
            'border border-input bg-background hover:bg-accent',
          variant === 'ghost' && 'hover:bg-accent hover:text-accent-foreground',
          // 尺寸样式
          size === 'sm' && 'h-8 px-3 text-xs',
          size === 'md' && 'h-10 px-4 text-sm',
          size === 'lg' && 'h-12 px-6 text-base',
          // 加载状态
          isLoading && 'cursor-not-allowed opacity-70',
          className,
        )}
        ref={ref}
        disabled={isLoading}
        {...props}
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <span className="animate-spin">...</span>
            {children}
          </span>
        ) : (
          children
        )}
      </button>
    )
  },
)
Button.displayName = 'Button'
```
