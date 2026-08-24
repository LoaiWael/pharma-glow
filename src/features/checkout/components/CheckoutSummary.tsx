import type { CartLineItem } from '@/features/cart'
import { useIntl } from 'react-intl'
import { Link } from 'react-router-dom'
import { DEFAULT_LOCALE, isLocale, type Locale } from '@/i18n/locales'
import { getLocalizedPath } from '@/i18n/navigation'
import { cn } from '@/lib/utils'

const SHIPPING_THRESHOLD = 150
const SHIPPING_COST = 25

type CheckoutSummaryProps = {
  items: CartLineItem[]
}

export const CheckoutSummary = ({ items }: CheckoutSummaryProps) => {
  const intl = useIntl()
  const locale: Locale = isLocale(intl.locale) ? intl.locale : DEFAULT_LOCALE
  const currency = intl.formatMessage({ id: 'product.currency', defaultMessage: 'EGP' })

  const subtotal = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0)
  const freeShipping = subtotal >= SHIPPING_THRESHOLD || items.length === 0
  const shippingCost = freeShipping ? 0 : SHIPPING_COST
  const grandTotal = subtotal + shippingCost

  return (
    <aside className="rounded-2xl border border-border/60 bg-card p-5 shadow-xs lg:p-6 space-y-5">
      <h2 className="text-lg font-semibold text-foreground">
        {intl.formatMessage({ id: 'cart.orderSummary', defaultMessage: 'Order Summary' })}
      </h2>

      <ul className="space-y-3">
        {items.map((item) => {
          const title = locale === 'ar' && item.product.titleAr ? item.product.titleAr : item.product.title
          const productPath = getLocalizedPath(`/products/${item.product.id}`, locale)

          return (
            <li key={item.id} className="flex items-center gap-3">
              <Link
                to={productPath}
                viewTransition={true}
                className="size-14 shrink-0 overflow-hidden rounded-xl border border-border/40 bg-neutral/50 p-1"
              >
                <img src={item.product.image} alt={title} className="size-full object-contain" />
              </Link>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">{title}</p>
                <p className="text-xs text-tertiary">
                  {intl.formatNumber(item.quantity)} × {intl.formatNumber(item.product.price)} {currency}
                </p>
              </div>
              <span className="text-sm font-semibold text-foreground whitespace-nowrap">
                {intl.formatNumber(item.product.price * item.quantity)} {currency}
              </span>
            </li>
          )
        })}
      </ul>

      <div className="space-y-2 border-t border-border/60 pt-4 text-sm">
        <div className="flex justify-between text-tertiary">
          <span>{intl.formatMessage({ id: 'cart.subtotal', defaultMessage: 'Subtotal' })}</span>
          <span className="font-medium text-foreground">
            {intl.formatNumber(subtotal)} {currency}
          </span>
        </div>
        <div className="flex justify-between text-tertiary">
          <span>{intl.formatMessage({ id: 'cart.shipping', defaultMessage: 'Estimated Delivery' })}</span>
          <span className={cn('font-medium', freeShipping ? 'text-secondary font-semibold' : 'text-foreground')}>
            {freeShipping
              ? intl.formatMessage({ id: 'cart.freeShipping', defaultMessage: 'FREE' })
              : `${intl.formatNumber(shippingCost)} ${currency}`}
          </span>
        </div>
        <div className="flex items-center justify-between border-t border-border/60 pt-3">
          <div>
            <span className="font-semibold text-foreground">
              {intl.formatMessage({ id: 'cart.total', defaultMessage: 'Total' })}
            </span>
            <p className="text-[11px] text-tertiary">
              {intl.formatMessage({ id: 'product.vatIncluded', defaultMessage: 'Prices include VAT' })}
            </p>
          </div>
          <span className="text-xl font-bold text-foreground">
            {intl.formatNumber(grandTotal)} {currency}
          </span>
        </div>
      </div>
    </aside>
  )
}
