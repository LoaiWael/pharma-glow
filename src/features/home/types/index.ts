import type { MessageKey } from '@/i18n/messages/en'

export interface HomeBanner {
  id: string
  imageSrc: string
  imageAltKey: MessageKey
  titleKey: MessageKey
  subtitleKey: MessageKey
  ctaKey: MessageKey
  href: string
}

export interface HomeCategory {
  id: string
  /** i18n key for curated tiles */
  titleKey?: MessageKey
  /** Plain label from API categories */
  title?: string
  descriptionKey?: MessageKey
  imageSrc: string
  href: string
  /** When true, image is the brand logo fallback (render rounded / contained). */
  isLogoFallback?: boolean
}
