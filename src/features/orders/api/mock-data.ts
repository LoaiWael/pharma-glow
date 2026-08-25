import { fetchProducts, type Product } from '@/features/products'
import type {
  EnrichedOrder,
  EnrichedOrdersList,
  Order,
  OrderItem,
  OrderLineItem,
  OrdersList,
} from '../types'

export const EMPTY_ORDERS: OrdersList = {
  orders: [],
}

/**
 * Mock orders reference catalog products by `productId` (API numeric ids).
 */
export const MOCK_ORDERS_LIST: Order[] = [
  {
    id: 'PG-2482310112',
    placedAt: '2026-08-23T14:20:00.000Z',
    status: 'processing',
    paymentMethod: 'cash_on_delivery',
    shippingCost: 0,
    contact: { fullName: 'Sara Ahmed', phone: '01012340112' },
    address: {
      country: 'EG',
      governorateId: 'cairo',
      city: 'Nasr City',
      street: 'Abbas El Akkad St.',
      building: 'Building 12, apt 4',
    },
    items: [
      { id: 'oi-1a', productId: 1, quantity: 1, selectedVolume: '30 مل' },
      { id: 'oi-1b', productId: 2, quantity: 1, selectedVolume: '50 مل' },
    ],
  },
  {
    id: 'PG-2082018901',
    placedAt: '2026-08-20T09:05:00.000Z',
    status: 'shipped',
    paymentMethod: 'cash_on_delivery',
    shippingCost: 25,
    contact: { fullName: 'Sara Ahmed', phone: '01012340112' },
    address: {
      country: 'EG',
      governorateId: 'giza',
      city: 'Dokki',
      street: 'Tahrir Street',
      building: 'Building 8, apt 2',
    },
    items: [{ id: 'oi-2a', productId: 1, quantity: 1, selectedVolume: '50 مل' }],
  },
]

export const MOCK_ORDERS: OrdersList = {
  orders: MOCK_ORDERS_LIST,
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

export const enrichOrderItems = (
  items: OrderItem[],
  products: Product[],
): OrderLineItem[] =>
  items.flatMap((item) => {
    const product = findProductById(products, item.productId)
    if (!product) return []
    return [{ ...item, product }]
  })

export const enrichOrder = (
  order: Order,
  products: Product[],
): EnrichedOrder => {
  const items = enrichOrderItems(order.items, products)
  const subtotal = items.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0,
  )
  const total = subtotal + order.shippingCost

  return {
    ...order,
    items,
    subtotal,
    total,
  }
}

export const enrichOrders = async (
  list: OrdersList,
): Promise<EnrichedOrdersList> => {
  const products = await fetchProducts({ perPage: 50 })
  return {
    orders: list.orders.map((order) => enrichOrder(order, products)),
  }
}
