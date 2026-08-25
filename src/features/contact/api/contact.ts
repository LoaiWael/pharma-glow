import { api, type ApiEnvelope } from '@/lib/http'
import type { ContactSettings } from '../types'

const CONTACT_PATH = '/api/v1/contact'

export const fetchContactSettings = async (): Promise<ContactSettings> => {
  const envelope = await api.get<ApiEnvelope<ContactSettings>>(CONTACT_PATH)
  return envelope.data
}
