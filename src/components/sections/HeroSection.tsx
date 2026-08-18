import { FormattedMessage, useIntl } from 'react-intl'
import { Link, useLocation } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import logo from '@/assets/Logo.webp'
import CountUp from '@/components/CountUp'
import Grainient from '@/components/Grainient'
import { Container } from '@/components/layout/Container'
import { buttonVariants } from '@/components/ui/button'
import { DEFAULT_LOCALE, type Locale } from '@/i18n/locales'
import { getLocalizedPath } from '@/i18n/navigation'
import { cn } from '@/lib/utils'

const stats = [
  { to: 12, labelId: 'about.stat1.label' },
  { to: 180, labelId: 'about.stat2.label' },
  { to: 40, labelId: 'about.stat3.label' },
] as const

export const HeroSection = () => {
  const intl = useIntl()
  const { pathname } = useLocation()
  const locale: Locale = pathname.startsWith('/en') ? 'en' : DEFAULT_LOCALE

  return (
    <section id="home" className="relative flex min-h-dvh scroll-mt-24 items-center overflow-hidden">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <Grainient
          color1="#F4F8FE"
          color2="#BAE6FD"
          color3="#E2E2EC"
          contrast={1.08}
          gamma={1.12}
          saturation={0.85}
          grainAmount={0.06}
          timeSpeed={0.18}
          warpStrength={0.7}
          warpAmplitude={70}
        />
      </div>
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-24 bg-linear-to-b from-transparent to-white"
        aria-hidden
      />
      <Container className="relative z-10 flex w-full flex-col items-center py-24 text-center">
        <img
          src={logo}
          alt={intl.formatMessage({ id: 'brand.name' })}
          className="h-20 w-auto sm:h-25"
        />
        <h1 className="mb-4 max-w-3xl text-4xl leading-tight !text-primary sm:text-5xl">
          <FormattedMessage id="hero.title" />
        </h1>
        <p className="max-w-xl text-base text-primary-800 sm:text-lg">
          <FormattedMessage id="hero.subtitle" />
        </p>
        <div className="mt-12 flex flex-wrap justify-center gap-3">
          <Link
            to={getLocalizedPath('/services', locale)}
            className={cn(
              buttonVariants({ size: 'lg' }),
              'h-11 gap-2 rounded-full border-secondary-300 bg-secondary-200 px-6 text-primary-950 hover:bg-secondary-300 hover:text-primary-950',
            )}
            viewTransition={true}
          >
            <FormattedMessage id="hero.cta.primary" />
            <ArrowRight className="size-4 rtl:rotate-180" />
          </Link>
          <a
            href={`${getLocalizedPath('/', locale)}#events`}
            className={cn(
              buttonVariants({ variant: 'outline', size: 'lg' }),
              'h-11 gap-2 rounded-full border-primary-300 bg-white/40 px-6 text-primary-950 backdrop-blur-sm hover:bg-primary-50 hover:text-primary-950',
            )}
          >
            <FormattedMessage id="hero.cta.secondary" />
          </a>
        </div>

        <div className="mt-12 h-px w-16 bg-primary-300" aria-hidden />

        <div className="mt-10 flex w-full max-w-3xl flex-wrap items-start justify-center gap-8 sm:gap-12">
          {stats.map((stat) => (
            <div key={stat.labelId} className="min-w-28">
              <p className="text-3xl font-semibold tracking-tight text-primary-950 sm:text-4xl">
                <CountUp to={stat.to} duration={1.6} />
                <span>+</span>
              </p>
              <p className="mt-1 text-sm text-primary-800">
                <FormattedMessage id={stat.labelId} />
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}
