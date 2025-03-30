# Vilivili - 一个创新的AI项目和代码应用的分享平台

简体中文 | [English](./README.md)

Vilivili 是一个创新的 AI项目 和代码应用的分享平台。它基于 Next.js 构建，采用了 TypeScript 作为开发语言，并集成了多个 UI 组件库来提供丰富的用户界面体验。

## 📑 目录

- [技术架构](#技术架构)
- [系统架构](#系统架构)
- [核心功能实现](#核心功能实现)
- [开发规范](#开发规范)
- [部署架构](#部署架构)
- [快速开始](#快速开始)
- [许可证](#许可证)

## 🏗 技术架构

### 技术栈

#### 前端
- **框架**: 
  - Next.js 15 (App Router)
  - React 18.3.1
- **UI库**: 
  - React 19 (Next.js)
  - React 18.3.1
- **开发语言**: TypeScript
- **样式**: 
  - Tailwind CSS v4 (Next.js)
  - Tailwind CSS 3.4.4
- **组件库**: 
  - Shadcn UI
  - Radix UI (Primitives)
- **构建工具**:
  - Vite 5.2.13
- **图标库**:
  - Lucide React 0.424.0
- **工具库**:
  - clsx - 用于构造类名字符串的工具
  - tailwind-merge - 合并Tailwind CSS类而不产生样式冲突
  - class-variance-authority - 类型安全的UI组件变体

#### 后端与数据库
- **数据库**: Neon Database (Serverless PostgreSQL)
- **ORM**: Drizzle ORM
- **身份认证**: Better Auth
- **API**: Next.js API Routes + Next Safe Action
- **邮件服务**: Resend
- **支付处理**: 
  - Stripe
  - Creem.io

#### 国际化
- **i18n框架**: Next-intl

#### 分析与AI
- **分析工具**: 
  - Plausible Analytics
  - Google Analytics
- **AI集成**: Vercel AI SDK
- **内容管理**: Content Collections

#### 数据展示
- **表格**: Tanstack Table

#### 开发工具
- **AI IDE**: [Trae](https://www.trae.ai/)
- **包管理器**: pnpm
- **代码质量**:
  - ESLint
  - Prettier
  - TypeScript严格模式
- **Git工作流**:
  - 约定式提交
  - 分支开发
  - GitHub Actions CI/CD

### 系统架构

```
Vilivili/
├── app/                      # Next.js 15 App Router
│   ├── [locale]/            # 国际化路由
│   ├── api/                 # API路由
│   └── providers.tsx        # 全局提供者
├── components/              # React组件
│   ├── ui/                 # Shadcn UI组件
│   └── features/           # 功能组件
├── db/                      # 数据库Schema和客户端
│   ├── schema.ts           # Drizzle Schema
│   └── index.ts            # DB客户端
├── config/                  # 配置文件
├── i18n/                    # 国际化
│   ├── client.ts           # 客户端国际化
│   └── server.ts           # 服务端国际化
├── lib/                     # 工具函数
│   ├── auth.ts             # 认证逻辑
│   ├── actions.ts          # 服务器操作
│   └── stripe.ts           # 支付逻辑
├── messages/               # 翻译文件
├── public/                 # 静态资源
└── styles/                 # 全局样式
```

## 🔥 核心功能实现

### 1. 多语言支持
- 基于路由的动态国际化（支持中文、英文、日语等12种语言）
- 语言检测和切换
- RTL支持
- 区域特定内容

### 2. 性能优化
- 服务器端渲染
- 静态页面生成
- 图片优化
- 代码分割
- Edge缓存

### 3. 安全措施
- 身份认证和授权
- 访问限制
- CORS配置
- 输入验证
- XSS防护

## 📋 开发规范

### 1. 代码质量
- 严格的TypeScript配置
- 全面的ESLint规则
- 一致的代码格式
- 单元测试覆盖

### 2. Git工作流
- 特性分支工作流
- 约定式提交信息
- Pull Request审查
- 自动化测试

### 3. 文档规范
- 内联代码文档
- API文档
- 组件故事书
- 开发指南

### 4. 性能指标
- 核心Web指标监控
- Lighthouse评分
- 错误跟踪
- 用户分析

## 🚀 部署架构

### 生产环境
- Vercel (主要托管)
- Edge函数
- CDN分发
- 自动化部署

### 开发环境
- 本地开发设置
- 开发服务器
- 热模块替换
- 调试工具

## 🧰 使用的技术

- [Next.js 15](https://nextjs.org/)
- [React 19](https://react.dev/)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [Shadcn UI](https://ui.shadcn.com/)
- [Neon Database](https://neon.tech/)
- [Drizzle ORM](https://orm.drizzle.team/)
- [TypeScript](https://www.typescriptlang.org/)
- [Stripe](https://stripe.com/)
- [Resend](https://resend.com/)
- [Next-intl](https://next-intl-docs.vercel.app/)
- [Vercel AI SDK](https://sdk.vercel.ai/docs)
- [Tanstack Table](https://tanstack.com/table)
- [Framer Motion](https://www.framer.com/motion/)

## 🚦 快速开始

### 使用 create-next-app 创建项目

使用 `create-next-app` 基于此模板创建新项目，运行以下命令：

```bash
pnpm create next-app -e https://github.com/leohuangbest/vilivili
```

### 安装依赖

```bash
pnpm install
```

### 运行开发服务器

```bash
pnpm dev
```

## 📜 许可证

采用 [知识共享署名-非商业性使用 4.0 国际许可协议（CC BY-NC 4.0）](https://creativecommons.org/licenses/by-nc/4.0/deed.zh)进行许可。

## 🤝 如何贡献

我们欢迎各种形式的贡献！如果您想参与项目开发，请参考以下步骤：

1. Fork项目仓库
2. 创建您的特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交您的更改 (`git commit -m 'feat: add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建Pull Request

详细的贡献指南请参见[CONTRIBUTING-zh-CN.md](./CONTRIBUTING-zh-CN.md)。