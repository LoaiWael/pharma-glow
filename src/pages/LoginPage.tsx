import { useEffect } from 'react'
import { LoginView } from '@/features/auth'

const LoginPage = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
  }, [])

  return <LoginView />
}

export default LoginPage
