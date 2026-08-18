import { useQuery } from '@tanstack/react-query'
import type { HomeCategory } from '../types'
import { HOME_CATEGORIES } from './mock-data'
import { homeKeys } from './query-keys'

const fetchHomeCategories = async (): Promise<HomeCategory[]> => HOME_CATEGORIES

export const useHomeCategories = () =>
  useQuery({
    queryKey: homeKeys.categories(),
    queryFn: fetchHomeCategories,
  })
