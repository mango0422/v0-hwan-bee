"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/auth-context"
import { Home, CreditCard, ArrowLeftRight, RefreshCcw, Settings, LogOut, Menu, X } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { ModeToggle } from "./mode-toggle"

export function Navbar() {
  const { isAuthenticated, logout } = useAuth()
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const isActive = (path: string) => {
    return pathname === path
  }

  const navItems = [
    { name: "홈", path: "/dashboard", icon: <Home className="mr-2 h-4 w-4" /> },
    { name: "계좌", path: "/accounts", icon: <CreditCard className="mr-2 h-4 w-4" /> },
    { name: "송금", path: "/transfer", icon: <ArrowLeftRight className="mr-2 h-4 w-4" /> },
    { name: "환전", path: "/exchange", icon: <RefreshCcw className="mr-2 h-4 w-4" /> },
    { name: "설정", path: "/settings", icon: <Settings className="mr-2 h-4 w-4" /> },
  ]

  if (!isAuthenticated) {
    return (
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center">
            <span className="text-xl font-bold text-primary">HwanBee</span>
            <span className="ml-2 text-xl font-bold">은행</span>
          </Link>
          <div className="flex items-center gap-4">
            <ModeToggle />
            <Link href="/login">
              <Button variant="outline">로그인</Button>
            </Link>
            <Link href="/signup">
              <Button>회원가입</Button>
            </Link>
          </div>
        </div>
      </header>
    )
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/dashboard" className="flex items-center">
          <span className="text-xl font-bold text-primary">HwanBee</span>
          <span className="ml-2 text-xl font-bold">은행</span>
        </Link>

        {/* 데스크톱 메뉴 */}
        <nav className="hidden md:flex items-center space-x-4">
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={cn(
                "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                isActive(item.path) ? "bg-primary text-primary-foreground" : "hover:bg-muted",
              )}
            >
              {item.icon}
              {item.name}
            </Link>
          ))}
          <ModeToggle />
          <Button variant="ghost" size="icon" onClick={logout}>
            <LogOut className="h-5 w-5" />
          </Button>
        </nav>

        {/* 모바일 메뉴 토글 */}
        <div className="flex md:hidden items-center gap-4">
          <ModeToggle />
          <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* 모바일 메뉴 */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t">
          <div className="container py-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "flex items-center px-3 py-3 text-sm font-medium rounded-md transition-colors",
                  isActive(item.path) ? "bg-primary text-primary-foreground" : "hover:bg-muted",
                )}
              >
                {item.icon}
                {item.name}
              </Link>
            ))}
            <Button
              variant="ghost"
              className="w-full justify-start px-3 py-3 text-sm font-medium"
              onClick={() => {
                setMobileMenuOpen(false)
                logout()
              }}
            >
              <LogOut className="mr-2 h-4 w-4" />
              로그아웃
            </Button>
          </div>
        </div>
      )}
    </header>
  )
}
