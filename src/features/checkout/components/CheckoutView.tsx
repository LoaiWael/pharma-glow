import { useEffect, useState } from 'react'
import { ClipboardList } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useIntl } from 'react-intl'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { CartEmptyState, useCart } from '@/features/cart'
import { useAuth } from '@/features/auth'
import { DEFAULT_LOCALE, isLocale, type Locale } from '@/i18n/locales'
import { getLocalizedPath } from '@/i18n/navigation'
import { usePlaceOrder } from '../api/use-place-order'
import type { PlaceOrderPayload } from '../types'
import { CHECKOUT_FORM_ID, CheckoutForm, CheckoutPlaceOrderButton } from './CheckoutForm'
import { CheckoutSummary } from './CheckoutSummary'

export const CheckoutView = () => {
  const intl = useIntl()
  const navigate = useNavigate()
  const locale: Locale = isLocale(intl.locale) ? intl.locale : DEFAULT_LOCALE
  const { data: cart, isLoading: isCartLoading } = useCart()
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth()
  const placeOrder = usePlaceOrder()
  const [isFormValid, setIsFormValid] = useState(false)

  const items = cart?.items ?? []
  const isLoading = isCartLoading || isAuthLoading
  const isEmpty = !isLoading && items.length === 0

  const handleSubmit = (payload: Omit<PlaceOrderPayload, 'items'>) => {
    placeOrder.mutate(
      {
        ...payload,
        items: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          selectedVolume: item.selectedVolume,
        })),
      },
      {
        onSuccess: (result) => {
          toast.success(intl.formatMessage({ id: 'checkout.successToast', defaultMessage: 'Order placed' }))
          navigate(getLocalizedPath(`/order-confirmation/${encodeURIComponent(result.orderId)}`, locale), {
            replace: true,
            viewTransition: true,
          })
        },
        onError: () => {
          toast.error(
            intl.formatMessage({
              id: 'checkout.errorToast',
              defaultMessage: 'Could not place the order. Please try again.',
            }),
          )
        },
      },
    )
  }

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
  }, [])

  return (
    <section className="py-6 md:py-12 pb-16">
      <header className="mb-6 md:mb-8 flex flex-col gap-2 border-b border-border/50 pb-6">
        <div className="flex items-center gap-2">
          <ClipboardList className="size-8 md:size-10 text-secondary" />
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl text-foreground">
            {intl.formatMessage({ id: 'checkout.title', defaultMessage: 'Proceed to order' })}
          </h1>
        </div>
        <p className="text-sm text-tertiary">
          {intl.formatMessage({
            id: 'checkout.subtitle',
            defaultMessage: 'Confirm your details and place the order with cash on delivery.',
          })}
        </p>
      </header>

      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid gap-8 lg:grid-cols-12"
          >
            <div className="h-96 animate-pulse rounded-2xl bg-primary/30 lg:col-span-8" />
            <div className="h-64 animate-pulse rounded-2xl bg-primary/20 lg:col-span-4" />
          </motion.div>
        ) : isEmpty ? (
          <div key="empty" className="flex min-h-[50vh] items-center justify-center">
            <CartEmptyState />
          </div>
        ) : (
          <motion.div
            key="checkout"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 gap-8 lg:grid-cols-12"
          >
            <div className="lg:col-span-8">
              <CheckoutForm
                isAuthenticated={isAuthenticated}
                defaultContact={{
                  fullName: user?.fullName ?? '',
                  phone: user?.phone ?? '',
                }}
                onSubmit={handleSubmit}
                onValidityChange={setIsFormValid}
              />
            </div>
            <div className="lg:col-span-4">
              <div className="lg:sticky lg:top-24 space-y-4">
                <CheckoutSummary items={items} />
                <CheckoutPlaceOrderButton
                  form={CHECKOUT_FORM_ID}
                  isSubmitting={placeOrder.isPending}
                  isValid={isFormValid}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
