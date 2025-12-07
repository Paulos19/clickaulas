import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(value: number | string | null | undefined) {
  if (value === null || value === undefined) return "-"
  const numberValue = Number(value)
  if (isNaN(numberValue)) return "-"
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(numberValue)
}

export function formatDate(date: Date | string | null | undefined, includeTime: boolean = false) {
  if (!date) return "-"
  const dateObj = new Date(date)
  if (isNaN(dateObj.getTime())) return "-"
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit", month: "2-digit", year: "numeric",
    ...(includeTime && { hour: "2-digit", minute: "2-digit" }),
  }).format(dateObj)
}

// NOVA FUNÇÃO
export function generateRandomPassword(length = 8) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%";
  let password = "";
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}