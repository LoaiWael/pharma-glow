import { useMutation } from '@tanstack/react-query'
import type { PlaceOrderPayload, PlaceOrderResult } from '../types'

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const placeOrder = async (payload: PlaceOrderPayload): Promise<PlaceOrderResult> => {
  await wait(700)
  const suffix = payload.contact.phone.slice(-4) || '0000'
  return { orderId: `PG-${Date.now().toString().slice(-6)}${suffix}` }
}

export const usePlaceOrder = () =>
  useMutation({
    mutationFn: placeOrder,
  })
