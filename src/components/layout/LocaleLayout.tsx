import { useLayoutEffect } from 'react'
import { IntlProvider } from 'react-intl'
import { Outlet, useLocation, useParams } from 'react-router-dom'
import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'
import { DEFAULT_LOCALE, isLocale, LOCALE_DIR, type Locale } from '@/i18n/locales'
import { getMessages } from '@/i18n/messages'

const DocumentLocale = ({ locale }: { locale: Locale }) => {
  useLayoutEffect(() => {
    document.documentElement.lang = locale
    document.documentElement.dir = LOCALE_DIR[locale]
  }, [locale])

  return null
}

type LocaleLayoutProps = {
  forcedLocale?: Locale
}

export const LocaleLayout = ({ forcedLocale }: LocaleLayoutProps) => {
  const { locale: paramLocale } = useParams()
  const { pathname } = useLocation()
  const activeLocale: Locale = forcedLocale || (isLocale(paramLocale) ? paramLocale : DEFAULT_LOCALE)
  const isGalleryRoute = pathname.includes('/gallery')

  return (
    <IntlProvider locale={activeLocale} messages={getMessages(activeLocale)} defaultLocale={DEFAULT_LOCALE}>
      <DocumentLocale locale={activeLocale} />
      <div className="flex min-h-svh flex-col bg-neutral-100 text-primary">
        <Header />
        <main className="flex-1">
          <Outlet />
        </main>
        {isGalleryRoute ? null : <Footer />}
      </div>
    </IntlProvider>
  )
}
