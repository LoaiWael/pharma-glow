import React, { useLayoutEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { GoArrowUpRight } from 'react-icons/go'
import { FaWhatsapp } from 'react-icons/fa6'
import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'

type CardNavLink = {
  label: string
  href: string
  ariaLabel: string
  external?: boolean
}

export type CardNavItem = {
  label: string
  bgColor: string
  textColor: string
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
  baseColor?: string
  menuColor?: string
  buttonBgColor?: string
  buttonTextColor?: string
  ctaLabel?: string
  ctaHref?: string
  ctaExternal?: boolean
  trailing?: React.ReactNode
  plainLinks?: CardNavLink[]
}

const CardNav: React.FC<CardNavProps> = ({
  logo,
  logoAlt = 'Logo',
  logoHref = '/',
  logoClassName,
  items,
  className = '',
  ease = 'power3.out',
  baseColor = '#fff',
  menuColor,
  buttonBgColor,
  buttonTextColor,
  ctaLabel,
  ctaHref,
  ctaExternal,
  trailing,
  plainLinks = [],
}) => {
  const [isHamburgerOpen, setIsHamburgerOpen] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const navRef = useRef<HTMLDivElement | null>(null)
  const cardsRef = useRef<HTMLDivElement[]>([])
  const tlRef = useRef<gsap.core.Timeline | null>(null)

  const calculateHeight = () => {
    const navEl = navRef.current
    if (!navEl) return 260

    const contentEl = navEl.querySelector('.card-nav-content') as HTMLElement
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

    return 260
  }

  const createTimeline = () => {
    const navEl = navRef.current
    if (!navEl) return null

    gsap.set(navEl, { height: 60, overflow: 'hidden' })
    gsap.set(cardsRef.current, { y: 50, opacity: 0 })

    const tl = gsap.timeline({ paused: true })

    tl.to(navEl, {
      height: calculateHeight,
      duration: 0.4,
      ease,
    })

    tl.to(cardsRef.current, { y: 0, opacity: 1, duration: 0.4, ease, stagger: 0.08 }, '-=0.1')

    return tl
  }

  useLayoutEffect(() => {
    const tl = createTimeline()
    tlRef.current = tl

    return () => {
      tl?.kill()
      tlRef.current = null
    }
  }, [ease, items, plainLinks])

  useLayoutEffect(() => {
    const handleResize = () => {
      if (!tlRef.current) return

      if (isExpanded) {
        const newHeight = calculateHeight()
        gsap.set(navRef.current, { height: newHeight })

        tlRef.current.kill()
        const newTl = createTimeline()
        if (newTl) {
          newTl.progress(1)
          tlRef.current = newTl
        }
      } else {
        tlRef.current.kill()
        const newTl = createTimeline()
        if (newTl) {
          tlRef.current = newTl
        }
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [isExpanded])

  const closeMenu = () => {
    const tl = tlRef.current
    if (!tl || !isExpanded) return
    setIsHamburgerOpen(false)
    tl.eventCallback('onReverseComplete', () => setIsExpanded(false))
    tl.reverse()
  }

  const toggleMenu = () => {
    const tl = tlRef.current
    if (!tl) return
    if (!isExpanded) {
      setIsHamburgerOpen(true)
      setIsExpanded(true)
      tl.play(0)
    } else {
      closeMenu()
    }
  }

  const setCardRef = (i: number) => (el: HTMLDivElement | null) => {
    if (el) cardsRef.current[i] = el
  }

  const handleInternalNav = (event: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    const hash = href.includes('#') ? href.slice(href.indexOf('#') + 1) : ''
    const target = hash ? document.getElementById(hash) : null
    closeMenu()
    if (!target) return
    event.preventDefault()
    target.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const renderCta = (inMenu = false) => {
    if (!ctaLabel || !ctaHref) return null
    const classNameCta = cn(
      'card-nav-cta-button inline-flex items-center justify-center gap-2 rounded-full border-0 font-medium transition-colors duration-300',
      inMenu ? 'h-11 w-full px-4 text-sm' : 'h-full px-4 text-sm',
    )
    const style = { backgroundColor: buttonBgColor, color: buttonTextColor }
    const content = (
      <>
        {ctaLabel}
        <FaWhatsapp className="size-4.5" />
      </>
    )

    if (ctaExternal) {
      return (
        <a href={ctaHref} target="_blank" rel="noreferrer" className={classNameCta} style={style}>
          {content}
        </a>
      )
    }

    return (
      <Link to={ctaHref} viewTransition={true} className={classNameCta} style={style} onClick={closeMenu}>
        {content}
      </Link>
    )
  }

  return (
    <div className={cn('card-nav-container z-[99]', className)}>
      <nav
        ref={navRef}
        className={`card-nav ${isExpanded ? 'open' : ''} relative block h-[60px] overflow-hidden rounded-2xl p-0 shadow-md will-change-[height]`}
        style={{ backgroundColor: baseColor }}
      >
        <div className="card-nav-top absolute inset-x-0 top-0 z-[2] flex h-[60px] items-center justify-between p-2 ps-[1.1rem]">
          <Link
            to={logoHref}
            viewTransition={true}
            className="logo-container order-1 flex items-center"
            onClick={closeMenu}
          >
            <img src={logo} alt={logoAlt} className={cn('logo h-[28px]', logoClassName)} />
          </Link>

          <div className="order-2 flex h-full items-center gap-2">
            {trailing}
            <div
              className={`hamburger-menu ${isHamburgerOpen ? 'open' : ''} group flex h-full cursor-pointer flex-col items-center justify-center gap-[6px] px-2`}
              onClick={toggleMenu}
              onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  toggleMenu()
                }
              }}
              role="button"
              aria-label={isExpanded ? 'Close menu' : 'Open menu'}
              aria-expanded={isExpanded}
              tabIndex={0}
              style={{ color: menuColor || '#000' }}
            >
              <div
                className={`hamburger-line h-[2px] w-[30px] bg-current transition-[transform,opacity,margin] duration-300 ease-linear [transform-origin:50%_50%] ${
                  isHamburgerOpen ? 'translate-y-[4px] rotate-45' : ''
                } group-hover:opacity-75`}
              />
              <div
                className={`hamburger-line h-[2px] w-[30px] bg-current transition-[transform,opacity,margin] duration-300 ease-linear [transform-origin:50%_50%] ${
                  isHamburgerOpen ? '-translate-y-[4px] -rotate-45' : ''
                } group-hover:opacity-75`}
              />
            </div>
          </div>
        </div>

        <div
          className={`card-nav-content absolute top-[60px] right-0 bottom-0 left-0 z-[1] flex flex-col items-stretch justify-between gap-4 p-2 ${
            isExpanded ? 'pointer-events-auto visible' : 'pointer-events-none invisible'
          }`}
          aria-hidden={!isExpanded}
        >
          {plainLinks.length > 0 ? (
            <div
              ref={setCardRef(0)}
              className="flex flex-col gap-1 px-2 py-1 text-sm text-primary"
            >
              {plainLinks.map((lnk, i) => {
                if (lnk.external) {
                  return (
                    <a
                      key={`${lnk.label}-${i}`}
                      href={lnk.href}
                      aria-label={lnk.ariaLabel}
                      target="_blank"
                      rel="noreferrer"
                      className="py-1.5 transition-opacity hover:opacity-70"
                    >
                      {lnk.label}
                    </a>
                  )
                }

                return (
                  <Link
                    key={`${lnk.label}-${i}`}
                    to={lnk.href}
                    aria-label={lnk.ariaLabel}
                    viewTransition={true}
                    onClick={(event) => handleInternalNav(event, lnk.href)}
                    className="py-1.5 transition-opacity hover:opacity-70"
                  >
                    {lnk.label}
                  </Link>
                )
              })}
            </div>
          ) : null}
          {(items || []).map((item, idx) => (
            <div
              key={`${item.label}-${idx}`}
              className="nav-card relative flex min-h-0 min-w-0 flex-col gap-0.5 rounded-[calc(0.75rem-0.2rem)] p-[12px_16px] select-none"
              ref={setCardRef(plainLinks.length > 0 ? idx + 1 : idx)}
              style={{ backgroundColor: item.bgColor, color: item.textColor }}
            >
              <div className="nav-card-label text-[18px] tracking-[-0.5px]">{item.label}</div>
              <div className="nav-card-links flex flex-col gap-[2px]">
                {item.links?.map((lnk, i) => {
                  const classNameLink =
                    'nav-card-link inline-flex cursor-pointer items-center gap-[6px] text-[15px] no-underline transition-opacity duration-300 hover:opacity-75'
                  const content = (
                    <>
                      <GoArrowUpRight className="nav-card-link-icon shrink-0" aria-hidden="true" />
                      {lnk.label}
                    </>
                  )

                  if (lnk.external) {
                    return (
                      <a
                        key={`${lnk.label}-${i}`}
                        className={classNameLink}
                        href={lnk.href}
                        aria-label={lnk.ariaLabel}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {content}
                      </a>
                    )
                  }

                  return (
                    <Link
                      key={`${lnk.label}-${i}`}
                      className={classNameLink}
                      to={lnk.href}
                      aria-label={lnk.ariaLabel}
                      viewTransition={true}
                      onClick={closeMenu}
                    >
                      {content}
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
          {ctaLabel && ctaHref ? (
            <div ref={setCardRef((plainLinks.length > 0 ? 1 : 0) + (items?.length || 0))}>
              {renderCta(true)}
            </div>
          ) : null}
        </div>
      </nav>
    </div>
  )
}

export default CardNav
