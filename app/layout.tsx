import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/context/auth-context"
import { BankDataProvider } from "@/context/bank-data-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "HwanBee 은행",
  description: "우리은행 스타일의 모던 뱅킹 솔루션",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthProvider>
            <BankDataProvider>{children}</BankDataProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
