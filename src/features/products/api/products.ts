import { api, type ApiEnvelope } from '@/lib/http'
import type { Product, ProductFilterState } from '../types'

export const PRODUCT_IMAGE_FALLBACK = '/imgs/mockup/1.webp'

export interface ProductFiltersParams extends Partial<ProductFilterState> {
  activeFilter?: string
  perPage?: number
  page?: number
}

/** Raw product shape from the Pure Store Catalog API. */
export interface ApiProduct {
  id: number
  slug: string
  sku?: string
  title: string
  brand?: string | null
  category?: string | null
  productType?: string | null
  image?: string | null
  images?: string[] | null
  price: number
  originalPrice?: number | null
  discountPercent?: number | null
  badge?: string | null
  badgeText?: string | null
  inStock?: boolean
  stockCount?: number | null
  rating?: number | null
  reviewCount?: number | null
  volume?: string | null
  volumeOptions?: string[] | null
  skinType?: string[] | null
  keyIngredients?: string[] | null
  description?: string | null
  overviewHighlights?: string[] | null
  howToUse?: string | null
  isFreeDelivery?: boolean
  isFeatured?: boolean
}

const PRODUCTS_PATH = '/api/v1/products'

export const normalizeProduct = (raw: ApiProduct): Product => {
  const images = (raw.images ?? []).filter(Boolean)
  const image = raw.image || images[0] || PRODUCT_IMAGE_FALLBACK

  return {
    id: raw.id,
    slug: raw.slug,
    sku: raw.sku,
    title: raw.title,
    brand: raw.brand ?? undefined,
    category: raw.category ?? undefined,
    productType: raw.productType ?? undefined,
    image,
    images: images.length > 0 ? images : [image],
    price: raw.price,
    originalPrice: raw.originalPrice ?? undefined,
    discountPercent: raw.discountPercent ?? undefined,
    badge: raw.badge ?? undefined,
    badgeText: raw.badgeText ?? undefined,
    inStock: raw.inStock,
    stockCount: raw.stockCount ?? undefined,
    rating: raw.rating ?? undefined,
    reviewCount: raw.reviewCount ?? undefined,
    volume: raw.volume ?? undefined,
    volumeOptions: raw.volumeOptions ?? undefined,
    skinType: raw.skinType ?? undefined,
    keyIngredients: raw.keyIngredients ?? undefined,
    description: raw.description ?? undefined,
    overviewHighlights: raw.overviewHighlights ?? undefined,
    howToUse: raw.howToUse ?? undefined,
    isFreeDelivery: raw.isFreeDelivery,
    isFeatured: raw.isFeatured,
  }
}

const resolveListQuery = (
  filters: ProductFiltersParams = {},
): Record<string, string | number | boolean | null | undefined> => {
  const {
    searchQuery,
    activeFilter = 'all',
    category,
    productType = 'all',
    priceRange,
    inStockOnly,
    freeDeliveryOnly,
    minRating = 0,
    sortBy = 'featured',
    perPage = 24,
    page,
  } = filters

  const query: Record<string, string | number | boolean | null | undefined> = {
    per_page: perPage,
    page,
  }

  if (searchQuery?.trim()) {
    query.q = searchQuery.trim()
  }

  const effectiveFilter = category || activeFilter
  if (effectiveFilter && effectiveFilter !== 'all') {
    if (
      effectiveFilter === 'best_of_us' ||
      effectiveFilter === 'most_ordered' ||
      effectiveFilter === 'discount' ||
      effectiveFilter === 'new'
    ) {
      query.badge = effectiveFilter
    } else {
      query.category = effectiveFilter
    }
  }

  if (productType && productType !== 'all') {
    query.product_type = productType
  }

  if (priceRange) {
    if (priceRange[0] > 0) query.min_price = priceRange[0]
    if (priceRange[1] < 2500) query.max_price = priceRange[1]
  }

  if (inStockOnly) query.in_stock = true
  if (freeDeliveryOnly) query.free_delivery = true
  if (minRating > 0) query.min_rating = minRating

  if (sortBy && sortBy !== 'discount') {
    query.sort = sortBy
  } else if (sortBy === 'discount') {
    query.badge = query.badge ?? 'discount'
  }

  return query
}

export const fetchProducts = async (
  filters: ProductFiltersParams = {},
): Promise<Product[]> => {
  const envelope = await api.get<ApiEnvelope<ApiProduct[]>>(PRODUCTS_PATH, {
    query: resolveListQuery(filters),
  })
  return envelope.data.map(normalizeProduct)
}

export const fetchProductBySlug = async (slug: string): Promise<Product> => {
  const envelope = await api.get<ApiEnvelope<ApiProduct>>(
    `${PRODUCTS_PATH}/${encodeURIComponent(slug)}`,
  )
  return normalizeProduct(envelope.data)
}

export const fetchRelatedProducts = async (
  productId: string | number,
  category?: string,
): Promise<Product[]> => {
  const products = await fetchProducts({
    category: category || undefined,
    perPage: 12,
  })
  const cleanId = String(productId).toLowerCase().trim()
  return products
    .filter(
      (p) =>
        String(p.id).toLowerCase() !== cleanId &&
        String(p.slug ?? '').toLowerCase() !== cleanId,
    )
    .slice(0, 8)
}
