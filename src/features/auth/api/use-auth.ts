import { useQuery } from '@tanstack/react-query'
import type { AuthSession } from '../types'
import { MOCK_SESSION } from './mock-data'
import { authKeys } from './query-keys'

const fetchSession = async (): Promise<AuthSession> => MOCK_SESSION

export const useAuth = () => {
  const query = useQuery({
    queryKey: authKeys.session(),
    queryFn: fetchSession,
  })

  const user = query.data?.user ?? null

  return {
    ...query,
    user,
    isAuthenticated: Boolean(user),
  }
}
