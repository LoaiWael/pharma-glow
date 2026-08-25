import { fetchProducts, type Product } from '@/features/products'
import type {
  EnrichedWishlist,
  Wishlist,
  WishlistItem,
  WishlistLineItem,
} from '../types'

export const EMPTY_WISHLIST: Wishlist = {
  items: [],
}

/**
 * Mock wishlist lines reference catalog products by `productId` (API numeric ids).
 */
export const MOCK_WISHLIST_ITEMS: WishlistItem[] = [
  { id: 'wi-1', productId: 1 },
  { id: 'wi-2', productId: 2 },
]

export const MOCK_WISHLIST: Wishlist = {
  items: MOCK_WISHLIST_ITEMS,
}

const findProductById = (
  products: Product[],
  productId: Product['id'],
): Product | undefined => {
  const cleanId = String(productId).toLowerCase().trim()
  return products.find(
    (product) =>
      String(product.id).toLowerCase() === cleanId ||
      String(product.slug ?? '').toLowerCase() === cleanId,
  )
}

export const enrichWishlistItems = async (
  items: WishlistItem[],
): Promise<WishlistLineItem[]> => {
  const products = await fetchProducts({ perPage: 50 })
  return items.flatMap((item) => {
    const product = findProductById(products, item.productId)
    if (!product) return []
    return [{ ...item, product }]
  })
}

export const enrichWishlist = async (
  wishlist: Wishlist,
): Promise<EnrichedWishlist> => ({
  items: await enrichWishlistItems(wishlist.items),
})
