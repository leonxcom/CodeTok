# Nostudy.ai - 真实项目驱动的AI创作者成长实战平台

简体中文 | [English](./README.md)

告别闷头学习，公开构建真实项目，获得你的前1000位铁杆粉丝！

## 📑 目录

- [核心理念](#核心理念)
- [技术架构](#技术架构)
- [系统架构](#系统架构)
- [核心功能实现](#核心功能实现)
- [开发规范](#开发规范)
- [部署架构](#部署架构)
- [快速开始](#快速开始)
- [许可证](#许可证)

## 💡 核心理念

- **第一性原理学习**: 我们的学习不只是认识世界，更是为了改造世界！
- **项目驱动**: 通过真实项目实践"边做边学"获取经验，而不是简单的知识积累
- **AI原生**: 将AI技术深度融入学习过程，提供个性化的学习体验和智能辅导
- **一键部署**: 简化AI项目部署流程，让创作者专注于内容和价值创造
- **公开构建**: 在公众视野下进行项目开发，获得反馈并建立个人品牌
- **粉丝连接**: 建立1000位铁杆粉丝社区，实现知识变现和团队资源共享

## 🏗 技术架构

### 技术栈

#### 前端
- **框架**: Next.js 15 (App Router)
- **UI库**: React 19
- **开发语言**: TypeScript
- **样式**: Tailwind CSS v4
- **组件库**: 
  - Shadcn UI
  - MagicUI Design

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
Nostudy.ai/
├── app/                      # Next.js 15 App Router
│   ├── [locale]/            # 国际化路由
│   ├── api/                 # API路由
│   └── providers.tsx        # 全局提供者
├── components/              # React组件
│   ├── ui/                 # Shadcn UI组件
│   ├── magic/              # MagicUI组件
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

### 1. AI原生学习系统
- 实时代码分析和反馈
- 智能进度跟踪
- 个性化学习路径生成
- 智能内容推荐

### 2. 项目驱动学习
- 真实项目模板
- 步骤引导
- 自动代码审查
- 进度跟踪和分析

### 3. 多语言支持
- 基于路由的动态国际化（支持中文、英文、日语等12种语言）
- 语言检测和切换
- RTL支持
- 区域特定内容

### 4. 性能优化
- 服务器端渲染
- 静态页面生成
- 图片优化
- 代码分割
- Edge缓存

### 5. 安全措施
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
npx create-next-app -e https://github.com/Nostudy-ai/Nostudy.ai
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