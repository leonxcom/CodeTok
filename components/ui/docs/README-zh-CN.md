# UI组件迁移

本文档描述了本项目从HeroUI到Shadcn UI的迁移过程。

## 概述

UI组件迁移涉及将HeroUI组件转换为Shadcn UI核心组件。本文档概述了迁移过程、组件接口和使用模式。

## 组件

以下组件已从HeroUI迁移到Shadcn UI：

| 组件 | 状态 | 描述 | 导入路径 |
|-----------|--------|-------------|------------|
| Button (按钮) | ✅ 已迁移 | 主要操作组件 | `import { Button } from "@/components/ui/button"` |
| Input (输入框) | ✅ 已迁移 | 文本输入字段 | `import { Input } from "@/components/ui/input"` |
| Card (卡片) | ✅ 已迁移 | 容器组件 | `import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"` |
| Label (标签) | ✅ 已迁移 | 表单标签 | `import { Label } from "@/components/ui/label"` |
| Avatar (头像) | ✅ 已迁移 | 用户头像 | `import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"` |
| Dialog (对话框) | ✅ 已迁移 | 模态对话框 | `import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"` |
| Dropdown Menu (下拉菜单) | ✅ 已迁移 | 下拉菜单 | `import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"` |
| Form (表单) | ✅ 已迁移 | 带验证的表单组件 | `import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form"` |
| Navbar (导航栏) | ✅ 已迁移 | 导航栏 | `import { Navbar } from "@/components/ui/navbar"` |
| Switch (开关) | ✅ 已迁移 | 切换开关 | `import { Switch } from "@/components/ui/switch"` |
| Listbox (列表选择框) | ✅ 已迁移 | 选择组件 | `import { Listbox } from "@/components/ui/listbox"` |

## 使用示例

### Button组件

```tsx
import { Button } from "@/components/ui/button";

export function ButtonExample() {
  return (
    <div className="flex gap-2">
      <Button>默认</Button>
      <Button variant="destructive">危险</Button>
      <Button variant="outline">轮廓</Button>
      <Button variant="secondary">次要</Button>
      <Button variant="ghost">幽灵</Button>
      <Button variant="link">链接</Button>
    </div>
  );
}
```

### Form组件

```tsx
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  username: z.string().min(2).max(50),
});

export function FormExample() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>用户名</FormLabel>
              <FormControl>
                <Input placeholder="用户名" {...field} />
              </FormControl>
              <FormDescription>
                这是您公开展示的名称。
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">提交</Button>
      </form>
    </Form>
  );
}
```

## 迁移指南

从HeroUI迁移到Shadcn UI时，请按照以下步骤操作：

1. 使用PNPM安装必要的依赖项：
   ```bash
   pnpm add shadcn-ui
   ```

2. 使用Shadcn UI CLI添加组件：
   ```bash
   pnpm dlx shadcn-ui@latest add button
   ```

3. 更新组件文件中的导入：
   ```tsx
   // 之前
   import { Button } from "@heroui/button";
   
   // 之后
   import { Button } from "@/components/ui/button";
   ```

4. 根据Shadcn UI API调整组件属性。

5. 更新事件处理程序和样式以匹配Shadcn UI方法。

6. 在亮色和暗色模式下彻底测试组件。

## 主题配置

Shadcn UI主题在`styles/globals.css`中配置，使用CSS变量进行配色方案。主题遵循`components.json`中定义的"New York"风格。

## 可访问性

所有迁移的组件都保持或改进可访问性标准。主要特点包括：

- 适当的ARIA属性
- 键盘导航支持
- 焦点管理
- 颜色对比度合规

## 最佳实践

使用迁移后的UI组件时：

1. 使用Tailwind类进行样式设置
2. 利用变体系统进行组件变化
3. 保持事件处理程序的一致命名约定（例如，`handleClick`）
4. 实现适当的可访问性属性
5. 在亮色和暗色模式下测试组件

## 相关文件

- `components.json`：Shadcn UI配置
- `tailwind.config.js`：Tailwind CSS配置
- `styles/globals.css`：全局样式和主题变量
- `app/providers.tsx`：主题提供者设置 