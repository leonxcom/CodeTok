'use client'

import * as React from 'react'
import { CheckIcon, PlusCircledIcon } from '@radix-ui/react-icons'
import { PopoverProps } from '@radix-ui/react-popover'

import { cn } from '@/lib/utils'
import { Button } from './button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from './command'
import { Popover, PopoverContent, PopoverTrigger } from './popover'
import { CaretSortIcon } from '@radix-ui/react-icons'

interface ComboboxProps {
  options: { value: string; label: string }[]
  value?: string
  onSelect?: (value: string) => void
  placeholder?: string
  emptyMessage?: string
  disabled?: boolean
  className?: string
  triggerClassName?: string
  contentClassName?: string
}

export function Combobox({
  options,
  value,
  onSelect,
  placeholder = 'Select an option',
  emptyMessage = 'No results found.',
  disabled = false,
  className,
  triggerClassName,
  contentClassName,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [selected, setSelected] = React.useState(value)

  React.useEffect(() => {
    setSelected(value)
  }, [value])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={cn('w-full justify-between', triggerClassName)}
        >
          {selected
            ? options.find((option) => option.value === selected)?.label
            : placeholder}
          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className={cn('p-0', contentClassName)} align="start">
        <Command className={className}>
          <CommandInput placeholder={placeholder} />
          <CommandEmpty>{emptyMessage}</CommandEmpty>
          <CommandGroup>
            {options.map((option) => (
              <CommandItem
                key={option.value}
                value={option.value}
                onSelect={(currentValue) => {
                  setSelected(currentValue)
                  setOpen(false)
                  onSelect?.(currentValue)
                }}
              >
                <CheckIcon
                  className={cn(
                    'mr-2 h-4 w-4',
                    selected === option.value ? 'opacity-100' : 'opacity-0',
                  )}
                />
                {option.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
