# Nostudy.ai - 不学习要练习！ - 公开构建你的项目并获得回报

# 不学习要练习！ - 公开构建你的项目并获得回报

通过练习提升真实能力，让知识创造实际价值

## 🏗 技术架构

### 核心理念

- **实战优先**: 摒弃传统的被动学习模式，转而采用"边做边学"的实战方式
- **项目驱动**: 通过真实项目实践获取实战经验，而不是简单的知识积累
- **AI原生**: 将AI技术深度融入学习过程，提供个性化的学习体验和智能辅导
- **即学即用**: 强调实用性技能的培养，确保学习内容可以立即应用到实际工作中
- **Build in Public**: 公开产品建构过程，公开创业，让学习和创造都在阳光下进行

### 核心技术栈

#### 前端
- **框架**: Next.js 13+ (App Router)
- **UI库**: React 18+
- **开发语言**: TypeScript 5.0+
- **样式**: TailwindCSS
- **状态管理**: Zustand
- **国际化**: next-intl
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
├── app/                      # Next.js 13 App Router
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

#### 2. 学习
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

更多技术细节，请参考我们的文档。

## 使用的技术

- [Next.js 14](https://nextjs.org/docs/getting-started)
- [HeroUI v2](https://heroui.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Tailwind Variants](https://tailwind-variants.org)
- [TypeScript](https://www.typescriptlang.org/)
- [Framer Motion](https://www.framer.com/motion/)
- [next-themes](https://github.com/pacocoursey/next-themes)

## 如何使用

### 使用 create-next-app 创建项目

使用 `create-next-app` 基于此模板创建新项目，运行以下命令：

```bash
npx create-next-app -e https://github.com/heroui-inc/next-app-template
```

### 安装依赖

你可以使用 `npm`、`yarn`、`pnpm`、`bun` 中的任何一个，这里以 `npm` 为例：

```bash
npm install
```

### 运行开发服务器

```bash
npm run dev
```

### 配置 pnpm（可选）

如果你使用 `pnpm`，需要在 `.npmrc` 文件中添加以下代码：

```bash
public-hoist-pattern[]=*@heroui/*
```

修改 `.npmrc` 文件后，需要重新运行 `pnpm install` 以确保依赖正确安装。

## 许可证

基于 [MIT 许可证](https://github.com/heroui-inc/next-app-template/blob/main/LICENSE)。

## ✨ 产品愿景

Nostudy.ai 致力于改变传统的学习方式，我们相信：
- 实战胜过理论
- 实践优于课本
- 项目好过题库
- 能力强于证书

## 🎯 产品定位

Nostudy.ai 是一个革新性的教育平台，我们的核心理念是：

- **实战优先**: 摒弃传统的被动学习模式，转而采用"边做边学"的实战方式
- **项目驱动**: 通过真实项目实践获取实战经验，而不是简单的知识积累
- **AI原生**: 将AI技术深度融入学习过程，提供个性化的学习体验和智能辅导
- **即学即用**: 强调实用性技能的培养，确保学习内容可以立即应用到实际工作中
- **Build in Public**: 公开产品建构过程，公开创业，让学习和创造都在阳光下进行

## ✨ 产品特点

Nostudy.ai 提供以下特点：
- 丰富的实战项目
- 个性化的学习体验
- 智能辅导和反馈
- 即学即用的学习方式
- 公开透明的创业经验分享

## 🎯 产品优势

Nostudy.ai 相比其他教育平台具有以下优势：
- 实战导向的学习方式
- 深度融入AI技术的学习体验
- 即学即用的学习效果
- 公开透明的创业经验分享

## 🎯 产品应用场景

Nostudy.ai 适用于以下场景：
- 需要快速提升实战能力的专业人士
- 想要学习AI技术的初学者
- 想要公开分享创业经验的创业者

## 🎯 产品使用流程

Nostudy.ai 的使用流程如下：
1. 注册账号
2. 选择感兴趣的实战项目
3. 开始实战学习
4. 获取智能辅导和反馈
5. 分享创业经验

## 🎯 产品未来发展

Nostudy.ai 的未来发展方向包括：
- 增加更多的实战项目
- 引入更多的AI技术
- 扩大公开分享的创业经验
- 建立更完善的创业生态系统