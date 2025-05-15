"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { AuthState, LoginCredentials, SignupCredentials, User } from "@/types/auth"
import { useRouter } from "next/navigation"

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<boolean>
  signup: (credentials: SignupCredentials) => Promise<boolean>
  logout: () => void
  updateUserProfile: (user: Partial<User>) => Promise<boolean>
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

  useEffect(() => {
    // 로컬 스토리지에서 사용자 정보 가져오기
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser)
        setAuthState({
          user,
          isAuthenticated: true,
          isLoading: false,
        })
      } catch (error) {
        console.error("Failed to parse stored user:", error)
        setAuthState({ ...authState, isLoading: false })
      }
    } else {
      setAuthState({ ...authState, isLoading: false })
    }
  }, [])

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    // 하드코딩된 로그인 로직
    if (credentials.email === "test@mail.com" && credentials.password === "test1234") {
      const user = SAMPLE_USER
      localStorage.setItem("user", JSON.stringify(user))
      setAuthState({
        user,
        isAuthenticated: true,
        isLoading: false,
      })
      return true
    }
    return false
  }

  const signup = async (credentials: SignupCredentials): Promise<boolean> => {
    // 하드코딩된 회원가입 로직 (실제로는 서버에 요청을 보내야 함)
    const user: User = {
      id: Math.random().toString(36).substring(2, 9),
      email: credentials.email,
      name: credentials.name,
      phoneNumber: credentials.phoneNumber,
      address: credentials.address,
    }

    localStorage.setItem("user", JSON.stringify(user))
    setAuthState({
      user,
      isAuthenticated: true,
      isLoading: false,
    })
    return true
  }

  const logout = () => {
    localStorage.removeItem("user")
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    })
    router.push("/login")
  }

  const updateUserProfile = async (userData: Partial<User>): Promise<boolean> => {
    if (!authState.user) return false

    const updatedUser = { ...authState.user, ...userData }
    localStorage.setItem("user", JSON.stringify(updatedUser))

    setAuthState({
      ...authState,
      user: updatedUser,
    })

    return true
  }

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        signup,
        logout,
        updateUserProfile,
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
