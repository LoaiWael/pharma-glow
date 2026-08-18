import { FormattedMessage } from 'react-intl'
import { Link, useLocation } from 'react-router-dom'
import logo from '@/assets/logo.svg'
import { Container } from '@/components/layout/Container'
import { DEFAULT_LOCALE, type Locale } from '@/i18n/locales'
import { getLocalizedPath } from '@/i18n/navigation'

export const Footer = () => {
  const { pathname } = useLocation()
  const locale: Locale = pathname.startsWith('/en') ? 'en' : DEFAULT_LOCALE
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-primary-900/20 bg-primary text-primary-100">
      <Container className="grid gap-8 py-12 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <Link to={getLocalizedPath('/', locale)} className="mb-3 flex items-center gap-2" viewTransition={true}>
            <img src={logo} alt="" className="size-9" />
            <span className="font-semibold text-white">
              <FormattedMessage id="brand.name" />
            </span>
          </Link>
          <p className="max-w-sm text-sm text-primary-200">
            <FormattedMessage id="footer.tagline" />
          </p>
        </div>
        <div className="text-sm">
          <p className="mb-2 font-medium text-white">
            <FormattedMessage id="footer.contact" />
          </p>
          <a className="text-secondary-300 hover:text-white" href="mailto:hello@pioneersofsuccess.com">
            <FormattedMessage id="footer.email" />
          </a>
        </div>
        <div className="flex items-end text-sm text-primary-300 lg:justify-end">
          <p>
            © {year} <FormattedMessage id="brand.name" />. <FormattedMessage id="footer.rights" />
          </p>
        </div>
      </Container>
    </footer>
  )
}
