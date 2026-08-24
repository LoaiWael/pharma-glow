import { ClipboardList, Sparkles } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useIntl } from 'react-intl'
import { Link } from 'react-router-dom'
import { DEFAULT_LOCALE, isLocale, type Locale } from '@/i18n/locales'
import { getLocalizedPath } from '@/i18n/navigation'
import { useOrders } from '../api/use-orders'
import { OrderCard } from './OrderCard'
import { OrdersEmptyState } from './OrdersEmptyState'

export const OrdersView = () => {
  const intl = useIntl()
  const locale: Locale = isLocale(intl.locale) ? intl.locale : DEFAULT_LOCALE
  const { data, isLoading } = useOrders()

  const orders = data?.orders ?? []
  const isEmpty = !isLoading && orders.length === 0
  const productsPath = getLocalizedPath('/products', locale)

  return (
    <section className="py-8 md:py-12">
      <header className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between border-b border-border/50 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <ClipboardList className="size-10 text-secondary" />
            <h1 className="text-2xl font-bold tracking-tight md:text-3xl text-foreground">
              {intl.formatMessage({ id: 'orders.title', defaultMessage: 'Orders' })}
            </h1>
          </div>
          <p className="mt-1 text-sm text-tertiary">
            {intl.formatMessage({ id: 'orders.count' }, { count: orders.length })}
          </p>
        </div>

        {!isEmpty ? (
          <Link
            to={productsPath}
            viewTransition={true}
            className="text-xs font-medium text-secondary hover:text-primary transition-colors flex items-center gap-1 self-start sm:self-auto"
          >
            <Sparkles className="size-3.5" />
            {intl.formatMessage({ id: 'cart.continueShopping', defaultMessage: 'Continue shopping' })}
          </Link>
        ) : null}
      </header>

      <AnimatePresence mode="wait">
        {isEmpty ? (
          <div className="flex min-h-[50vh] items-center justify-center">
            <OrdersEmptyState key="empty" />
          </div>
        ) : (
          <motion.div
            key="orders-content"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="space-y-4"
          >
            <AnimatePresence mode="popLayout">
              {orders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
