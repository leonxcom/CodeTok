# Nostudy.ai - A Real Project-Driven Growth Platform for AI Creators

English | [简体中文](./README-zh-CN.md)

Say goodbye to isolated learning! Build real projects in public and gain your first 1,000 dedicated followers!

## 📑 Table of Contents

- [Core Concepts](#core-concepts)
- [Technical Architecture](#technical-architecture)
- [System Architecture](#system-architecture)
- [Core Features Implementation](#core-features-implementation)
- [Development Standards](#development-standards)
- [Deployment Architecture](#deployment-architecture)
- [Quick Start](#quick-start)
- [License](#license)

## 💡 Core Concepts

- **First Principles Learning**: Our learning is not just about understanding the world, but transforming it!
- **Project-Driven**: Gain experience through "learning by doing" with real projects, not just knowledge accumulation
- **AI-Native**: Deeply integrate AI technology into the learning process, providing personalized learning experiences and intelligent tutoring
- **One-Click Deployment**: Simplify AI project deployment processes, allowing creators to focus on content and value creation
- **Build in Public**: Develop projects in the public eye, receive feedback, and establish your personal brand
- **Fan Connection**: Build a community of 1,000 dedicated followers, monetize knowledge, and share team resources

## 🏗 Technical Architecture

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
  - MagicUI Design
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
- **Package Manager**: pnpm
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
Nostudy.ai/
├── app/                      # Next.js 15 App Router
│   ├── [locale]/            # Internationalized routes
│   ├── api/                 # API routes
│   └── providers.tsx        # Global providers
├── components/              # React components
│   ├── ui/                 # Shadcn UI components
│   ├── magic/              # MagicUI components
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

## 🔥 Core Features Implementation

### 1. AI-Native Learning System
- Real-time code analysis and feedback
- Intelligent progress tracking
- Personalized learning path generation
- Smart content recommendations

### 2. Project-Driven Learning
- Real project templates
- Step-by-step guidance
- Automated code review
- Progress tracking and analysis

### 3. Multi-language Support
- Route-based dynamic internationalization (supporting 12 languages including English, Chinese, Japanese)
- Language detection and switching
- RTL support
- Region-specific content

### 4. Performance Optimization
- Server-side rendering
- Static site generation
- Image optimization
- Code splitting
- Edge caching

### 5. Security Measures
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
- Lighthouse scores
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

To create a new project based on this template using `create-next-app`, run the following command:

```bash
npx create-next-app -e https://github.com/Nostudy-ai/Nostudy.ai
```

### Install dependencies

```bash
pnpm install
```

### Start the development server

```bash
pnpm dev
```

## 📜 License

Licensed under the [Creative Commons Attribution-NonCommercial 4.0 International License (CC BY-NC 4.0)](https://creativecommons.org/licenses/by-nc/4.0/).

## 🤝 How to Contribute

We welcome contributions of all kinds! If you want to participate in project development, please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Create a Pull Request

For detailed contribution guidelines, please see [CONTRIBUTING.md](./CONTRIBUTING.md). 