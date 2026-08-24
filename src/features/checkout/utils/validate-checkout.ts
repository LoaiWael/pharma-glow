import type { CheckoutFormValues } from '../types'

export const EGYPT_MOBILE_PATTERN = /^01[0125][0-9]{8}$/

export const NAME_PATTERN = /^[\u0600-\u06FFa-zA-Z][\u0600-\u06FFa-zA-Z\s.'-]{1,79}$/

export const emptyCheckoutForm = (defaults?: Partial<CheckoutFormValues>): CheckoutFormValues => ({
  fullName: '',
  phone: '',
  country: 'EG',
  governorateId: '',
  city: '',
  street: '',
  building: '',
  landmark: '',
  notes: '',
  paymentMethod: 'cash_on_delivery',
  ...defaults,
})
