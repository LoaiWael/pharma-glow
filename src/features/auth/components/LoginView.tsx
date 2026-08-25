import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Eye, EyeOff, LogIn } from 'lucide-react'
import { motion } from 'motion/react'
import { useIntl } from 'react-intl'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { EGYPT_MOBILE_PATTERN } from '@/features/checkout'
import { DEFAULT_LOCALE, isLocale, type Locale } from '@/i18n/locales'
import { getLocalizedPath } from '@/i18n/navigation'
import { useLogin } from '../api/use-auth'
import type { LoginValues } from '../types'
import { AuthShell } from './AuthShell'

const digitsOnly = (value: string) => value.replace(/\D/g, '')

export const LoginView = () => {
  const intl = useIntl()
  const navigate = useNavigate()
  const locale: Locale = isLocale(intl.locale) ? intl.locale : DEFAULT_LOCALE
  const login = useLogin()
  const [showPassword, setShowPassword] = useState(false)

  const message = (id: string, defaultMessage?: string) =>
    intl.formatMessage({ id, defaultMessage })

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({
    mode: 'onTouched',
    defaultValues: { phone: '', password: '' },
  })

  const onSubmit = handleSubmit((values) => {
    login.mutate(
      { ...values, phone: digitsOnly(values.phone) },
      {
        onSuccess: () => {
          toast.success(message('auth.login.success'))
          navigate(getLocalizedPath('/account', locale), { replace: true })
        },
        onError: () => toast.error(message('auth.login.error')),
      },
    )
  })

  return (
    <AuthShell
      title={message('auth.login.title')}
      subtitle={message('auth.login.subtitle')}
      footer={
        <>
          {message('auth.login.noAccount')}{' '}
          <Link
            to={getLocalizedPath('/register', locale)}
            viewTransition={true}
            className="font-semibold text-secondary hover:text-secondary-700 underline-offset-4 hover:underline"
          >
            {message('auth.login.createAccount')}
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} noValidate className="space-y-5">
        <div className="space-y-1.5">
          <Label htmlFor="login-phone">{message('auth.fields.phone')}</Label>
          <Controller
            name="phone"
            control={control}
            rules={{
              required: message('checkout.errors.required'),
              validate: (value) =>
                EGYPT_MOBILE_PATTERN.test(digitsOnly(value)) ||
                message('checkout.errors.phone'),
            }}
            render={({ field }) => (
              <Input
                {...field}
                id="login-phone"
                type="tel"
                inputMode="numeric"
                autoComplete="tel"
                placeholder="01xxxxxxxxx"
                aria-invalid={Boolean(errors.phone)}
                className="h-11 rounded-xl border-primary-200/80 bg-neutral/60 px-3.5"
              />
            )}
          />
          {errors.phone ? (
            <p role="alert" className="text-xs text-destructive">
              {errors.phone.message}
            </p>
          ) : null}
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between gap-2">
            <Label htmlFor="login-password">{message('auth.fields.password')}</Label>
            <span className="text-xs text-tertiary">{message('auth.login.forgotHint')}</span>
          </div>
          <Controller
            name="password"
            control={control}
            rules={{
              required: message('checkout.errors.required'),
              minLength: {
                value: 6,
                message: message('auth.errors.passwordMin'),
              },
            }}
            render={({ field }) => (
              <div className="relative">
                <Input
                  {...field}
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  aria-invalid={Boolean(errors.password)}
                  className="h-11 rounded-xl border-primary-200/80 bg-neutral/60 px-3.5 pe-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute end-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-tertiary transition-colors hover:text-secondary"
                  aria-label={
                    showPassword
                      ? message('auth.fields.hidePassword')
                      : message('auth.fields.showPassword')
                  }
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            )}
          />
          {errors.password ? (
            <p role="alert" className="text-xs text-destructive">
              {errors.password.message}
            </p>
          ) : null}
        </div>

        <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
          <Button
            type="submit"
            disabled={login.isPending}
            className="h-11 w-full rounded-xl bg-secondary text-secondary-foreground hover:bg-secondary-600"
          >
            <LogIn className="size-4" />
            {login.isPending ? message('auth.login.submitting') : message('auth.login.submit')}
          </Button>
        </motion.div>
      </form>
    </AuthShell>
  )
}
