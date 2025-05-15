"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/context/auth-context"
import { Navbar } from "@/components/navbar"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

// TODO: [OAuth 로그인 버튼 추가]
// OAuth 로그인 버튼을 추가합니다.
// import { OAUTH_PROVIDERS } from "@/lib/oauth"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { login, isAuthenticated, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectPath = searchParams.get("redirect")

  // 이미 로그인된 경우 대시보드로 리다이렉트
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.push(redirectPath || "/dashboard")
    }
  }, [authLoading, isAuthenticated, router, redirectPath])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const success = await login({ email, password })
      if (!success) {
        setError("이메일 또는 비밀번호가 올바르지 않습니다.")
      }
    } catch (err) {
      setError("로그인 중 오류가 발생했습니다. 다시 시도해주세요.")
    } finally {
      setIsLoading(false)
    }
  }

  if (authLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <p>로딩 중...</p>
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center py-12">
        <div className="w-full max-w-md space-y-6 px-4">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold">로그인</h1>
            <p className="text-muted-foreground">계정에 로그인하여 서비스를 이용하세요</p>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">이메일</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">비밀번호</Label>
                <Link href="#" className="text-sm text-primary underline-offset-4 hover:underline">
                  비밀번호 찾기
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "로그인 중..." : "로그인"}
            </Button>
          </form>

          <div className="text-center text-sm">
            계정이 없으신가요?{" "}
            <Link href="/signup" className="text-primary underline-offset-4 hover:underline">
              회원가입
            </Link>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">테스트 계정</span>
            </div>
          </div>

          <div className="rounded-lg border p-4">
            <div className="space-y-2 text-sm">
              <p>
                <span className="font-medium">이메일:</span> test@mail.com
              </p>
              <p>
                <span className="font-medium">비밀번호:</span> test1234
              </p>
            </div>
          </div>

          {/* TODO: [OAuth 로그인 버튼 추가 시 주석 해제]*/}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">소셜 로그인</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {/*
            <Button
              type="button"
              variant="outline"
              onClick={() => oauthLogin(OAUTH_PROVIDERS.GOOGLE)}
              className="w-full"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5 mr-2">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Google
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => oauthLogin(OAUTH_PROVIDERS.KAKAO)}
              className="w-full bg-yellow-300 hover:bg-yellow-400 text-black"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5 mr-2">
                <path
                  fill="currentColor"
                  d="M12 3C7.03 3 3 6.14 3 10c0 2.45 1.76 4.63 4.38 5.73.2.07.29.26.23.45l-.57 2.15c-.1.38.3.66.64.48l2.5-1.39c.23-.13.5-.16.76-.1.74.16 1.5.25 2.28.25 4.97 0 9-3.14 9-7s-4.03-7-9-7"
                />
              </svg>
              Kakao
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => oauthLogin(OAUTH_PROVIDERS.NAVER)}
              className="w-full bg-green-500 hover:bg-green-600 text-white"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5 mr-2">
                <path fill="currentColor" d="M16.33 7.1v9.8L12 12.79l-4.33 4.11V7.1h8.66z" />
              </svg>
              Naver
            </Button>
            */}
          </div>
        </div>
      </main>
    </div>
  )
}
