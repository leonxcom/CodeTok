# Listbox Component

The Listbox component provides a dropdown selection box. It allows users to select a single option from a list of options.

## Basic Usage

```tsx
import { Listbox } from "@/components/ui/listbox";

export function BasicListbox() {
  const options = [
    { label: "Apple", value: "apple" },
    { label: "Banana", value: "banana" },
    { label: "Orange", value: "orange" },
  ];

  return (
    <Listbox
      options={options}
      placeholder="Select a fruit"
    />
  );
}
```

## With State

```tsx
import { useState } from "react";
import { Listbox } from "@/components/ui/listbox";

export function StatefulListbox() {
  const [value, setValue] = useState("");
  
  const options = [
    { label: "Apple", value: "apple" },
    { label: "Banana", value: "banana" },
    { label: "Orange", value: "orange" },
  ];

  return (
    <Listbox
      value={value}
      onChange={setValue}
      options={options}
      placeholder="Select a fruit"
    />
  );
}
```

## With Label

```tsx
import { Listbox } from "@/components/ui/listbox";

export function ListboxWithLabel() {
  const options = [
    { label: "Apple", value: "apple" },
    { label: "Banana", value: "banana" },
    { label: "Orange", value: "orange" },
  ];

  return (
    <Listbox
      label="Favorite Fruit"
      options={options}
      placeholder="Select a fruit"
    />
  );
}
```

## Disabled Options

```tsx
import { Listbox } from "@/components/ui/listbox";

export function ListboxWithDisabledOptions() {
  const options = [
    { label: "Apple", value: "apple" },
    { label: "Banana", value: "banana", disabled: true },
    { label: "Orange", value: "orange" },
  ];

  return (
    <Listbox
      options={options}
      placeholder="Select a fruit"
    />
  );
}
```

## Disabled Listbox

```tsx
import { Listbox } from "@/components/ui/listbox";

export function DisabledListbox() {
  const options = [
    { label: "Apple", value: "apple" },
    { label: "Banana", value: "banana" },
    { label: "Orange", value: "orange" },
  ];

  return (
    <Listbox
      options={options}
      placeholder="Select a fruit"
      disabled={true}
    />
  );
}
```

## Different Sizes

```tsx
import { Listbox } from "@/components/ui/listbox";

export function ListboxSizes() {
  const options = [
    { label: "Apple", value: "apple" },
    { label: "Banana", value: "banana" },
    { label: "Orange", value: "orange" },
  ];

  return (
    <div className="space-y-4">
      <Listbox
        options={options}
        placeholder="Small Listbox"
        size="sm"
      />
      <Listbox
        options={options}
        placeholder="Medium Listbox"
        size="md"
      />
      <Listbox
        options={options}
        placeholder="Large Listbox"
        size="lg"
      />
    </div>
  );
}
```

## Using Direct Select Components

For more complex use cases, you can import the underlying Select components directly:

```tsx
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/listbox";

export function CustomListbox() {
  return (
    <Select>
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Select a framework" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Frameworks</SelectLabel>
          <SelectItem value="react">React</SelectItem>
          <SelectItem value="vue">Vue</SelectItem>
          <SelectItem value="angular">Angular</SelectItem>
          <SelectItem value="svelte">Svelte</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
```

## Props

The Listbox component accepts the following props:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| options | `{ label: string; value: string; disabled?: boolean; }[]` | required | Array of options to display |
| value | string | undefined | The currently selected value |
| onChange | (value: string) => void | undefined | Handler for when selection changes |
| placeholder | string | "Select an option" | Text to display when no option is selected |
| className | string | undefined | Additional CSS classes |
| label | string | undefined | Label text displayed above the listbox |
| disabled | boolean | false | Whether the listbox is disabled |
| size | "sm" \| "md" \| "lg" | "md" | Size of the listbox |
| ariaLabel | string | undefined | ARIA label for accessibility |

## Accessibility

The Listbox component follows accessibility best practices:

- Uses appropriate ARIA attributes
- Supports keyboard navigation
- Clearly indicates the selected option
- Provides proper focus management 