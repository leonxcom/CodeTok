# Shadcn UI 组件

本目录包含了项目中集成的所有 Shadcn UI 组件。Shadcn UI 是一套基于 Radix UI 和 Tailwind CSS 构建的可复用组件集合，为构建可访问性强且可定制的用户界面提供了坚实基础。

## 安装

所有组件均通过 shadcn CLI 安装：

```bash
pnpm dlx shadcn@latest add <组件名称>
```

例如：

```bash
pnpm dlx shadcn@latest add button
pnpm dlx shadcn@latest add dialog
```

## 组件分类

Shadcn UI 组件按功能分为以下几个类别：

### 基础组件
- `button`：标准按钮组件
- `input`：文本输入字段
- `textarea`：多行文本输入
- `label`：表单字段标签
- `checkbox`：切换选择组件
- `switch`：开关组件
- `radio-group`：单选按钮组
- `select`：下拉选择组件
- `slider`：范围滑块组件
- `avatar`：用户或实体表示组件

### 布局组件
- `card`：相关内容容器
- `aspect-ratio`：维持宽高比
- `separator`：内容间视觉分隔线
- `scroll-area`：可定制的可滚动区域
- `resizable`：可调整大小的容器组件
- `sidebar`：侧边导航组件

### 导航组件
- `navigation-menu`：主导航组件
- `menubar`：水平菜单组件
- `breadcrumb`：层次路径指示器
- `pagination`：页面导航控件
- `tabs`：基于标签的内容组织

### 反馈组件
- `alert`：上下文消息组件
- `progress`：进度指示器
- `skeleton`：加载状态占位符
- `tooltip`：悬停时的上下文信息

### 对话框组件
- `dialog`：模态对话框组件
- `alert-dialog`：确认对话框
- `drawer`：侧面板组件
- `popover`：上下文浮动内容
- `hover-card`：悬停时显示的卡片
- `sheet`：滑入式面板组件

### 数据展示组件
- `table`：数据表格组件
- `data-table`：具有排序/过滤功能的增强型数据表格
- `calendar`：日期显示和选择
- `date-picker`：日期选择组件
- `collapsible`：可展开/折叠的内容
- `accordion`：可展开的部分
- `carousel`：幻灯片组件
- `command`：命令面板组件
- `context-menu`：右键菜单
- `dropdown-menu`：下拉菜单组件

### 高级组件
- `form`：带验证的表单
- `combobox`：自动完成输入
- `chart`：数据可视化
- `input-otp`：一次性密码输入

## 使用方法

您可以通过两种方式导入 Shadcn UI 组件：

### 1. 直接从组件文件导入

```tsx
import { Button } from "@/components/shadcnui/button";
import { Dialog } from "@/components/shadcnui/dialog";

// 使用组件
<Button variant="default">
  点击我
</Button>

<Dialog>
  <DialogTrigger>打开对话框</DialogTrigger>
  <DialogContent>内容</DialogContent>
</Dialog>
```

### 2. 通过统一 UI 入口点导入

```tsx
import { shadcn } from "@/lib/ui";

// 使用组件
<shadcn.Button.Button variant="default">
  点击我
</shadcn.Button.Button>

<shadcn.Dialog.Dialog>
  <shadcn.Dialog.DialogTrigger>打开对话框</shadcn.Dialog.DialogTrigger>
  <shadcn.Dialog.DialogContent>内容</shadcn.Dialog.DialogContent>
</shadcn.Dialog.Dialog>
```

## 依赖项

这些组件依赖于：
- React 和 React DOM
- Tailwind CSS
- Radix UI
- Class Variance Authority
- clsx/tailwind-merge（用于 className 合并）
- Lucide React（用于图标）

## 自定义

Shadcn UI 组件可以通过以下方式自定义：

1. **变体**：大多数组件使用 `cva`（Class Variance Authority）模式来定义变体
2. **className 属性**：所有组件都接受 className 属性以进行额外的样式设置
3. **Tailwind 配置**：全局样式可以在 Tailwind 配置中调整

## 注意事项

- Shadcn UI 不是传统意义上的组件库，而是一系列直接复制到项目中的可复用组件
- 组件可以轻松修改以适应项目的设计需求
- 关于无障碍最佳实践，请参考相应 Radix UI 原语的文档 