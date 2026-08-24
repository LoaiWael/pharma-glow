import { useQuery } from '@tanstack/react-query'
import type { EnrichedWishlist } from '../types'
import { MOCK_WISHLIST, enrichWishlist } from './mock-data'
import { wishlistKeys } from './query-keys'

const fetchWishlist = async (): Promise<EnrichedWishlist> => enrichWishlist(MOCK_WISHLIST)

export const useWishlist = () =>
  useQuery({
    queryKey: wishlistKeys.detail(),
    queryFn: fetchWishlist,
  })
