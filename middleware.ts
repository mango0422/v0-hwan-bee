// import { NextResponse } from 'next/server'
// import type { NextRequest } from 'next/server'

// 미들웨어 구현 (현재는 주석 처리)
// export function middleware(request: NextRequest) {
//   const isAuthenticated = request.cookies.has('auth-token')
//   const isAuthPage = request.nextUrl.pathname.startsWith('/login') ||
//                      request.nextUrl.pathname.startsWith('/signup')

//   if (!isAuthenticated && !isAuthPage && request.nextUrl.pathname !== '/') {
//     return NextResponse.redirect(new URL('/login', request.url))
//   }

//   if (isAuthenticated && isAuthPage) {
//     return NextResponse.redirect(new URL('/dashboard', request.url))
//   }

//   return NextResponse.next()
// }

// export const config = {
//   matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
// }
