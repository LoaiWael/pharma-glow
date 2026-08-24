import type { Product } from '@/features/products'

/**
 * Persisted cart line — only cart-owned state.
 * Display fields (title, image, price, …) come from Product via productId.
 */
export interface CartItem {
  /** Unique cart line id (not the product id). */
  id: string
  /** References `Product.id` in the products catalog. */
  productId: Product['id']
  quantity: number
  /** Selected volume/size option for this line, when the product has volumeOptions. */
  selectedVolume?: string
}

/** Cart line with the resolved Product snapshot for UI. */
export interface CartLineItem extends CartItem {
  product: Product
}

export interface Cart {
  items: CartItem[]
}

export interface EnrichedCart {
  items: CartLineItem[]
}
