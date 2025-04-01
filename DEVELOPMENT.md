# Vibetok Development Guide

## Project Overview

Vibetok is an innovative AI project and code application sharing platform. It is built with Next.js, uses TypeScript as the development language, and integrates multiple UI component libraries to provide a rich user interface experience.

## MVP Development Priorities

Below are the prioritized development areas for the Minimum Viable Product (MVP) version of Vibetok, arranged by importance:

### 1. Core Functionality Completion & Stability (High Priority)

1. **Project Browsing and Display System**
   - Enhance reliability testing for random project redirection
   - Optimize performance for project display pages, especially for external embedded projects
   - Implement project filtering and categorization features to allow users to browse projects by type/tags
   - **TikTok-style browsing experience** with up/down navigation and intelligent recommendations
     - Down button/swipe: Show next recommended project based on current project attributes
     - Up button/swipe: Navigate back to previously viewed projects using browsing history
     - Client-side history tracking with sessionStorage for persistence
     - Server-side recommendation API that considers project type, similarity, and popularity
   - **Enhanced home page loading experience** with client-side redirection
     - Visual loading indicator showing brand elements
     - Improved error handling and fallback mechanism
     - Elimination of NEXT_REDIRECT errors in development console

2. **User Authentication System**
   - Implement basic user registration/login functionality
   - Integrate third-party authentication (GitHub, Google) to simplify user registration
   - Set up user permissions and role management

3. **Database Stability**
   - Optimize database queries and connections to ensure production environment stability
   - Improve data migration scripts and backup/restore mechanisms
   - Ensure database connection pool configuration is suitable for production environment loads

### 2. User Interaction Features (Medium Priority)

1. **Project Interaction Functionality**
   - Implement like, favorite, and share features
   - Add project comment system
   - Project view counting and trending projects display

2. **Upload and Create Projects**
   - Optimize project upload process, supporting multiple file formats
   - Add more templates and example projects
   - Implement basic online code editing functionality

3. **User Profiles**
   - User profile pages and settings
   - User project favorites list
   - User contribution history

### 3. Extended Features (Low Priority, Post-MVP)

1. **Community Features**
   - User follow system
   - Activity streams and notifications
   - Project collaboration features

2. **Content Management**
   - Admin control panel
   - Content moderation tools
   - Reporting and content policy enforcement

3. **Advanced Features**
   - AI-assisted code generation
   - Project statistics and analytics
   - Integrated testing and CI/CD support

### Implementation Suggestions

When implementing the MVP, focus on:

1. **Completing the User Authentication System**
   - This is the most crucial missing core functionality, essential for user interaction and content management
   - Implement basic registration/login functionality, integrate Better Auth

2. **Improving Project Browsing Experience**
   - Add categories, tags, and search functionality
   - Implement a project list page, providing more browsing options beyond random redirects
   - Optimize project page loading performance, particularly for externally embedded projects

3. **Adding Basic Interaction Features**
   - Implement like and favorite functionality
   - Add a simple comment system
   - Implement project sharing and social media integration

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
- **Storage**: Vercel Blob Storage (For file uploads and code sharing)
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
Vibetok/
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

Components are located in the `src/components/ui` directory and exported through the `@/components/ui` import path.

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

If you encounter issues related to Magic UI component imports, it might be due to import path problems. Components should be imported from `@/components/ui`.

For fixing import paths, refer to the script fix method used previously.

## UI Design Specifications

### Core Interaction Elements

The platform features several key interaction elements designed to enhance user engagement:

#### Dice Random Navigation Button

The platform's core interactive element is a dice button (🎲) replacing the traditional red button:
- **Function**: Navigates users to a random code snippet when clicked
- **Design**: Uses dice emoji (🎲) to intuitively represent randomness
- **Hover Effect**: Displays "Random Next Project" text only when hovering over the dice
- **Placement**: Positioned at the bottom center of the interface or in a prominent area of the page
- **Accessibility**: Must be easily clickable on both desktop and mobile devices

#### Frame Controls

- **Remove Frame**: Allows users to view content without surrounding UI elements
  - Removes navigation and non-essential UI components for a focused reading experience
  - Must provide a clear way to restore the frame
- **Home**: Quick navigation back to the platform's homepage

### Layout Structure

The interface follows a container-based design approach:

```
+-------------------------------------------------------+
|  Branding                               [Controls]    |
|-------------------------------------------------------|
|                                                       |
|  +---------------------------------------------------+  |
|  |                 Code Display Area                 |  |
|  +---------------------------------------------------+  |
|                                                       |
|  +---------------------------------------------------+  |
|  |            Comments/Interaction Area              |  |
|  +---------------------------------------------------+  |
|                                                       |
|  [Nav Area]           [Red Button]       [Frame Ctrl]  |
+-------------------------------------------------------+
```

### Vertical Interaction Buttons

Interaction buttons are vertically arranged on the right side of the code display area:

```
+---------------------------------------------------+ +-----+
| [Lang] [Copy] [Fullscreen]                        | |     |
|---------------------------------------------------| | [Like]|
|                                                   | |     |
|                  Code Content                     | |-----|
|                                                   | | [Cmnt]|
|                                                   | |     |
+---------------------------------------------------+ |-----|
                                                      | [Save]|
                                                      |     |
                                                      |-----|
                                                      | [Share]|
                                                      |     |
                                                      +-----+
```

#### Button Functionality

- **Like**: Allows users to express appreciation for a code snippet
- **Comment**: Opens/closes the comment section
- **Save**: Adds the code snippet to the user's collection
- **Share**: Generates a shareable link to the code snippet

### Container Design

Each code snippet is contained within a self-contained module with the following structure:
- Title section
- Tags section
- Code display area with syntax highlighting
- Interaction area

This container-based approach ensures:
- Proper encapsulation of related content
- Consistency across the platform
- Responsive behavior for different screen sizes
- Support for both light and dark themes

### Technical Implementation Considerations

1. **Button Implementation**: Utilize Shadcn UI components
2. **Syntax Highlighting**: Integrate libraries supporting all major programming languages
3. **Animation Effects**: Implement subtle animations for button interactions and state changes
4. **Theme Integration**: All UI elements must respect the user's chosen theme
5. **Dice Button**: Use standard emoji (🎲) with hover text explanation rather than custom graphics
6. **Frame Controls**: Employ CSS classes and state management for toggling UI elements

### Accessibility Requirements

1. **Keyboard Navigation**: All interactive elements must be keyboard accessible
2. **Screen Reader Support**: Provide appropriate ARIA labels for all interactive elements
3. **Color Contrast**: Maintain WCAG 2.1 AA compliance for all text and interactive elements
4. **Responsive Design**: UI must adapt smoothly to all device sizes and orientations

This design system prioritizes simplicity, engagement, and accessibility while maintaining a professional, code-focused user experience.
