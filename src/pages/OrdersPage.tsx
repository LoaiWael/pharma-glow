import { OrdersView } from '@/features/orders'
import { useEffect } from 'react'

const OrdersPage = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
  }, [])

  return <OrdersView />
}

export default OrdersPage
