import { Heart, ShoppingBag } from 'lucide-react'
import { motion } from 'motion/react'
import { useIntl } from 'react-intl'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'
import { buttonVariants } from '@/components/ui/button'
import { DEFAULT_LOCALE, isLocale, type Locale } from '@/i18n/locales'
import { getLocalizedPath } from '@/i18n/navigation'
import { cn } from '@/lib/utils'
import type { WishlistLineItem } from '../types'

interface WishlistItemCardProps {
  item: WishlistLineItem
  onRemove?: (id: string) => void
  onAddToCart?: (id: string) => void
}

export const WishlistItemCard = ({ item, onRemove, onAddToCart }: WishlistItemCardProps) => {
  const intl = useIntl()
  const navigate = useNavigate()
  const locale: Locale = isLocale(intl.locale) ? intl.locale : DEFAULT_LOCALE

  const { product, id } = item
  const productTitle = locale === 'ar' && product.titleAr ? product.titleAr : product.title
  const brandName = locale === 'ar' && product.brandAr ? product.brandAr : product.brand
  const productPath = getLocalizedPath(`/products/${product.id}`, locale)
  const inStock = product.inStock !== false

  const unitPrice = product.price
  const originalPrice = product.originalPrice
  const calculatedDiscount =
    originalPrice && originalPrice > unitPrice
      ? Math.round(((originalPrice - unitPrice) / originalPrice) * 100)
      : undefined
  const discountPercent = product.discountPercent ?? calculatedDiscount

  const handleAddToCart = () => {
    toast.success(intl.formatMessage({ id: 'products.addedSuccess' }, { name: productTitle }))
    onAddToCart?.(id)
    navigate(getLocalizedPath('/cart', locale), { viewTransition: true })
  }

  const handleRemove = () => {
    toast.success(
      intl.formatMessage({ id: 'product.removedFromWishlistSuccess' }, { name: productTitle }),
    )
    onRemove?.(id)
  }

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96, y: -10 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="group relative flex flex-col sm:flex-row items-start sm:items-center gap-4 rounded-2xl border border-border/60 bg-card p-4 sm:p-5 shadow-xs"
    >
      <Link
        to={productPath}
        viewTransition={true}
        className="relative aspect-square w-24 sm:w-28 shrink-0 overflow-hidden rounded-xl bg-neutral/50 p-2 border border-border/40"
      >
        <img
          src={product.image}
          alt={productTitle}
          className="size-full object-contain object-center"
          loading="lazy"
        />
      </Link>

      <div className="flex flex-1 flex-col justify-between self-stretch w-full gap-3">
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1 text-start">
            {brandName ? (
              <span className="text-xs font-medium uppercase tracking-wider text-secondary">
                {brandName}
              </span>
            ) : null}
            <h3 className="text-base font-semibold leading-tight text-foreground transition-colors">
              <Link to={productPath} viewTransition={true}>
                {productTitle}
              </Link>
            </h3>

            {product.volume ? (
              <div className="inline-flex items-center rounded-full bg-neutral px-2.5 py-0.5 text-xs text-tertiary">
                {product.volume}
              </div>
            ) : null}
          </div>

          <motion.button
            type="button"
            onClick={handleRemove}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            className="w-9 h-9 shrink-0 rounded-full bg-white/90 dark:bg-neutral-800/90 backdrop-blur-xs border border-border flex items-center justify-center transition-colors shadow-xs cursor-pointer text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30"
            title={intl.formatMessage({ id: 'wishlist.removeItem', defaultMessage: 'Remove from wishlist' })}
            aria-label={intl.formatMessage({ id: 'wishlist.removeItem', defaultMessage: 'Remove from wishlist' })}
          >
            <Heart className="w-4 h-4 fill-current" />
          </motion.button>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-border/40">
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-baseline gap-1 text-foreground font-extrabold text-base md:text-lg">
              <span>{intl.formatNumber(unitPrice)}</span>
              <span className="text-xs font-bold text-tertiary">
                {intl.formatMessage({ id: 'product.currency', defaultMessage: 'EGP' })}
              </span>
            </div>

            {(originalPrice || (discountPercent && discountPercent > 0)) && (
              <div className="flex items-center gap-1.5 shrink-0">
                {originalPrice && originalPrice > unitPrice && (
                  <span className="line-through text-xs text-tertiary font-medium whitespace-nowrap">
                    {intl.formatNumber(originalPrice)}{' '}
                    {intl.formatMessage({ id: 'product.currency', defaultMessage: 'EGP' })}
                  </span>
                )}

                {discountPercent && discountPercent > 0 && (
                  <span className="text-[11px] font-bold bg-secondary-100 text-secondary-900 dark:bg-secondary-900 dark:text-secondary-100 px-1.5 py-0.5 rounded-md shrink-0">
                    -{discountPercent}%
                  </span>
                )}
              </div>
            )}
          </div>

          <motion.button
            type="button"
            disabled={!inStock}
            onClick={handleAddToCart}
            whileHover={inStock ? { scale: 1.02 } : undefined}
            whileTap={inStock ? { scale: 0.97 } : undefined}
            className={cn(
              buttonVariants({ variant: 'secondary', size: 'sm' }),
              'h-9 rounded-xl gap-1.5 px-3 text-xs font-medium disabled:opacity-50',
            )}
          >
            <ShoppingBag className="size-3.5" />
            {inStock
              ? intl.formatMessage({ id: 'product.addToBag', defaultMessage: 'Add to bag' })
              : intl.formatMessage({ id: 'wishlist.outOfStock', defaultMessage: 'Out of stock' })}
          </motion.button>
        </div>
      </div>
    </motion.article>
  )
}
