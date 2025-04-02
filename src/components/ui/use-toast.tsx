"use client"

import * as React from "react"

interface ToastProps {
  title?: string
  description?: string
  type?: 'default' | 'success' | 'error' | 'warning' | 'info'
  duration?: number
}

export type ToasterToast = ToastProps & {
  id: string
  open: boolean
}

// 简单的全局状态管理
let toasts: ToasterToast[] = []
let listeners: Array<(toasts: ToasterToast[]) => void> = []

const notifyListeners = () => {
  listeners.forEach(listener => listener([...toasts]))
}

// 简单的ID生成
let count = 0
const generateId = () => {
  return (count++).toString()
}

// 删除 toast
const removeToast = (id: string) => {
  toasts = toasts.filter(t => t.id !== id)
  notifyListeners()
}

// 添加 toast
export const toast = ({ title, description, type = 'default', duration = 5000 }: ToastProps) => {
  const id = generateId()
  
  const newToast: ToasterToast = {
    id,
    title,
    description, 
    type,
    duration,
    open: true
  }
  
  toasts = [...toasts, newToast]
  notifyListeners()
  
  // 自动移除
  setTimeout(() => {
    removeToast(id)
  }, duration)
  
  return {
    id,
    dismiss: () => removeToast(id)
  }
}

// Hook用于组件中
export function useToast() {
  const [state, setState] = React.useState<ToasterToast[]>(toasts)
  
  React.useEffect(() => {
    listeners.push(setState)
    return () => {
      listeners = listeners.filter(listener => listener !== setState)
    }
  }, [])
  
  return {
    toasts: state,
    toast,
    dismiss: (id?: string) => {
      if (id) {
        removeToast(id)
      } else {
        toasts.forEach(t => removeToast(t.id))
      }
    }
  }
} 