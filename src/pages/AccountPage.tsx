import { AccountView } from '@/features/account'
import { useEffect } from 'react'

const AccountPage = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
  }, [])

  return <AccountView />
}

export default AccountPage
