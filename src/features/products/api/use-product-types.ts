import { useQuery } from '@tanstack/react-query'
import { fetchProductTypes } from './product-types'
import { productKeys } from './query-keys'

export const useProductTypes = () =>
  useQuery({
    queryKey: productKeys.types(),
    queryFn: fetchProductTypes,
    staleTime: 1000 * 60 * 15,
  })
