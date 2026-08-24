import type { CartLineItem } from '@/features/cart'

export type PaymentMethod = 'cash_on_delivery'

export interface CheckoutContact {
  fullName: string
  phone: string
}

export interface CheckoutAddress {
  country: 'EG'
  governorateId: string
  city: string
  street: string
  building: string
  landmark: string
}

export interface CheckoutFormValues extends CheckoutContact, CheckoutAddress {
  notes: string
  paymentMethod: PaymentMethod
}

export interface PlaceOrderPayload {
  contact: CheckoutContact
  address: CheckoutAddress
  notes: string
  paymentMethod: PaymentMethod
  items: Array<{
    productId: CartLineItem['productId']
    quantity: number
    selectedVolume?: string
  }>
}

export interface PlaceOrderResult {
  orderId: string
}
