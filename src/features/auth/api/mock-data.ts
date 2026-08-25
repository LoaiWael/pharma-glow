import type { AuthSession, AuthUser, LoginValues, RegisterValues } from '../types'

export const MOCK_USER: AuthUser = {
  id: 'u-1',
  fullName: 'Fatima Hassan',
  phone: '01012345678',
}

/**
 * Guest checkout is the default mock. Set to `true` to skip name/phone fields.
 */
export const MOCK_IS_AUTHENTICATED = false

let sessionStore: AuthSession = {
  user: MOCK_IS_AUTHENTICATED ? MOCK_USER : null,
}

const delay = (ms = 500) => new Promise((resolve) => setTimeout(resolve, ms))

const digitsOnly = (value: string) => value.replace(/\D/g, '')

export const fetchAuthSession = async (): Promise<AuthSession> => {
  await delay(120)
  return structuredClone(sessionStore)
}

export const loginWithCredentials = async (values: LoginValues): Promise<AuthSession> => {
  await delay(650)
  const phone = digitsOnly(values.phone)

  if (!phone || !values.password.trim()) {
    throw new Error('INVALID_CREDENTIALS')
  }

  // Demo: any valid phone + non-empty password signs in as the mock member.
  sessionStore = {
    user: {
      ...MOCK_USER,
      phone,
    },
  }

  return structuredClone(sessionStore)
}

export const registerWithCredentials = async (
  values: RegisterValues,
): Promise<AuthSession> => {
  await delay(750)
  const phone = digitsOnly(values.phone)
  const fullName = values.fullName.trim()

  if (!fullName || !phone || !values.password.trim()) {
    throw new Error('INVALID_REGISTRATION')
  }

  if (values.password !== values.confirmPassword) {
    throw new Error('PASSWORD_MISMATCH')
  }

  sessionStore = {
    user: {
      id: `u-${Date.now()}`,
      fullName,
      phone,
    },
  }

  return structuredClone(sessionStore)
}

export const logoutSession = async (): Promise<AuthSession> => {
  await delay(200)
  sessionStore = { user: null }
  return structuredClone(sessionStore)
}

export const MOCK_SESSION: AuthSession = {
  user: MOCK_IS_AUTHENTICATED ? MOCK_USER : null,
}
