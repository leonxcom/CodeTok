# Magic UI组件

本文档描述了我们项目的增强交互式UI组件(Magic UI)。

## 概述

Magic UI组件提供增强的交互效果和动画，以改善用户体验。这些组件构建在核心UI组件之上，添加了类似魔法的交互行为。

## 组件

| 组件 | 状态 | 描述 | 导入路径 |
|-----------|--------|-------------|------------|
| Hover (悬停效果) | ✅ 已实现 | 具有增强悬停效果的组件 | `import { Hover } from "@/components/magic/hover"` |
| Spotlight (聚光灯) | 🔄 计划中 | 带聚光灯效果的组件 | 即将推出 |
| Glow (发光) | 🔄 计划中 | 带发光效果的组件 | 即将推出 |
| Fade (淡入淡出) | 🔄 计划中 | 带淡入/淡出动画的组件 | 即将推出 |
| Typewriter (打字机) | 🔄 计划中 | 带打字机效果的文本 | 即将推出 |

## 使用示例

### Hover组件

Hover组件在用户悬停在元素上时添加一个微妙的交互效果。它以最小的努力创造更具吸引力的用户体验。

```tsx
import { Hover } from "@/components/magic/hover";

export function HoverExample() {
  return (
    <Hover className="p-4 bg-background rounded-lg border">
      <p>悬停在我上面查看魔法效果！</p>
    </Hover>
  );
}
```

#### 属性

| 属性 | 类型 | 默认值 | 描述 |
|------|------|---------|-------------|
| className | string | "" | 额外的CSS类 |
| children | ReactNode | 必填 | 要显示的内容 |
| variant | "subtle" \| "emphasis" | "subtle" | 效果强度 |
| radius | number | 500 | 效果半径 |
| intensity | number | 0.2 | 效果强度(0-1) |
| borderWidth | number | 1 | 悬停时的边框宽度 |
| duration | number | 200 | 动画持续时间(毫秒) |

## 实现指南

实现新的Magic UI组件时，请遵循以下指南：

1. 使用PNPM安装必要的依赖项：
   ```bash
   pnpm add framer-motion
   ```

2. 在`components/magic`目录中创建新文件。

3. 导入所需库：
   ```tsx
   import React from "react";
   import { motion } from "framer-motion";
   import { cn } from "@/lib/utils";
   ```

4. 使用适当的动画和效果实现组件。

5. 导出具有有意义名称的组件。

6. 记录组件的属性和用法。

## 可访问性考虑

创建Magic UI组件时，确保它们：

1. 在启用减少动画时可以正常工作
2. 不仅仅依靠悬停进行重要交互
3. 保持适当的对比度
4. 支持键盘导航
5. 包含适当的ARIA属性

## 最佳实践

1. 优先选择微妙的效果而非华丽的效果
2. 确保动画流畅且高效
3. 通过变体使效果可选
4. 在不同设备和屏幕尺寸上测试
5. 确保组件在不支持高级CSS功能的浏览器中优雅降级

## 相关文件

- `lib/utils.ts`：类名合并的实用函数
- `components/ui/*`：核心UI组件
- `styles/globals.css`：全局样式和动画 