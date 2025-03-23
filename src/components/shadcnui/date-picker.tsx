"use client"

import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/shadcnui/button"
import { Calendar } from "@/components/shadcnui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/shadcnui/popover"

interface DatePickerProps {
  date?: Date
  onDateChange?: (date?: Date) => void
  disabled?: boolean
  className?: string
  placeholder?: string
}

export function DatePicker({
  date,
  onDateChange,
  disabled = false,
  className,
  placeholder = "Pick a date",
}: DatePickerProps) {
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(date)

  React.useEffect(() => {
    setSelectedDate(date)
  }, [date])

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !selectedDate && "text-muted-foreground",
            className
          )}
          disabled={disabled}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {selectedDate ? format(selectedDate, "PPP") : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={(date) => {
            setSelectedDate(date)
            onDateChange?.(date)
          }}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}

interface DateRangePickerProps {
  from?: Date
  to?: Date
  onRangeChange?: (range: DateRange | undefined) => void
  disabled?: boolean
  className?: string
  placeholder?: string
}

export function DateRangePicker({
  from,
  to,
  onRangeChange,
  disabled = false,
  className,
  placeholder = "Select a date range",
}: DateRangePickerProps) {
  const [date, setDate] = React.useState<DateRange | undefined>(
    from && to ? { from, to } : undefined
  )

  React.useEffect(() => {
    if (from && to) {
      setDate({ from, to })
    } else {
      setDate(undefined)
    }
  }, [from, to])

  // 当日期范围变化时调用 onRangeChange
  React.useEffect(() => {
    onRangeChange?.(date)
  }, [date, onRangeChange])

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal",
              !date?.from && "text-muted-foreground",
              disabled && "cursor-not-allowed opacity-50"
            )}
            disabled={disabled}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              placeholder
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="range"
            selected={date}
            onSelect={setDate}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  )
} 