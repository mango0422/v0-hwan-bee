// API 클라이언트 설정 및 인터페이스 정의
// 이 파일은 실제 API 연동 시 사용할 수 있는 가이드입니다.

import axios from "axios"
import type { Account, Transaction, ExchangeRate } from "@/types/bank"
import type { User, LoginCredentials, SignupCredentials } from "@/types/auth"

// 기본 API 클라이언트 설정
export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
})

// 인증 토큰 인터셉터 설정
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("auth-token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

// 응답 인터셉터 설정 (토큰 만료 처리 등)
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // 401 Unauthorized 에러 및 토큰 갱신이 필요한 경우
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        // 리프레시 토큰으로 새 액세스 토큰 요청
        const refreshToken = localStorage.getItem("refresh-token")
        if (!refreshToken) {
          // 리프레시 토큰이 없으면 로그인 페이지로 리다이렉트
          window.location.href = "/login"
          return Promise.reject(error)
        }

        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`, { refreshToken })

        const { accessToken } = response.data
        localStorage.setItem("auth-token", accessToken)

        // 새 토큰으로 원래 요청 재시도
        originalRequest.headers.Authorization = `Bearer ${accessToken}`
        return apiClient(originalRequest)
      } catch (refreshError) {
        // 토큰 갱신 실패 시 로그아웃 처리
        localStorage.removeItem("auth-token")
        localStorage.removeItem("refresh-token")
        localStorage.removeItem("user")
        window.location.href = "/login"
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  },
)

// API 인터페이스 정의
// 각 API 엔드포인트의 요청/응답 형식을 정의합니다.

// 인증 API 인터페이스
interface AuthResponse {
  accessToken: string
  refreshToken: string
  user: User
}

interface RefreshTokenRequest {
  refreshToken: string
}

interface RefreshTokenResponse {
  accessToken: string
}

// 계좌 API 인터페이스
interface CreateAccountRequest {
  accountNumber: string
  accountName: string
  balance: number
  currency: string
  type: string
}

// 거래 API 인터페이스
interface TransferRequest {
  fromAccountId: string
  toAccountNumber: string
  amount: number
  description: string
}

interface ExchangeRequest {
  fromAccountId: string
  toCurrency: string
  amount: number
}

// API 엔드포인트 정의
export const API = {
  auth: {
    // 로그인 API
    // POST /auth/login
    // Request: LoginCredentials
    // Response: AuthResponse
    login: (credentials: LoginCredentials) => apiClient.post<AuthResponse>("/auth/login", credentials),

    // 회원가입 API
    // POST /auth/signup
    // Request: SignupCredentials
    // Response: AuthResponse
    signup: (userData: SignupCredentials) => apiClient.post<AuthResponse>("/auth/signup", userData),

    // 토큰 갱신 API
    // POST /auth/refresh
    // Request: RefreshTokenRequest
    // Response: RefreshTokenResponse
    refreshToken: (refreshToken: string) => apiClient.post<RefreshTokenResponse>("/auth/refresh", { refreshToken }),

    // 로그아웃 API
    // POST /auth/logout
    // Request: {}
    // Response: { success: boolean }
    logout: () => apiClient.post<{ success: boolean }>("/auth/logout"),

    // OAuth 콜백 처리 API
    // POST /auth/oauth/callback
    // Request: { code: string, state?: string }
    // Response: AuthResponse
    oauthCallback: (code: string, state?: string) =>
      apiClient.post<AuthResponse>("/auth/oauth/callback", { code, state }),
  },

  user: {
    // 사용자 프로필 조회 API
    // GET /users/profile
    // Response: User
    getProfile: () => apiClient.get<User>("/users/profile"),

    // 사용자 프로필 업데이트 API
    // PUT /users/profile
    // Request: Partial<User>
    // Response: User
    updateProfile: (userData: Partial<User>) => apiClient.put<User>("/users/profile", userData),

    // 비밀번호 변경 API
    // PUT /users/password
    // Request: { currentPassword: string, newPassword: string }
    // Response: { success: boolean }
    changePassword: (passwordData: { currentPassword: string; newPassword: string }) =>
      apiClient.put<{ success: boolean }>("/users/password", passwordData),
  },

  accounts: {
    // 모든 계좌 조회 API
    // GET /accounts
    // Response: Account[]
    getAll: () => apiClient.get<Account[]>("/accounts"),

    // 계좌 상세 조회 API
    // GET /accounts/:id
    // Response: Account
    getById: (id: string) => apiClient.get<Account>(`/accounts/${id}`),

    // 계좌 생성 API
    // POST /accounts
    // Request: CreateAccountRequest
    // Response: Account
    create: (accountData: CreateAccountRequest) => apiClient.post<Account>("/accounts", accountData),

    // 계좌 삭제 API
    // DELETE /accounts/:id
    // Response: { success: boolean }
    delete: (id: string) => apiClient.delete<{ success: boolean }>(`/accounts/${id}`),
  },

  transactions: {
    // 모든 거래 내역 조회 API
    // GET /transactions
    // Response: Transaction[]
    getAll: () => apiClient.get<Transaction[]>("/transactions"),

    // 계좌별 거래 내역 조회 API
    // GET /transactions/account/:accountId
    // Response: Transaction[]
    getByAccountId: (accountId: string) => apiClient.get<Transaction[]>(`/transactions/account/${accountId}`),

    // 거래 상세 조회 API
    // GET /transactions/:id
    // Response: Transaction
    getById: (id: string) => apiClient.get<Transaction>(`/transactions/${id}`),

    // 송금 API
    // POST /transactions/transfer
    // Request: TransferRequest
    // Response: Transaction
    transfer: (transferData: TransferRequest) => apiClient.post<Transaction>("/transactions/transfer", transferData),

    // 환전 API
    // POST /transactions/exchange
    // Request: ExchangeRequest
    // Response: Transaction
    exchange: (exchangeData: ExchangeRequest) => apiClient.post<Transaction>("/transactions/exchange", exchangeData),
  },

  exchange: {
    // 환율 조회 API
    // GET /exchange/rates
    // Response: ExchangeRate[]
    getRates: () => apiClient.get<ExchangeRate[]>("/exchange/rates"),
  },
}

// API 사용 예시:
/*
// 로그인
const login = async (email: string, password: string) => {
  try {
    const response = await API.auth.login({ email, password });
    const { accessToken, refreshToken, user } = response.data;
    
    // 토큰 저장
    localStorage.setItem("auth-token", accessToken);
    localStorage.setItem("refresh-token", refreshToken);
    localStorage.setItem("user", JSON.stringify(user));
    
    return user;
  } catch (error) {
    console.error("Login failed:", error);
    throw error;
  }
};

// 계좌 목록 조회
const getAccounts = async () => {
  try {
    const response = await API.accounts.getAll();
    return response.data;
  } catch (error) {
    console.error("Failed to fetch accounts:", error);
    throw error;
  }
};

// 송금
const transferMoney = async (fromAccountId: string, toAccountNumber: string, amount: number, description: string) => {
  try {
    const response = await API.transactions.transfer({
      fromAccountId,
      toAccountNumber,
      amount,
      description
    });
    return response.data;
  } catch (error) {
    console.error("Transfer failed:", error);
    throw error;
  }
};
*/

// 환전
const exchangeCurrency = async (fromAccountId: string, toCurrency: string, amount: number) => {
  try {
    const response = await API.transactions.exchange({
      fromAccountId,
      toCurrency,
      amount,
    })
    return response.data
  } catch (error) {
    console.error("Exchange failed:", error)
    throw error
  }
}
