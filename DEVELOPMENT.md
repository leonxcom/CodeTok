# Vilivili Development Documentation

## Project Overview

Vilivili is an innovative AI project and code application sharing platform. It is built with Next.js, uses TypeScript as the development language, and integrates multiple UI component libraries to provide a rich user interface experience.

## Technology Stack

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
- **Package Management**: pnpm

### Backend & Database

- **Database**: Neon Database (Serverless PostgreSQL)
- **ORM**: Drizzle ORM
- **Authentication**: Better Auth
- **API**: Next.js API Routes + Next Safe Action
- **Email Service**: Resend
- **Payment Processing**:
  - Stripe
  - Creem.io

### Internationalization

- **i18n Framework**: Next-intl

### Analytics & AI

- **Analytics Tools**:
  - Plausible Analytics
  - Google Analytics
- **AI Integration**: Vercel AI SDK
- **Content Management**: Content Collections

### Data Visualization

- **Tables**: Tanstack Table

### Development Tools

- **AI IDE**: Trae
- **Code Quality**:
  - ESLint
  - Prettier
  - TypeScript Strict Mode
- **Git Workflow**:
  - Conventional Commits
  - Branch Development
  - GitHub Actions CI/CD

## Directory Structure

```
Vilivili/
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

## Component Libraries

### Shadcn UI

Shadcn UI is a collection of unstyled components built on Radix UI and Tailwind CSS, providing highly customizable components for building modern user interfaces.

Components are located in the `src/components/shadcnui` directory and exported through the `shadcn` namespace in `@/lib/ui.ts`.

Main components include:

- Basic components: Button, Input, Form, etc.
- Interactive components: Dialog, Sheet, Popover, etc.
- Data display components: Table, DataTable, etc.



## Development Guidelines

### Core Principle

**Always Follow Official Documentation**: When integrating libraries, frameworks, or APIs, strictly adhere to their official documentation as the primary reference standard. This ensures compatibility, proper implementation, and leverages best practices recommended by the technology creators. Official documentation takes precedence over other references or previous implementation patterns.

### Code Style

- Use TypeScript for type checking
- Follow ESLint and Prettier configuration for code formatting
- Modular development, each functional module should have its own directory

### Component Development Principles

1. **Modularization**: Each functional module should have two README files, one in English and one in Simplified Chinese, summarizing functionality, interfaces, and usage
2. **Iterative Development**: Develop one feature at a time, follow best practices, avoid complex hacks
3. **Timely Commits**: Commit to git after completing each milestone

### Naming Conventions

- Component file names: PascalCase (e.g., `Button.tsx`)
- Utility function file names: camelCase (e.g., `useMediaQuery.ts`)
- CSS class names: kebab-case or follow Tailwind CSS conventions

### Comment Guidelines

- Component files should have a description of the component functionality at the top
- Complex logic should have corresponding comments
- Public APIs and interfaces should have complete documentation comments
- Code comments should be in English

### Internationalization

- Interface text should use internationalization scheme, not hardcoded
- Support for switching between Chinese and English
- Internationalization files located in the `messages` directory

### Package Management

- Use pnpm consistently for package management
- Ensure dependency versions are locked when adding new dependencies

### Git Commit Conventions

- Commit messages should be in English
- Commit message format: `<type>: <description>`
- Types include: feat (new feature), fix, docs, style, refactor, test, chore

## Local Development

### Environment Setup

1. Clone the repository
2. Install dependencies: `pnpm install`
3. Run the development server: `pnpm dev`

### Installing New Components

#### Shadcn UI Components

```bash
pnpm dlx shadcn@latest add <component-name>
```



## Building and Deployment

### Build

```bash
pnpm build
```

### Preview Build

```bash
pnpm start
```

## Troubleshooting

### Common Issues

If you encounter issues related to Magic UI component imports, it might be due to import path problems. Magic UI components by default import dependencies from `@/components/ui`, while in our project structure these components are located in `@/components/shadcnui`.

For fixing import paths, refer to the script fix method used previously.
