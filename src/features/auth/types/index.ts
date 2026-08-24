export interface AuthUser {
  id: string
  fullName: string
  phone: string
}

export interface AuthSession {
  user: AuthUser | null
}
