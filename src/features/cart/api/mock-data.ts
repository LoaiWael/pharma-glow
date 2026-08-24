import { mockProducts, type Product } from '@/features/products'
import type { Cart, CartItem, CartLineItem, EnrichedCart } from '../types'

export const EMPTY_CART: Cart = {
  items: [],
}

/**
 * Mock cart lines reference real catalog products by `productId`.
 * Name, photo, price, and other display data are resolved from `mockProducts`.
 */
export const MOCK_CART_ITEMS: CartItem[] = [
  {
    id: 'ci-1',
    productId: 'p1',
    quantity: 2,
    selectedVolume: '30 مل',
  },
  {
    id: 'ci-2',
    productId: 'p3',
    quantity: 1,
    selectedVolume: '50 مل',
  },
  {
    id: 'ci-3',
    productId: 'p5',
    quantity: 1,
    selectedVolume: '50 مل',
  },
  {
    id: 'ci-4',
    productId: 'p8',
    quantity: 3,
  },
  {
    id: 'ci-5',
    productId: 'p11',
    quantity: 1,
  },
]

export const MOCK_CART: Cart = {
  items: MOCK_CART_ITEMS,
}

const findProductById = (productId: Product['id']): Product | undefined => {
  const cleanId = String(productId).toLowerCase().trim()
  return mockProducts.find((product) => String(product.id).toLowerCase() === cleanId)
}

/** Resolve cart line items against the products catalog for name, photo, price, etc. */
export const enrichCartItems = (items: CartItem[]): CartLineItem[] =>
  items.flatMap((item) => {
    const product = findProductById(item.productId)
    if (!product) return []
    return [{ ...item, product }]
  })

export const enrichCart = (cart: Cart): EnrichedCart => ({
  items: enrichCartItems(cart.items),
})
