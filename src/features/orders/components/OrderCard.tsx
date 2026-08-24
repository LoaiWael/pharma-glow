import { useState } from 'react'
import {
  Check,
  ChevronDown,
  Clock,
  MapPin,
  Package,
  PackageCheck,
  RotateCcw,
  Sparkles,
  Truck,
} from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useIntl } from 'react-intl'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { buttonVariants } from '@/components/ui/button'
import { EGYPT_GOVERNORATES } from '@/features/checkout'
import { DEFAULT_LOCALE, isLocale, type Locale } from '@/i18n/locales'
import { getLocalizedPath } from '@/i18n/navigation'
import { cn } from '@/lib/utils'
import type { EnrichedOrder, OrderStatus } from '../types'

interface OrderCardProps {
  order: EnrichedOrder
}

const statusBadgeStyles: Record<
  OrderStatus,
  {
    badge: string
    dot: string
  }
> = {
  processing: {
    badge: 'bg-primary/50 text-secondary border border-secondary/20',
    dot: 'bg-secondary animate-pulse',
  },
  shipped: {
    badge: 'bg-secondary/15 text-secondary border border-secondary/30',
    dot: 'bg-secondary animate-ping',
  },
  delivered: {
    badge: 'bg-secondary text-secondary-foreground shadow-xs',
    dot: 'bg-secondary-foreground',
  },
  cancelled: {
    badge: 'bg-neutral text-tertiary border border-border/60',
    dot: 'bg-tertiary',
  },
}

interface TrackingStepConfig {
  key: 'placed' | 'processing' | 'shipped' | 'delivered'
  labelId: string
  icon: typeof Package
}

const TRACKING_STEPS: TrackingStepConfig[] = [
  { key: 'placed', labelId: 'orders.tracking.placed', icon: Package },
  { key: 'processing', labelId: 'orders.tracking.processing', icon: Clock },
  { key: 'shipped', labelId: 'orders.tracking.shipped', icon: Truck },
  { key: 'delivered', labelId: 'orders.tracking.delivered', icon: PackageCheck },
]

export const OrderCard = ({ order }: OrderCardProps) => {
  const intl = useIntl()
  const navigate = useNavigate()
  const locale: Locale = isLocale(intl.locale) ? intl.locale : DEFAULT_LOCALE
  const [expanded, setExpanded] = useState(false)

  const currency = intl.formatMessage({ id: 'product.currency', defaultMessage: 'EGP' })
  const governorate = EGYPT_GOVERNORATES.find((item) => item.id === order.address.governorateId)
  const governorateName = locale === 'ar' ? governorate?.nameAr : governorate?.nameEn
  const itemCount = order.items.reduce((acc, item) => acc + item.quantity, 0)
  const canReorder = order.status === 'delivered' || order.status === 'cancelled'

  // An order is active / in-transit if it's processing or shipped
  const isUndelivered = order.status === 'processing' || order.status === 'shipped'

  // Map status to progress step index (0: placed, 1: processing, 2: shipped, 3: delivered)
  const currentStepIndex = order.status === 'processing' ? 1 : order.status === 'shipped' ? 2 : 0

  const handleReorder = () => {
    toast.success(intl.formatMessage({ id: 'orders.reorderSuccess' }))
    navigate(getLocalizedPath('/cart', locale), { viewTransition: true })
  }

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96, y: -10 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={cn(
        'group relative overflow-hidden rounded-2xl border bg-card p-3 shadow-xs transition-all duration-200 hover:shadow-md sm:p-6',
        isUndelivered
          ? 'border-secondary/30 ring-1 ring-secondary/10 bg-linear-to-b from-primary/10 via-card to-card'
          : 'border-border/60',
      )}
    >
      {/* Header Info */}
      <div className="flex flex-col gap-2.5 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2.5">
            <h2 className="text-base font-bold tracking-tight text-foreground sm:text-lg" dir="ltr">
              {order.id}
            </h2>
            <span
              className={cn(
                'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold',
                statusBadgeStyles[order.status].badge,
              )}
            >
              <span
                className={cn('size-1.5 rounded-full shrink-0', statusBadgeStyles[order.status].dot)}
              />
              {intl.formatMessage({ id: `orders.status.${order.status}` })}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-tertiary sm:text-sm">
            <span>
              {intl.formatMessage(
                { id: 'orders.placedOn' },
                {
                  date: intl.formatDate(order.placedAt, {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  }),
                },
              )}
            </span>
            <span className="text-border">·</span>
            <span>
              {intl.formatMessage({ id: 'orders.itemsCount' }, { count: itemCount })}
            </span>
            <span className="text-border">·</span>
            <span className="font-medium text-foreground/80">
              {intl.formatMessage({ id: 'checkout.paymentCod' })}
            </span>
          </div>
        </div>

        {/* Price & Summary */}
        <div className="flex items-end justify-between border-t border-border/40 pt-2 sm:border-t-0 sm:pt-0 sm:text-end">
          <div>
            <p className="text-[11px] font-medium text-tertiary">
              {intl.formatMessage({ id: 'cart.total', defaultMessage: 'Total' })}
            </p>
            <p className="text-lg font-black tracking-tight text-foreground sm:text-xl">
              {intl.formatNumber(order.total)}{' '}
              <span className="text-xs font-medium text-tertiary">{currency}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Progress Track Line for Active / Undelivered Orders */}
      {isUndelivered && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.3 }}
          className="mt-3 rounded-xl border border-secondary/20 bg-linear-to-r from-primary/30 via-primary/20 to-neutral/40 p-2.5 sm:mt-5 sm:p-5"
        >
          {/* Header of Track Line */}
          {(() => {
            const currentStepConfig = TRACKING_STEPS[currentStepIndex] || TRACKING_STEPS[0]
            const CurrentIcon = currentStepConfig.icon

            return (
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2 sm:mb-4">
                <div className="flex items-center gap-2.5">
                  <span className="flex size-8 items-center justify-center rounded-lg bg-secondary/15 text-secondary shadow-2xs">
                    <CurrentIcon className="size-4.5 animate-bounce" />
                  </span>
                  <div>
                    <p className="text-xs font-bold text-foreground sm:text-sm">
                      {intl.formatMessage({ id: currentStepConfig.labelId })}
                    </p>
                    <p className="text-[11px] text-tertiary">
                      {intl.formatMessage(
                        { id: 'orders.tracking.eta' },
                        { days: intl.formatMessage({ id: 'orders.tracking.etaDays' }) },
                      )}
                    </p>
                  </div>
                </div>

                <span className="inline-flex items-center gap-1 rounded-full bg-secondary/10 px-2.5 py-0.5 text-[11px] font-semibold text-secondary">
                  <Sparkles className="size-3" />
                  {intl.formatMessage({ id: `orders.status.${order.status}` })}
                </span>
              </div>
            )
          })()}

          {/* Stepper Bar */}
          <div className="relative pt-2 pb-1">
            {/* Background Line */}
            <div className="absolute top-5 sm:top-6 start-5 end-5 sm:start-6 sm:end-6 h-1 -translate-y-1/2 rounded-full bg-border/60" />

            {/* Filled Active Line with Motion */}
            <motion.div
              className="absolute top-5 sm:top-6 start-5 sm:start-6 h-1 -translate-y-1/2 rounded-full bg-secondary"
              initial={{ width: '0%' }}
              animate={{
                width:
                  currentStepIndex === 0
                    ? '0%'
                    : currentStepIndex === 1
                      ? '33.33%'
                      : currentStepIndex === 2
                        ? '66.66%'
                        : '100%',
              }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            />

            {/* Steps Nodes */}
            <div className="relative flex justify-between">
              {TRACKING_STEPS.map((step, index) => {
                const isCompleted = index < currentStepIndex
                const isCurrent = index === currentStepIndex
                const StepIcon = step.icon

                return (
                  <div
                    key={step.key}
                    className="flex flex-1 flex-col items-center px-0.5 text-center"
                  >
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className={cn(
                        'relative flex size-7.5 items-center justify-center rounded-full border-2 transition-all duration-300 sm:size-9',
                        isCompleted
                          ? 'border-secondary bg-secondary text-secondary-foreground shadow-xs'
                          : isCurrent
                            ? 'border-secondary bg-card text-secondary ring-3 sm:ring-4 ring-secondary/20'
                            : 'border-border/80 bg-neutral/80 text-tertiary/60',
                      )}
                    >
                      {isCompleted ? (
                        <Check className="size-3.5 stroke-[3] sm:size-4" />
                      ) : (
                        <StepIcon
                          className={cn(
                            'size-3.5 sm:size-4',
                            isCurrent && 'animate-pulse text-secondary',
                          )}
                        />
                      )}

                      {/* Ripple animation on current active step */}
                      {isCurrent && (
                        <span className="absolute inset-0 rounded-full animate-ping bg-secondary/25" />
                      )}
                    </motion.div>

                    <p
                      className={cn(
                        'mt-1.5 line-clamp-2 w-full text-[10px] font-medium leading-tight sm:mt-2 sm:text-xs',
                        isCurrent
                          ? 'font-bold text-secondary'
                          : isCompleted
                            ? 'text-foreground'
                            : 'text-tertiary/70',
                      )}
                    >
                      {intl.formatMessage({ id: step.labelId })}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        </motion.div>
      )}

      {/* Items Preview Row */}
      <div className="mt-3 flex items-center gap-2 sm:mt-4.5 sm:gap-2.5">
        {order.items.slice(0, 4).map((item) => {
          const title =
            locale === 'ar' && item.product.titleAr ? item.product.titleAr : item.product.title
          return (
            <Link
              key={item.id}
              to={getLocalizedPath(`/products/${item.product.id}`, locale)}
              viewTransition={true}
              className="group/thumb relative size-13.5 shrink-0 overflow-hidden rounded-xl border border-border/50 bg-neutral/50 p-1.5 transition-transform duration-200 hover:scale-105 hover:border-secondary/40 sm:size-15"
            >
              <img
                src={item.product.image}
                alt={title}
                className="size-full object-contain transition-transform duration-200 group-hover/thumb:scale-110"
              />
              {item.quantity > 1 && (
                <span className="absolute bottom-1 end-1 rounded-md bg-secondary px-1.5 py-0.2 text-[10px] font-bold text-secondary-foreground shadow-xs">
                  x{item.quantity}
                </span>
              )}
            </Link>
          )
        })}
        {order.items.length > 4 ? (
          <span className="flex size-13.5 shrink-0 items-center justify-center rounded-xl border border-dashed border-border/80 bg-neutral/30 text-xs font-semibold text-tertiary sm:size-15">
            +{order.items.length - 4}
          </span>
        ) : null}
      </div>

      {/* Actions */}
      <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-border/40 pt-3 sm:mt-4 sm:gap-2.5 sm:pt-4">
        <motion.button
          type="button"
          onClick={() => setExpanded((prev) => !prev)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={cn(
            buttonVariants({ variant: 'outline', size: 'sm' }),
            'h-9 cursor-pointer rounded-xl gap-1.5 px-3 text-xs font-medium',
          )}
          aria-expanded={expanded}
        >
          {intl.formatMessage({ id: expanded ? 'orders.hideDetails' : 'orders.viewDetails' })}
          <ChevronDown className={cn('size-3.5 transition-transform duration-200', expanded && 'rotate-180')} />
        </motion.button>

        {canReorder ? (
          <motion.button
            type="button"
            onClick={handleReorder}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className={cn(
              buttonVariants({ variant: 'secondary', size: 'sm' }),
              'h-9 cursor-pointer rounded-xl gap-1.5 px-3 text-xs font-semibold',
            )}
          >
            <RotateCcw className="size-3.5" />
            {intl.formatMessage({ id: 'orders.reorder' })}
          </motion.button>
        ) : null}
      </div>

      {/* Collapsible Details Drawer */}
      <AnimatePresence>
        {expanded ? (
          <motion.div
            key="details"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="overflow-hidden"
          >
            <div className="mt-4 space-y-4 border-t border-border/40 pt-4">
              <ul className="divide-y divide-border/30">
                {order.items.map((item) => {
                  const title =
                    locale === 'ar' && item.product.titleAr ? item.product.titleAr : item.product.title
                  const productPath = getLocalizedPath(`/products/${item.product.id}`, locale)
                  const volume = item.selectedVolume ?? item.product.volume

                  return (
                    <li key={item.id} className="flex flex-col gap-2 py-3 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:gap-3.5">
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <Link
                          to={productPath}
                          viewTransition={true}
                          className="size-13 shrink-0 overflow-hidden rounded-xl border border-border/40 bg-neutral/50 p-1.5 transition-transform hover:scale-105 sm:size-14"
                        >
                          <img src={item.product.image} alt={title} className="size-full object-contain" />
                        </Link>
                        <div className="min-w-0 flex-1">
                          <Link
                            to={productPath}
                            viewTransition={true}
                            className="block truncate text-sm font-semibold text-foreground hover:text-secondary transition-colors"
                          >
                            {title}
                          </Link>
                          <p className="text-xs text-tertiary">
                            {intl.formatNumber(item.quantity)} × {intl.formatNumber(item.product.price)}{' '}
                            {currency}
                            {volume ? ` · ${volume}` : ''}
                          </p>
                        </div>
                      </div>
                      <div className="flex justify-end ps-16 sm:ps-0">
                        <span className="text-sm font-bold text-foreground whitespace-nowrap">
                          {intl.formatNumber(item.product.price * item.quantity)} {currency}
                        </span>
                      </div>
                    </li>
                  )
                })}
              </ul>

              {/* Delivery Address & Contact Info Box */}
              <div className="flex items-start gap-2.5 rounded-xl border border-border/50 bg-neutral/60 p-3 text-xs text-tertiary">
                <MapPin className="mt-0.5 size-4 shrink-0 text-secondary" />
                <div className="space-y-0.5">
                  <p className="font-semibold text-foreground">
                    {intl.formatMessage({ id: 'orders.shipTo' })}
                  </p>
                  <p>
                    {order.contact.fullName} ({order.contact.phone})
                  </p>
                  <p>
                    {order.address.street}, {order.address.building}, {order.address.city}
                    {governorateName ? `, ${governorateName}` : ''}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.article>
  )
}

