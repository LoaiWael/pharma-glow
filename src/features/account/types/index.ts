export interface AccountAddress {
  country: 'EG'
  governorateId: string
  city: string
  street: string
  building: string
  landmark: string
}

export interface AccountProfile {
  id: string
  fullNameEn: string
  fullNameAr: string
  phone: string
  email: string
  memberSince: string
  avatarUrl: string | null
  address: AccountAddress
}

export interface AccountPersonalValues {
  fullName: string
  phone: string
  email: string
}

export interface AccountAddressValues {
  governorateId: string
  city: string
  street: string
  building: string
  landmark: string
}
