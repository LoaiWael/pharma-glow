import { useQuery } from '@tanstack/react-query'
import type { EnrichedCart } from '../types'
import { MOCK_CART, enrichCart } from './mock-data'
import { cartKeys } from './query-keys'

const fetchCart = async (): Promise<EnrichedCart> => enrichCart(MOCK_CART)

export const useCart = () =>
  useQuery({
    queryKey: cartKeys.detail(),
    queryFn: fetchCart,
  })
