import type { Product } from '@/features/products'

/**
 * Persisted wishlist line — only wishlist-owned state.
 * Display fields (title, image, price, …) come from Product via productId.
 */
export interface WishlistItem {
  /** Unique wishlist line id (not the product id). */
  id: string
  /** References `Product.id` in the products catalog. */
  productId: Product['id']
}

/** Wishlist line with the resolved Product snapshot for UI. */
export interface WishlistLineItem extends WishlistItem {
  product: Product
}

export interface Wishlist {
  items: WishlistItem[]
}

export interface EnrichedWishlist {
  items: WishlistLineItem[]
}
