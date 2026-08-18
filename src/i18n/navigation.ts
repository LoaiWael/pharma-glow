import { DEFAULT_LOCALE, type Locale } from '@/i18n/locales'

export const getLocalizedPath = (path: string, locale: Locale): string => {
  const cleanPath = path.startsWith('/') ? path : `/${path}`
  const strippedPath = cleanPath.replace(/^\/(en|ar)(\/|$)/, '$2') || '/'

  if (locale === DEFAULT_LOCALE) {
    return strippedPath
  }

  return strippedPath === '/' ? `/${locale}` : `/${locale}${strippedPath}`
}
