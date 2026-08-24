import type { Product } from '@/features/products'

export type OrderStatus = 'processing' | 'shipped' | 'delivered' | 'cancelled'

export type OrderPaymentMethod = 'cash_on_delivery'

/**
 * Persisted order line — only order-owned state.
 * Display fields (title, image, price, …) come from Product via productId.
 */
export interface OrderItem {
  id: string
  productId: Product['id']
  quantity: number
  selectedVolume?: string
}

export interface OrderLineItem extends OrderItem {
  product: Product
}

export interface OrderAddress {
  country: 'EG'
  governorateId: string
  city: string
  street: string
  building: string
}

export interface OrderContact {
  fullName: string
  phone: string
}

export interface Order {
  id: string
  placedAt: string
  status: OrderStatus
  paymentMethod: OrderPaymentMethod
  shippingCost: number
  contact: OrderContact
  address: OrderAddress
  items: OrderItem[]
}

export interface EnrichedOrder extends Omit<Order, 'items'> {
  items: OrderLineItem[]
  subtotal: number
  total: number
}

export interface OrdersList {
  orders: Order[]
}

export interface EnrichedOrdersList {
  orders: EnrichedOrder[]
}
