# Vibetok Development Guide

## Project Overview

Vibetok is an innovative AI project and code application sharing platform. It is built with Next.js, uses TypeScript as the development language, and integrates multiple UI component libraries to provide a rich user interface experience.

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

## No-Login Code Sharing Feature

The platform now supports code sharing without requiring user login, following the implementation of services like yourware.so.

### Feature Overview

- **Upload Methods:**
  - Direct code pasting into text area
  - File upload (HTML, TSX, CSS, JS)
  - Folder upload (containing HTML, CSS, JS files)
  
- **Technical Implementation:**
  - Unique project ID generation using UUID
  - Files stored in Vercel Blob Storage with `@vercel/blob`
  - Project metadata stored in Neon PostgreSQL
  - File size limit: 10MB
  - TSX file execution support with browser-based Babel compilation

### Storage Implementation

```typescript
// Project storage with Vercel Blob
import { put } from '@vercel/blob';

// Upload files to Vercel Blob
const uploadFile = async (file, projectId) => {
  const { url } = await put(`projects/${projectId}/${file.name}`, file, {
    access: 'public',
  });
  return url;
};

// Store metadata in PostgreSQL
const storeProject = async (projectId, files) => {
  await db.insert(projects).values({
    id: projectId,
    files: JSON.stringify(files),
    createdAt: new Date()
  });
};
```

### API Endpoints

```
POST /api/projects         # Create new project with uploaded files/code
GET  /api/projects/random  # Get a random project
GET  /api/projects/:id     # Get specific project data
```

### Interface Components

1. **Upload Page** (`/[locale]/upload`)
   - Split interface with paste area and drag-drop zone
   - Handles text input and file uploads
   - Creates projects via API

2. **Project Viewing** (`/[locale]/project/[id]`)
   - Displays uploaded code in a viewer
   - Supports toggling between code view and preview
   - Includes features like "Remove Frame" for distraction-free viewing
   - Sidebar file browser for multi-file projects

3. **Home Page Random Projects**
   - Dice button (🎲) for exploring random projects
   - Preview panel for featured random project

### Security Considerations

- File type validation to prevent malicious uploads
- Content sanitization to prevent XSS attacks
- Sandbox isolation for iframe code preview
