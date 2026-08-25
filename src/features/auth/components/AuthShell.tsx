import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { Sparkles } from 'lucide-react'
import { useIntl } from 'react-intl'
import logo from '@/assets/logo.webp'
import { DEFAULT_LOCALE, isLocale, type Locale } from '@/i18n/locales'
import { getLocalizedPath } from '@/i18n/navigation'
import { cn } from '@/lib/utils'

const AUTH_HERO_IMAGE =
  'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=1400&q=80'

type AuthShellProps = {
  title: string
  subtitle: string
  children: ReactNode
  footer: ReactNode
  className?: string
}

export const AuthShell = ({ title, subtitle, children, footer, className }: AuthShellProps) => {
  const intl = useIntl()
  const locale: Locale = isLocale(intl.locale) ? intl.locale : DEFAULT_LOCALE
  const brandName = intl.formatMessage({ id: 'brand.name' })

  return (
    <section
      className={cn(
        'full-bleed relative min-h-[calc(100svh-5rem)] overflow-hidden bg-neutral flex items-center justify-center',
        className,
      )}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,var(--primary-100),transparent_55%),radial-gradient(ellipse_at_bottom_right,var(--secondary-100),transparent_50%)]"
      />

      <div className="relative mx-auto grid w-full max-w-6xl gap-0 px-3 py-4 sm:px-6 sm:py-8 lg:grid-cols-2 lg:gap-10 lg:px-8 lg:py-12">
        {/* Visual panel */}
        <motion.aside
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="relative hidden overflow-hidden rounded-3xl lg:block"
        >
          <img
            src={AUTH_HERO_IMAGE}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-secondary-950/80 via-secondary-900/35 to-primary-200/20" />
          <div className="relative z-10 flex h-full min-h-[34rem] flex-col justify-between p-8 text-primary-50">
            <Link
              to={getLocalizedPath('/', locale)}
              viewTransition={true}
              className="inline-flex items-center gap-3 self-start no-underline"
            >
              <img
                src={logo}
                alt=""
                className="size-11 rounded-full border-2 border-primary-100/70 object-cover shadow-md"
              />
              <span className="text-lg font-semibold tracking-tight">{brandName}</span>
            </Link>

            <div className="max-w-sm space-y-3">
              <p className="inline-flex items-center gap-1.5 rounded-full bg-primary/25 px-3 py-1 text-xs font-medium text-primary-50 ring-1 ring-primary-100/40 backdrop-blur-sm">
                <Sparkles className="size-3.5" />
                {intl.formatMessage({ id: 'auth.panel.badge' })}
              </p>
              <h2 className="text-3xl font-semibold leading-tight tracking-tight text-primary-50">
                {intl.formatMessage({ id: 'auth.panel.title' })}
              </h2>
              <p className="text-sm leading-relaxed text-primary-100/90">
                {intl.formatMessage({ id: 'auth.panel.subtitle' })}
              </p>
            </div>
          </div>
        </motion.aside>

        {/* Form panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center"
        >
          <div className="w-full rounded-2xl border border-primary-200/70 bg-card/90 p-4 shadow-lg shadow-secondary/5 backdrop-blur-md sm:rounded-3xl sm:p-8">
            <div className="mb-4 flex items-center gap-3 sm:mb-6 lg:hidden">
              <Link
                to={getLocalizedPath('/', locale)}
                viewTransition={true}
                className="inline-flex items-center gap-2.5 no-underline"
              >
                <img
                  src={logo}
                  alt=""
                  className="size-9 rounded-full border-2 border-secondary/30 object-cover sm:size-10"
                />
                <span className="text-base font-semibold text-foreground">{brandName}</span>
              </Link>
            </div>

            <div className="mb-5 space-y-1.5 sm:mb-7 sm:space-y-2">
              <h1 className="text-xl font-semibold tracking-tight text-foreground sm:text-3xl">
                {title}
              </h1>
              <p className="text-sm leading-relaxed text-tertiary">{subtitle}</p>
            </div>

            {children}

            <div className="mt-4 text-center text-sm text-tertiary sm:mt-6">{footer}</div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
