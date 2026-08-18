import { ar } from './messages/ar'
import { en } from './messages/en'
import type { Locale } from './locales'

export const messages = { en, ar } as const

export const getMessages = (locale: Locale): Record<string, string> => messages[locale]
