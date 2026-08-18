import { useQuery } from '@tanstack/react-query'
import type { HomeBanner } from '../types'
import { HOME_BANNERS } from './mock-data'
import { homeKeys } from './query-keys'

const fetchHomeBanners = async (): Promise<HomeBanner[]> => HOME_BANNERS

export const useHomeBanners = () =>
  useQuery({
    queryKey: homeKeys.banners(),
    queryFn: fetchHomeBanners,
  })
