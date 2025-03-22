# Component Library

This directory contains various React components for the project. The components are organized in a modular structure to facilitate maintenance and reuse.

## Directory Structure

- `mobile-nav/` - Mobile navigation component with responsive design
- `ui/` - Shadcn UI components customized for the project
- `*.tsx` - Individual components used throughout the application

## Components Overview

| Component      | Description                                      | Documentation                    |
| -------------- | ------------------------------------------------ | -------------------------------- |
| MobileNav      | Mobile-optimized navigation with dropdown menu   | [README](./mobile-nav/README.md) |
| MainNav        | Main navigation bar for desktop screens          | -                                |
| SiteHeader     | Main header component with responsive navigation | -                                |
| LanguageToggle | Language switching component with dropdown       | -                                |
| ThemeToggle    | Dark/light mode toggle component                 | -                                |
| Icons          | Common icon components and wrappers              | -                                |

## Development Guidelines

When creating new components:

1. Create a dedicated directory for complex components with multiple files
2. Include both English (README.md) and Chinese (README-zh-CN.md) documentation
3. Follow the project's design system using Shadcn UI and MagicUI
4. Use TypeScript for type safety
5. Implement responsive design with Tailwind CSS
6. Add accessibility features
7. Support internationalization

## Best Practices

- Use early returns for readability
- Prefer Tailwind classes over custom CSS
- Use descriptive variable and function names
- Handle event functions with "handle" prefix (e.g., handleClick)
- Implement appropriate accessibility attributes
- Prefer const arrow functions over regular functions

For more details on specific components, refer to their respective documentation folders.
