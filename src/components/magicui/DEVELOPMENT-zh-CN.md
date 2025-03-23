# Magic UI 组件

本目录包含了项目中集成的所有 Magic UI 组件。Magic UI 是一个基于 React、Tailwind CSS 和 Framer Motion 构建的精美动画 UI 组件集合。

## 安装

所有组件均通过根目录中的 `install-magicui.sh` 脚本安装。该脚本使用 shadcn CLI 从 Magic UI 组件库中添加组件。

## 组件分类

Magic UI 组件按功能分为以下几个类别：

### 基础组件
- `marquee`：平滑滚动的文本或元素跑马灯
- `terminal`：具有打字动画效果的终端显示
- `bento-grid`：卡片式 UI 的响应式网格布局
- `animated-list`：项目具有交错动画效果的列表
- `dock`：macOS 风格的带悬停动画的程序坞
- `globe`：交互式 3D 地球可视化
- `tweet-card`：预设样式的 Twitter/X 卡片组件
- `orbiting-circles`：围绕中心点旋转的动画圆圈
- `avatar-circles`：具有交互动画的头像圆圈
- `icon-cloud`：交互式悬浮图标云
- `animated-circular-progress-bar`：动画环形进度指示器
- `file-tree`：交互式文件/目录树可视化
- `code-comparison`：并排代码比较显示
- `script-copy-btn`：代码片段复制按钮
- `scroll-progress`：滚动进度的可视化指示器
- `lens`：内容放大镜效果
- `pointer`：自定义动画指针/光标组件

### 设备模拟
- `safari`：Safari 浏览器窗口模拟
- `iphone-15-pro`：iPhone 15 Pro 设备模型
- `android`：Android 设备模型

### 特效组件
- `animated-beam`：动画光束效果
- `border-beam`：带动画光效的边框
- `shine-border`：闪烁边框动画
- `magic-card`：带悬停效果的卡片
- `meteors`：流星/流星雨动画背景
- `neon-gradient-card`：带霓虹渐变效果的卡片
- `confetti`：彩色纸屑粒子动画
- `particles`：通用粒子系统
- `cool-mode`：特效叠加层
- `scratch-to-reveal`：交互式刮刮卡揭示效果

### 文字动画
- `text-animate`：通用文本动画工具
- `line-shadow-text`：带线条阴影效果的文本
- `aurora-text`：具有极光色彩效果的文本
- `number-ticker`：动画数字计数器
- `animated-shiny-text`：带闪亮动画的文本
- `animated-gradient-text`：带动画渐变的文本
- `text-reveal`：文本揭示动画
- `hyper-text`：带动画效果的超文本
- `word-rotate`：旋转词语动画
- `typing-animation`：打字机文本效果
- `scroll-based-velocity`：基于滚动的文本动画
- `flip-text`：带翻转动画的文本
- `box-reveal`：基于盒子的文本揭示动画
- `sparkles-text`：带闪烁效果的文本
- `morphing-text`：带变形动画的文本
- `spinning-text`：带旋转动画的文本

### 按钮
- `rainbow-button`：带彩虹效果的按钮
- `shimmer-button`：带微光动画的按钮
- `shiny-button`：带闪亮效果的按钮
- `interactive-hover-button`：交互式悬停按钮
- `animated-subscribe-button`：带动画的订阅按钮
- `pulsating-button`：带脉动动画的按钮
- `ripple-button`：带涟漪效果的按钮

### 背景
- `warp-background`：带扭曲效果的背景
- `flickering-grid`：带闪烁动画的网格
- `animated-grid-pattern`：动画网格图案背景
- `retro-grid`：复古风格的网格背景
- `ripple`：涟漪动画效果
- `dot-pattern`：点阵图案背景
- `grid-pattern`：网格图案背景
- `interactive-grid-pattern`：交互式网格背景

## 使用方法

您可以通过两种方式导入 Magic UI 组件：

### 1. 直接从组件文件导入

```tsx
import { Marquee } from "@/components/magicui/marquee";
import { AnimatedBeam } from "@/components/magicui/animated-beam";

// 使用组件
<Marquee>
  您的内容
</Marquee>

<AnimatedBeam />
```

### 2. 通过统一 UI 入口点导入

```tsx
import { magicui } from "@/lib/ui";

// 使用组件
<magicui.Marquee>
  您的内容
</magicui.Marquee>

<magicui.AnimatedBeam />
```

## 依赖项

这些组件依赖于：
- React 和 React DOM
- Tailwind CSS
- Framer Motion
- 其他工具库（因组件而异）

## 与 shadcn UI 的集成

Magic UI 组件设计为与 shadcn UI 组件无缝配合，shadcn UI 组件位于 `@/components/shadcnui` 目录。一些 Magic UI 组件内部使用了 shadcn UI 组件。

## 自定义

大多数组件接受标准 props 用于样式和行为自定义。请参阅每个组件的实现以了解特定的自定义选项。

## 注意事项

- Magic UI 网站上的并非所有组件都可作为可安装组件使用
- 某些组件可能需要额外配置或适配以满足特定用例
- 所有导入路径已调整以适应我们的项目结构（使用 shadcnui 目录而非 ui） 