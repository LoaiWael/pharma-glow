import { useQuery } from '@tanstack/react-query'
import { fetchContactSettings } from './contact'
import { contactKeys } from './query-keys'

export const useContactSettings = () =>
  useQuery({
    queryKey: contactKeys.details(),
    queryFn: fetchContactSettings,
    staleTime: 1000 * 60 * 10,
  })

export const useContact = useContactSettings
