# CodeTok - An Innovative Platform for Sharing AI Projects and Code Applications

English | [简体中文](./README-zh-CN.md)

CodeTok is an innovative platform for sharing AI projects and code applications. It's built with Next.js, uses TypeScript as the development language, and integrates multiple UI component libraries to provide a rich user interface experience.

## 📑 Table of Contents

- [Technology Architecture](#technology-architecture)
- [System Architecture](#system-architecture)
- [Core Feature Implementation](#core-feature-implementation)
- [Development Standards](#development-standards)
- [Deployment Architecture](#deployment-architecture)
- [Quick Start](#quick-start)
- [License](#license)

## 🏗 Technology Architecture

### Tech Stack

#### Frontend
- **Framework**: 
  - Next.js 15 (App Router)
  - React 18.3.1
- **UI Library**: 
  - React 19 (Next.js)
  - React 18.3.1
- **Development Language**: TypeScript
- **Styling**: 
  - Tailwind CSS v4 (Next.js)
  - Tailwind CSS 3.4.4
- **Component Libraries**: 
  - Shadcn UI
  - Radix UI (Primitives)
- **Build Tools**:
  - Vite 5.2.13
- **Icon Library**:
  - Lucide React 0.424.0
- **Utility Libraries**:
  - clsx - Tool for constructing className strings
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

#### Data Visualization
- **Tables**: Tanstack Table

#### Development Tools
- **AI IDE**: [Trae](https://www.trae.ai/)
- **Package Management**: pnpm
- **Code Quality**:
  - ESLint
  - Prettier
  - TypeScript Strict Mode
- **Git Workflow**:
  - Conventional Commits
  - Branch Development
  - GitHub Actions CI/CD

### System Architecture

```
CodeTok/
├── app/                      # Next.js 15 App Router
│   ├── [locale]/            # Internationalized routes
│   ├── api/                 # API routes
│   └── providers.tsx        # Global providers
├── components/              # React components
│   ├── ui/                 # Shadcn UI components
│   └── features/           # Feature components
├── db/                      # Database Schema and Client
│   ├── schema.ts           # Drizzle Schema
│   └── index.ts            # DB Client
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

## 🔥 Core Feature Implementation

### 1. Multilingual Support
- Route-based dynamic internationalization (supporting 12 languages including Chinese, English, Japanese)
- Language detection and switching
- RTL support
- Region-specific content

### 2. Performance Optimization
- Server-side rendering
- Static page generation
- Image optimization
- Code splitting
- Edge caching

### 3. Security Measures
- Authentication and authorization
- Access restrictions
- CORS configuration
- Input validation
- XSS protection

## 📋 Development Standards

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
- Lighthouse scoring
- Error tracking
- User analytics

## 🚀 Deployment Architecture

### Production Environment
- Vercel (primary hosting)
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

### Create a project using create-next-app

Use `create-next-app` to create a new project based on this template by running:

```bash
pnpm create next-app -e https://github.com/leohuangbest/codetok
```

### Install dependencies

```bash
pnpm install
```

### Run the development server

```bash
pnpm dev
```

## 📜 License

Licensed under the [Creative Commons Attribution-NonCommercial 4.0 International License (CC BY-NC 4.0)](https://creativecommons.org/licenses/by-nc/4.0/).

## 🤝 How to Contribute

We welcome contributions of all forms! If you want to participate in project development, please refer to the following steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Create a Pull Request

For detailed contribution guidelines, see [CONTRIBUTING.md](./CONTRIBUTING.md).