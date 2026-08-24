import type { Locale } from '@/i18n/locales'
import type { AccountAddressValues, AccountPersonalValues, AccountProfile } from '../types'

export const getAccountDisplayName = (profile: AccountProfile, locale: Locale) =>
  locale === 'ar' ? profile.fullNameAr : profile.fullNameEn

export const getAccountInitials = (name: string, locale: Locale) => {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return locale === 'ar' ? 'فج' : 'PG'
  return parts
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
}

export const toPersonalValues = (profile: AccountProfile, locale: Locale): AccountPersonalValues => ({
  fullName: getAccountDisplayName(profile, locale),
  phone: profile.phone,
  email: profile.email,
})

export const toAddressValues = (profile: AccountProfile): AccountAddressValues => ({
  governorateId: profile.address.governorateId,
  city: profile.address.city,
  street: profile.address.street,
  building: profile.address.building,
  landmark: profile.address.landmark,
})

export const applyPersonalValues = (
  profile: AccountProfile,
  values: AccountPersonalValues,
  locale: Locale,
): AccountProfile => ({
  ...profile,
  fullNameEn: locale === 'en' ? values.fullName.trim() : profile.fullNameEn,
  fullNameAr: locale === 'ar' ? values.fullName.trim() : profile.fullNameAr,
  phone: values.phone,
  email: values.email.trim(),
})

export const applyAddressValues = (
  profile: AccountProfile,
  values: AccountAddressValues,
): AccountProfile => ({
  ...profile,
  address: {
    country: 'EG',
    governorateId: values.governorateId,
    city: values.city.trim(),
    street: values.street.trim(),
    building: values.building.trim(),
    landmark: values.landmark.trim(),
  },
})
