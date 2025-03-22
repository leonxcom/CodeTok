# Magic UI Components

This document describes the enhanced interactive UI components (Magic UI) for our project.

## Overview

Magic UI components provide enhanced interactive effects and animations to improve user experience. These components are built on top of the core UI components and add magic-like interactive behaviors.

## Components

| Component | Status | Description | Import Path |
|-----------|--------|-------------|------------|
| Hover | ✅ Implemented | Component with enhanced hover effects | `import { Hover } from "@/components/magic/hover"` |
| Spotlight | 🔄 Planned | Component with spotlight effect | Coming soon |
| Glow | 🔄 Planned | Component with glow effect | Coming soon |
| Fade | 🔄 Planned | Component with fade-in/fade-out animations | Coming soon |
| Typewriter | 🔄 Planned | Text with typewriter effect | Coming soon |

## Usage Examples

### Hover Component

The Hover component adds a subtle interactive effect when users hover over the element. It creates a more engaging user experience with minimal effort.

```tsx
import { Hover } from "@/components/magic/hover";

export function HoverExample() {
  return (
    <Hover className="p-4 bg-background rounded-lg border">
      <p>Hover over me to see the magic effect!</p>
    </Hover>
  );
}
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| className | string | "" | Additional CSS classes |
| children | ReactNode | required | Content to display |
| variant | "subtle" \| "emphasis" | "subtle" | Effect intensity |
| radius | number | 500 | Effect radius |
| intensity | number | 0.2 | Effect intensity (0-1) |
| borderWidth | number | 1 | Border width when hovered |
| duration | number | 200 | Animation duration in ms |

## Implementation Guide

When implementing a new Magic UI component, follow these guidelines:

1. Install necessary dependencies using PNPM:
   ```bash
   pnpm add framer-motion
   ```

2. Create a new file in the `components/magic` directory.

3. Import required libraries:
   ```tsx
   import React from "react";
   import { motion } from "framer-motion";
   import { cn } from "@/lib/utils";
   ```

4. Implement the component with appropriate animations and effects.

5. Export the component with a meaningful name.

6. Document the component's props and usage.

## Accessibility Considerations

When creating Magic UI components, ensure they:

1. Work without animations when reduced motion is enabled
2. Don't rely solely on hover for important interactions
3. Maintain proper contrast ratios
4. Support keyboard navigation
5. Include appropriate ARIA attributes

## Best Practices

1. Prefer subtle effects over flashy ones
2. Ensure animations are smooth and performant
3. Make effects optional with variants
4. Test on different devices and screen sizes
5. Ensure the component degrades gracefully in browsers that don't support advanced CSS features

## Related Files

- `lib/utils.ts`: Utility functions for class name merging
- `components/ui/*`: Core UI components
- `styles/globals.css`: Global styles and animations 