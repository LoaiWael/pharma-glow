import { DEFAULT_LOCALE, type Locale } from '@/i18n/locales'

export const getLocalizedPath = (path: string, locale: Locale): string => {
  // Ensure path starts with /
  const cleanPath = path.startsWith('/') ? path : `/${path}`

  // Strip existing locale prefix if any (/en or /ar)
  const strippedPath = cleanPath.replace(/^\/(en|ar)(\/|$)/, '$2') || '/'

  // Arabic is default with no prefix
  if (locale === DEFAULT_LOCALE) {
    return strippedPath
  }

  // Non-default locale gets prefix (e.g., /en)
  return strippedPath === '/' ? `/${locale}` : `/${locale}${strippedPath}`
}
