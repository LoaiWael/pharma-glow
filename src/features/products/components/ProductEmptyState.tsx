import { PackageSearch, Sparkles } from 'lucide-react'
import { motion } from 'motion/react'
import { useIntl } from 'react-intl'
import { Link } from 'react-router-dom'
import { buttonVariants } from '@/components/ui/button'
import { DEFAULT_LOCALE, isLocale, type Locale } from '@/i18n/locales'
import { getLocalizedPath } from '@/i18n/navigation'
import { cn } from '@/lib/utils'

type ProductEmptyStateProps = {
  onResetFilters?: () => void
  /** When true, CTA clears filters instead of navigating away */
  showResetCta?: boolean
}

const ProductEmptyIllustration = () => {
  const intl = useIntl()

  return (
    <motion.div
      className="relative mx-auto size-44"
      role="img"
      aria-label={intl.formatMessage({ id: 'products.emptyIllustration' })}
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
          <ellipse cx="100" cy="168" rx="46" ry="8" className="fill-secondary/15" />
          <rect
            x="52"
            y="70"
            width="96"
            height="78"
            rx="18"
            className="fill-card stroke-secondary"
            strokeWidth="3"
          />
          <path
            d="M70 70c0-18 13-30 30-30s30 12 30 30"
            className="fill-none stroke-secondary"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path d="M72 98h56" className="stroke-primary-400" strokeWidth="6" strokeLinecap="round" />
          <path d="M80 118h40" className="stroke-primary-300" strokeWidth="5" strokeLinecap="round" />
          <circle cx="100" cy="52" r="10" className="fill-secondary" />
        </svg>
      </motion.div>

      <motion.span
        className="absolute top-3 start-6 size-2 rounded-full bg-secondary"
        animate={{ y: [0, -6, 0], opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.span
        className="absolute top-10 end-4 size-1.5 rounded-full bg-tertiary"
        animate={{ y: [0, -5, 0], opacity: [0.35, 1, 0.35] }}
        transition={{ duration: 2.8, delay: 0.4, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute -top-1 end-8 text-secondary"
        animate={{ rotate: [0, 12, 0], scale: [0.9, 1.1, 0.9] }}
        transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
      >
        <PackageSearch className="size-5" />
      </motion.div>
    </motion.div>
  )
}

export const ProductEmptyState = ({
  onResetFilters,
  showResetCta = false,
}: ProductEmptyStateProps) => {
  const intl = useIntl()
  const locale: Locale = isLocale(intl.locale) ? intl.locale : DEFAULT_LOCALE
  const productsPath = getLocalizedPath('/products', locale)

  return (
    <motion.div
      key="product-empty-state"
      className="flex flex-1 flex-col items-center justify-center px-2 py-10 text-center w-full"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <ProductEmptyIllustration />

      <p className="mt-5 text-xs font-medium tracking-[0.22em] text-secondary uppercase">
        {intl.formatMessage({ id: 'products.emptyKicker' })}
      </p>
      <h3 className="mt-2 max-w-[16rem] text-xl font-medium text-balance">
        {intl.formatMessage({ id: 'products.emptyHeadline' })}
      </h3>
      <p className="mt-2 max-w-[18rem] text-sm leading-relaxed text-tertiary">
        {intl.formatMessage({ id: 'products.emptyBody' })}
      </p>

      <motion.div className="mt-6 w-full max-w-56" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
        {showResetCta && onResetFilters ? (
          <button
            type="button"
            onClick={onResetFilters}
            className={cn(
              buttonVariants({ variant: 'secondary', size: 'lg' }),
              'h-11 w-full rounded-xl',
            )}
          >
            <Sparkles className="size-4" aria-hidden="true" />
            {intl.formatMessage({ id: 'products.resetFilters' })}
          </button>
        ) : (
          <Link
            to={productsPath}
            viewTransition={true}
            className={cn(
              buttonVariants({ variant: 'secondary', size: 'lg' }),
              'h-11 w-full rounded-xl',
            )}
          >
            <Sparkles className="size-4" aria-hidden="true" />
            {intl.formatMessage({ id: 'cart.continueShopping' })}
          </Link>
        )}
      </motion.div>
    </motion.div>
  )
}
