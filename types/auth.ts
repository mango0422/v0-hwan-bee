export interface User {
  id: string
  email: string
  name: string
  phoneNumber: string
  address?: string
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface SignupCredentials {
  email: string
  password: string
  name: string
  phoneNumber: string
  address?: string
}
