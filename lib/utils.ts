import { ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

import { siteConfig } from "@/config/site"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const fetcher = (url: string, config?: RequestInit) =>
  fetch(`${siteConfig.baseURL}/${url}`, {
    ...config,
    headers: {
      ...config?.headers,
      "Content-Type": "application/json",
      Authorization: `${localStorage.getItem("token")}`,
    },
  })

export const randomId = () => {
  return Math.random().toString(36).substring(2, 9)
}
