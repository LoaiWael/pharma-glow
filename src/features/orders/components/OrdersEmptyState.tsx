import { Package, Sparkles } from 'lucide-react'
import { motion } from 'motion/react'
import { useIntl } from 'react-intl'
import { Link } from 'react-router-dom'
import { buttonVariants } from '@/components/ui/button'
import { DEFAULT_LOCALE, isLocale, type Locale } from '@/i18n/locales'
import { getLocalizedPath } from '@/i18n/navigation'
import { cn } from '@/lib/utils'

type OrdersEmptyStateProps = {
  onExploreProducts?: () => void
}

const OrdersEmptyIllustration = () => {
  const intl = useIntl()

  return (
    <motion.div
      className="relative mx-auto size-44"
      role="img"
      aria-label={intl.formatMessage({ id: 'orders.emptyIllustration' })}
      initial={{ opacity: 0, scale: 0.88, y: 18 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <motion.div
        className="absolute inset-4 rounded-full bg-primary/80 blur-2xl"
        animate={{ scale: [1, 1.12, 1], opacity: [0.55, 0.9, 0.55] }}
        transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.div
        className="absolute inset-0"
        animate={{ y: [0, -7, 0] }}
        transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut' }}
      >
        <svg viewBox="0 0 200 200" className="size-full">
          <ellipse cx="100" cy="170" rx="48" ry="8" className="fill-secondary/15" />
          <path
            d="M52 96h96v58a18 18 0 0 1-18 18H70a18 18 0 0 1-18-18V96Z"
            className="fill-card stroke-secondary"
            strokeWidth="3"
          />
          <path d="M52 96h96v22H52Z" className="fill-primary/50" />
          <path d="M100 96v76" className="stroke-secondary" strokeWidth="3" />
          <path
            d="M48 86h104l-8 16H56L48 86Z"
            className="fill-primary stroke-secondary"
            strokeWidth="2.5"
          />
          <rect x="88" y="70" width="24" height="22" rx="5" className="fill-secondary" />
          <path
            d="M94 70c0-8 3-14 6-14s6 6 6 14"
            className="fill-none stroke-tertiary"
            strokeWidth="2.5"
          />
        </svg>
      </motion.div>

      <motion.span
        className="absolute top-4 start-6 size-2 rounded-full bg-secondary"
        animate={{ y: [0, -6, 0], opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.span
        className="absolute top-12 end-3 size-1.5 rounded-full bg-tertiary"
        animate={{ y: [0, -5, 0], opacity: [0.35, 1, 0.35] }}
        transition={{ duration: 2.8, delay: 0.4, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute -top-2 end-6 text-secondary"
        animate={{ rotate: [0, 15, 0], scale: [0.9, 1.15, 0.9] }}
        transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
      >
        <Sparkles className="size-5" />
      </motion.div>
    </motion.div>
  )
}

export const OrdersEmptyState = ({ onExploreProducts }: OrdersEmptyStateProps) => {
  const intl = useIntl()
  const locale: Locale = isLocale(intl.locale) ? intl.locale : DEFAULT_LOCALE
  const productsPath = getLocalizedPath('/products', locale)

  return (
    <motion.div
      className="flex flex-1 flex-col items-center justify-center px-4 py-12 text-center"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <OrdersEmptyIllustration />

      <p className="mt-6 text-xs font-medium tracking-[0.22em] text-secondary uppercase">
        {intl.formatMessage({ id: 'orders.emptyKicker' })}
      </p>
      <h3 className="mt-2 max-w-xs text-xl font-medium text-balance md:text-2xl">
        {intl.formatMessage({ id: 'orders.emptyHeadline' })}
      </h3>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-tertiary">
        {intl.formatMessage({ id: 'orders.emptyBody' })}
      </p>

      <motion.div className="mt-6 w-full max-w-56" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
        <Link
          to={productsPath}
          onClick={onExploreProducts}
          viewTransition={true}
          className={cn(buttonVariants({ variant: 'secondary', size: 'lg' }), 'h-11 w-full rounded-xl gap-2 font-medium')}
        >
          <Package className="size-4" aria-hidden="true" />
          {intl.formatMessage({ id: 'orders.startShopping' })}
        </Link>
      </motion.div>
    </motion.div>
  )
}
