import { FormattedMessage } from 'react-intl'
import { Link, useLocation } from 'react-router-dom'
import { Container } from '@/components/layout/Container'
import { SectionHeading } from '@/components/layout/SectionHeading'
import { buttonVariants } from '@/components/ui/button'
import { services } from '@/data/services'
import { DEFAULT_LOCALE, type Locale } from '@/i18n/locales'
import { getLocalizedPath } from '@/i18n/navigation'
import { cn } from '@/lib/utils'

type ServicesSectionProps = {
  limit?: number
  showViewAll?: boolean
}

export const ServicesSection = ({ limit, showViewAll = true }: ServicesSectionProps) => {
  const { pathname } = useLocation()
  const locale: Locale = pathname.startsWith('/en') ? 'en' : DEFAULT_LOCALE
  const items = limit ? services.slice(0, limit) : services

  return (
    <section id="services" className="scroll-mt-24 bg-white py-16">
      <Container>
        <SectionHeading
          kicker="services.kicker"
          title="services.title"
          subtitle="services.subtitle"
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((service) => (
            <Link
              key={service.slug}
              to={getLocalizedPath(`/services/${service.slug}`, locale)}
              className="rounded-2xl border border-primary-100 bg-neutral-50 p-6 text-start transition hover:border-secondary-300 hover:shadow-sm"
              viewTransition={true}
            >
              <h3 className="mb-2 text-lg font-medium text-primary">
                <FormattedMessage id={service.titleKey} />
              </h3>
              <p className="mb-4 text-sm text-tertiary-600">
                <FormattedMessage id={service.summaryKey} />
              </p>
              <span className="text-sm font-medium text-secondary-600">
                <FormattedMessage id="services.viewDetails" />
              </span>
            </Link>
          ))}
        </div>
        {showViewAll ? (
          <div className="mt-8 flex justify-center">
            <Link
              to={getLocalizedPath('/services', locale)}
              className={cn(buttonVariants({ variant: 'default', size: 'lg' }), 'px-4')}
              viewTransition={true}
            >
              <FormattedMessage id="services.viewAll" />
            </Link>
          </div>
        ) : null}
      </Container>
    </section>
  )
}
