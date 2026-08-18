import { AnimatePresence } from 'motion/react'
import { useIntl } from 'react-intl'
import { useCart } from '../api/use-cart'
import { CartEmptyState } from './CartEmptyState'

export const CartView = () => {
  const intl = useIntl()
  const { data: cart } = useCart()
  const items = cart?.items ?? []
  const isEmpty = items.length === 0

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="text-center sm:text-start">
        <h1 className="text-3xl font-medium text-secondary">
          {intl.formatMessage({ id: 'cart.title' })}
        </h1>
        <p className="mt-2 text-tertiary">
          {intl.formatMessage({ id: 'cart.itemsCount' }, { count: items.length })}
        </p>
      </header>

      <AnimatePresence mode="wait">
        {isEmpty ? (
          <div className="flex min-h-[50vh] items-center justify-center">
            <CartEmptyState key="empty" />
          </div>
        ) : null}
      </AnimatePresence>
    </section>
  )
}
