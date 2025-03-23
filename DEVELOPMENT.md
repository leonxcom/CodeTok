# NoStudy.ai Development Documentation

## Project Overview

NoStudy.ai is a modern web application built with Next.js. It uses TypeScript as the development language and integrates multiple UI component libraries to provide a rich user interface experience.

## Technology Stack

- **Framework**: Next.js 15.2.x
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Component Libraries**: Shadcn UI, Magic UI
- **Package Management**: pnpm

## Directory Structure

```
/
├── src/                # Source code directory
│   ├── app/            # Next.js app router
│   ├── components/     # Components directory
│   │   ├── shadcnui/   # Shadcn UI components
│   │   ├── magicui/    # Magic UI components
│   │   └── ...         # Other custom components
│   ├── lib/            # Utility functions and libraries
│   └── ...             # Other source code directories
├── public/             # Static assets
├── messages/           # Internationalization message files
└── ...                 # Other configuration files
```

## Component Libraries

### Shadcn UI

Shadcn UI is a collection of unstyled components built on Radix UI and Tailwind CSS, providing highly customizable components for building modern user interfaces.

Components are located in the `src/components/shadcnui` directory and exported through the `shadcn` namespace in `@/lib/ui.ts`.

Main components include:

- Basic components: Button, Input, Form, etc.
- Interactive components: Dialog, Sheet, Popover, etc.
- Data display components: Table, DataTable, etc.

### Magic UI

Magic UI is a collection of animated UI components built with React, Tailwind CSS, and Framer Motion, providing rich animation and interactive experiences.

Components are located in the `src/components/magicui` directory and exported through the `magicui` namespace in `@/lib/ui.ts`.

Magic UI components are categorized as follows:

- Basic components (Marquee, Terminal, BentoGrid, etc.)
- Device simulation (Safari, iPhone, Android, etc.)
- Special effects (AnimatedBeam, Confetti, Meteors, etc.)
- Text animations (TextReveal, TypingAnimation, SpinningText, etc.)
- Buttons (RainbowButton, ShimmerButton, etc.)
- Backgrounds (WarpBackground, GridPattern, etc.)

For a detailed list of components, please refer to `src/components/magicui/README.md`.

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

#### Magic UI Components

```bash
pnpm dlx shadcn@latest add "https://magicui.design/r/<component-name>" --yes --overwrite
```

You can also use the `install-magicui.sh` script in the project root to install multiple components.

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
