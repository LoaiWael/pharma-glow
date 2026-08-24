import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { AccountProfile } from '../types'
import { fetchAccountProfile, updateAccountProfile } from './mock-data'
import { accountKeys } from './query-keys'

export const useAccount = () =>
  useQuery({
    queryKey: accountKeys.profile(),
    queryFn: fetchAccountProfile,
  })

export const useUpdateAccount = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateAccountProfile,
    onSuccess: (profile: AccountProfile) => {
      queryClient.setQueryData(accountKeys.profile(), profile)
    },
  })
}
