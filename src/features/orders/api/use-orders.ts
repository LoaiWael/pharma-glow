import { useQuery } from '@tanstack/react-query'
import type { EnrichedOrdersList } from '../types'
import { MOCK_ORDERS, enrichOrders } from './mock-data'
import { orderKeys } from './query-keys'

const fetchOrders = async (): Promise<EnrichedOrdersList> => enrichOrders(MOCK_ORDERS)

export const useOrders = () =>
  useQuery({
    queryKey: orderKeys.list(),
    queryFn: fetchOrders,
  })
