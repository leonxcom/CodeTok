# Nostudy.ai - 项目驱动的AI时代公开构建平台

与其闷头学习，不如公开构建真实项目并获得全世界认可！

## 🏗 技术架构

### 核心理念

- **实战优先**: 摒弃传统的被动学习模式，转而采用"边做边学"的实战方式
- **项目驱动**: 通过真实项目实践获取实战经验，而不是简单的知识积累
- **AI原生**: 将AI技术深度融入学习过程，提供个性化的学习体验和智能辅导
- **即学即用**: 强调实用性技能的培养，确保学习内容可以立即应用到实际工作中
- **公开构建**: 公开产品建构过程，让学习和创造都在阳光下进行

### 技术栈

#### 前端
- **框架**: Next.js 14+ (App Router)
- **UI库**: React 18+
- **开发语言**: TypeScript 5.0+
- **样式**: TailwindCSS
- **组件库**: shadcn/ui

#### AI集成
- **LLM引擎**: GPT-4
- **功能特性**:
  - 实时代码审查
  - 智能学习路径生成
  - 个性化进度跟踪
  - 智能问答支持
  - 代码优化建议

#### 开发工具
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
├── app/                      # Next.js 14 App Router
│   ├── [locale]/            # 国际化路由
│   ├── api/                 # API路由
│   └── providers.tsx        # 全局提供者
├── components/              # React组件
│   ├── ui/                 # 基础UI组件
│   └── features/           # 功能组件
├── config/                  # 配置文件
├── i18n/                    # 国际化
│   ├── client.ts           # 客户端国际化
│   └── server.ts           # 服务端国际化
├── lib/                     # 工具函数
├── messages/               # 翻译文件
├── public/                 # 静态资源
└── styles/                 # 全局样式
```

### 核心功能实现

#### 1. AI原生学习系统
- 实时代码分析和反馈
- 智能进度跟踪
- 个性化学习路径生成
- 智能内容推荐

#### 2. 项目驱动学习
- 真实项目模板
- 步骤引导
- 自动代码审查
- 进度跟踪和分析

#### 3. 多语言支持
- 基于路由的动态国际化
- 语言检测和切换
- RTL支持
- 区域特定内容

#### 4. 性能优化
- 服务器端渲染
- 静态页面生成
- 图片优化
- 代码分割
- Edge缓存

#### 5. 安全措施
- 身份认证和授权
- 访问限制
- CORS配置
- 输入验证
- XSS防护

### 开发规范

1. **代码质量**
   - 严格的TypeScript配置
   - 全面的ESLint规则
   - 一致的代码格式
   - 单元测试覆盖

2. **Git工作流**
   - 特性分支工作流
   - 约定式提交信息
   - Pull Request审查
   - 自动化测试

3. **文档规范**
   - 内联代码文档
   - API文档
   - 组件故事书
   - 开发指南

4. **性能指标**
   - 核心Web指标监控
   - Lighthouse评分
   - 错误跟踪
   - 用户分析

### 部署架构

- **生产环境**
  - Vercel (主要托管)
  - Edge函数
  - CDN分发
  - 自动化部署

- **开发环境**
  - 本地开发设置
  - 开发服务器
  - 热模块替换
  - 调试工具

---

## 使用的技术

- [Next.js 14](https://nextjs.org/docs/getting-started)
- [Tailwind CSS](https://tailwindcss.com/)
- [Tailwind Variants](https://tailwind-variants.org)
- [TypeScript](https://www.typescriptlang.org/)
- [Framer Motion](https://www.framer.com/motion/)
- [next-themes](https://github.com/pacocoursey/next-themes)

## 如何使用

### 使用 create-next-app 创建项目

使用 `create-next-app` 基于此模板创建新项目，运行以下命令：

```bash
npx create-next-app -e https://github.com/leohuang/nostudy.ai
```

### 安装依赖

```bash
pnpm install
```

### 运行开发服务器

```bash
pnpm dev
```

## 许可证

采用 [知识共享署名-非商业性使用 4.0 国际许可协议（CC BY-NC 4.0）](https://creativecommons.org/licenses/by-nc/4.0/deed.zh)进行许可。