# Component Development Guidelines

This document outlines the standards and best practices for developing components in the Nostudy.ai project.

## Component Structure

### Simple Components

For simple, single-file components:

```
src/components/
└── component-name.tsx
```

### Complex Components

For complex components with multiple files:

```
src/components/
└── component-name/
    ├── index.tsx       # Main component export
    ├── sub-component.tsx  # Sub-components if needed
    ├── utils.ts        # Component-specific utilities
    ├── README.md       # English documentation
    └── README-zh-CN.md # Chinese documentation
```

## Documentation Requirements

Each component or component directory must include:

1. **English Documentation** (README.md):

   - Component overview
   - API/Props interface
   - Usage examples
   - Implementation details
   - Best practices

2. **Chinese Documentation** (README-zh-CN.md):
   - Same structure as the English documentation, translated to Chinese

## Coding Standards

### General Guidelines

- Use TypeScript for all components
- Include proper type definitions for props
- Add JSDoc comments for complex functions
- Follow the DRY (Don't Repeat Yourself) principle
- Keep components focused on a single responsibility

### Naming Conventions

- **Components**: PascalCase (e.g., `ButtonGroup`)
- **Files**: kebab-case (e.g., `button-group.tsx`)
- **Folders**: kebab-case (e.g., `button-group/`)
- **Event Handlers**: camelCase with "handle" prefix (e.g., `handleClick`)
- **Props interfaces**: PascalCase with "Props" suffix (e.g., `ButtonProps`)

### Component Structure

```tsx
// Imports
import * as React from 'react'
// ... other imports

// Types
interface ComponentProps {
  // props definition
}

// Component
export function Component({ prop1, prop2 }: ComponentProps) {
  // Implementation
  return (
    // JSX
  )
}
```

### Styling

- Use Tailwind CSS for styling
- Follow the project's design system (Shadcn UI + MagicUI)
- Use `cn()` utility for conditional classes
- Prefer composition over inheritance

### Accessibility

- Include proper ARIA attributes
- Ensure keyboard navigation works
- Support focus management
- Add appropriate `tabIndex` values
- Include screen reader text where necessary

## Testing

For complex components, consider adding:

- Unit tests for utility functions
- Component tests for UI behavior
- Snapshot tests for UI appearance

## Examples

### Example Button Component

```tsx
// button.tsx
import * as React from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'default',
      size = 'md',
      isLoading,
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <button
        className={cn(
          'rounded-md font-medium focus:outline-none focus:ring-2',
          // Variant styles
          variant === 'default' &&
            'bg-primary text-primary-foreground hover:bg-primary/90',
          variant === 'outline' &&
            'border border-input bg-background hover:bg-accent',
          variant === 'ghost' && 'hover:bg-accent hover:text-accent-foreground',
          // Size styles
          size === 'sm' && 'h-8 px-3 text-xs',
          size === 'md' && 'h-10 px-4 text-sm',
          size === 'lg' && 'h-12 px-6 text-base',
          // Loading state
          isLoading && 'cursor-not-allowed opacity-70',
          className,
        )}
        ref={ref}
        disabled={isLoading}
        {...props}
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <span className="animate-spin">...</span>
            {children}
          </span>
        ) : (
          children
        )}
      </button>
    )
  },
)
Button.displayName = 'Button'
```
