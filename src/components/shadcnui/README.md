# Shadcn UI Components

This directory contains all Shadcn UI components integrated into the project. Shadcn UI is a collection of re-usable components built with Radix UI and Tailwind CSS, providing a solid foundation for building accessible and customizable user interfaces.

## Installation

All components have been installed via the shadcn CLI:

```bash
pnpm dlx shadcn@latest add <component-name>
```

For example:

```bash
pnpm dlx shadcn@latest add button
pnpm dlx shadcn@latest add dialog
```

## Component Categories

Shadcn UI components are organized into several categories:

### Basic Components
- `button`: Standard button component
- `input`: Text input field
- `textarea`: Multi-line text input
- `label`: Form field label
- `checkbox`: Toggle selection component
- `switch`: Toggle on/off component
- `radio-group`: Group of radio inputs
- `select`: Dropdown selection component
- `slider`: Range slider component
- `avatar`: User or entity representation

### Layout Components
- `card`: Container for related content
- `aspect-ratio`: Maintain width-to-height ratio
- `separator`: Visual divider between content
- `scroll-area`: Customizable scrollable region
- `resizable`: Resizable container component
- `sidebar`: Side navigation component

### Navigation Components
- `navigation-menu`: Primary navigation component
- `menubar`: Horizontal menu component
- `breadcrumb`: Hierarchical path indicator
- `pagination`: Page navigation controls
- `tabs`: Tab-based content organization

### Feedback Components
- `alert`: Contextual message component
- `progress`: Progress indicator
- `skeleton`: Loading state placeholder
- `tooltip`: Contextual information on hover

### Dialog Components
- `dialog`: Modal dialog component
- `alert-dialog`: Confirmation dialog
- `drawer`: Side panel component
- `popover`: Contextual floating content
- `hover-card`: Card displayed on hover
- `sheet`: Slide-in panel component

### Data Display Components
- `table`: Data table component
- `data-table`: Enhanced data table with sorting/filtering
- `calendar`: Date display and selection
- `date-picker`: Date selection component
- `collapsible`: Expandable/collapsible content
- `accordion`: Expandable sections
- `carousel`: Slideshow component
- `command`: Command palette component
- `context-menu`: Right-click menu
- `dropdown-menu`: Dropdown menu component

### Advanced Components
- `form`: Form with validation
- `combobox`: Autocomplete input
- `chart`: Data visualization
- `input-otp`: One-time password input

## Usage

You can import Shadcn UI components in two ways:

### 1. Direct import from component file

```tsx
import { Button } from "@/components/shadcnui/button";
import { Dialog } from "@/components/shadcnui/dialog";

// Using components
<Button variant="default">
  Click me
</Button>

<Dialog>
  <DialogTrigger>Open Dialog</DialogTrigger>
  <DialogContent>Content here</DialogContent>
</Dialog>
```

### 2. Import via unified UI entry point

```tsx
import { shadcn } from "@/lib/ui";

// Using components
<shadcn.Button.Button variant="default">
  Click me
</shadcn.Button.Button>

<shadcn.Dialog.Dialog>
  <shadcn.Dialog.DialogTrigger>Open Dialog</shadcn.Dialog.DialogTrigger>
  <shadcn.Dialog.DialogContent>Content here</shadcn.Dialog.DialogContent>
</shadcn.Dialog.Dialog>
```

## Dependencies

These components depend on:
- React and React DOM
- Tailwind CSS
- Radix UI
- Class Variance Authority
- clsx/tailwind-merge (for className merging)
- Lucide React (for icons)

## Customization

Shadcn UI components can be customized through:

1. **Variants**: Most components use the `cva` (Class Variance Authority) pattern for defining variants
2. **className prop**: All components accept a className prop for additional styling
3. **Tailwind configuration**: Global styling can be adjusted in the Tailwind config

## Notes

- Shadcn UI is not a traditional component library, but a collection of reusable components that are copied directly into your project
- Components can be easily modified to fit your project's design requirements
- For accessibility best practices, refer to the Radix UI documentation for the corresponding primitive 