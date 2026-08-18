import { useQuery } from '@tanstack/react-query'
import type { Cart } from '../types'
import { EMPTY_CART } from './mock-data'
import { cartKeys } from './query-keys'

const fetchCart = async (): Promise<Cart> => EMPTY_CART

export const useCart = () =>
  useQuery({
    queryKey: cartKeys.detail(),
    queryFn: fetchCart,
  })
