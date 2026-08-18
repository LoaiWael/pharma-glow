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
  titleKey: MessageKey
  descriptionKey?: MessageKey
  imageSrc: string
  href: string
}
