import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// 인증이 필요한 경로 목록
const PROTECTED_PATHS = ["/dashboard", "/accounts", "/transfer", "/exchange", "/settings", "/transactions"]

// 인증 없이 접근 가능한 경로 목록
const PUBLIC_PATHS = ["/", "/login", "/signup", "/auth/callback"]

export function middleware(request: NextRequest) {
  // 현재 경로
  const path = request.nextUrl.pathname

  // 인증 토큰 확인
  const authToken = request.cookies.get("auth-token")?.value
  const userDataCookie = request.cookies.get("user")?.value
  const isAuthenticated = !!authToken || !!userDataCookie

  // 정적 파일 요청은 무시
  if (path.startsWith("/_next") || path.startsWith("/favicon.ico") || path.includes(".") || path.startsWith("/api")) {
    return NextResponse.next()
  }

  // 인증이 필요한 경로에 인증 없이 접근하는 경우
  const isProtectedPath = PROTECTED_PATHS.some(
    (protectedPath) => path === protectedPath || path.startsWith(`${protectedPath}/`),
  )

  if (isProtectedPath && !isAuthenticated) {
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("redirect", path)
    return NextResponse.redirect(loginUrl)
  }

  // 이미 인증된 상태에서 로그인/회원가입 페이지에 접근하는 경우
  const isAuthPath = PUBLIC_PATHS.some((publicPath) => path === publicPath && publicPath !== "/")

  if (isAuthPath && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
