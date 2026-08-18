import { useRef, type MouseEvent, type PointerEvent } from 'react'
import { motion } from 'motion/react'
import { FormattedMessage, useIntl } from 'react-intl'
import { Link } from 'react-router-dom'
import { DEFAULT_LOCALE, isLocale, type Locale } from '@/i18n/locales'
import { getLocalizedPath } from '@/i18n/navigation'
import { useHomeCategories } from '../api/use-home-categories'

const MotionLink = motion.create(Link)

export const HomeCategories = () => {
  const intl = useIntl()
  const locale: Locale = isLocale(intl.locale) ? intl.locale : DEFAULT_LOCALE
  const { data: categories = [], isPending } = useHomeCategories()
  const scrollerRef = useRef<HTMLDivElement>(null)
  const dragState = useRef({
    active: false,
    moved: false,
    pointerId: -1,
    startX: 0,
    scrollLeft: 0,
  })

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    const el = scrollerRef.current
    if (!el || el.scrollWidth <= el.clientWidth) {
      return
    }

    dragState.current = {
      active: true,
      moved: false,
      pointerId: event.pointerId,
      startX: event.clientX,
      scrollLeft: el.scrollLeft,
    }
    el.setPointerCapture(event.pointerId)
  }

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const el = scrollerRef.current
    const state = dragState.current
    if (!el || !state.active || event.pointerId !== state.pointerId) {
      return
    }

    const delta = event.clientX - state.startX
    if (Math.abs(delta) > 4) {
      state.moved = true
    }
    el.scrollLeft = state.scrollLeft - delta
  }

  const endDrag = (event: PointerEvent<HTMLDivElement>) => {
    const el = scrollerRef.current
    const state = dragState.current
    if (!state.active || event.pointerId !== state.pointerId) {
      return
    }

    state.active = false
    if (el?.hasPointerCapture(event.pointerId)) {
      el.releasePointerCapture(event.pointerId)
    }
  }

  const onClickCapture = (event: MouseEvent<HTMLDivElement>) => {
    if (!dragState.current.moved) {
      return
    }

    event.preventDefault()
    event.stopPropagation()
    dragState.current.moved = false
  }

  if (isPending) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
        <div className="flex justify-center gap-6 overflow-hidden sm:gap-8">
          {Array.from({ length: 8 }).map((_, index) => (
            <div className="flex w-20 shrink-0 flex-col items-center gap-2" key={index}>
              <div className="size-16 rounded-full bg-primary-100 sm:size-20" />
              <div className="h-3 w-14 rounded-full bg-primary-100" />
            </div>
          ))}
        </div>
      </section>
    )
  }

  if (categories.length === 0) {
    return null
  }

  return (
    <section
      aria-label={intl.formatMessage({ id: 'home.categories.title' })}
      className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8"
    >
      <h2 className="sr-only">
        <FormattedMessage id="home.categories.title" />
      </h2>

      <div
        className="cursor-grab overflow-x-auto overscroll-x-contain pb-1 select-none active:cursor-grabbing scrollbar-none"
        onClickCapture={onClickCapture}
        onPointerCancel={endDrag}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        ref={scrollerRef}
      >
        <ul className="mx-auto flex w-max min-w-full justify-center gap-6 sm:gap-8">
          {categories.map((category, index) => (
            <motion.li
              animate={{ opacity: 1, y: 0 }}
              className="w-19 shrink-0 sm:w-20"
              initial={{ opacity: 0, y: 10 }}
              key={category.id}
              transition={{ delay: 0.04 * index, duration: 0.3, ease: 'easeOut' }}
            >
              <MotionLink
                aria-label={intl.formatMessage({ id: category.titleKey })}
                className="flex flex-col items-center"
                draggable={false}
                to={getLocalizedPath(category.href, locale)}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.96 }}
              >
                <span className="flex size-16 overflow-hidden rounded-full bg-card shadow-sm ring-1 ring-primary-200 sm:size-20">
                  <img
                    alt=""
                    className="size-full object-cover"
                    draggable={false}
                    src={category.imageSrc}
                  />
                </span>
                <span className="mt-2 line-clamp-2 text-center text-xs font-medium text-secondary">
                  <FormattedMessage id={category.titleKey} />
                </span>
              </MotionLink>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  )
}
