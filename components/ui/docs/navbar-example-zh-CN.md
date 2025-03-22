# Navbar（导航栏）组件

Navbar组件是一个响应式导航栏，可以适应不同的屏幕尺寸。它包括移动菜单、搜索功能和各种操作按钮。

## 基本用法

```tsx
import { Navbar } from "@/components/ui/navbar";

export function App() {
  return (
    <>
      <Navbar />
      <main>
        {/* 您的内容在这里 */}
      </main>
    </>
  );
}
```

## Navbar组件

Navbar由几个模块化组件组成：

### NavLink

NavLink组件用于单个导航链接。

```tsx
import { NavLink } from "@/components/ui/navbar";

export function NavigationExample() {
  return (
    <NavLink href="/dashboard" label="仪表盘" isActive={true} />
  );
}
```

### MobileMenu

MobileMenu组件负责移动导航体验。它使用Sheet组件创建滑动侧边菜单。

```tsx
import { MobileMenu } from "@/components/ui/navbar";

export function MobileNavExample() {
  return <MobileMenu />;
}
```

### SearchInput和SearchButton

SearchInput组件提供带有键盘快捷键指示器的搜索框，而SearchButton是移动视图的紧凑替代品。

```tsx
import { SearchInput, SearchButton } from "@/components/ui/navbar";

export function SearchExample() {
  return (
    <div>
      <SearchInput />
      <SearchButton />
    </div>
  );
}
```

## 配置

Navbar使用`config/site.ts`中的站点配置来获取导航项目、站点名称和链接：

```tsx
// config/site.ts
export const siteConfig = {
  name: "您的站点名称",
  navItems: [
    {
      label: "home",
      href: "/",
    },
    {
      label: "features",
      href: "/features",
    },
    {
      label: "pricing",
      href: "/pricing",
    },
    {
      label: "about",
      href: "/about",
    },
  ],
  links: {
    github: "https://github.com/yourusername/your-repo",
  },
};
```

## 国际化

Navbar完全支持国际化：

1. 它使用`next-intl`库进行翻译
2. 导航链接根据当前语言环境自动本地化
3. 链接路径前缀为当前语言环境

## 响应式设计

Navbar默认是响应式的：

- 在桌面上，它显示完整的导航菜单和搜索输入
- 在移动设备上，它显示一个汉堡菜单图标，打开侧边菜单
- 站点徽标和操作按钮始终可见

## 可访问性

Navbar遵循可访问性最佳实践：

- 为当前页面指示提供适当的ARIA属性
- 菜单切换的屏幕阅读器支持
- 键盘导航支持
- 焦点管理

## 自定义

您可以通过修改`navbar.tsx`文件来自定义Navbar：

- 更改布局结构
- 添加或删除组件
- 使用Tailwind类修改样式
- 更新移动菜单行为 