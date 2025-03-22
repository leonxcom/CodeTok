"use client";

import * as React from "react";
import { memo } from "react";
import { cn } from "@/lib/utils";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface ListboxOption {
  label: string;
  value: string;
  disabled?: boolean;
}

export interface ListboxProps {
  /**
   * The options to display in the listbox.
   */
  options: ListboxOption[];
  
  /**
   * The currently selected value.
   */
  value?: string;
  
  /**
   * Event handler for when the selection changes.
   */
  onChange?: (value: string) => void;
  
  /**
   * The placeholder to display when no option is selected.
   */
  placeholder?: string;
  
  /**
   * Additional CSS classes to apply.
   */
  className?: string;
  
  /**
   * Label to display above the listbox.
   */
  label?: string;
  
  /**
   * Whether the listbox is disabled.
   */
  disabled?: boolean;
  
  /**
   * The size of the listbox.
   */
  size?: "sm" | "md" | "lg";
  
  /**
   * Additional ARIA label for the listbox.
   */
  ariaLabel?: string;
}

/**
 * Listbox component based on Shadcn UI Select.
 * This component provides a dropdown selection box.
 */
const ListboxComponent = ({
  options,
  value,
  onChange,
  placeholder = "Select an option",
  className,
  label,
  disabled = false,
  size = "md",
  ariaLabel,
}: ListboxProps) => {
  const handleValueChange = (newValue: string) => {
    if (onChange) {
      onChange(newValue);
    }
  };

  const sizeClassMap = {
    sm: "h-8 text-xs",
    md: "h-9 text-sm",
    lg: "h-10 text-base",
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          {label}
        </label>
      )}
      <Select
        value={value}
        onValueChange={handleValueChange}
        disabled={disabled}
      >
        <SelectTrigger 
          className={cn(
            sizeClassMap[size],
            className
          )}
          aria-label={ariaLabel}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {label && <SelectLabel>{label}</SelectLabel>}
          <SelectGroup>
            {options.map((option) => (
              <SelectItem
                key={option.value}
                value={option.value}
                disabled={option.disabled}
              >
                {option.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export const Listbox = memo(ListboxComponent);

/**
 * A simpler version of Listbox for use cases that need direct access to the Select components.
 */
export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
}; 