import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { useIntl } from 'react-intl'
import { Link } from 'react-router-dom'
import { Heart, HelpCircle, Home, ShoppingBag, Sparkles, Star, Tag } from 'lucide-react'
import { motion } from 'motion/react'
import logo from '@/assets/logo.webp'
import CardNav, { type CardNavItem } from '@/components/CardNav'
import { DesktopHeader } from '@/layout/DesktopHeader'
import { PromoTicker } from '@/layout/PromoTicker'
import { DEFAULT_LOCALE, isLocale, type Locale } from '@/i18n/locales'
import type { MessageKey } from '@/i18n/messages/en'
import { getLocalizedPath } from '@/i18n/navigation'
import { useCart } from '@/features/cart'
import { useWishlist } from '@/features/wishlist'
import { useContactSettings } from '@/features/contact'
import { NavActions, NavSearch } from '@/layout/NavActions'

export const Header = () => {
  const intl = useIntl()
  const locale: Locale = isLocale(intl.locale) ? intl.locale : DEFAULT_LOCALE
  const { data: contact } = useContactSettings()
  const brandName = contact?.appName || intl.formatMessage({ id: 'brand.name' })

  const [hidden, setHidden] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    let previousScrollY = window.scrollY

    const handleScroll = () => {
      if (isMenuOpen) {
        setHidden(false)
        return
      }

      const currentScrollY = window.scrollY
      const diff = currentScrollY - previousScrollY

      if (currentScrollY > 80 && diff > 5) {
        setHidden(true)
      } else if (diff < -5 || currentScrollY <= 80) {
        setHidden(false)
      }

      previousScrollY = currentScrollY
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isMenuOpen])

  const items = useMemo<CardNavItem[]>(() => {
    const link = (path: string, id: MessageKey, icon?: ReactNode) => {
      const label = intl.formatMessage({ id })
      return {
        label,
        href: getLocalizedPath(path, locale),
        ariaLabel: label,
        icon,
      }
    }

    return [
      {
        label: intl.formatMessage({ id: 'nav.shop' }),
        className: 'bg-primary text-primary-950',
        links: [
          link('/', 'nav.home', <Home className="size-4 shrink-0" />),
          link('/products', 'nav.products', <ShoppingBag className="size-4 shrink-0" />),
          link('/offers', 'nav.offers', <Tag className="size-4 shrink-0" />),
        ],
      },
      {
        label: intl.formatMessage({ id: 'nav.care' }),
        className: 'bg-secondary text-secondary-foreground',
        links: [
          link('/skincare', 'category.skincare.title', <Sparkles className="size-4 shrink-0" />),
          link('/bodycare', 'category.bodycare.title', <Heart className="size-4 shrink-0" />),
        ],
      },
      {
        label: intl.formatMessage({ id: 'nav.explore' }),
        className: 'bg-tertiary text-tertiary-foreground',
        links: [
          link('/reviews', 'nav.reviews', <Star className="size-4 shrink-0" />),
          link('/how-to-order', 'nav.howToOrder', <HelpCircle className="size-4 shrink-0" />),
        ],
      },
    ]
  }, [intl, locale])

  const { data: cart } = useCart()
  const { data: wishlist } = useWishlist()

  const cartCount = cart?.items.reduce((total, item) => total + (item.quantity || 1), 0) ?? 0
  const wishlistCount = wishlist?.items.length ?? 0

  return (
    <header className="sticky top-0 z-50 w-full rounded-none">
      <PromoTicker />
      <motion.div
        className="w-full rounded-none"
        initial={false}
        animate={{
          y: hidden ? '-100%' : '0%',
        }}
        transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
        style={{
          pointerEvents: hidden ? 'none' : 'auto',
        }}
      >
        {/* Desktop Header (Large Screens: lg and up) */}
        <div className="hidden lg:block">
          <DesktopHeader />
        </div>

        {/* Mobile/Tablet CardNav Header (Screens below lg) */}
        <div className="block lg:hidden">
          <CardNav
            logo={logo}
            logoAlt={brandName}
            logoHref={getLocalizedPath('/', locale)}
            items={items}
            leading={<NavSearch />}
            actions={<NavActions />}
            openMenuLabel={intl.formatMessage({ id: 'nav.openMenu' })}
            closeMenuLabel={intl.formatMessage({ id: 'nav.closeMenu' })}
            onMenuOpenChange={(open) => {
              setIsMenuOpen(open)
              if (open) setHidden(false)
            }}
            mobileActions={(closeMenu) => (
              <div className="flex w-full items-center gap-2 pt-0.5">
                <Link
                  to={getLocalizedPath('/wishlist', locale)}
                  onClick={closeMenu}
                  viewTransition={true}
                  aria-label={intl.formatMessage({ id: 'nav.wishlist' })}
                  className="group relative flex flex-1 items-center justify-between overflow-hidden rounded-xl bg-gradient-to-br from-rose-500/15 via-rose-500/10 to-rose-500/5 p-2.5 text-rose-950 dark:text-rose-100 ring-1 ring-rose-500/20 shadow-xs transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="flex size-8 items-center justify-center rounded-lg bg-rose-500/20 text-rose-600 dark:text-rose-300 shadow-xs transition-transform group-hover:scale-110">
                      <Heart className="size-4 fill-rose-500/40 text-rose-600 dark:text-rose-300" />
                    </div>
                    <span className="text-sm font-semibold tracking-tight">
                      {intl.formatMessage({ id: 'nav.wishlist' })}
                    </span>
                  </div>
                  {wishlistCount > 0 && (
                    <span className="flex min-w-5 h-5 items-center justify-center rounded-full bg-rose-500 px-1.5 text-xs font-bold text-white shadow-xs">
                      {wishlistCount > 99 ? '99+' : wishlistCount}
                    </span>
                  )}
                </Link>

                <Link
                  to={getLocalizedPath('/cart', locale)}
                  onClick={closeMenu}
                  viewTransition={true}
                  aria-label={intl.formatMessage({ id: 'nav.cart' })}
                  className="group relative flex flex-1 items-center justify-between overflow-hidden rounded-xl bg-gradient-to-br from-primary/30 via-primary/20 to-primary/10 p-2.5 text-primary-950 dark:text-primary-100 ring-1 ring-primary/30 shadow-xs transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="flex size-8 items-center justify-center rounded-lg bg-primary/30 text-primary-950 dark:text-primary-100 shadow-xs transition-transform group-hover:scale-110">
                      <ShoppingBag className="size-4 text-primary-900 dark:text-primary-100" />
                    </div>
                    <span className="text-sm font-semibold tracking-tight">
                      {intl.formatMessage({ id: 'nav.cart' })}
                    </span>
                  </div>
                  {cartCount > 0 && (
                    <span className="flex min-w-5 h-5 items-center justify-center rounded-full bg-secondary px-1.5 text-xs font-bold text-secondary-foreground shadow-xs">
                      {cartCount > 99 ? '99+' : cartCount}
                    </span>
                  )}
                </Link>
              </div>
            )}
          />
        </div>
      </motion.div>
    </header>
  )
}






