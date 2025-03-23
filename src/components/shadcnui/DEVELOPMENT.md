# Shadcn UI Components Development

This directory contains all Shadcn UI components integrated into the project. This document provides guidelines for development and customization.

## Adding New Components

To add a new Shadcn UI component, use the shadcn CLI:

```bash
pnpm dlx shadcn@latest add <component-name>
```

The CLI will place the component files in this directory. Note that our project uses a customized setup where components are installed to `src/components/shadcnui` instead of the default `src/components/ui`.

## Component Structure

Most Shadcn UI components follow a similar structure:

1. **Import dependencies**: Radix UI primitives, styling utilities, types
2. **Define types**: Component props interfaces
3. **Define variants**: Using `cva` for style variants
4. **Component implementation**: The main component function
5. **Export subcomponents**: If the component has multiple parts (like Dialog)

Example:

```tsx
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

// Types
export interface ButtonProps extends 
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

// Variants
export const buttonVariants = cva("...", {
  variants: { ... },
  defaultVariants: { ... }
})

// Component implementation
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({...}) => {
  // Implementation
})
Button.displayName = "Button"
```

## Customization Guidelines

When customizing components, follow these guidelines to maintain consistency:

### 1. Style Customization

- Modify variants in the `cva` configuration
- For global style changes, adjust the Tailwind configuration
- For component-specific changes, modify the component's CSS classes
- Use the `cn()` utility for merging classes

Example:

```tsx
export const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        // Add a new variant
        custom: "bg-orange-500 text-white hover:bg-orange-600",
      },
      // Other variants...
    },
  }
)
```

### 2. Functional Customization

- Add new props to extend component functionality
- Use composition for complex customization needs
- Maintain the original component API for compatibility

Example:

```tsx
export interface CustomButtonProps extends ButtonProps {
  customProp?: boolean
}

export const CustomButton = React.forwardRef<HTMLButtonElement, CustomButtonProps>(
  ({ customProp, ...props }, ref) => {
    // Custom logic based on customProp
    return <Button ref={ref} {...props} />
  }
)
CustomButton.displayName = "CustomButton"
```

## Accessibility Considerations

When developing or customizing components:

1. Ensure keyboard navigation works correctly
2. Maintain ARIA attributes and roles
3. Preserve focus management
4. Test with screen readers
5. Follow color contrast guidelines

## Testing Components

Test components thoroughly:

1. **Functional testing**: Ensure all features work
2. **Visual testing**: Check appearance in different states
3. **Accessibility testing**: Verify accessibility features
4. **Responsive testing**: Test on different screen sizes

## Component Integration

When integrating Shadcn UI components into your application:

1. Use the direct import method for simpler components
2. Use the namespace import from `@/lib/ui` for complex components
3. For complex forms, use the Form component with React Hook Form
4. For data tables, use the enhanced DataTable component

## Troubleshooting Common Issues

### Styling Issues

If styles aren't applying correctly:
- Check if Tailwind classes are correct
- Verify that the `cn()` utility is being used properly
- Make sure the component is not overridden by more specific CSS

### Functional Issues

For functional issues:
- Check if the proper props are passed
- Verify correct component composition
- Look for console errors related to misusing Radix primitives

## Performance Optimization

For better performance:
- Memoize components when appropriate
- Use lazy loading for larger components
- Watch out for expensive rerenders

## Documentation

When adding or significantly modifying a component:
1. Update the component's JSDoc comments
2. Update the README if necessary
3. Add usage examples in comments or documentation

## Additional Resources

- [Shadcn UI Documentation](https://ui.shadcn.com)
- [Radix UI Documentation](https://www.radix-ui.com)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Class Variance Authority Documentation](https://cva.style/docs) 