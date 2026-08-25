import { fetchProducts, type Product } from '@/features/products'
import type { Cart, CartItem, CartLineItem, EnrichedCart } from '../types'

export const EMPTY_CART: Cart = {
  items: [],
}

/**
 * Mock cart lines reference catalog products by `productId` (API numeric ids).
 * Display data is resolved from the live products catalog.
 */
export const MOCK_CART_ITEMS: CartItem[] = [
  {
    id: 'ci-1',
    productId: 1,
    quantity: 2,
    selectedVolume: '30 مل',
  },
  {
    id: 'ci-2',
    productId: 2,
    quantity: 1,
    selectedVolume: '50 مل',
  },
]

export const MOCK_CART: Cart = {
  items: MOCK_CART_ITEMS,
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

export const enrichCartItems = async (
  items: CartItem[],
): Promise<CartLineItem[]> => {
  const products = await fetchProducts({ perPage: 50 })
  return items.flatMap((item) => {
    const product = findProductById(products, item.productId)
    if (!product) return []
    return [{ ...item, product }]
  })
}

export const enrichCart = async (cart: Cart): Promise<EnrichedCart> => ({
  items: await enrichCartItems(cart.items),
})
