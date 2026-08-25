import { useQuery } from '@tanstack/react-query'
import {
  fetchProductBySlug,
  fetchProducts,
  fetchRelatedProducts,
  type ProductFiltersParams,
} from './products'
import { productKeys } from './query-keys'

export type { ProductFiltersParams }

export interface ProductFilterMeta {
  typeCounts: Record<string, number>
  inStockCount: number
  freeDeliveryCount: number
  ratingCounts: Record<number, number>
  minPrice: number
  maxPrice: number
  totalCount: number
}

const calculateProductFilterMeta = (
  products: Awaited<ReturnType<typeof fetchProducts>>,
): ProductFilterMeta => {
  const typeCounts: Record<string, number> = {
    all: products.length,
  }

  let minPrice = Infinity
  let maxPrice = -Infinity
  let inStockCount = 0
  let freeDeliveryCount = 0
  const ratingCounts: Record<number, number> = {
    0: products.length,
    4.0: 0,
    4.5: 0,
    4.8: 0,
  }

  products.forEach((p) => {
    if (p.productType) {
      typeCounts[p.productType] = (typeCounts[p.productType] || 0) + 1
    }
    if (p.price < minPrice) minPrice = p.price
    if (p.price > maxPrice) maxPrice = p.price
    if (p.inStock !== false) inStockCount++
    if (p.isFreeDelivery) freeDeliveryCount++

    const rating = p.rating ?? 0
    if (rating >= 4.0) ratingCounts[4.0] = (ratingCounts[4.0] || 0) + 1
    if (rating >= 4.5) ratingCounts[4.5] = (ratingCounts[4.5] || 0) + 1
    if (rating >= 4.8) ratingCounts[4.8] = (ratingCounts[4.8] || 0) + 1
  })

  return {
    typeCounts,
    inStockCount,
    freeDeliveryCount,
    ratingCounts,
    minPrice: minPrice === Infinity ? 0 : minPrice,
    maxPrice: maxPrice === -Infinity ? 2500 : maxPrice,
    totalCount: products.length,
  }
}

export const useProducts = (filters: ProductFiltersParams = {}) =>
  useQuery({
    queryKey: productKeys.list(filters),
    queryFn: () => fetchProducts(filters),
    placeholderData: (previousData) => previousData,
  })

export const useProduct = (slugOrId?: string | number) =>
  useQuery({
    queryKey: productKeys.detail(slugOrId ?? ''),
    queryFn: () => fetchProductBySlug(String(slugOrId)),
    enabled: Boolean(slugOrId),
  })

export const useRelatedProducts = (
  productId: string | number,
  category?: string,
) =>
  useQuery({
    queryKey: [...productKeys.all, 'related', productId, category] as const,
    queryFn: () => fetchRelatedProducts(productId, category),
    enabled: Boolean(productId),
  })

export const useProductFilterMeta = () =>
  useQuery({
    queryKey: [...productKeys.all, 'filter-meta'] as const,
    queryFn: async () =>
      calculateProductFilterMeta(await fetchProducts({ perPage: 50 })),
    staleTime: 1000 * 60 * 15,
  })
