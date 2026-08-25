import { api, type ApiEnvelope } from '@/lib/http'
import type { Category } from '../types'

const CATEGORIES_PATH = '/api/v1/categories'

export const fetchCategories = async (): Promise<Category[]> => {
  const envelope = await api.get<ApiEnvelope<Category[]>>(CATEGORIES_PATH)
  return envelope.data
}

export const fetchCategoryBySlug = async (slug: string): Promise<Category> => {
  const envelope = await api.get<ApiEnvelope<Category>>(
    `${CATEGORIES_PATH}/${encodeURIComponent(slug)}`,
  )
  return envelope.data
}
