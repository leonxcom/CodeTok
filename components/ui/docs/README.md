# UI Component Migration

This document describes the migration process from HeroUI to Shadcn UI for our project.

## Overview

The UI component migration involves transitioning from HeroUI components to Shadcn UI for core components. This document outlines the migration process, component interfaces, and usage patterns.

## Components

The following components have been migrated from HeroUI to Shadcn UI:

| Component | Status | Description | Import Path |
|-----------|--------|-------------|------------|
| Button | ✅ Migrated | Primary action component | `import { Button } from "@/components/ui/button"` |
| Input | ✅ Migrated | Text input field | `import { Input } from "@/components/ui/input"` |
| Card | ✅ Migrated | Container component | `import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"` |
| Label | ✅ Migrated | Form label | `import { Label } from "@/components/ui/label"` |
| Avatar | ✅ Migrated | User avatar | `import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"` |
| Dialog | ✅ Migrated | Modal dialog | `import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"` |
| Dropdown Menu | ✅ Migrated | Dropdown menu | `import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"` |
| Form | ✅ Migrated | Form component with validation | `import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form"` |
| Navbar | ✅ Migrated | Navigation bar | `import { Navbar } from "@/components/ui/navbar"` |
| Switch | ✅ Migrated | Toggle switch | `import { Switch } from "@/components/ui/switch"` |
| Listbox | ✅ Migrated | Selection component | `import { Listbox } from "@/components/ui/listbox"` |

## Usage Examples

### Button Component

```tsx
import { Button } from "@/components/ui/button";

export function ButtonExample() {
  return (
    <div className="flex gap-2">
      <Button>Default</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="link">Link</Button>
    </div>
  );
}
```

### Form Component

```tsx
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  username: z.string().min(2).max(50),
});

export function FormExample() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="Username" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
```

## Migration Guide

When migrating a component from HeroUI to Shadcn UI, follow these steps:

1. Install the necessary dependencies using PNPM:
   ```bash
   pnpm add shadcn-ui
   ```

2. Use the Shadcn UI CLI to add the component:
   ```bash
   pnpm dlx shadcn-ui@latest add button
   ```

3. Update imports in your component files:
   ```tsx
   // Before
   import { Button } from "@heroui/button";
   
   // After
   import { Button } from "@/components/ui/button";
   ```

4. Adjust component props according to the Shadcn UI API.

5. Update event handlers and styling to match the Shadcn UI approach.

6. Test the component thoroughly in light and dark modes.

## Theme Configuration

The Shadcn UI theme is configured in `styles/globals.css` with CSS variables for color schemes. The theme follows the "New York" style as defined in `components.json`.

## Accessibility

All migrated components maintain or improve accessibility standards. Key features include:

- Proper ARIA attributes
- Keyboard navigation support
- Focus management
- Color contrast compliance

## Best Practices

When working with the migrated UI components:

1. Use Tailwind classes for styling
2. Leverage the variant system for component variations
3. Maintain consistent naming conventions for event handlers (e.g., `handleClick`)
4. Implement proper accessibility attributes
5. Test components in both light and dark modes

## Related Files

- `components.json`: Shadcn UI configuration
- `tailwind.config.js`: Tailwind CSS configuration
- `styles/globals.css`: Global styles and theme variables
- `app/providers.tsx`: Theme provider setup 