"use client"

import * as React from "react"
import { useToast } from "./use-toast"
import { cn } from "@/lib/utils"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <div
      className="fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]"
      aria-live="polite"
      role="alert"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={cn(
            "group mb-2 flex w-full items-center justify-between rounded-md border p-4 shadow-lg transition-all",
            "bg-background text-foreground",
            toast.type === "success" && "border-green-500 bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300",
            toast.type === "error" && "border-red-500 bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300",
            toast.type === "warning" && "border-yellow-500 bg-yellow-50 dark:bg-yellow-950 text-yellow-700 dark:text-yellow-300",
            toast.type === "info" && "border-blue-500 bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300"
          )}
          data-state={toast.open ? "open" : "closed"}
        >
          <div className="grid gap-1">
            {toast.title && (
              <div className="text-sm font-semibold">{toast.title}</div>
            )}
            {toast.description && (
              <div className="text-sm opacity-90">{toast.description}</div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
} 