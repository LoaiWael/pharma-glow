import { api, type ApiEnvelope } from '@/lib/http'
import type { CatalogProductType } from '../types'

const PRODUCT_TYPES_PATH = '/api/v1/product-types'

export const fetchProductTypes = async (): Promise<CatalogProductType[]> => {
  const envelope = await api.get<ApiEnvelope<CatalogProductType[]>>(
    PRODUCT_TYPES_PATH,
  )
  return [...envelope.data].sort((a, b) => a.sortOrder - b.sortOrder)
}
