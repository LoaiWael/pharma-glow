import { ar } from './ar'
import { en } from './en'
import type { Locale } from '../locales'

export const messages = { en, ar } as const

export const getMessages = (locale: Locale): Record<string, string> =>
  messages[locale] as unknown as Record<string, string>

export type { MessageKey } from './en'
