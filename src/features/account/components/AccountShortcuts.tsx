import { ChevronLeft, ChevronRight, Heart, Package, Sparkles } from 'lucide-react'
import { motion } from 'motion/react'
import { useIntl } from 'react-intl'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card'
import { DEFAULT_LOCALE, isLocale, type Locale } from '@/i18n/locales'
import { getLocalizedPath } from '@/i18n/navigation'
import { containerVariants, itemFadeUpVariants } from '@/lib/animation-variants'

const shortcuts = [
  {
    to: '/orders',
    icon: Package,
    titleId: 'account.shortcut.orders',
    hintId: 'account.shortcut.ordersHint',
  },
  {
    to: '/wishlist',
    icon: Heart,
    titleId: 'account.shortcut.wishlist',
    hintId: 'account.shortcut.wishlistHint',
  },
  {
    to: '/products',
    icon: Sparkles,
    titleId: 'account.shortcut.shop',
    hintId: 'account.shortcut.shopHint',
  },
] as const

export const AccountShortcuts = () => {
  const intl = useIntl()
  const locale: Locale = isLocale(intl.locale) ? intl.locale : DEFAULT_LOCALE
  const Chevron = locale === 'ar' ? ChevronLeft : ChevronRight

  return (
    <motion.div
      className="grid gap-3 sm:grid-cols-3"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {shortcuts.map((shortcut) => {
        const Icon = shortcut.icon
        return (
          <motion.div key={shortcut.to} variants={itemFadeUpVariants}>
            <Link to={getLocalizedPath(shortcut.to, locale)} viewTransition={true} className="block">
              <motion.div whileHover={{ y: -3 }} whileTap={{ scale: 0.98 }}>
                <Card className="h-full rounded-2xl border-primary-200/60 bg-card/90 ring-primary-200/40 transition-colors hover:bg-primary-50/60">
                  <CardContent className="flex items-center gap-3 py-1">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/40 text-secondary">
                      <Icon className="size-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <CardTitle className="text-sm font-semibold text-foreground">
                        {intl.formatMessage({ id: shortcut.titleId })}
                      </CardTitle>
                      <CardDescription className="mt-0.5 text-xs text-tertiary">
                        {intl.formatMessage({ id: shortcut.hintId })}
                      </CardDescription>
                    </div>
                    <Chevron className="size-4 shrink-0 text-tertiary/50" />
                  </CardContent>
                </Card>
              </motion.div>
            </Link>
          </motion.div>
        )
      })}
    </motion.div>
  )
}
