# ViliVili 开发文档

## 项目概述

ViliVili 是一个创新的 AI项目 和代码应用的分享平台。它基于 Next.js 构建，采用了 TypeScript 作为开发语言，并集成了多个 UI 组件库来提供丰富的用户界面体验。

## 技术栈

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
- **包管理**: pnpm

### 后端与数据库

- **数据库**: Neon Database (Serverless PostgreSQL)
- **ORM**: Drizzle ORM
- **身份认证**: Better Auth
- **API**: Next.js API Routes + Next Safe Action
- **邮件服务**: Resend
- **支付处理**:
  - Stripe
  - Creem.io

### 国际化

- **i18n框架**: Next-intl

### 分析与AI

- **分析工具**:
  - Plausible Analytics
  - Google Analytics
- **AI集成**: Vercel AI SDK
- **内容管理**: Content Collections

### 数据展示

- **表格**: Tanstack Table

### 开发工具

- **AI IDE**: Trae
- **代码质量**:
  - ESLint
  - Prettier
  - TypeScript严格模式
- **Git工作流**:
  - 约定式提交
  - 分支开发
  - GitHub Actions CI/CD

## 目录结构

```
ViliVili/
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

## 组件库

### Shadcn UI

Shadcn UI 是一套基于 Radix UI 和 Tailwind CSS 构建的无样式组件集合，提供了高度可定制的组件，用于构建现代化的用户界面。

组件位于 `src/components/shadcnui` 目录，通过 `@/lib/ui.ts` 中的 `shadcn` 命名空间导出。

主要组件包括：

- Button, Input, Form 等基础组件
- Dialog, Sheet, Popover 等交互组件
- Table, DataTable 等数据展示组件



## 开发规范

### 核心原则

**始终遵循官方文档**: 在集成库、框架或API时，必须严格按照其官方文档作为首要参考标准进行开发。这确保了兼容性、正确的实现方式，并利用了技术创建者推荐的最佳实践。官方文档的优先级高于其他参考资料或之前的实现模式。

### 代码风格

- 使用 TypeScript 进行类型检查
- 遵循 ESLint 和 Prettier 配置的代码格式
- 模块化开发，每个功能模块应该有自己的目录

### 组件开发原则

1. **模块化**: 每个功能模块开发归档两份 README，一份英文文档，一份简体中文，总结功能、接口和使用方式
2. **小步快跑**: 每次只开发一个功能，代码遵循最佳实践，不搞黑科技
3. **及时提交**: 每完成一个节点提交一下 git 暂存
4. **完整测试**: 每个模块开发完成后，必须进行全面测试，包括组件测试、API测试、集成测试和跨浏览器测试，确保功能正常工作无误，所有测试通过后才能视为模块完成

### 命名规范

- 组件文件名: PascalCase (例如 `Button.tsx`)
- 工具函数文件名: camelCase (例如 `useMediaQuery.ts`)
- CSS 类名: kebab-case 或遵循 Tailwind CSS 约定

### 注释规范

- 组件文件顶部应有组件功能说明
- 复杂逻辑应有相应注释
- 公共 API 和接口应有完整文档注释
- 代码注释使用英文

### 国际化

- 界面文本使用国际化方案，不硬编码
- 支持中英文切换
- 国际化文件位于 `messages` 目录

### 包管理

- 统一使用 pnpm 进行包管理
- 添加新依赖时确保依赖版本锁定

### Git 提交规范

- 提交信息使用英文
- 提交信息格式: `<type>: <description>`
- 类型包括: feat(新功能), fix(修复), docs(文档), style(格式), refactor(重构), test(测试), chore(杂项)

## 本地开发

### 环境设置

1. 克隆仓库
2. 安装依赖: `pnpm install`
3. 运行开发服务器: `pnpm dev`

### 安装新组件

#### Shadcn UI 组件

```bash
pnpm dlx shadcn@latest add <component-name>
```



## 构建与部署

### 构建

```bash
pnpm build
```

### 预览构建

```bash
pnpm start
```

## 问题解决

### 常见问题

如遇到与 Magic UI 组件导入相关的问题，可能是导入路径问题。Magic UI 组件默认从 `@/components/ui` 导入依赖，而我们的项目结构中这些组件位于 `@/components/shadcnui`。

如需修复导入路径，可参考之前使用的脚本修复方法。
