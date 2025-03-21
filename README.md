# Nostudy.ai

English | [简体中文](./README.zh-CN.md)

> Practice, Not Study! - Build Your Projects in Public and Get Rewarded

Through practice to enhance real capabilities, let knowledge create actual value

## 🛠 Development Tools

### AI-Powered Development
This project is built using [Trae](https://www.trae.ai/), an adaptive AI IDE that transforms how you work, collaborating with you to run faster. Trae provides intelligent code completion, real-time collaboration, and AI-powered development assistance.

## 🏗 Technology Architecture

### Core Concept

- **Practice First**: Embrace the "learn-by-doing" approach by abandoning traditional passive learning modes
- **Project-Driven**: Acquire practical experience through real projects, rather than just accumulating knowledge
- **AI-Native**: Deeply integrate AI technology into the learning process
- **Immediate Application**: Highlight practical skills that can be immediately applied
- **Public Construction**: Share our product construction process and entrepreneurial journey publicly

### Core Technology Stack

#### Frontend
- **Framework**: Next.js 13+ (App Router)
- **UI Library**: React 18+
- **Language**: TypeScript 5.0+
- **Style**: TailwindCSS
- **State Management**: Zustand
- **Internationalization**: next-intl
- **Component Library**: HeroUI v2.7.0
  - Supports Dark Mode
  - Based on TailwindCSS
  - Fully Type-Safe
  - Supports React Server Components
  - Customizable Theme
  - No Runtime Styles
  - Supports Accessibility

#### AI Integration
- **LLM Engine**: GPT-4
- **Features**:
  - Real-Time Code Review
  - Intelligent Learning Path Generation
  - Personalized Progress Tracking
  - Intelligent Question and Answer Support
  - Code Optimization Suggestions

#### Development Tools
- **Package Manager**: pnpm
- **Code Quality**:
  - ESLint
  - Prettier
  - TypeScript Strict Mode
- **Git Workflow**:
  - Standard Commit
  - Branch-Based Development
  - GitHub Actions CI/CD

### System Architecture

```
Nostudy.ai/
├── app/                      # Next.js 13 App Router
│   ├── [locale]/            # i18n 路由
│   ├── api/                 # API 路由
│   └── providers.tsx        # 全局提供者
├── components/              # React 组件
│   ├── ui/                 # 基础 UI 组件
│   └── features/           # 功能组件
├── config/                  # 配置文件
├── i18n/                    # 国际化
│   ├── client.ts           # 客户端 i18n
│   └── server.ts           # 服务端 i18n
├── lib/                     # 工具函数
├── messages/               # 翻译文件
├── public/                 # 静态资源
└── styles/                 # 全局样式
```

### Core Function Implementation

#### 1. AI-Native Learning System
- Real-Time Code Analysis and Feedback
- Intelligent Progress Tracking
- Personalized Learning Path Generation
- Intelligent Content Recommendation

#### 2. Project-Based Learning
- Real Project Template
- Step-by-Step Guidance
- Automated Code Review
- Progress Tracking and Analysis

#### 3. Multi-Language Support
- Dynamic Routing i18n
- Language Detection and Switching
- RTL Support
- Localization Content

#### 4. Performance Optimization
- Server-Side Rendering
- Static Page Generation
- Image Optimization
- Code Splitting
- Edge Caching

#### 5. Security Measures
- Identity Verification and Authorization
- Rate Limiting
- CORS Configuration
- Input Validation
- XSS Protection

### Development Standards

1. **Code Quality**
   - Strict TypeScript Configuration
   - Comprehensive ESLint Rules
   - Consistent Code Formatting
   - Unit Test Coverage

2. **Git Workflow**
   - Feature Branch Workflow
   - Standard Commit Information
   - Pull Request Review
   - Automated Testing

3. **Documentation**
   - Inline Code Documentation
   - API Documentation
   - Component Storybook
   - Development Guide

4. **Performance Metrics**
   - Core Web Vitals Monitoring
   - Lighthouse Score
   - Error Tracking
   - User Analysis

### Deployment Architecture

- **Production Environment**
  - Vercel (Primary Hosting)
  - Edge Functions
  - CDN Distribution
  - Automated Deployment

- **Development Environment**
  - Local Development Setup
  - Development Server
  - Hot Module Replacement
  - Debugging Tools

---

More technical details, please refer to our documentation.

## Used Technologies

- [Next.js 14](https://nextjs.org/docs/getting-started)
- [HeroUI v2](https://heroui.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Tailwind Variants](https://tailwind-variants.org)
- [TypeScript](https://www.typescriptlang.org/)
- [Framer Motion](https://www.framer.com/motion/)
- [next-themes](https://github.com/pacocoursey/next-themes)

## How to Use

### Use create-next-app to Create a Project

Use `create-next-app` based on this template to create a new project, run the following command:

```bash
npx create-next-app -e https://github.com/heroui-inc/next-app-template
```

### Install Dependencies

We recommend using `pnpm` as the default package manager. First-time use requires installing pnpm:

```bash
npm install -g pnpm
```

Then install project dependencies:

```bash
pnpm install
```

> Note: Although the project defaults to using `pnpm`, you can also use `npm`, `yarn`, or `bun`.

### Set pnpm

Since the project uses HeroUI, you need to add the following configuration to the `.npmrc` file:

```bash
public-hoist-pattern[]=*@heroui/*
```

After adding the configuration, please rerun `pnpm install` to ensure dependencies are correctly installed.

### Run Development Server

```bash
pnpm dev
```

## License

This project is licensed under the Creative Commons Attribution-NonCommercial 4.0 International License (CC BY-NC 4.0). This means you can:

- Use the software for personal and non-commercial purposes
- Share the software with others (only for non-commercial purposes)
- Modify the software for personal use
- Access the source code and documentation

You cannot:
- Use the software for commercial purposes without separate commercial permission
- Distribute the software for commercial purposes
- Imply Nostudy.ai's endorsement

If you need a commercial license, please contact us: support@nostudy.ai.

See [LICENSE](LICENSE) file for the complete license text.
