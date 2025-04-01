"use client"

import * as React from "react"
import toast from "react-hot-toast"

export type { Toast as ToasterToast } from "react-hot-toast"

export { toast }

export const useToast = () => {
  return {
    toast,
    toasts: [], // Compatibility with existing code
    dismiss: toast.dismiss
  }
} 