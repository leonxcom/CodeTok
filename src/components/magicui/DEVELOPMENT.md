# Magic UI Components Development

This directory contains all Magic UI components integrated into the project. Magic UI is a collection of beautiful, animated UI components built with React, Tailwind CSS and Framer Motion.

## Installation

All components have been installed via the `install-magicui.sh` script in the root directory. This script uses the shadcn CLI to add components from the Magic UI registry.

## Component Categories

Magic UI components are organized into several categories:

### Basic Components
- `marquee`: A smooth scrolling text or element marquee
- `terminal`: Terminal-like text display with typing animation
- `bento-grid`: Responsive grid layout for card-based UIs
- `animated-list`: List with staggered animations for items
- `dock`: macOS-style dock with hover animations
- `globe`: Interactive 3D globe visualization
- `tweet-card`: Pre-styled Twitter/X card component
- `orbiting-circles`: Animated circles that orbit around a center point
- `avatar-circles`: Circles of avatars with interactive animations
- `icon-cloud`: Interactive cloud of floating icons
- `animated-circular-progress-bar`: Animated circular progress indicator
- `file-tree`: Interactive file/directory tree visualization
- `code-comparison`: Side-by-side code comparison display
- `script-copy-btn`: Button for copying code snippets
- `scroll-progress`: Visual indicator of scroll progress
- `lens`: Magnification lens effect for content
- `pointer`: Custom animated pointer/cursor component

### Device Simulation
- `safari`: Safari browser window simulation
- `iphone-15-pro`: iPhone 15 Pro device mockup
- `android`: Android device mockup

### Special Effects
- `animated-beam`: Animated light beam effect
- `border-beam`: Border with animated light effect
- `shine-border`: Shimmering border animation
- `magic-card`: Card with hover effects
- `meteors`: Meteor/shooting star animation background
- `neon-gradient-card`: Card with neon gradient effects
- `confetti`: Confetti particle animation
- `particles`: Generalized particle system
- `cool-mode`: Special effects overlay
- `scratch-to-reveal`: Interactive scratch-off reveal effect

### Text Animations
- `text-animate`: General text animation utilities
- `line-shadow-text`: Text with line shadow effects
- `aurora-text`: Text with aurora-like color effects
- `number-ticker`: Animated number counter
- `animated-shiny-text`: Text with shiny animation
- `animated-gradient-text`: Text with animated gradient
- `text-reveal`: Text reveal animation
- `hyper-text`: Hypertext with animation effects
- `word-rotate`: Rotating words animation
- `typing-animation`: Typewriter text effect
- `scroll-based-velocity`: Scroll-based text animation
- `flip-text`: Text with flip animation
- `box-reveal`: Box-based text reveal animation
- `sparkles-text`: Text with sparkle effects
- `morphing-text`: Text with morphing animations
- `spinning-text`: Text with spinning animation

### Buttons
- `rainbow-button`: Button with rainbow effects
- `shimmer-button`: Button with shimmer animation
- `shiny-button`: Button with shine effect
- `interactive-hover-button`: Button with interactive hover
- `animated-subscribe-button`: Subscription button with animation
- `pulsating-button`: Button with pulse animation
- `ripple-button`: Button with ripple effect

### Backgrounds
- `warp-background`: Background with warp effect
- `flickering-grid`: Grid with flickering animation
- `animated-grid-pattern`: Animated grid pattern background
- `retro-grid`: Retro-style grid background
- `ripple`: Ripple animation effect
- `dot-pattern`: Dot pattern background
- `grid-pattern`: Grid pattern background
- `interactive-grid-pattern`: Interactive grid background

## Development Guidelines

### Adding New Components

To add a new Magic UI component, you can use the `install-magicui.sh` script in the root directory or install it directly:

```bash
pnpm dlx shadcn@latest add "https://magicui.design/r/<component-name>" --yes --overwrite
```

### Import Path Fixes

After installing a new component, you may need to fix the import paths. Magic UI components default to importing from `@/components/ui/`, but our project uses `@/components/shadcnui/`. You can modify the imports manually or use a script similar to what we used previously:

```bash
find src/components/magicui -name "*.tsx" -exec sed -i '' 's|from "@/components/ui/|from "@/components/shadcnui/|g' {} \;
```

### Creating Variants

You can create custom variants of Magic UI components by:

1. Creating a new file in this directory
2. Importing the base component
3. Extending it with your custom styles or behavior

Example:

```tsx
// src/components/magicui/custom-marquee.tsx
import { Marquee } from "./marquee";
import { cn } from "@/lib/utils";

export interface CustomMarqueeProps extends React.ComponentProps<typeof Marquee> {
  customProp?: boolean;
}

export function CustomMarquee({ className, customProp, ...props }: CustomMarqueeProps) {
  return (
    <Marquee 
      className={cn("custom-styles", className)}
      {...props}
    />
  );
}
```

### Testing Components

When implementing or modifying a component, ensure to:

1. Test it with different prop combinations
2. Verify responsive behavior on different screen sizes
3. Test animations and interactions
4. Check accessibility compliance

### Integration with App

To use these components in your app, import them from this directory or via the unified UI entry point in `@/lib/ui.ts`.

## Usage Examples

### Basic Usage

```tsx
import { Marquee } from "@/components/magicui/marquee";

function DemoComponent() {
  return (
    <Marquee>
      Your content here
    </Marquee>
  );
}
```

### With Custom Styling

```tsx
import { AnimatedBeam } from "@/components/magicui/animated-beam";

function DemoComponent() {
  return (
    <AnimatedBeam 
      className="custom-class" 
      color="blue" 
      size="lg"
    />
  );
}
```

### Via Unified Interface

```tsx
import { magicui } from "@/lib/ui";

function DemoComponent() {
  return (
    <magicui.Marquee>
      Your content here
    </magicui.Marquee>
  );
}
```

## Troubleshooting

### Common Issues

- If you encounter styling issues, check for conflicting Tailwind classes
- Animation performance issues may occur with too many animated components on the same page
- Some components may require specific parent containers or context providers

### Solutions

- For styling conflicts, use the `cn()` utility to merge classes properly
- For performance issues, consider lazy loading components or reducing animation complexity
- Check component documentation or implementation for specific requirements 