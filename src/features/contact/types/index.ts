export interface SocialLinks {
  facebook?: string | null
  instagram?: string | null
  twitter?: string | null
  linkedin?: string | null
  snapchat?: string | null
  tiktok?: string | null
}

export interface ContactSettings {
  appName?: string | null
  email?: string | null
  phone?: string | null
  whatsapp?: string | null
  address?: string | null
  mapUrl?: string | null
  social?: SocialLinks | null
}
