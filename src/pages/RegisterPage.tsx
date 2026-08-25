import { useEffect } from 'react'
import { RegisterView } from '@/features/auth'

const RegisterPage = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
  }, [])

  return <RegisterView />
}

export default RegisterPage
