import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number, currency = "KRW"): string {
  return new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency,
    maximumFractionDigits: currency === "KRW" ? 0 : 2,
  }).format(amount)
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date)
}

export function formatAccountNumber(accountNumber: string): string {
  // 123-456-789012 형식으로 포맷팅
  if (!accountNumber) return ""

  const cleaned = accountNumber.replace(/\D/g, "")
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{6})$/)

  if (match) {
    return `${match[1]}-${match[2]}-${match[3]}`
  }

  return accountNumber
}

export function generateAccountNumber(): string {
  const part1 = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0")
  const part2 = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0")
  const part3 = Math.floor(Math.random() * 1000000)
    .toString()
    .padStart(6, "0")

  return `${part1}-${part2}-${part3}`
}
