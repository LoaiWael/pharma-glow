import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { LoginValues, RegisterValues } from '../types'
import {
  fetchAuthSession,
  loginWithCredentials,
  logoutSession,
  registerWithCredentials,
} from './mock-data'
import { authKeys } from './query-keys'

export const useAuth = () => {
  const query = useQuery({
    queryKey: authKeys.session(),
    queryFn: fetchAuthSession,
  })

  const user = query.data?.user ?? null

  return {
    ...query,
    user,
    isAuthenticated: Boolean(user),
  }
}

export const useLogin = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (values: LoginValues) => loginWithCredentials(values),
    onSuccess: (session) => {
      queryClient.setQueryData(authKeys.session(), session)
    },
  })
}

export const useRegister = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (values: RegisterValues) => registerWithCredentials(values),
    onSuccess: (session) => {
      queryClient.setQueryData(authKeys.session(), session)
    },
  })
}

export const useLogout = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: logoutSession,
    onSuccess: (session) => {
      queryClient.setQueryData(authKeys.session(), session)
    },
  })
}
