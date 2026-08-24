import { Minus, Plus, Trash2 } from 'lucide-react'
import { motion } from 'motion/react'
import { useIntl } from 'react-intl'
import { Link } from 'react-router-dom'
import { DEFAULT_LOCALE, isLocale, type Locale } from '@/i18n/locales'
import { getLocalizedPath } from '@/i18n/navigation'
import type { CartLineItem } from '../types'

interface CartItemCardProps {
  item: CartLineItem
  onUpdateQuantity?: (id: string, quantity: number) => void
  onRemove?: (id: string) => void
}

export const CartItemCard = ({ item, onUpdateQuantity, onRemove }: CartItemCardProps) => {
  const intl = useIntl()
  const locale: Locale = isLocale(intl.locale) ? intl.locale : DEFAULT_LOCALE

  const { product, quantity, selectedVolume, id } = item
  const productTitle = locale === 'ar' && product.titleAr ? product.titleAr : product.title
  const brandName = locale === 'ar' && product.brandAr ? product.brandAr : product.brand
  const productPath = getLocalizedPath(`/products/${product.id}`, locale)

  const unitPrice = product.price
  const itemTotal = unitPrice * quantity
  const originalTotal = product.originalPrice ? product.originalPrice * quantity : null

  // Calculate discount percentage if original price is greater than current price
  const calculatedDiscount =
    product.originalPrice && product.originalPrice > unitPrice
      ? Math.round(((product.originalPrice - unitPrice) / product.originalPrice) * 100)
      : undefined
  const discountPercent = product.discountPercent ?? calculatedDiscount

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96, y: -10 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="group relative flex flex-col sm:flex-row items-start sm:items-center gap-4 rounded-2xl border border-border/60 bg-card p-4 sm:p-5 shadow-xs"
    >
      {/* Product Image */}
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

      {/* Main Info & Quantity / Price */}
      <div className="flex flex-1 flex-col justify-between self-stretch w-full gap-3">
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1 text-start">
            {brandName ? (
              <span className="text-xs font-medium uppercase tracking-wider text-secondary">
                {brandName}
              </span>
            ) : null}
            <h3 className="text-base font-semibold leading-tight text-foreground transition-colors">
              <Link to={productPath} viewTransition={true}>{productTitle}</Link>
            </h3>

            {selectedVolume || product.volume ? (
              <div className="inline-flex items-center rounded-full bg-neutral px-2.5 py-0.5 text-xs text-tertiary">
                {selectedVolume ?? product.volume}
              </div>
            ) : null}
          </div>

          {/* Remove Button */}
          <button
            type="button"
            onClick={() => onRemove?.(id)}
            className="rounded-lg p-1.5 text-tertiary transition-colors hover:bg-destructive/10 hover:text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring shrink-0"
            aria-label={intl.formatMessage({ id: 'cart.removeItem', defaultMessage: 'Remove item' })}
          >
            <Trash2 className="size-4" />
          </button>
        </div>

        {/* Quantity Controls & Price Summary */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-border/40">
          {/* Quantity Stepper */}
          <div className="flex items-center rounded-xl border border-border bg-neutral/30 p-1">
            <button
              type="button"
              disabled={quantity <= 1}
              onClick={() => onUpdateQuantity?.(id, Math.max(1, quantity - 1))}
              className="flex size-7 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-card disabled:opacity-35 disabled:hover:bg-transparent"
              aria-label={intl.formatMessage({ id: 'cart.decreaseQuantity', defaultMessage: 'Decrease quantity' })}
            >
              <Minus className="size-3.5" />
            </button>
            <span className="w-8 text-center text-sm font-semibold text-foreground">
              {intl.formatNumber(quantity)}
            </span>
            <button
              type="button"
              onClick={() => onUpdateQuantity?.(id, quantity + 1)}
              className="flex size-7 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-card"
              aria-label={intl.formatMessage({ id: 'cart.increaseQuantity', defaultMessage: 'Increase quantity' })}
            >
              <Plus className="size-3.5" />
            </button>
          </div>

          {/* Pricing Row */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Current Item Total Price */}
            <div className="flex items-baseline gap-1 text-foreground font-extrabold text-base md:text-lg">
              <span>{intl.formatNumber(itemTotal)}</span>
              <span className="text-xs font-bold text-tertiary">
                {intl.formatMessage({ id: 'product.currency', defaultMessage: 'EGP' })}
              </span>
            </div>

            {/* Original Price & Discount Percentage */}
            {(originalTotal || (discountPercent && discountPercent > 0)) && (
              <div className="flex items-center gap-1.5 shrink-0">
                {originalTotal && originalTotal > itemTotal && (
                  <span className="line-through text-xs text-tertiary font-medium whitespace-nowrap">
                    {intl.formatNumber(originalTotal)} {intl.formatMessage({ id: 'product.currency', defaultMessage: 'EGP' })}
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
        </div>
      </div>
    </motion.article>
  )
}
