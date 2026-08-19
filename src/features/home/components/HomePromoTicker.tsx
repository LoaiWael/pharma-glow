import { motion } from 'motion/react'
import { useIntl } from 'react-intl'
import TextLoop from '@/components/TextLoop'
import { DEFAULT_LOCALE, isLocale, LOCALE_DIR, type Locale } from '@/i18n/locales'

const PROMO_KEYS = [
  'home.promo.shipping',
  'home.promo.authentic',
  'home.promo.trusted',
  'home.promo.arrivals',
  'home.promo.offers',
] as const

const GLOW_SEPARATOR = '✦'

export const HomePromoTicker = () => {
  const intl = useIntl()
  const locale: Locale = isLocale(intl.locale) ? intl.locale : DEFAULT_LOCALE
  const direction = LOCALE_DIR[locale]
  const isRtl = direction === 'rtl'

  const text = PROMO_KEYS.map((id) => intl.formatMessage({ id })).join(` ${GLOW_SEPARATOR} `)

  return (
    <motion.section
      animate={{ opacity: 1, y: 0 }}
      aria-label={intl.formatMessage({ id: 'home.promo.label' })}
      className="full-bleed mt-4 bg-secondary"
      dir={direction}
      initial={{ opacity: 0, y: 12 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
    >
      <TextLoop
        color="var(--primary-50)"
        dir={direction}
        fontSize={isRtl ? 15 : 14}
        fontWeight={600}
        letterSpacing={0}
        pauseOnHover
        ribbon
        ribbonColor="var(--color-secondary)"
        ribbonWidth={10}
        separator={GLOW_SEPARATOR}
        shape="line"
        speed={64}
        text={text}
        uppercase
      />
    </motion.section>
  )
}
