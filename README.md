# ViliVili - Vibe, Code, Share

English | [简体中文](./README-zh-CN.md)

ViliVili is an innovative platform for sharing AI projects and code applications. Built with Next.js, it uses TypeScript as the development language and integrates multiple UI component libraries to provide a rich user interface experience.

## 📑 Table of Contents

- [Core Concept](#core-concept)
- [Technical Architecture](#technical-architecture)
- [System Architecture](#system-architecture)
- [Core Features Implementation](#core-features-implementation)
- [Development Guidelines](#development-guidelines)
- [Deployment Architecture](#deployment-architecture)
- [Quick Start](#quick-start)
- [License](#license)

## 🏗 Technical Architecture

### Tech Stack

#### Frontend
- **Framework**: 
  - Next.js 15 (App Router)
  - React 18.3.1
- **UI Libraries**: 
  - React 19 (Next.js)
  - React 18.3.1
- **Language**: TypeScript
- **Styling**: 
  - Tailwind CSS v4 (Next.js)
  - Tailwind CSS 3.4.4
- **Component Libraries**: 
  - Shadcn UI
  - Radix UI (Primitives)
- **Build Tool**:
  - Vite 5.2.13
- **Icon Library**:
  - Lucide React 0.424.0
- **Utility Libraries**:
  - clsx - Utility for constructing className strings
  - tailwind-merge - Merge Tailwind CSS classes without style conflicts
  - class-variance-authority - Type-safe UI component variants

#### Backend & Database
- **Database**: Neon Database (Serverless PostgreSQL)
- **ORM**: Drizzle ORM
- **Authentication**: Better Auth
- **API**: Next.js API Routes + Next Safe Action
- **Email Service**: Resend
- **Payment Processing**: 
  - Stripe
  - Creem.io

#### Internationalization
- **i18n Framework**: Next-intl

#### Analytics & AI
- **Analytics Tools**: 
  - Plausible Analytics
  - Google Analytics
- **AI Integration**: Vercel AI SDK
- **Content Management**: Content Collections

#### Data Display
- **Tables**: Tanstack Table

#### Development Tools
- **AI IDE**: [Trae](https://www.trae.ai/)
- **Package Manager**: pnpm
- **Code Quality**:
  - ESLint
  - Prettier
  - TypeScript strict mode
- **Git Workflow**:
  - Conventional Commits
  - Branch development
  - GitHub Actions CI/CD

### System Architecture

```
ViliVili/
├── app/                      # Next.js 15 App Router
│   ├── [locale]/            # i18n routes
│   ├── api/                 # API routes
│   └── providers.tsx        # Global providers
├── components/              # React components
│   ├── ui/                 # Shadcn UI components
│   └── features/           # Feature components
├── db/                      # Database Schema and client
│   ├── schema.ts           # Drizzle Schema
│   └── index.ts            # DB client
├── config/                  # Configuration files
├── i18n/                    # Internationalization
│   ├── client.ts           # Client-side i18n
│   └── server.ts           # Server-side i18n
├── lib/                     # Utility functions
│   ├── auth.ts             # Authentication logic
│   ├── actions.ts          # Server actions
│   └── stripe.ts           # Payment logic
├── messages/               # Translation files
├── public/                 # Static assets
└── styles/                 # Global styles
```

## 🔥 Core Features Implementation

### 1. AI-Native Learning System
- Real-time code analysis and feedback
- Intelligent progress tracking
- Personalized learning path generation
- Smart content recommendations

### 2. Project-Driven Learning
- Real project templates
- Step-by-step guidance
- Automatic code review
- Progress tracking and analysis

### 3. Multi-Language Support
- Dynamic internationalization based on routes (supporting 12 languages including Chinese, English, Japanese)
- Language detection and switching
- RTL support
- Region-specific content

### 4. Performance Optimization
- Server-side rendering
- Static page generation
- Image optimization
- Code splitting
- Edge caching

### 5. Security Measures
- Authentication and authorization
- Access restrictions
- CORS configuration
- Input validation
- XSS protection

## 📋 Development Guidelines

### 1. Code Quality
- Strict TypeScript configuration
- Comprehensive ESLint rules
- Consistent code formatting
- Unit test coverage

### 2. Git Workflow
- Feature branch workflow
- Conventional commit messages
- Pull Request reviews
- Automated testing

### 3. Documentation Standards
- Inline code documentation
- API documentation
- Component storybook
- Development guides

### 4. Performance Metrics
- Core Web Vitals monitoring
- Lighthouse scores
- Error tracking
- User analytics

## 🚀 Deployment Architecture

### Production Environment
- Vercel (Primary hosting)
- Edge functions
- CDN distribution
- Automated deployment

### Development Environment
- Local development setup
- Development server
- Hot module replacement
- Debugging tools

## 🧰 Technologies Used

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

## 🚦 Quick Start

### Create project using create-next-app

Use `create-next-app` to create a new project based on this template by running:

```bash
npx create-next-app -e https://github.com/Nostudy-ai/Nostudy.ai
```

### Install dependencies

```bash
pnpm install
```

### Run development server

```bash
pnpm dev
```

## 📜 License

Licensed under the [Creative Commons Attribution-NonCommercial 4.0 International License (CC BY-NC 4.0)](https://creativecommons.org/licenses/by-nc/4.0/).

## 🤝 How to Contribute

We welcome all kinds of contributions! If you'd like to participate in project development, please follow these steps:

1. Fork the project repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Create a Pull Request

For detailed contribution guidelines, please refer to [CONTRIBUTING.md](./CONTRIBUTING.md).