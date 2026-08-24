import { mockProducts, type Product } from '@/features/products'
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
 * Mock orders reference real catalog products by `productId`.
 * Name, photo, price, and other display data are resolved from `mockProducts`.
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
      { id: 'oi-1a', productId: 'p1', quantity: 1, selectedVolume: '30 مل' },
      { id: 'oi-1b', productId: 'p3', quantity: 1, selectedVolume: '50 مل' },
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
    items: [{ id: 'oi-2a', productId: 'p5', quantity: 1, selectedVolume: '50 مل' }],
  },
  {
    id: 'PG-1081503344',
    placedAt: '2026-08-10T16:40:00.000Z',
    status: 'delivered',
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
      { id: 'oi-3a', productId: 'p8', quantity: 2 },
      { id: 'oi-3b', productId: 'p11', quantity: 1 },
      { id: 'oi-3c', productId: 'p2', quantity: 1 },
    ],
  },
  {
    id: 'PG-1571509876',
    placedAt: '2026-07-15T11:12:00.000Z',
    status: 'cancelled',
    paymentMethod: 'cash_on_delivery',
    shippingCost: 25,
    contact: { fullName: 'Sara Ahmed', phone: '01012340112' },
    address: {
      country: 'EG',
      governorateId: 'alexandria',
      city: 'Stanley',
      street: 'Corniche Road',
      building: 'Villa 3',
    },
    items: [{ id: 'oi-4a', productId: 'p4', quantity: 1 }],
  },
]

export const MOCK_ORDERS: OrdersList = {
  orders: MOCK_ORDERS_LIST,
}

const findProductById = (productId: Product['id']): Product | undefined => {
  const cleanId = String(productId).toLowerCase().trim()
  return mockProducts.find((product) => String(product.id).toLowerCase() === cleanId)
}

export const enrichOrderItems = (items: OrderItem[]): OrderLineItem[] =>
  items.flatMap((item) => {
    const product = findProductById(item.productId)
    if (!product) return []
    return [{ ...item, product }]
  })

export const enrichOrder = (order: Order): EnrichedOrder => {
  const items = enrichOrderItems(order.items)
  const subtotal = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0)
  const total = subtotal + order.shippingCost

  return {
    ...order,
    items,
    subtotal,
    total,
  }
}

export const enrichOrders = (list: OrdersList): EnrichedOrdersList => ({
  orders: list.orders.map(enrichOrder),
})
