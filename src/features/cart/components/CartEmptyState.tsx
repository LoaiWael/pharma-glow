import { Sparkles } from 'lucide-react'
import { motion } from 'motion/react'
import { useIntl } from 'react-intl'
import { Link } from 'react-router-dom'
import { buttonVariants } from '@/components/ui/button'
import { DEFAULT_LOCALE, isLocale, type Locale } from '@/i18n/locales'
import { getLocalizedPath } from '@/i18n/navigation'
import { cn } from '@/lib/utils'

type CartEmptyStateProps = {
  onContinueShopping?: () => void
}

const CartEmptyIllustration = () => {
  const intl = useIntl()

  return (
    <motion.div
      className="relative mx-auto size-44"
      role="img"
      aria-label={intl.formatMessage({ id: 'cart.emptyIllustration' })}
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

          <path
            d="M58 92h84l-8 62a16 16 0 0 1-16 14H82a16 16 0 0 1-16-14L58 92Z"
            className="fill-card stroke-secondary"
            strokeWidth="3"
          />
          <path
            d="M72 92c0-18 12-32 28-32s28 14 28 32"
            className="fill-none stroke-secondary"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path d="M70 108h60" className="stroke-primary-400" strokeWidth="6" strokeLinecap="round" />

          <rect x="88" y="48" width="24" height="46" rx="8" className="fill-primary stroke-secondary" strokeWidth="2.5" />
          <rect x="94" y="38" width="12" height="14" rx="4" className="fill-secondary" />
          <rect x="97" y="28" width="6" height="14" rx="3" className="fill-tertiary" />
          <circle cx="100" cy="68" r="6" className="fill-card/70" />
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
      <motion.span
        className="absolute bottom-8 start-3 size-1.5 rounded-full bg-primary-600"
        animate={{ y: [0, -4, 0], opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 3, delay: 0.7, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.div
        className="absolute -top-1 end-8 text-secondary"
        animate={{ rotate: [0, 12, 0], scale: [0.9, 1.1, 0.9] }}
        transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
      >
        <Sparkles className="size-5" />
      </motion.div>
    </motion.div>
  )
}

export const CartEmptyState = ({ onContinueShopping }: CartEmptyStateProps) => {
  const intl = useIntl()
  const locale: Locale = isLocale(intl.locale) ? intl.locale : DEFAULT_LOCALE
  const productsPath = getLocalizedPath('/products', locale)

  return (
    <motion.div
      className="flex flex-1 flex-col items-center justify-center px-2 py-6 text-center"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <CartEmptyIllustration />

      <p className="mt-5 text-xs font-medium tracking-[0.22em] text-secondary uppercase">
        {intl.formatMessage({ id: 'cart.emptyKicker' })}
      </p>
      <h3 className="mt-2 max-w-[16rem] text-xl font-medium text-balance">
        {intl.formatMessage({ id: 'cart.emptyHeadline' })}
      </h3>
      <p className="mt-2 max-w-[18rem] text-sm leading-relaxed text-tertiary">
        {intl.formatMessage({ id: 'cart.emptyBody' })}
      </p>

      <motion.div className="mt-6 w-full max-w-56" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
        <Link
          to={productsPath}
          onClick={onContinueShopping}
          viewTransition={true}
          className={cn(
            buttonVariants({ variant: 'secondary', size: 'lg' }),
            'h-11 w-full rounded-xl',
          )}
        >
          <Sparkles className="size-4" aria-hidden="true" />
          {intl.formatMessage({ id: 'cart.continueShopping' })}
        </Link>
      </motion.div>
    </motion.div>
  )
}
