# Shadcn UI 组件开发

本目录包含了项目中集成的所有 Shadcn UI 组件。本文档提供了开发和自定义的指南。

## 添加新组件

要添加新的 Shadcn UI 组件，请使用 shadcn CLI：

```bash
pnpm dlx shadcn@latest add <组件名称>
```

CLI 会将组件文件放置在此目录中。请注意，我们的项目使用了自定义设置，组件安装到 `src/components/shadcnui` 而不是默认的 `src/components/ui`。

## 组件结构

大多数 Shadcn UI 组件遵循类似的结构：

1. **导入依赖**：Radix UI 原语、样式工具、类型
2. **定义类型**：组件属性接口
3. **定义变体**：使用 `cva` 定义样式变体
4. **组件实现**：主要组件函数
5. **导出子组件**：如果组件有多个部分（如 Dialog）

示例：

```tsx
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

// 类型
export interface ButtonProps extends 
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

// 变体
export const buttonVariants = cva("...", {
  variants: { ... },
  defaultVariants: { ... }
})

// 组件实现
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({...}) => {
  // 实现
})
Button.displayName = "Button"
```

## 自定义指南

自定义组件时，请遵循以下指南以保持一致性：

### 1. 样式自定义

- 在 `cva` 配置中修改变体
- 对于全局样式更改，调整 Tailwind 配置
- 对于组件特定更改，修改组件的 CSS 类
- 使用 `cn()` 工具合并类

示例：

```tsx
export const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        // 添加新变体
        custom: "bg-orange-500 text-white hover:bg-orange-600",
      },
      // 其他变体...
    },
  }
)
```

### 2. 功能自定义

- 添加新属性以扩展组件功能
- 对于复杂自定义需求，使用组合
- 保持原始组件 API 的兼容性

示例：

```tsx
export interface CustomButtonProps extends ButtonProps {
  customProp?: boolean
}

export const CustomButton = React.forwardRef<HTMLButtonElement, CustomButtonProps>(
  ({ customProp, ...props }, ref) => {
    // 基于 customProp 的自定义逻辑
    return <Button ref={ref} {...props} />
  }
)
CustomButton.displayName = "CustomButton"
```

## 无障碍性考虑

开发或自定义组件时：

1. 确保键盘导航正常工作
2. 维护 ARIA 属性和角色
3. 保留焦点管理
4. 使用屏幕阅读器测试
5. 遵循颜色对比度指南

## 测试组件

彻底测试组件：

1. **功能测试**：确保所有功能正常工作
2. **视觉测试**：检查不同状态下的外观
3. **无障碍性测试**：验证无障碍性功能
4. **响应式测试**：在不同屏幕尺寸上测试

## 组件集成

将 Shadcn UI 组件集成到应用程序时：

1. 对于简单组件，使用直接导入方法
2. 对于复杂组件，使用 `@/lib/ui` 的命名空间导入
3. 对于复杂表单，使用 Form 组件与 React Hook Form
4. 对于数据表格，使用增强型 DataTable 组件

## 常见问题排查

### 样式问题

如果样式未正确应用：
- 检查 Tailwind 类是否正确
- 验证是否正确使用 `cn()` 工具
- 确保组件未被更具体的 CSS 覆盖

### 功能问题

对于功能问题：
- 检查是否传递了正确的属性
- 验证正确的组件组合
- 查找与误用 Radix 原语相关的控制台错误

## 性能优化

为了获得更好的性能：
- 适当时记忆化组件
- 对较大组件使用懒加载
- 注意昂贵的重新渲染

## 文档

添加或显著修改组件时：
1. 更新组件的 JSDoc 注释
2. 必要时更新 README
3. 在注释或文档中添加使用示例

## 其他资源

- [Shadcn UI 文档](https://ui.shadcn.com)
- [Radix UI 文档](https://www.radix-ui.com)
- [Tailwind CSS 文档](https://tailwindcss.com/docs)
- [Class Variance Authority 文档](https://cva.style/docs) 