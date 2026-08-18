import { useEffect, useMemo, useState } from 'react'
import { Globe } from 'lucide-react'
import { FaWhatsapp } from 'react-icons/fa6'
import { FormattedMessage, useIntl } from 'react-intl'
import { Link, useLocation } from 'react-router-dom'
import logo from '@/assets/logo.svg'
import CardNav from '@/components/CardNav'
import { Container } from '@/components/layout/Container'
import { buttonVariants } from '@/components/ui/button'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu'
import { services } from '@/data/services'
import { DEFAULT_LOCALE, type Locale } from '@/i18n/locales'
import { getLocalizedPath } from '@/i18n/navigation'
import { cn } from '@/lib/utils'

const sectionIds = ['home', 'about', 'services', 'events', 'feedback'] as const
type SectionId = (typeof sectionIds)[number]

const navItems = [
  { section: 'home' as const, to: '', hash: 'home', id: 'nav.home' as const },
  { section: 'about' as const, to: '', hash: 'about', id: 'nav.about' as const },
  { section: 'services' as const, to: 'services', id: 'nav.services' as const },
  { section: 'gallery' as const, to: 'gallery', id: 'nav.gallery' as const },
  { section: 'events' as const, to: '', hash: 'events', id: 'nav.events' as const },
  { section: 'feedback' as const, to: '', hash: 'feedback', id: 'nav.feedback' as const },
]

/** International digits only, no + or spaces. Example: 9627XXXXXXXX */
const WHATSAPP_NUMBER = ''

export const Header = () => {
  const intl = useIntl()
  const { pathname, hash } = useLocation()
  const currentLocale: Locale = pathname.startsWith('/en') ? 'en' : DEFAULT_LOCALE
  const nextLocale: Locale = currentLocale === 'en' ? 'ar' : 'en'
  const switchedPath = `${getLocalizedPath(pathname, nextLocale)}${hash}`
  const isServicesRoute = pathname.includes('/services')
  const isGalleryRoute = pathname.includes('/gallery')
  const [activeSection, setActiveSection] = useState<SectionId>(isServicesRoute ? 'services' : 'home')
  const cardNavItems = useMemo(
    () => [
      {
        label: intl.formatMessage({ id: 'nav.services' }),
        bgColor: '#1190CF',
        textColor: '#ffffff',
        links: [
          ...services.slice(0, 4).map((service) => ({
            label: intl.formatMessage({ id: service.titleKey }),
            href: getLocalizedPath(`/services/${service.slug}`, currentLocale),
            ariaLabel: intl.formatMessage({ id: service.titleKey }),
          })),
          {
            label: intl.formatMessage({ id: 'services.viewAll' }),
            href: getLocalizedPath('/services', currentLocale),
            ariaLabel: intl.formatMessage({ id: 'services.viewAll' }),
          },
        ],
      },
    ],
    [currentLocale, intl],
  )
  const cardNavPlainLinks = useMemo(
    () => [
      {
        label: intl.formatMessage({ id: 'nav.home' }),
        href: `${getLocalizedPath('/', currentLocale)}#home`,
        ariaLabel: intl.formatMessage({ id: 'nav.home' }),
      },
      {
        label: intl.formatMessage({ id: 'nav.about' }),
        href: `${getLocalizedPath('/', currentLocale)}#about`,
        ariaLabel: intl.formatMessage({ id: 'nav.about' }),
      },
      {
        label: intl.formatMessage({ id: 'nav.events' }),
        href: `${getLocalizedPath('/', currentLocale)}#events`,
        ariaLabel: intl.formatMessage({ id: 'nav.events' }),
      },
      {
        label: intl.formatMessage({ id: 'nav.gallery' }),
        href: getLocalizedPath('/gallery', currentLocale),
        ariaLabel: intl.formatMessage({ id: 'nav.gallery' }),
      },
      {
        label: intl.formatMessage({ id: 'nav.feedback' }),
        href: `${getLocalizedPath('/', currentLocale)}#feedback`,
        ariaLabel: intl.formatMessage({ id: 'nav.feedback' }),
      },
    ],
    [currentLocale, intl],
  )

  useEffect(() => {
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null)

    if (elements.length === 0) {
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        const next = visible[0]?.target.id
        if (next && sectionIds.includes(next as SectionId)) {
          setActiveSection(next as SectionId)
        }
      },
      { rootMargin: '-30% 0px -55% 0px', threshold: [0, 0.25, 0.6] },
    )

    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [pathname])

  return (
    <>
      <div className="fixed top-2 right-2 left-2 z-40 md:hidden">
        <CardNav
          logo={logo}
          logoAlt={intl.formatMessage({ id: 'brand.name' })}
          logoHref={getLocalizedPath('/', currentLocale)}
          logoClassName={currentLocale === 'ar' ? '-scale-x-100' : undefined}
          items={cardNavItems}
          plainLinks={cardNavPlainLinks}
          baseColor="#ffffff"
          menuColor="#0C0A28"
          buttonBgColor="#1190CF"
          buttonTextColor="#ffffff"
          ctaLabel={intl.formatMessage({ id: 'nav.contact' })}
          ctaHref={`https://wa.me/${WHATSAPP_NUMBER}`}
          ctaExternal
          trailing={
            <Link
              to={switchedPath}
              className={cn(
                buttonVariants({ variant: 'outline', size: 'sm' }),
                'items-center justify-center rounded-full border-secondary px-3 leading-none text-secondary uppercase hover:bg-secondary/10 hover:text-secondary',
              )}
              aria-label={nextLocale === 'en' ? 'Switch to English' : 'التبديل إلى العربية'}
              viewTransition={true}
            >
              <Globe className="size-3.5 text-secondary" />
              <FormattedMessage id="nav.language" />
            </Link>
          }
        />
      </div>
      <header className="fixed top-2 right-2 left-2 z-40 hidden rounded-full border border-primary-100/80 bg-white/90 shadow-md [view-transition-name:site-header] backdrop-blur md:block">
      <Container className="grid h-14 max-w-none grid-cols-[1fr_auto_1fr] items-center gap-4 p-1 px-1 sm:px-1 lg:px-1">
        <Link
          to={getLocalizedPath('/', currentLocale)}
          aria-label={intl.formatMessage({ id: 'brand.name' })}
          className="group/brand flex h-full w-fit shrink-0 items-center rounded-full border-2 border-secondary-200/50 bg-secondary-100/50 px-1.5"
          viewTransition={true}
        >
          <img
            src={logo}
            alt=""
            className={cn(
              'relative z-10 h-8 w-auto shrink-0',
              currentLocale === 'ar' && '-scale-x-100',
            )}
          />
          <span className="grid max-w-0 overflow-hidden transition-[max-width] duration-500 ease-out group-focus-visible/brand:max-w-56 group-hover/brand:max-w-56">
            <span className="-translate-x-3 ps-2 text-sm font-semibold whitespace-nowrap text-primary opacity-0 blur-md transition-[opacity,filter,translate] duration-500 ease-out group-focus-visible/brand:translate-x-0 group-focus-visible/brand:opacity-100 group-focus-visible/brand:blur-none group-hover/brand:translate-x-0 group-hover/brand:opacity-100 group-hover/brand:blur-none rtl:translate-x-3 rtl:group-focus-visible/brand:translate-x-0 rtl:group-hover/brand:translate-x-0 sm:text-base">
              <FormattedMessage id="brand.name" />
            </span>
          </span>
        </Link>
        <nav className="hidden items-center justify-center gap-5 text-sm text-tertiary-600 md:flex">
          {navItems.map((item) => {
            const href = item.hash
              ? `${getLocalizedPath('/', currentLocale)}#${item.hash}`
              : getLocalizedPath(item.to, currentLocale)
            const isActive = isGalleryRoute
              ? item.section === 'gallery'
              : isServicesRoute
                ? item.section === 'services'
                : activeSection === item.section
            const linkClass = isActive ? 'font-medium text-secondary-600' : 'hover:text-primary'

            if (item.section === 'services') {
              return (
                <NavigationMenu key={item.id} className="flex-none">
                  <NavigationMenuList>
                    <NavigationMenuItem>
                      <NavigationMenuTrigger
                        className={cn(
                          'h-auto bg-transparent px-0 py-0 text-sm font-normal hover:bg-transparent focus:bg-transparent data-open:bg-transparent data-open:hover:bg-transparent data-popup-open:bg-transparent data-popup-open:hover:bg-transparent',
                          linkClass,
                        )}
                      >
                        <FormattedMessage id={item.id} />
                      </NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <ul className="grid w-80 gap-1">
                          <li>
                            <NavigationMenuLink
                              render={
                                <Link to={href} viewTransition={true} />
                              }
                              className="flex-col items-start gap-0.5"
                            >
                              <span className="font-medium text-primary">
                                <FormattedMessage id="services.viewAll" />
                              </span>
                            </NavigationMenuLink>
                          </li>
                          {services.map((service) => (
                            <li key={service.slug}>
                              <NavigationMenuLink
                                render={
                                  <Link
                                    to={getLocalizedPath(`/services/${service.slug}`, currentLocale)}
                                    viewTransition={true}
                                  />
                                }
                                className="flex-col items-start gap-0.5"
                              >
                                <span className="font-medium text-primary">
                                  <FormattedMessage id={service.titleKey} />
                                </span>
                                <span className="text-xs text-tertiary-600">
                                  <FormattedMessage id={service.summaryKey} />
                                </span>
                              </NavigationMenuLink>
                            </li>
                          ))}
                        </ul>
                      </NavigationMenuContent>
                    </NavigationMenuItem>
                  </NavigationMenuList>
                </NavigationMenu>
              )
            }

            return (
              <Link
                key={item.id}
                to={href}
                className={linkClass}
                viewTransition={true}
                onClick={(event) => {
                  if (!item.hash) return
                  const target = document.getElementById(item.hash)
                  if (!target) return
                  event.preventDefault()
                  target.scrollIntoView({ behavior: 'smooth', block: 'start' })
                  if (sectionIds.includes(item.section as SectionId)) {
                    setActiveSection(item.section as SectionId)
                  }
                }}
              >
                <FormattedMessage id={item.id} />
              </Link>
            )
          })}
        </nav>
        <div className="flex h-full shrink-0 items-center justify-end gap-2">
          <Link
            to={switchedPath}
            className={cn(
              buttonVariants({ variant: 'outline', size: 'sm' }),
              'items-center justify-center rounded-full border-secondary p-4 leading-none text-secondary uppercase hover:bg-secondary/10 hover:text-secondary',
            )}
            aria-label={nextLocale === 'en' ? 'Switch to English' : 'التبديل إلى العربية'}
            viewTransition={true}
          >
            <Globe className="size-3.5 text-secondary" />
            <FormattedMessage id="nav.language" />
          </Link>
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}`}
            target="_blank"
            rel="noreferrer"
            className={cn(
              buttonVariants({ variant: 'secondary', size: 'sm' }),
              'h-full items-center justify-center gap-2 rounded-full px-4 leading-none text-white hover:bg-secondary-600',
            )}
          >
            <FormattedMessage id="nav.contact" />
            <FaWhatsapp className="size-4.5" />
          </a>
        </div>
      </Container>
    </header>
    </>
  )
}
