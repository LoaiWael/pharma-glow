export interface AuthUser {
  id: string
  fullName: string
  phone: string
}

export interface AuthSession {
  user: AuthUser | null
}

export interface LoginValues {
  phone: string
  password: string
}

export interface RegisterValues {
  fullName: string
  phone: string
  password: string
  confirmPassword: string
}
