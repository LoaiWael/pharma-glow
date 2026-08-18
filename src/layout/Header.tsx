import { useMemo } from 'react'
import { useIntl } from 'react-intl'
import logo from '@/assets/logo.webp'
import CardNav, { type CardNavItem } from '@/components/CardNav'
import { DEFAULT_LOCALE, isLocale, type Locale } from '@/i18n/locales'
import type { MessageKey } from '@/i18n/messages/en'
import { getLocalizedPath } from '@/i18n/navigation'
import { NavActions, NavSearch } from '@/layout/NavActions'

export const Header = () => {
  const intl = useIntl()
  const locale: Locale = isLocale(intl.locale) ? intl.locale : DEFAULT_LOCALE
  const brandName = intl.formatMessage({ id: 'brand.name' })

  const items = useMemo<CardNavItem[]>(() => {
    const link = (path: string, id: MessageKey) => {
      const label = intl.formatMessage({ id })
      return {
        label,
        href: getLocalizedPath(path, locale),
        ariaLabel: label,
      }
    }

    return [
      {
        label: intl.formatMessage({ id: 'nav.shop' }),
        className: 'bg-primary text-primary-950',
        links: [
          link('/', 'nav.home'),
          link('/products', 'nav.products'),
          link('/offers', 'nav.offers'),
        ],
      },
      {
        label: intl.formatMessage({ id: 'nav.care' }),
        className: 'bg-secondary text-secondary-foreground',
        links: [
          link('/skincare', 'category.skincare.title'),
          link('/bodycare', 'category.bodycare.title'),
        ],
      },
      {
        label: intl.formatMessage({ id: 'nav.explore' }),
        className: 'bg-tertiary text-tertiary-foreground',
        links: [link('/reviews', 'nav.reviews')],
      },
    ]
  }, [intl, locale])

  return (
    <header className="sticky top-0 z-40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <CardNav
          logo={logo}
          logoAlt={brandName}
          logoHref={getLocalizedPath('/', locale)}
          items={items}
          leading={<NavSearch />}
          actions={<NavActions />}
          openMenuLabel={intl.formatMessage({ id: 'nav.openMenu' })}
          closeMenuLabel={intl.formatMessage({ id: 'nav.closeMenu' })}
        />
      </div>
    </header>
  )
}
