import { CheckoutView } from '@/features/checkout'
import { useEffect } from 'react'

const CheckoutPage = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
  }, [])

  return <CheckoutView />
}

export default CheckoutPage
