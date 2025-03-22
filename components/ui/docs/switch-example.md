# Switch Component

The Switch component is a UI element that allows users to toggle between two states (on/off).

## Basic Usage

```tsx
import { Switch } from "@/components/ui/switch";

export function SwitchDemo() {
  return <Switch />;
}
```

## With Labels

```tsx
import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export function SwitchWithLabel() {
  const [isChecked, setIsChecked] = useState(false);
  
  return (
    <div className="flex items-center space-x-2">
      <Switch 
        id="airplane-mode" 
        checked={isChecked} 
        onCheckedChange={setIsChecked} 
      />
      <Label htmlFor="airplane-mode">Airplane Mode</Label>
    </div>
  );
}
```

## Disabled State

```tsx
import { Switch } from "@/components/ui/switch";

export function DisabledSwitch() {
  return <Switch disabled />;
}
```

## Theme Switch Example

Here's how we implement the theme switching functionality using the Switch component:

```tsx
import { useTheme } from "next-themes";
import { Switch } from "@/components/ui/switch";
import { SunIcon, MoonIcon } from "lucide-react";

export function ThemeSwitch() {
  const { theme, setTheme } = useTheme();
  const isLight = theme === "light";
  
  const handleChange = (checked: boolean) => {
    setTheme(checked ? "light" : "dark");
  };

  return (
    <div className="flex items-center space-x-2">
      <SunIcon className="h-4 w-4" />
      <Switch 
        checked={isLight}
        onCheckedChange={handleChange}
        aria-label={`Switch to ${isLight ? "dark" : "light"} mode`}
      />
      <MoonIcon className="h-4 w-4" />
    </div>
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| checked | boolean | false | Whether the switch is checked |
| onCheckedChange | (checked: boolean) => void | - | Event handler called when the checked state changes |
| disabled | boolean | false | Whether the switch is disabled |
| required | boolean | false | Whether the switch is required in a form |
| name | string | - | The name of the switch for form submission |
| value | string | - | The value of the switch for form submission |
| id | string | - | The ID of the switch for associating with a label |
| className | string | - | Additional CSS classes |

## Accessibility

The Switch component follows accessibility best practices:

- Uses `role="switch"` for proper semantics
- Supports keyboard navigation (Tab to focus, Space to toggle)
- Includes appropriate ARIA attributes
- Can be associated with a label using the `id` prop

## Customization

You can customize the Switch component by modifying the `switch.tsx` file or by passing additional classes via the `className` prop.

For example, to change the colors:

```tsx
<Switch className="data-[state=checked]:bg-green-500" />
``` 