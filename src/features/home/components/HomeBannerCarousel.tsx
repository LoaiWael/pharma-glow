import { useEffect, useRef, useState } from 'react'
import Autoplay from 'embla-carousel-autoplay'
import { motion } from 'motion/react'
import { FormattedMessage, useIntl } from 'react-intl'
import { Link } from 'react-router-dom'
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel'
import { buttonVariants } from '@/components/ui/button'
import { DEFAULT_LOCALE, isLocale, LOCALE_DIR, type Locale } from '@/i18n/locales'
import { getLocalizedPath } from '@/i18n/navigation'
import { cn } from '@/lib/utils'
import { useHomeBanners } from '../api/use-home-banners'

const BANNER_SHELL = 'mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'
const BANNER_HEIGHT = 'h-[280px] sm:h-[360px] md:h-[440px] lg:h-[500px]'

export const HomeBannerCarousel = () => {
  const intl = useIntl()
  const locale: Locale = isLocale(intl.locale) ? intl.locale : DEFAULT_LOCALE
  const direction = LOCALE_DIR[locale]
  const { data: banners = [], isPending } = useHomeBanners()
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
  const autoplayPlugin = useRef(
    Autoplay({ delay: 5500, stopOnInteraction: false, stopOnMouseEnter: true }),
  )

  useEffect(() => {
    if (!api) {
      return
    }

    const onSelect = () => {
      setCurrent(api.selectedScrollSnap())
    }

    onSelect()
    api.on('select', onSelect)

    return () => {
      api.off('select', onSelect)
    }
  }, [api])

  if (isPending) {
    return (
      <section className="w-full pt-4">
        <div className={BANNER_SHELL}>
          <div className={cn(BANNER_HEIGHT, 'rounded-2xl bg-primary-100')} />
        </div>
      </section>
    )
  }

  if (banners.length === 0) {
    return null
  }

  return (
    <section aria-label={intl.formatMessage({ id: 'brand.name' })} className="w-full pt-4">
      <div className={BANNER_SHELL}>
        <Carousel
          key={direction}
          className="overflow-hidden rounded-2xl"
          dir={direction}
          opts={{ align: 'start', loop: true, direction }}
          plugins={[autoplayPlugin.current]}
          setApi={setApi}
        >
          <CarouselContent className="-ml-0">
            {banners.map((banner) => (
              <CarouselItem key={banner.id} className="pl-0">
                <div className={cn('relative w-full overflow-hidden', BANNER_HEIGHT)}>
                  <img
                    alt={intl.formatMessage({ id: banner.imageAltKey })}
                    className="size-full object-cover object-center"
                    src={banner.imageSrc}
                  />
                  <div className="absolute inset-0 bg-linear-to-r from-secondary-950/70 via-secondary-950/25 to-transparent rtl:bg-linear-to-l" />
                  <div className="absolute inset-0 flex items-end px-4 pt-4 pb-14 sm:items-center sm:p-8 lg:p-10">
                    <motion.div
                      animate={{ opacity: 1, y: 0 }}
                      className="max-w-xl"
                      initial={{ opacity: 0, y: 16 }}
                      transition={{ duration: 0.45, ease: 'easeOut' }}
                    >
                      <p className="text-xl font-medium tracking-tight text-primary-foreground sm:text-3xl lg:text-4xl">
                        <FormattedMessage id={banner.titleKey} />
                      </p>
                      <p className="mt-1 max-w-md text-xs text-primary-100 sm:mt-2 sm:text-sm lg:text-base">
                        <FormattedMessage id={banner.subtitleKey} />
                      </p>
                      <motion.div
                        className="mt-4 inline-flex sm:mt-5"
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        <Link
                          className={cn(buttonVariants({ variant: 'secondary', size: 'lg' }), 'h-10 px-5')}
                          to={getLocalizedPath(banner.href, locale)}
                        >
                          <FormattedMessage id={banner.ctaKey} />
                        </Link>
                      </motion.div>
                    </motion.div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          <motion.div
            animate={{ opacity: 1, x: '-50%', y: 0 }}
            className="absolute bottom-3 left-1/2 z-10 flex w-fit items-center gap-2 rounded-full border border-primary-200/50 bg-neutral/40 px-3 py-1.5 shadow-sm backdrop-blur-md"
            initial={{ opacity: 0, x: '-50%', y: 8 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
          >
            {banners.map((banner, index) => (
              <motion.button
                animate={{ width: index === current ? 32 : 8 }}
                aria-current={index === current}
                aria-label={intl.formatMessage({ id: 'home.banner.goTo' }, { n: index + 1 })}
                className={cn('h-2 rounded-full', index === current ? 'bg-secondary' : 'bg-primary')}
                key={banner.id}
                onClick={() => api?.scrollTo(index)}
                type="button"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              />
            ))}
          </motion.div>
        </Carousel>
      </div>
    </section>
  )
}
