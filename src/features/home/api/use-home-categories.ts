import { useQuery } from '@tanstack/react-query'
import { fetchCategories } from '@/features/categories'
import type { HomeCategory } from '../types'
import {
  CATEGORY_IMAGE_FALLBACK,
  CURATED_HOME_CATEGORIES,
  DEDICATED_CATEGORY_SLUGS,
} from './mock-data'
import { homeKeys } from './query-keys'

const fetchHomeCategories = async (): Promise<HomeCategory[]> => {
  const apiCategories = await fetchCategories()

  const fromApi: HomeCategory[] = apiCategories
    .filter((category) => !DEDICATED_CATEGORY_SLUGS.has(category.slug))
    .map((category) => {
      const hasImage = Boolean(category.image)
      return {
        id: category.slug,
        title: category.name,
        imageSrc: category.image || CATEGORY_IMAGE_FALLBACK,
        isLogoFallback: !hasImage,
        href: `/products?category=${encodeURIComponent(category.slug)}`,
      }
    })

  return [...CURATED_HOME_CATEGORIES, ...fromApi]
}

export const useHomeCategories = () =>
  useQuery({
    queryKey: homeKeys.categories(),
    queryFn: fetchHomeCategories,
  })
