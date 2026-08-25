import { useQuery } from '@tanstack/react-query'
import { fetchCategories, fetchCategoryBySlug } from './categories'
import { categoryKeys } from './query-keys'

export const useCategories = () =>
  useQuery({
    queryKey: categoryKeys.list(),
    queryFn: fetchCategories,
  })

export const useCategory = (slug?: string) =>
  useQuery({
    queryKey: categoryKeys.detail(slug ?? ''),
    queryFn: () => fetchCategoryBySlug(slug!),
    enabled: Boolean(slug),
  })
