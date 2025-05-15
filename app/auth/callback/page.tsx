"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { handleOAuthCallback } from "@/lib/oauth"

export default function OAuthCallbackPage() {
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const code = searchParams.get("code")
    const state = searchParams.get("state")
    const error = searchParams.get("error")

    if (error) {
      setError(error)
      return
    }

    if (!code) {
      setError("Authorization code not found")
      return
    }

    // OAuth 콜백 처리
    handleOAuthCallback(code, state)
      .then(() => {
        // 인증 성공 시 대시보드로 리다이렉트
        router.push("/dashboard")
      })
      .catch((err) => {
        console.error("OAuth callback error:", err)
        setError("Authentication failed. Please try again.")
      })
  }, [searchParams, router])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      {error ? (
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-500">인증 오류</h1>
          <p className="mt-2">{error}</p>
          <button className="mt-4 rounded-md bg-primary px-4 py-2 text-white" onClick={() => router.push("/login")}>
            로그인 페이지로 돌아가기
          </button>
        </div>
      ) : (
        <div className="text-center">
          <h1 className="text-2xl font-bold">인증 처리 중...</h1>
          <p className="mt-2">잠시만 기다려주세요.</p>
        </div>
      )}
    </div>
  )
}
