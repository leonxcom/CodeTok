# NoStudy.ai

NoStudy.ai是一个AI学习助手平台，旨在通过人工智能技术让学习变得更轻松、更高效。

## 功能特点

- 基于Next.js框架开发的现代化Web应用
- 使用Tailwind CSS和ShadcnUI构建美观的用户界面
- 支持多语言（中文、英文、法语）
- 响应式设计，适配各种设备

## 技术栈

- [Next.js](https://nextjs.org/) - React框架
- [Tailwind CSS](https://tailwindcss.com/) - CSS框架
- [ShadcnUI](https://ui.shadcn.com/) - UI组件库
- [NextIntl](https://next-intl-docs.vercel.app/) - 国际化方案

## 快速开始

克隆仓库并安装依赖：

```bash
git clone https://github.com/LeonZeng919/nostudy.ai.git
cd nostudy.ai
pnpm install
```

复制环境变量文件：

```bash
cp .env.example .env.local
```

启动开发服务器：

```bash
pnpm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

## 项目结构

```bash
.
├── messages    --> 多语言文本
│   ├── en.json
│   ├── fr.json
│   └── zh.json
├── public      --> 静态资源
├── src
│   ├── app     --> 应用页面
│   ├── components --> 组件
│   ├── config  --> 配置
│   ├── lib     --> 工具库
│   └── styles  --> 样式
```

## 国际化配置

- `src/i18n.ts` - next-intl配置文件
- `src/middleware.ts` - 自动语言检测中间件
- `messages/` - 语言包目录

## 许可证

[MIT](LICENSE)
