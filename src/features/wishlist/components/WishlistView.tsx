import { useState } from 'react'
import { Heart, Sparkles } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useIntl } from 'react-intl'
import { Link } from 'react-router-dom'
import { DEFAULT_LOCALE, isLocale, type Locale } from '@/i18n/locales'
import { getLocalizedPath } from '@/i18n/navigation'
import { useWishlist } from '../api/use-wishlist'
import type { WishlistLineItem } from '../types'
import { WishlistEmptyState } from './WishlistEmptyState'
import { WishlistItemCard } from './WishlistItemCard'

export const WishlistView = () => {
  const intl = useIntl()
  const locale: Locale = isLocale(intl.locale) ? intl.locale : DEFAULT_LOCALE
  const { data: wishlist, isLoading } = useWishlist()

  const [localItems, setLocalItems] = useState<WishlistLineItem[] | null>(null)

  const items = localItems ?? wishlist?.items ?? []
  const isEmpty = !isLoading && items.length === 0

  const handleRemove = (id: string) => {
    setLocalItems((prev) => (prev ?? wishlist?.items ?? []).filter((item) => item.id !== id))
  }

  const productsPath = getLocalizedPath('/products', locale)

  return (
    <section className="py-8 md:py-12">
      <header className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between border-b border-border/50 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <Heart className="size-10 fill-secondary text-secondary" />
            <h1 className="text-2xl font-bold tracking-tight md:text-3xl text-foreground">
              {intl.formatMessage({ id: 'wishlist.title', defaultMessage: 'Wishlist' })}
            </h1>
          </div>
          <p className="mt-1 text-sm text-tertiary">
            {intl.formatMessage({ id: 'wishlist.itemsCount' }, { count: items.length })}
          </p>
        </div>

        {!isEmpty && (
          <Link
            to={productsPath}
            viewTransition={true}
            className="text-xs font-medium text-secondary hover:text-primary transition-colors flex items-center gap-1 self-start sm:self-auto"
          >
            <Sparkles className="size-3.5" />
            {intl.formatMessage({ id: 'wishlist.exploreProducts', defaultMessage: 'Explore Products' })}
          </Link>
        )}
      </header>

      <AnimatePresence mode="wait">
        {isEmpty ? (
          <div className="flex min-h-[50vh] items-center justify-center">
            <WishlistEmptyState key="empty" />
          </div>
        ) : (
          <motion.div
            key="wishlist-content"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="grid grid-cols-1 gap-4 md:grid-cols-2"
          >
            <AnimatePresence mode="popLayout">
              {items.map((item) => (
                <WishlistItemCard key={item.id} item={item} onRemove={handleRemove} />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
