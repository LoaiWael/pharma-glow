export const LOCALES = ['en', 'ar'] as const

export type Locale = (typeof LOCALES)[number]

export const DEFAULT_LOCALE: Locale = 'ar'

export const LOCALE_DIR: Record<Locale, 'ltr' | 'rtl'> = {
  en: 'ltr',
  ar: 'rtl',
}

export const isLocale = (value: string | undefined): value is Locale =>
  LOCALES.includes(value as Locale)
