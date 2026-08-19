import { useQuery } from '@tanstack/react-query'
import type { Product, ProductFilterState, ProductType } from '../types'
import { mockProducts } from '../data/mockProducts'
import { productKeys } from './query-keys'

export interface ProductFiltersParams extends Partial<ProductFilterState> {
  activeFilter?: string
}

export interface ProductFilterMeta {
  typeCounts: Record<ProductType | 'all', number>
  inStockCount: number
  freeDeliveryCount: number
  ratingCounts: Record<number, number>
  minPrice: number
  maxPrice: number
  totalCount: number
}

const filterAndSortProducts = (
  products: Product[],
  filters: ProductFiltersParams
): Product[] => {
  const {
    searchQuery = '',
    activeFilter = 'all',
    category,
    productType = 'all',
    priceRange = [0, 2500],
    inStockOnly = false,
    freeDeliveryOnly = false,
    minRating = 0,
    sortBy = 'featured',
  } = filters

  const result = products.filter((product) => {
    // 1. Search Query
    const q = searchQuery.toLowerCase().trim()
    if (q !== '') {
      const matchesTitle = product.title.toLowerCase().includes(q)
      const matchesTitleAr = product.titleAr && product.titleAr.toLowerCase().includes(q)
      const matchesCategory = product.category && product.category.toLowerCase().includes(q)
      const matchesType = product.productType && product.productType.toLowerCase().includes(q)
      if (!matchesTitle && !matchesTitleAr && !matchesCategory && !matchesType) {
        return false
      }
    }

    // 2. Active Image / Badge / Category Filter
    const effectiveFilter = category || activeFilter
    if (effectiveFilter && effectiveFilter !== 'all') {
      if (effectiveFilter === 'best_of_us' && product.badge !== 'best_of_us') {
        return false
      }
      if (effectiveFilter === 'most_ordered' && product.badge !== 'most_ordered') {
        return false
      }
      if (effectiveFilter === 'discount') {
        const hasDiscount = product.badge === 'discount' || (product.discountPercent ?? 0) > 0
        if (!hasDiscount) return false
      }
      if (effectiveFilter === 'new' && product.badge !== 'new') {
        return false
      }
      if (
        (effectiveFilter === 'skin_care' || effectiveFilter === 'body_care') &&
        product.category !== effectiveFilter
      ) {
        return false
      }
    }

    // 3. Product Type Filter
    if (productType !== 'all') {
      if (product.productType) {
        if (product.productType !== productType) return false
      } else {
        const typeKeywordMap: Record<string, string[]> = {
          serum: ['سيروم', 'serum'],
          cream: ['كريم', 'cream'],
          cleanser: ['منظف', 'غسول', 'cleanser', 'ميسيلار'],
          sunscreen: ['واقي', 'شمس', 'sunscreen', 'spf'],
          oil: ['زيت', 'oil'],
          scrub: ['مقشر', 'سكر', 'scrub'],
          lotion: ['لوشن', 'lotion'],
          gel: ['جل', 'gel'],
          butter: ['زبدة', 'butter'],
          toner: ['تونر', 'toner'],
          set: ['مجموعة', 'روتين', 'set'],
        }
        const keywords = typeKeywordMap[productType] || [productType]
        const matches = keywords.some(
          (kw) =>
            product.title.toLowerCase().includes(kw) ||
            (product.titleAr && product.titleAr.toLowerCase().includes(kw))
        )
        if (!matches) return false
      }
    }

    // 4. Price Range
    if (product.price < priceRange[0] || product.price > priceRange[1]) {
      return false
    }

    // 5. In-Stock Only
    if (inStockOnly && product.inStock === false) {
      return false
    }

    // 6. Free Delivery Only
    if (freeDeliveryOnly && product.isFreeDelivery !== true) {
      return false
    }

    // 7. Minimum Rating
    if (minRating > 0 && (product.rating ?? 0) < minRating) {
      return false
    }

    return true
  })

  // Sorting
  return [...result].sort((a, b) => {
    switch (sortBy) {
      case 'price_asc':
        return a.price - b.price
      case 'price_desc':
        return b.price - a.price
      case 'rating':
        return (b.rating ?? 0) - (a.rating ?? 0)
      case 'discount': {
        const discountA = a.discountPercent ?? 0
        const discountB = b.discountPercent ?? 0
        return discountB - discountA
      }
      case 'featured':
      default:
        return 0
    }
  })
}

const fetchProducts = async (filters: ProductFiltersParams = {}): Promise<Product[]> => {
  return filterAndSortProducts(mockProducts, filters)
}

const calculateProductFilterMeta = (products: Product[]): ProductFilterMeta => {
  const typeCounts: Record<ProductType | 'all', number> = {
    all: products.length,
    serum: 0,
    cream: 0,
    cleanser: 0,
    sunscreen: 0,
    oil: 0,
    scrub: 0,
    lotion: 0,
    gel: 0,
    butter: 0,
    toner: 0,
    set: 0,
  }

  let minPrice = Infinity
  let maxPrice = -Infinity
  let inStockCount = 0
  let freeDeliveryCount = 0
  const ratingCounts: Record<number, number> = { 0: products.length, 4.0: 0, 4.5: 0, 4.8: 0 }

  products.forEach((p) => {
    if (p.productType && p.productType in typeCounts) {
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

export const useProductFilterMeta = () =>
  useQuery({
    queryKey: [...productKeys.all, 'filter-meta'] as const,
    queryFn: async () => calculateProductFilterMeta(mockProducts),
    staleTime: 1000 * 60 * 15,
  })
