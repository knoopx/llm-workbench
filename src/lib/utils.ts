import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const randomId = () => Math.random().toString(36).substr(2, 9)

export function humanFileSize(size: number) {
  if (size > 0) {
    const i = Math.floor(Math.log(size) / Math.log(1024))
    return (
      (size / Math.pow(1024, i)).toFixed(2) * 1 +
      ["B", "kB", "MB", "GB", "TB"][i]
    )
  }
  return "0.00MB"
}
