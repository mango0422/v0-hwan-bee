"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { AuthState, LoginCredentials, SignupCredentials, User } from "@/types/auth"
import { useRouter, useSearchParams } from "next/navigation"
// import { API } from "@/lib/api" // 실제 API 연동 시 주석 해제
// import { getOAuthURL } from "@/lib/oauth" // 실제 API 연동 시 주석 해제

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<boolean>
  signup: (credentials: SignupCredentials) => Promise<boolean>
  logout: () => void
  updateUserProfile: (user: Partial<User>) => Promise<boolean>
  oauthLogin?: (provider: string) => void // 선택적으로 변경
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// 샘플 사용자 데이터
const SAMPLE_USER: User = {
  id: "1",
  email: "test@mail.com",
  name: "테스트 사용자",
  phoneNumber: "010-1234-5678",
  address: "서울시 강남구",
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  })
  const router = useRouter()
  const searchParams = useSearchParams()

  // 초기 인증 상태 확인
  useEffect(() => {
    const checkAuth = () => {
      try {
        // 로컬 스토리지에서 사용자 정보 가져오기
        const storedUser = localStorage.getItem("user")
        const authToken = localStorage.getItem("auth-token")

        if (storedUser && (authToken || process.env.NODE_ENV === "development")) {
          const user = JSON.parse(storedUser)
          setAuthState({
            user,
            isAuthenticated: true,
            isLoading: false,
          })
        } else {
          // 토큰이 없거나 유효하지 않은 경우 로그아웃 처리
          localStorage.removeItem("user")
          localStorage.removeItem("auth-token")
          localStorage.removeItem("refresh-token")

          setAuthState({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          })
        }
      } catch (error) {
        console.error("Auth check error:", error)
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        })
      }
    }

    checkAuth()

    // 브라우저 스토리지 변경 감지 (다른 탭에서 로그아웃 시 동기화)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "auth-token" || e.key === "user") {
        checkAuth()
      }
    }

    window.addEventListener("storage", handleStorageChange)
    return () => {
      window.removeEventListener("storage", handleStorageChange)
    }
  }, [])

  // 로그인 함수
  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    try {
      // 하드코딩된 로그인 로직
      if (credentials.email === "test@mail.com" && credentials.password === "test1234") {
        const user = SAMPLE_USER

        // 토큰 및 사용자 정보 저장
        localStorage.setItem("auth-token", "sample-auth-token")
        localStorage.setItem("refresh-token", "sample-refresh-token")
        localStorage.setItem("user", JSON.stringify(user))

        setAuthState({
          user,
          isAuthenticated: true,
          isLoading: false,
        })

        // 리다이렉트 처리
        const redirectPath = searchParams.get("redirect") || "/dashboard"
        router.push(redirectPath)

        return true
      }
      return false

      // TODO: [API 연동 시 수정]
      // 실제 API 연동 시 아래 코드로 대체
      /*
      try {
        // API 호출로 변경
        const response = await API.auth.login(credentials)
        const { accessToken, refreshToken, user } = response.data

        // 토큰 저장
        localStorage.setItem("auth-token", accessToken)
        localStorage.setItem("refresh-token", refreshToken)
        localStorage.setItem("user", JSON.stringify(user))

        setAuthState({
          user,
          isAuthenticated: true,
          isLoading: false,
        })
        
        // 리다이렉트 처리
        const redirectPath = searchParams.get('redirect') || '/dashboard'
        router.push(redirectPath)

        return true
      } catch (error) {
        console.error("Login error:", error)
        return false
      }
      */
    } catch (error) {
      console.error("Login error:", error)
      return false
    }
  }

  // 회원가입 함수
  const signup = async (credentials: SignupCredentials): Promise<boolean> => {
    try {
      // 하드코딩된 회원가입 로직 (실제로는 서버에 요청을 보내야 함)
      const user: User = {
        id: Math.random().toString(36).substring(2, 9),
        email: credentials.email,
        name: credentials.name,
        phoneNumber: credentials.phoneNumber,
        address: credentials.address,
      }

      // 토큰 및 사용자 정보 저장
      localStorage.setItem("auth-token", "sample-auth-token")
      localStorage.setItem("refresh-token", "sample-refresh-token")
      localStorage.setItem("user", JSON.stringify(user))

      setAuthState({
        user,
        isAuthenticated: true,
        isLoading: false,
      })

      router.push("/dashboard")
      return true

      // TODO: [API 연동 시 수정]
      // 실제 API 연동 시 아래 코드로 대체
      /*
      try {
        // API 호출로 변경
        const response = await API.auth.signup(credentials)
        const { accessToken, refreshToken, user } = response.data

        // 토큰 저장
        localStorage.setItem("auth-token", accessToken)
        localStorage.setItem("refresh-token", refreshToken)
        localStorage.setItem("user", JSON.stringify(user))

        setAuthState({
          user,
          isAuthenticated: true,
          isLoading: false,
        })
        
        router.push('/dashboard')
        return true
      } catch (error) {
        console.error("Signup error:", error)
        return false
      }
      */
    } catch (error) {
      console.error("Signup error:", error)
      return false
    }
  }

  // 로그아웃 함수
  const logout = () => {
    try {
      // 로컬 스토리지 토큰 삭제
      localStorage.removeItem("auth-token")
      localStorage.removeItem("refresh-token")
      localStorage.removeItem("user")

      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      })

      // 로그인 페이지로 리다이렉트
      router.push("/login")

      // TODO: [API 연동 시 수정]
      // 실제 API 연동 시 아래 코드로 대체
      /*
      try {
        // API 호출로 변경
        await API.auth.logout()
      } catch (error) {
        console.error("Logout error:", error)
      } finally {
        // 로컬 스토리지 토큰 삭제
        localStorage.removeItem("auth-token")
        localStorage.removeItem("refresh-token")
        localStorage.removeItem("user")

        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        })

        router.push("/login")
      }
      */
    } catch (error) {
      console.error("Logout error:", error)
      // 오류가 발생해도 로그아웃 처리
      localStorage.removeItem("auth-token")
      localStorage.removeItem("refresh-token")
      localStorage.removeItem("user")

      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      })

      router.push("/login")
    }
  }

  // OAuth 로그인 함수 (주석 처리)
  /*
  const oauthLogin = (provider: string) => {
    const url = getOAuthURL(provider)
    window.location.href = url
  }
  */

  // 프로필 업데이트 함수
  const updateUserProfile = async (userData: Partial<User>): Promise<boolean> => {
    try {
      if (!authState.user) return false

      const updatedUser = { ...authState.user, ...userData }
      localStorage.setItem("user", JSON.stringify(updatedUser))

      setAuthState({
        ...authState,
        user: updatedUser,
      })

      return true

      // TODO: [API 연동 시 수정]
      // 실제 API 연동 시 아래 코드로 대체
      /*
      try {
        // API 호출로 변경
        const response = await API.user.updateProfile(userData)
        const updatedUser = response.data

        localStorage.setItem("user", JSON.stringify(updatedUser))

        setAuthState({
          ...authState,
          user: updatedUser,
        })

        return true
      } catch (error) {
        console.error("Profile update error:", error)
        return false
      }
      */
    } catch (error) {
      console.error("Profile update error:", error)
      return false
    }
  }

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        signup,
        logout,
        updateUserProfile,
        // oauthLogin, // 실제 API 연동 시 주석 해제
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
