# Listbox（列表选择框）组件

Listbox组件提供了一个下拉选择框。它允许用户从选项列表中选择单个选项。

## 基本用法

```tsx
import { Listbox } from "@/components/ui/listbox";

export function BasicListbox() {
  const options = [
    { label: "苹果", value: "apple" },
    { label: "香蕉", value: "banana" },
    { label: "橙子", value: "orange" },
  ];

  return (
    <Listbox
      options={options}
      placeholder="选择一种水果"
    />
  );
}
```

## 带状态

```tsx
import { useState } from "react";
import { Listbox } from "@/components/ui/listbox";

export function StatefulListbox() {
  const [value, setValue] = useState("");
  
  const options = [
    { label: "苹果", value: "apple" },
    { label: "香蕉", value: "banana" },
    { label: "橙子", value: "orange" },
  ];

  return (
    <Listbox
      value={value}
      onChange={setValue}
      options={options}
      placeholder="选择一种水果"
    />
  );
}
```

## 带标签

```tsx
import { Listbox } from "@/components/ui/listbox";

export function ListboxWithLabel() {
  const options = [
    { label: "苹果", value: "apple" },
    { label: "香蕉", value: "banana" },
    { label: "橙子", value: "orange" },
  ];

  return (
    <Listbox
      label="喜欢的水果"
      options={options}
      placeholder="选择一种水果"
    />
  );
}
```

## 禁用选项

```tsx
import { Listbox } from "@/components/ui/listbox";

export function ListboxWithDisabledOptions() {
  const options = [
    { label: "苹果", value: "apple" },
    { label: "香蕉", value: "banana", disabled: true },
    { label: "橙子", value: "orange" },
  ];

  return (
    <Listbox
      options={options}
      placeholder="选择一种水果"
    />
  );
}
```

## 禁用列表框

```tsx
import { Listbox } from "@/components/ui/listbox";

export function DisabledListbox() {
  const options = [
    { label: "苹果", value: "apple" },
    { label: "香蕉", value: "banana" },
    { label: "橙子", value: "orange" },
  ];

  return (
    <Listbox
      options={options}
      placeholder="选择一种水果"
      disabled={true}
    />
  );
}
```

## 不同尺寸

```tsx
import { Listbox } from "@/components/ui/listbox";

export function ListboxSizes() {
  const options = [
    { label: "苹果", value: "apple" },
    { label: "香蕉", value: "banana" },
    { label: "橙子", value: "orange" },
  ];

  return (
    <div className="space-y-4">
      <Listbox
        options={options}
        placeholder="小号列表框"
        size="sm"
      />
      <Listbox
        options={options}
        placeholder="中号列表框"
        size="md"
      />
      <Listbox
        options={options}
        placeholder="大号列表框"
        size="lg"
      />
    </div>
  );
}
```

## 使用直接的Select组件

对于更复杂的用例，您可以直接导入底层的Select组件：

```tsx
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/listbox";

export function CustomListbox() {
  return (
    <Select>
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="选择一个框架" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>框架</SelectLabel>
          <SelectItem value="react">React</SelectItem>
          <SelectItem value="vue">Vue</SelectItem>
          <SelectItem value="angular">Angular</SelectItem>
          <SelectItem value="svelte">Svelte</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
```

## 属性

Listbox组件接受以下属性：

| 属性 | 类型 | 默认值 | 描述 |
|------|------|---------|-------------|
| options | `{ label: string; value: string; disabled?: boolean; }[]` | 必填 | 要显示的选项数组 |
| value | string | undefined | 当前选中的值 |
| onChange | (value: string) => void | undefined | 选择变化时的处理函数 |
| placeholder | string | "Select an option" | 未选择选项时显示的文本 |
| className | string | undefined | 额外的CSS类 |
| label | string | undefined | 显示在列表框上方的标签文本 |
| disabled | boolean | false | 列表框是否禁用 |
| size | "sm" \| "md" \| "lg" | "md" | 列表框的大小 |
| ariaLabel | string | undefined | 用于可访问性的ARIA标签 |

## 可访问性

Listbox组件遵循可访问性最佳实践：

- 使用适当的ARIA属性
- 支持键盘导航
- 清晰地指示选中的选项
- 提供适当的焦点管理 