import { useLayoutEffect, useRef, useState, type KeyboardEvent, type ReactNode } from 'react'
import { gsap } from 'gsap'
import { motion } from 'motion/react'
import { GoArrowUpRight } from 'react-icons/go'
import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'

export type CardNavLink = {
  label: string
  href: string
  ariaLabel: string
  icon?: ReactNode
}

export type CardNavItem = {
  label: string
  className?: string
  links: CardNavLink[]
}

export interface CardNavProps {
  logo: string
  logoAlt?: string
  logoHref?: string
  logoClassName?: string
  items: CardNavItem[]
  className?: string
  ease?: string
  leading?: ReactNode
  actions?: ReactNode
  openMenuLabel?: string
  closeMenuLabel?: string
  onMenuOpenChange?: (open: boolean) => void
  mobileActions?: ReactNode | ((closeMenu: () => void) => ReactNode)
}

const defaultCardClasses = [
  'bg-primary text-primary-950',
  'bg-secondary text-secondary-foreground',
  'bg-tertiary text-tertiary-foreground',
] as const

const CardNav = ({
  logo,
  logoAlt = 'Logo',
  logoHref = '/',
  logoClassName,
  items,
  className = '',
  ease = 'power3.out',
  leading,
  actions,
  openMenuLabel = 'Open menu',
  closeMenuLabel = 'Close menu',
  onMenuOpenChange,
  mobileActions,
}: CardNavProps) => {
  const [isHamburgerOpen, setIsHamburgerOpen] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const navRef = useRef<HTMLDivElement | null>(null)
  const cardsRef = useRef<HTMLDivElement[]>([])
  const tlRef = useRef<gsap.core.Timeline | null>(null)

  const calculateHeight = () => {
    const navEl = navRef.current
    if (!navEl) return 260

    const isMobile = window.matchMedia('(max-width: 768px)').matches
    if (isMobile) {
      const contentEl = navEl.querySelector('.card-nav-content') as HTMLElement | null
      if (contentEl) {
        const wasVisible = contentEl.style.visibility
        const wasPointerEvents = contentEl.style.pointerEvents
        const wasPosition = contentEl.style.position
        const wasHeight = contentEl.style.height

        contentEl.style.visibility = 'visible'
        contentEl.style.pointerEvents = 'auto'
        contentEl.style.position = 'static'
        contentEl.style.height = 'auto'

        contentEl.offsetHeight

        const topBar = 60
        const padding = 16
        const contentHeight = contentEl.scrollHeight

        contentEl.style.visibility = wasVisible
        contentEl.style.pointerEvents = wasPointerEvents
        contentEl.style.position = wasPosition
        contentEl.style.height = wasHeight

        return topBar + contentHeight + padding
      }
    }
    return 260
  }

  useLayoutEffect(() => {
    const navEl = navRef.current
    if (!navEl) return

    gsap.set(navEl, { height: 60, overflow: 'hidden' })
    gsap.set(cardsRef.current, { y: 50, opacity: 0 })

    const tl = gsap.timeline({ paused: true })

    tl.to(navEl, {
      height: calculateHeight,
      duration: 0.4,
      ease,
    })

    tl.to(cardsRef.current, { y: 0, opacity: 1, duration: 0.4, ease, stagger: 0.08 }, '-=0.1')

    tlRef.current = tl

    return () => {
      tl.kill()
      tlRef.current = null
    }
  }, [ease, items])

  useLayoutEffect(() => {
    const handleResize = () => {
      if (!tlRef.current) return

      if (isExpanded) {
        const newHeight = calculateHeight()
        gsap.set(navRef.current, { height: newHeight })

        tlRef.current.kill()
        const navEl = navRef.current
        if (!navEl) return

        gsap.set(navEl, { height: newHeight, overflow: 'hidden' })
        gsap.set(cardsRef.current, { y: 0, opacity: 1 })

        const newTl = gsap.timeline({ paused: true })
        newTl.to(navEl, { height: calculateHeight, duration: 0.4, ease })
        newTl.to(
          cardsRef.current,
          { y: 0, opacity: 1, duration: 0.4, ease, stagger: 0.08 },
          '-=0.1',
        )
        newTl.progress(1)
        tlRef.current = newTl
      } else {
        tlRef.current.kill()
        const navEl = navRef.current
        if (!navEl) return

        gsap.set(navEl, { height: 60, overflow: 'hidden' })
        gsap.set(cardsRef.current, { y: 50, opacity: 0 })

        const newTl = gsap.timeline({ paused: true })
        newTl.to(navEl, { height: calculateHeight, duration: 0.4, ease })
        newTl.to(
          cardsRef.current,
          { y: 0, opacity: 1, duration: 0.4, ease, stagger: 0.08 },
          '-=0.1',
        )
        tlRef.current = newTl
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [ease, isExpanded])

  const closeMenu = () => {
    const tl = tlRef.current
    if (!tl || !isExpanded) return
    setIsHamburgerOpen(false)
    onMenuOpenChange?.(false)
    tl.eventCallback('onReverseComplete', () => setIsExpanded(false))
    tl.reverse()
  }

  const toggleMenu = () => {
    const tl = tlRef.current
    if (!tl) return
    if (!isExpanded) {
      setIsHamburgerOpen(true)
      setIsExpanded(true)
      onMenuOpenChange?.(true)
      tl.play(0)
    } else {
      closeMenu()
    }
  }

  const setCardRef = (i: number) => (el: HTMLDivElement | null) => {
    if (el) cardsRef.current[i] = el
  }

  return (
    <div className={cn('card-nav-container relative z-40 h-[60px] w-full', className)}>
      <nav
        ref={navRef}
        aria-label={logoAlt}
        className={cn(
          'card-nav absolute top-0 inset-x-0 block h-[60px] overflow-hidden rounded-none bg-card p-0 shadow-md border-x border-b border-primary-200 will-change-[height]',
          isExpanded && 'open',
        )}
      >
        <div className="card-nav-top absolute inset-x-0 top-0 z-[2] flex h-[60px] items-center justify-between p-2 ps-[0.85rem] pe-2">
          <div className="flex h-full shrink-0 items-center gap-0.5 sm:gap-1">
            <motion.button
              type="button"
              className="hamburger-menu flex size-9 shrink-0 cursor-pointer flex-col items-center justify-center gap-[5px] rounded-lg text-secondary hover:bg-primary/70 hover:text-secondary"
              onClick={toggleMenu}
              onKeyDown={(event: KeyboardEvent<HTMLButtonElement>) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault()
                  toggleMenu()
                }
              }}
              aria-label={isExpanded ? closeMenuLabel : openMenuLabel}
              aria-expanded={isExpanded}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
            >
              <motion.span
                className="hamburger-line h-[2px] w-[20px] rounded-full origin-center bg-current"
                animate={isHamburgerOpen ? { y: 3.5, rotate: 45 } : { y: 0, rotate: 0 }}
                transition={{ duration: 0.24, ease: 'easeOut' }}
              />
              <motion.span
                className="hamburger-line h-[2px] w-[20px] rounded-full origin-center bg-current"
                animate={isHamburgerOpen ? { y: -3.5, rotate: -45 } : { y: 0, rotate: 0 }}
                transition={{ duration: 0.24, ease: 'easeOut' }}
              />
            </motion.button>
            {leading}
          </div>

          <div className="logo-container pointer-events-auto flex min-w-0 items-center md:absolute md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2">
            <Link
              to={logoHref}
              className="flex min-w-0 items-center gap-2 no-underline"
              aria-label={logoAlt}
              onClick={closeMenu}
              viewTransition={true}
            >
              <img
                src={logo}
                alt=""
                className={cn(
                  'logo h-9 w-9 rounded-full border-2 border-secondary/30 ring-2 ring-primary/50 object-cover shrink-0 p-0.5 shadow-xs',
                  logoClassName
                )}
              />
              <span className="hidden truncate text-sm font-medium text-secondary sm:inline">
                {logoAlt}
              </span>
            </Link>
          </div>

          <div className="flex shrink-0 items-center gap-0.5 sm:gap-1">{actions}</div>
        </div>

        <div
          className={cn(
            'card-nav-content absolute inset-x-0 top-[60px] bottom-0 z-[1] flex flex-col items-stretch justify-start gap-2 p-2',
            isExpanded ? 'pointer-events-auto visible' : 'pointer-events-none invisible',
            'md:flex-row md:items-end md:gap-3',
          )}
          aria-hidden={!isExpanded}
        >
          {(items || []).slice(0, 3).map((item, idx) => (
            <div
              key={`${item.label}-${idx}`}
              className={cn(
                'nav-card relative flex min-h-[60px] min-w-0 flex-[1_1_auto] select-none flex-col gap-2 rounded-[calc(0.75rem-0.2rem)] p-3 md:h-full md:min-h-0 md:flex-[1_1_0%]',
                item.className ?? defaultCardClasses[idx] ?? defaultCardClasses[0],
              )}
              ref={setCardRef(idx)}
            >
              <div className="nav-card-label text-[18px] font-normal tracking-[-0.5px] md:text-[22px]">
                {item.label}
              </div>
              <div className="nav-card-links mt-auto flex flex-col gap-0.5">
                {item.links?.map((link) => (
                  <Link
                    key={`${link.label}-${link.href}`}
                    className="nav-card-link cursor-pointer text-[15px] no-underline md:text-base"
                    to={link.href}
                    aria-label={link.ariaLabel}
                    onClick={closeMenu}
                    viewTransition={true}
                  >
                    <motion.span
                      className="inline-flex items-center gap-1.5"
                      whileHover={{ opacity: 0.75, x: 2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {link.icon ? (
                        <span className="nav-card-link-icon shrink-0" aria-hidden="true">
                          {link.icon}
                        </span>
                      ) : (
                        <GoArrowUpRight
                          className="nav-card-link-icon shrink-0 rtl:-scale-x-100"
                          aria-hidden="true"
                        />
                      )}
                      {link.label}
                    </motion.span>
                  </Link>
                ))}
              </div>
            </div>
          ))}

          {mobileActions && (
            <div
              className="w-full shrink-0 pt-1 md:hidden"
              ref={setCardRef((items || []).slice(0, 3).length)}
            >
              {typeof mobileActions === 'function' ? mobileActions(closeMenu) : mobileActions}
            </div>
          )}
        </div>
      </nav>
    </div>
  )
}

export default CardNav
