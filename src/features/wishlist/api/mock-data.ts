import { mockProducts, type Product } from '@/features/products'
import type { EnrichedWishlist, Wishlist, WishlistItem, WishlistLineItem } from '../types'

export const EMPTY_WISHLIST: Wishlist = {
  items: [],
}

/**
 * Mock wishlist lines reference real catalog products by `productId`.
 * Name, photo, price, and other display data are resolved from `mockProducts`.
 */
export const MOCK_WISHLIST_ITEMS: WishlistItem[] = [
  {
    id: 'wi-1',
    productId: 'p2',
  },
  {
    id: 'wi-2',
    productId: 'p4',
  },
  {
    id: 'wi-3',
    productId: 'p6',
  },
  {
    id: 'wi-4',
    productId: 'p9',
  },
  {
    id: 'wi-5',
    productId: 'p12',
  },
]

export const MOCK_WISHLIST: Wishlist = {
  items: MOCK_WISHLIST_ITEMS,
}

const findProductById = (productId: Product['id']): Product | undefined => {
  const cleanId = String(productId).toLowerCase().trim()
  return mockProducts.find((product) => String(product.id).toLowerCase() === cleanId)
}

/** Resolve wishlist line items against the products catalog for name, photo, price, etc. */
export const enrichWishlistItems = (items: WishlistItem[]): WishlistLineItem[] =>
  items.flatMap((item) => {
    const product = findProductById(item.productId)
    if (!product) return []
    return [{ ...item, product }]
  })

export const enrichWishlist = (wishlist: Wishlist): EnrichedWishlist => ({
  items: enrichWishlistItems(wishlist.items),
})
