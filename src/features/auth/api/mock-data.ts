import type { AuthSession, AuthUser } from '../types'

export const MOCK_USER: AuthUser = {
  id: 'u-1',
  fullName: 'Fatima Hassan',
  phone: '01012345678',
}

/**
 * Guest checkout is the default mock. Set to `true` to skip name/phone fields.
 */
export const MOCK_IS_AUTHENTICATED = false

export const MOCK_SESSION: AuthSession = {
  user: MOCK_IS_AUTHENTICATED ? MOCK_USER : null,
}
