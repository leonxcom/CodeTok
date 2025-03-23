# Magic UI Components

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

## Usage

You can import Magic UI components in two ways:

### 1. Direct import from component file

```tsx
import { Marquee } from "@/components/magicui/marquee";
import { AnimatedBeam } from "@/components/magicui/animated-beam";

// Using components
<Marquee>
  Your content here
</Marquee>

<AnimatedBeam />
```

### 2. Import via unified UI entry point

```tsx
import { magicui } from "@/lib/ui";

// Using components
<magicui.Marquee>
  Your content here
</magicui.Marquee>

<magicui.AnimatedBeam />
```

## Dependencies

These components depend on:
- React and React DOM
- Tailwind CSS
- Framer Motion
- Other utility libraries (varies by component)

## Integration with shadcn UI

Magic UI components are designed to work seamlessly with shadcn UI components, which are available in the `@/components/shadcnui` directory. Some Magic UI components use shadcn UI components internally.

## Customization

Most components accept standard props for styling and behavior customization. Refer to each component's implementation for specific customization options.

## Notes

- Not all components from the Magic UI website may be available as installable components
- Some components may require additional configuration or adaptation for specific use cases
- All import paths have been adjusted to work with our project structure (shadcnui directory instead of ui) 