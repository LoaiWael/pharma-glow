import { useState, type FormEvent } from 'react'
import { useIntl } from 'react-intl'
import { Link } from 'react-router-dom'
import {
  Sparkles,
  ShieldCheck,
  Truck,
  Headphones,
  CreditCard,
  Mail,
  Phone,
  Clock,
  MapPin,
  Heart,
  ArrowUp,
  Check,
} from 'lucide-react'
import {
  SiInstagram,
  SiFacebook,
  SiX,
  SiYoutube,
} from 'react-icons/si'

import { motion } from 'motion/react'
import logo from '@/assets/logo.webp'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DEFAULT_LOCALE, isLocale, LOCALE_DIR, type Locale } from '@/i18n/locales'
import { getLocalizedPath } from '@/i18n/navigation'

export const Footer = () => {
  const intl = useIntl()
  const locale: Locale = isLocale(intl.locale) ? intl.locale : DEFAULT_LOCALE
  const direction = LOCALE_DIR[locale]
  const brandName = intl.formatMessage({ id: 'brand.name' })

  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = (e: FormEvent) => {
    e.preventDefault()
    if (email.trim()) {
      setSubscribed(true)
      setEmail('')
      setTimeout(() => setSubscribed(false), 5000)
    }
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const trustBadges = [
    {
      icon: ShieldCheck,
      title: intl.formatMessage({ id: 'footer.feature.authentic.title' }),
      desc: intl.formatMessage({ id: 'footer.feature.authentic.desc' }),
      color: 'text-secondary',
      bgColor: 'bg-primary/20',
    },
    {
      icon: Truck,
      title: intl.formatMessage({ id: 'footer.feature.shipping.title' }),
      desc: intl.formatMessage({ id: 'footer.feature.shipping.desc' }),
      color: 'text-tertiary-700 dark:text-tertiary-300',
      bgColor: 'bg-tertiary-100 dark:bg-tertiary-900/40',
    },
    {
      icon: Headphones,
      title: intl.formatMessage({ id: 'footer.feature.support.title' }),
      desc: intl.formatMessage({ id: 'footer.feature.support.desc' }),
      color: 'text-secondary-700 dark:text-secondary-300',
      bgColor: 'bg-secondary-100 dark:bg-secondary-900/40',
    },
    {
      icon: CreditCard,
      title: intl.formatMessage({ id: 'footer.feature.secure.title' }),
      desc: intl.formatMessage({ id: 'footer.feature.secure.desc' }),
      color: 'text-primary-800 dark:text-primary-200',
      bgColor: 'bg-primary-200/60 dark:bg-primary-950/60',
    },
  ]

  const shopLinks = [
    { label: intl.formatMessage({ id: 'nav.products' }), href: getLocalizedPath('/products', locale) },
    { label: intl.formatMessage({ id: 'category.skincare.title' }), href: getLocalizedPath('/skincare', locale) },
    { label: intl.formatMessage({ id: 'category.bodycare.title' }), href: getLocalizedPath('/bodycare', locale) },
    { label: intl.formatMessage({ id: 'nav.offers' }), href: getLocalizedPath('/offers', locale) },
  ]

  const quickLinks = [
    { label: intl.formatMessage({ id: 'nav.home' }), href: getLocalizedPath('/', locale) },
    { label: intl.formatMessage({ id: 'nav.reviews' }), href: getLocalizedPath('/reviews', locale) },
    { label: intl.formatMessage({ id: 'nav.howToOrder' }), href: getLocalizedPath('/how-to-order', locale) },
    { label: intl.formatMessage({ id: 'nav.wishlist' }), href: getLocalizedPath('/wishlist', locale) },
  ]

  const customerCareLinks = [
    { label: intl.formatMessage({ id: 'nav.account' }), href: getLocalizedPath('/account', locale) },
    { label: intl.formatMessage({ id: 'nav.orders' }), href: getLocalizedPath('/orders', locale) },
    { label: intl.formatMessage({ id: 'nav.cart' }), href: getLocalizedPath('/cart', locale) },
  ]

  const socialLinks = [
    { name: 'Instagram', icon: SiInstagram, href: 'https://instagram.com' },
    { name: 'Facebook', icon: SiFacebook, href: 'https://facebook.com' },
    { name: 'X', icon: SiX, href: 'https://x.com' },
    { name: 'YouTube', icon: SiYoutube, href: 'https://youtube.com' },
  ]


  return (
    <footer dir={direction} className="relative mt-20 border-t border-primary-200/70 bg-gradient-to-b from-card via-background to-neutral text-foreground overflow-hidden">
      {/* Decorative Glow Elements */}
      <div
        className="pointer-events-none absolute -top-28 start-1/2 -translate-x-1/2 size-96 rounded-full bg-primary/20 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute bottom-10 end-0 size-80 rounded-full bg-secondary/10 blur-3xl"
        aria-hidden="true"
      />

      {/* Trust & Guarantee Badges Section */}
      <div className="border-b border-primary-100 dark:border-primary-950/50 bg-primary-50/60 dark:bg-card/40">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {trustBadges.map((badge, idx) => {
              const Icon = badge.icon
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                  className="flex items-center gap-4 p-3.5 rounded-2xl bg-card/80 backdrop-blur-xs border border-primary-200/50 shadow-xs hover:shadow-md hover:border-primary-300 transition-all duration-300 group"
                >
                  <div className={`flex size-12 shrink-0 items-center justify-center rounded-xl ${badge.bgColor} ${badge.color} transition-transform duration-300 group-hover:scale-110 shadow-xs`}>
                    <Icon className="size-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-foreground tracking-tight">
                      {badge.title}
                    </h4>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-snug">
                      {badge.desc}
                    </p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 pt-14 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          
          {/* Brand & Mission Column (4 cols) */}
          <div className="lg:col-span-4 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <Link
                to={getLocalizedPath('/', locale)}
                viewTransition
                className="inline-flex items-center gap-3 group"
              >
                <img
                  src={logo}
                  alt={brandName}
                  className="h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                />
                <span className="text-xl font-bold tracking-tight text-secondary">
                  {brandName}
                </span>
              </Link>
              <p className="text-sm text-tertiary leading-relaxed max-w-sm">
                {intl.formatMessage({ id: 'footer.tagline' })}
              </p>
            </div>

            {/* Newsletter Subscription Card */}
            <div className="rounded-2xl bg-gradient-to-br from-primary/25 via-primary/15 to-transparent p-5 border border-primary-200/80 shadow-xs">
              <div className="flex items-center gap-2 mb-1.5 text-secondary">
                <Sparkles className="size-4 shrink-0" />
                <h4 className="text-sm font-bold text-secondary-900 dark:text-secondary-100">
                  {intl.formatMessage({ id: 'footer.newsletter.title' })}
                </h4>
              </div>
              <p className="text-xs text-tertiary-700 dark:text-tertiary-300 mb-3.5 leading-relaxed">
                {intl.formatMessage({ id: 'footer.newsletter.subtitle' })}
              </p>

              {subscribed ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-2 rounded-xl bg-primary/40 p-2.5 text-xs font-semibold text-secondary-950 dark:text-secondary-100 border border-primary/50"
                >
                  <Check className="size-4 text-emerald-600 dark:text-emerald-400" />
                  <span>{intl.formatMessage({ id: 'footer.newsletter.success' })}</span>
                </motion.div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-2">
                  <Input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={intl.formatMessage({ id: 'footer.newsletter.placeholder' })}
                    className="h-9 bg-card text-xs border-primary-200 focus-visible:ring-secondary/40 placeholder:text-muted-foreground"
                  />
                  <Button
                    type="submit"
                    variant="secondary"
                    size="sm"
                    className="shrink-0 h-9 px-3.5 text-xs font-semibold shadow-xs"
                  >
                    {intl.formatMessage({ id: 'footer.newsletter.subscribe' })}
                  </Button>
                </form>
              )}
            </div>
          </div>

          {/* Navigation Links Columns (5 cols total) */}
          <div className="lg:col-span-5 grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-8">
            
            {/* Shop Column */}
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-secondary tracking-wider uppercase">
                {intl.formatMessage({ id: 'footer.section.shop' })}
              </h4>
              <ul className="space-y-2.5">
                {shopLinks.map((item, idx) => (
                  <li key={idx}>
                    <Link
                      to={item.href}
                      viewTransition
                      className="text-sm text-tertiary hover:text-secondary transition-colors inline-block hover:translate-x-1 rtl:hover:-translate-x-1 duration-200"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Quick Links Column */}
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-secondary tracking-wider uppercase">
                {intl.formatMessage({ id: 'footer.section.quickLinks' })}
              </h4>
              <ul className="space-y-2.5">
                {quickLinks.map((item, idx) => (
                  <li key={idx}>
                    <Link
                      to={item.href}
                      viewTransition
                      className="text-sm text-tertiary hover:text-secondary transition-colors inline-block hover:translate-x-1 rtl:hover:-translate-x-1 duration-200"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Customer Care Column */}
            <div className="space-y-4 col-span-2 sm:col-span-1">
              <h4 className="text-sm font-bold text-secondary tracking-wider uppercase">
                {intl.formatMessage({ id: 'footer.section.customerCare' })}
              </h4>
              <ul className="space-y-2.5">
                {customerCareLinks.map((item, idx) => (
                  <li key={idx}>
                    <Link
                      to={item.href}
                      viewTransition
                      className="text-sm text-tertiary hover:text-secondary transition-colors inline-block hover:translate-x-1 rtl:hover:-translate-x-1 duration-200"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

          </div>

          {/* Contact & Support Column (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-sm font-bold text-secondary tracking-wider uppercase">
              {intl.formatMessage({ id: 'footer.section.contact' })}
            </h4>
            <div className="space-y-3 text-sm text-tertiary">
              <div className="flex items-start gap-3">
                <MapPin className="size-4 shrink-0 mt-0.5 text-secondary" />
                <span>{intl.formatMessage({ id: 'footer.contact.location' })}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="size-4 shrink-0 text-secondary" />
                <span dir="ltr" className="font-medium text-foreground/90">
                  {intl.formatMessage({ id: 'footer.contact.phone' })}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="size-4 shrink-0 text-secondary" />
                <span>{intl.formatMessage({ id: 'footer.contact.email' })}</span>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="size-4 shrink-0 mt-0.5 text-secondary" />
                <span>{intl.formatMessage({ id: 'footer.contact.hours' })}</span>
              </div>
            </div>

            {/* Social Media Links */}
            <div className="pt-2">
              <div className="flex items-center gap-2">
                {socialLinks.map((social) => {
                  const Icon = social.icon
                  return (
                    <motion.a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.name}
                      whileHover={{ scale: 1.15, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex size-9 items-center justify-center rounded-xl bg-card border border-primary-200/80 text-secondary hover:bg-secondary hover:text-secondary-foreground shadow-xs transition-colors duration-200"
                    >
                      <Icon className="size-4" />
                    </motion.a>
                  )
                })}
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Bar: Copyright, Back to Top, Made with Love */}
      <div className="border-t border-primary-200/60 bg-card/60 dark:bg-card/30">
        <div className="container mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <span>&copy; {new Date().getFullYear()} {brandName}.</span>
            <span>{intl.formatMessage({ id: 'footer.rights' })}</span>
          </div>

          <div className="flex items-center gap-1.5 text-tertiary">
            <span>{intl.formatMessage({ id: 'footer.designedWith' })}</span>
            <Heart className="size-3.5 fill-rose-500 text-rose-500 inline-block animate-pulse" />
          </div>

          <motion.button
            type="button"
            onClick={scrollToTop}
            whileHover={{ scale: 1.06, y: -2 }}
            whileTap={{ scale: 0.94 }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-card border border-primary-200/80 text-xs font-medium text-secondary hover:bg-primary/30 transition-colors shadow-xs"
          >
            <ArrowUp className="size-3.5" />
            <span>{direction === 'rtl' ? 'للأعلى' : 'Top'}</span>
          </motion.button>
        </div>
      </div>
    </footer>
  )
}
