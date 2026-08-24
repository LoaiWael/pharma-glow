import { useState } from 'react'
import { ArrowRight, ShoppingBag, Sparkles } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useIntl } from 'react-intl'
import { Link } from 'react-router-dom'
import { buttonVariants } from '@/components/ui/button'
import { DEFAULT_LOCALE, isLocale, type Locale } from '@/i18n/locales'
import { getLocalizedPath } from '@/i18n/navigation'
import { cn } from '@/lib/utils'
import { useCart } from '../api/use-cart'
import { CartEmptyState } from './CartEmptyState'
import { CartItemCard } from './CartItemCard'

export const CartView = () => {
  const intl = useIntl()
  const locale: Locale = isLocale(intl.locale) ? intl.locale : DEFAULT_LOCALE
  const { data: cart, isLoading } = useCart()

  // Local state for interactive quantity updates / item removal in UI
  const [localItems, setLocalItems] = useState(cart?.items ?? [])

  // Sync state when query resolves initially
  const items = localItems.length > 0 || cart?.items === undefined ? (localItems.length > 0 ? localItems : cart?.items ?? []) : []
  const isEmpty = !isLoading && items.length === 0

  const handleUpdateQuantity = (id: string, newQuantity: number) => {
    setLocalItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: newQuantity } : item))
    )
  }

  const handleRemove = (id: string) => {
    setLocalItems((prev) => prev.filter((item) => item.id !== id))
  }

  const subtotal = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0)
  const shippingThreshold = 150
  const freeShipping = subtotal >= shippingThreshold || items.length === 0
  const shippingCost = freeShipping ? 0 : 25
  const grandTotal = subtotal + shippingCost

  const productsPath = getLocalizedPath('/products', locale)
  const checkoutPath = getLocalizedPath('/checkout', locale)

  return (
    <section className="py-6 md:py-12 pb-28 md:pb-12">
      <header className="mb-6 md:mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between border-b border-border/50 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <ShoppingBag className="size-8 md:size-10 text-secondary" />
            <h1 className="text-2xl font-bold tracking-tight md:text-3xl text-foreground">
              {intl.formatMessage({ id: 'cart.title', defaultMessage: 'Shopping Bag' })}
            </h1>
          </div>
          <p className="mt-1 text-sm text-tertiary">
            {intl.formatMessage({ id: 'cart.itemsCount' }, { count: items.length })}
          </p>
        </div>

        {!isEmpty && (
          <Link
            to={productsPath}
            viewTransition={true}
            className="text-xs font-medium text-secondary hover:text-primary transition-colors flex items-center gap-1 self-start sm:self-auto"
          >
            <Sparkles className="size-3.5" />
            {intl.formatMessage({ id: 'cart.continueShopping', defaultMessage: 'Continue Shopping' })}
          </Link>
        )}
      </header>

      <AnimatePresence mode="wait">
        {isEmpty ? (
          <div className="flex min-h-[50vh] items-center justify-center">
            <CartEmptyState key="empty" />
          </div>
        ) : (
          <motion.div
            key="cart-content"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="grid grid-cols-1 gap-8 lg:grid-cols-12"
          >
            {/* Cart Items List */}
            <div className="space-y-4 lg:col-span-8">
              <AnimatePresence mode="popLayout">
                {items.map((item) => (
                  <CartItemCard
                    key={item.id}
                    item={item}
                    onUpdateQuantity={handleUpdateQuantity}
                    onRemove={handleRemove}
                  />
                ))}
              </AnimatePresence>
            </div>

            {/* Order Summary Sidebar / Mobile Bottom Fixed Bar */}
            <aside className="lg:col-span-4">
              <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border/80 bg-background/95 p-4 shadow-lg backdrop-blur-md lg:static lg:z-auto lg:rounded-2xl lg:border lg:border-border/60 lg:bg-card lg:p-6 lg:shadow-xs lg:backdrop-blur-none space-y-3 lg:space-y-6">
                <h2 className="hidden lg:block text-lg font-semibold text-foreground">
                  {intl.formatMessage({ id: 'cart.orderSummary', defaultMessage: 'Order Summary' })}
                </h2>

                <div className="space-y-2 lg:space-y-3 text-xs lg:text-sm">
                  <div className="hidden lg:flex justify-between text-tertiary">
                    <span>{intl.formatMessage({ id: 'cart.subtotal', defaultMessage: 'Subtotal' })}</span>
                    <span className="font-medium text-foreground">
                      {intl.formatNumber(subtotal)} {intl.formatMessage({ id: 'product.currency', defaultMessage: 'EGP' })}
                    </span>
                  </div>

                  <div className="hidden lg:flex justify-between text-tertiary">
                    <span>{intl.formatMessage({ id: 'cart.shipping', defaultMessage: 'Estimated Delivery' })}</span>
                    <span className={cn('font-medium', freeShipping ? 'text-emerald-600 dark:text-emerald-400 font-semibold' : 'text-foreground')}>
                      {freeShipping
                        ? intl.formatMessage({ id: 'cart.freeShipping', defaultMessage: 'FREE' })
                        : `${intl.formatNumber(shippingCost)} ${intl.formatMessage({ id: 'product.currency', defaultMessage: 'EGP' })}`}
                    </span>
                  </div>

                  {/* Compact Mobile Total / Desktop Full Total */}
                  <div className="flex items-center justify-between lg:border-t lg:border-border/60 lg:pt-3">
                    <div>
                      <span className="text-xs lg:text-base font-semibold text-foreground">
                        {intl.formatMessage({ id: 'cart.total', defaultMessage: 'Total' })}
                      </span>
                      <p className="text-[10px] lg:text-[11px] text-tertiary">
                        {intl.formatMessage({ id: 'product.vatIncluded', defaultMessage: 'Prices include VAT' })}
                      </p>
                    </div>

                    <div className="text-end">
                      <span className="text-lg lg:text-xl font-bold text-foreground">
                        {intl.formatNumber(grandTotal)} {intl.formatMessage({ id: 'product.currency', defaultMessage: 'EGP' })}
                      </span>
                    </div>
                  </div>
                </div>

                <Link
                  to={checkoutPath}
                  viewTransition={true}
                  className={cn(
                    buttonVariants({ variant: 'secondary', size: 'lg' }),
                    'w-full h-11 lg:h-12 rounded-xl text-sm lg:text-base font-medium shadow-sm hover:shadow transition-all flex items-center justify-center gap-2'
                  )}
                >
                  <span>{intl.formatMessage({ id: 'cart.checkout', defaultMessage: 'Proceed to Checkout' })}</span>
                  <ArrowRight className="size-4 rtl:rotate-180" />
                </Link>
              </div>
            </aside>
          </motion.div>
        )}
      </AnimatePresence>
    </section>

  )
}

