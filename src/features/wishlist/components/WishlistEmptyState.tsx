import { Heart, Sparkles } from 'lucide-react'
import { motion } from 'motion/react'
import { useIntl } from 'react-intl'
import { Link } from 'react-router-dom'
import { buttonVariants } from '@/components/ui/button'
import { DEFAULT_LOCALE, isLocale, type Locale } from '@/i18n/locales'
import { getLocalizedPath } from '@/i18n/navigation'
import { cn } from '@/lib/utils'

type WishlistEmptyStateProps = {
  onExploreProducts?: () => void
}

const WishlistEmptyIllustration = () => {
  const intl = useIntl()

  return (
    <motion.div
      className="relative mx-auto size-44"
      role="img"
      aria-label={intl.formatMessage({ id: 'wishlist.emptyIllustration' })}
      initial={{ opacity: 0, scale: 0.88, y: 18 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      {/* Background radial glow */}
      <motion.div
        className="absolute inset-4 rounded-full bg-primary/80 blur-2xl"
        animate={{ scale: [1, 1.15, 1], opacity: [0.55, 0.9, 0.55] }}
        transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Floating illustration layer */}
      <motion.div
        className="absolute inset-0"
        animate={{ y: [0, -7, 0] }}
        transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut' }}
      >
        <svg viewBox="0 0 200 200" className="size-full">
          {/* Base shadow */}
          <ellipse cx="100" cy="170" rx="48" ry="8" className="fill-secondary/15" />

          {/* Central Heart Card / Container */}
          <rect
            x="48"
            y="65"
            width="104"
            height="95"
            rx="24"
            className="fill-card stroke-secondary"
            strokeWidth="2.5"
          />

          {/* Inner Accent Plate */}
          <rect
            x="58"
            y="75"
            width="84"
            height="75"
            rx="16"
            className="fill-primary/40"
          />

          {/* Center outline/solid Heart */}
          <path
            d="M100 135 C88 123 68 108 68 92 C68 81 76 73 87 73 C93 73 97 76 100 80 C103 76 107 73 113 73 C124 73 132 81 132 92 C132 108 112 123 100 135 Z"
            className="fill-secondary stroke-secondary"
            strokeWidth="2"
            strokeLinejoin="round"
          />

          {/* Inner heart highlight */}
          <path
            d="M100 125 C91 116 76 104 76 92 C76 85 81 80 88 80 C93 80 97 83 100 87 C103 83 107 80 112 80 C119 80 124 85 124 92 C124 104 109 116 100 125 Z"
            className="fill-card/40"
          />

          {/* Floating mini heart */}
          <path
            d="M142 54 C136 48 126 40 126 32 C126 26 130 22 135.5 22 C138.5 22 140.5 23.5 142 25.5 C143.5 23.5 145.5 22 148.5 22 C154 22 158 26 158 32 C158 40 148 48 142 54 Z"
            className="fill-primary-400 stroke-secondary"
            strokeWidth="2"
          />
        </svg>
      </motion.div>

      {/* Floating sparkles and particles */}
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
      <motion.span
        className="absolute bottom-8 start-4 size-1.5 rounded-full bg-primary-600"
        animate={{ y: [0, -4, 0], opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 3, delay: 0.7, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.div
        className="absolute -top-2 end-6 text-secondary"
        animate={{ rotate: [0, 15, 0], scale: [0.9, 1.15, 0.9] }}
        transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
      >
        <Sparkles className="size-5" />
      </motion.div>
      <motion.div
        className="absolute top-2 start-10 text-tertiary/70"
        animate={{ scale: [0.8, 1.1, 0.8] }}
        transition={{ duration: 2.2, delay: 0.3, repeat: Infinity, ease: 'easeInOut' }}
      >
        <Heart className="size-3.5 fill-current" />
      </motion.div>
    </motion.div>
  )
}

export const WishlistEmptyState = ({ onExploreProducts }: WishlistEmptyStateProps) => {
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
      <WishlistEmptyIllustration />

      <p className="mt-6 text-xs font-medium tracking-[0.22em] text-secondary uppercase">
        {intl.formatMessage({ id: 'wishlist.emptyKicker' })}
      </p>
      <h3 className="mt-2 max-w-xs text-xl font-medium text-balance md:text-2xl">
        {intl.formatMessage({ id: 'wishlist.emptyHeadline' })}
      </h3>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-tertiary">
        {intl.formatMessage({ id: 'wishlist.emptyBody' })}
      </p>

      <motion.div className="mt-6 w-full max-w-56" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
        <Link
          to={productsPath}
          onClick={onExploreProducts}
          viewTransition={true}
          className={cn(
            buttonVariants({ variant: 'secondary', size: 'lg' }),
            'h-11 w-full rounded-xl gap-2 font-medium',
          )}
        >
          <Sparkles className="size-4" aria-hidden="true" />
          {intl.formatMessage({ id: 'wishlist.exploreProducts' })}
        </Link>
      </motion.div>
    </motion.div>
  )
}
