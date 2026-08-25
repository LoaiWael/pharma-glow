import { AnimatePresence, motion } from 'motion/react'
import { FormattedMessage, useIntl } from 'react-intl'
import { Link } from 'react-router-dom'
import { DEFAULT_LOCALE, isLocale, type Locale } from '@/i18n/locales'
import { getLocalizedPath } from '@/i18n/navigation'
import { useHomeCategories } from '../api/use-home-categories'

const MotionLink = motion.create(Link)

const CategorySkeleton = () => (
  <motion.div
    key="home-categories-skeleton"
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -8 }}
    transition={{ duration: 0.3, ease: 'easeOut' }}
    className="py-4 md:py-6"
  >
    <div className="grid grid-cols-4 md:grid-cols-8 gap-2 sm:gap-2.5">
      {Array.from({ length: 8 }).map((_, index) => (
        <div className="flex flex-col items-center gap-1.5" key={index}>
          <div className="w-full aspect-square rounded-xl bg-primary-100 animate-pulse" />
          <div className="h-3 w-3/4 rounded-full bg-primary-100 animate-pulse" />
        </div>
      ))}
    </div>
  </motion.div>
)

export const HomeCategories = () => {
  const intl = useIntl()
  const locale: Locale = isLocale(intl.locale) ? intl.locale : DEFAULT_LOCALE
  const { data: categories = [], isPending } = useHomeCategories()

  return (
    <AnimatePresence mode="wait">
      {isPending ? (
        <CategorySkeleton />
      ) : categories.length === 0 ? null : (
        <motion.section
          key="home-categories"
          aria-label={intl.formatMessage({ id: 'home.categories.title' })}
          className="py-4 md:py-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        >
          <h2 className="sr-only">
            <FormattedMessage id="home.categories.title" />
          </h2>

          <div className="w-full">
            <ul className="grid grid-cols-4 md:grid-cols-8 gap-2 sm:gap-2.5">
              {categories.map((category, index) => {
                const label = category.titleKey
                  ? intl.formatMessage({ id: category.titleKey })
                  : (category.title ?? '')

                return (
                  <motion.li
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full"
                    initial={{ opacity: 0, y: 10 }}
                    key={category.id}
                    transition={{
                      delay: 0.03 * index,
                      duration: 0.3,
                      ease: 'easeOut',
                    }}
                  >
                    <MotionLink
                      aria-label={label}
                      className="group flex flex-col items-center w-full"
                      draggable={false}
                      to={getLocalizedPath(category.href, locale)}
                      viewTransition={true}
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.96 }}
                    >
                      <span
                        className={
                          category.isLogoFallback
                            ? 'flex w-full aspect-square overflow-hidden rounded-xl bg-primary-50 shadow-xs ring-1 ring-primary-200 transition-all group-hover:ring-secondary/50 group-hover:shadow-sm items-center justify-center p-2.5 sm:p-3'
                            : 'flex w-full aspect-square overflow-hidden rounded-xl bg-card shadow-xs ring-1 ring-primary-200 transition-all group-hover:ring-secondary/50 group-hover:shadow-sm'
                        }
                      >
                        <img
                          alt=""
                          className={
                            category.isLogoFallback
                              ? 'size-[72%] max-w-[4.5rem] rounded-full object-contain transition-transform duration-300 group-hover:scale-105'
                              : 'size-full object-cover transition-transform duration-300 group-hover:scale-105'
                          }
                          draggable={false}
                          src={category.imageSrc}
                        />
                      </span>
                      <span className="mt-1.5 line-clamp-1 text-center text-xs sm:text-sm font-medium text-secondary group-hover:text-secondary-700 transition-colors">
                        {category.titleKey ? (
                          <FormattedMessage id={category.titleKey} />
                        ) : (
                          category.title
                        )}
                      </span>
                    </MotionLink>
                  </motion.li>
                )
              })}
            </ul>
          </div>
        </motion.section>
      )}
    </AnimatePresence>
  )
}
