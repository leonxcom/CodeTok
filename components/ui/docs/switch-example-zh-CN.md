# Switch（开关）组件

Switch组件是一个允许用户在两种状态（开/关）之间切换的UI元素。

## 基本用法

```tsx
import { Switch } from "@/components/ui/switch";

export function SwitchDemo() {
  return <Switch />;
}
```

## 带标签

```tsx
import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export function SwitchWithLabel() {
  const [isChecked, setIsChecked] = useState(false);
  
  return (
    <div className="flex items-center space-x-2">
      <Switch 
        id="airplane-mode" 
        checked={isChecked} 
        onCheckedChange={setIsChecked} 
      />
      <Label htmlFor="airplane-mode">飞行模式</Label>
    </div>
  );
}
```

## 禁用状态

```tsx
import { Switch } from "@/components/ui/switch";

export function DisabledSwitch() {
  return <Switch disabled />;
}
```

## 主题切换示例

以下是我们如何使用Switch组件实现主题切换功能：

```tsx
import { useTheme } from "next-themes";
import { Switch } from "@/components/ui/switch";
import { SunIcon, MoonIcon } from "lucide-react";

export function ThemeSwitch() {
  const { theme, setTheme } = useTheme();
  const isLight = theme === "light";
  
  const handleChange = (checked: boolean) => {
    setTheme(checked ? "light" : "dark");
  };

  return (
    <div className="flex items-center space-x-2">
      <SunIcon className="h-4 w-4" />
      <Switch 
        checked={isLight}
        onCheckedChange={handleChange}
        aria-label={`切换到${isLight ? "暗" : "亮"}色模式`}
      />
      <MoonIcon className="h-4 w-4" />
    </div>
  );
}
```

## 属性

| 属性 | 类型 | 默认值 | 描述 |
|------|------|---------|-------------|
| checked | boolean | false | 开关是否被选中 |
| onCheckedChange | (checked: boolean) => void | - | 当选中状态变化时调用的事件处理程序 |
| disabled | boolean | false | 开关是否禁用 |
| required | boolean | false | 开关在表单中是否必需 |
| name | string | - | 用于表单提交的开关名称 |
| value | string | - | 用于表单提交的开关值 |
| id | string | - | 用于关联标签的开关ID |
| className | string | - | 额外的CSS类 |

## 可访问性

Switch组件遵循可访问性最佳实践：

- 使用`role="switch"`提供正确的语义
- 支持键盘导航（Tab键聚焦，空格键切换）
- 包含适当的ARIA属性
- 可以使用`id`属性与标签关联

## 自定义

您可以通过修改`switch.tsx`文件或通过`className`属性传递额外的类来自定义Switch组件。

例如，更改颜色：

```tsx
<Switch className="data-[state=checked]:bg-green-500" />
``` 