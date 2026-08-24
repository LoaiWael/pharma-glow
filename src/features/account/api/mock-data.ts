import type { AccountProfile } from '../types'

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const MOCK_PROFILE: AccountProfile = {
  id: 'u-1',
  fullNameEn: 'Noura Ahmed',
  fullNameAr: 'نورة أحمد',
  phone: '01012345678',
  email: 'noura.ahmed@pure.com',
  memberSince: '2025-03-12',
  avatarUrl: null,
  address: {
    country: 'EG',
    governorateId: 'cairo',
    city: 'Nasr City',
    street: 'Abbas El Akkad St.',
    building: 'Building 12, apt 4',
    landmark: 'Next to Al Noor Pharmacy',
  },
}

let profileStore: AccountProfile = structuredClone(MOCK_PROFILE)

export const fetchAccountProfile = async (): Promise<AccountProfile> => {
  await wait(280)
  return structuredClone(profileStore)
}

export const updateAccountProfile = async (profile: AccountProfile): Promise<AccountProfile> => {
  await wait(650)
  profileStore = structuredClone(profile)
  return structuredClone(profileStore)
}
