import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Eye, EyeOff, Sparkles } from 'lucide-react'
import { motion } from 'motion/react'
import { useIntl } from 'react-intl'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { EGYPT_MOBILE_PATTERN, NAME_PATTERN } from '@/features/checkout'
import { DEFAULT_LOCALE, isLocale, type Locale } from '@/i18n/locales'
import { getLocalizedPath } from '@/i18n/navigation'
import { useRegister } from '../api/use-auth'
import type { RegisterValues } from '../types'
import { AuthShell } from './AuthShell'

const digitsOnly = (value: string) => value.replace(/\D/g, '')

export const RegisterView = () => {
  const intl = useIntl()
  const navigate = useNavigate()
  const locale: Locale = isLocale(intl.locale) ? intl.locale : DEFAULT_LOCALE
  const register = useRegister()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const message = (id: string, defaultMessage?: string) =>
    intl.formatMessage({ id, defaultMessage })

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterValues>({
    mode: 'onTouched',
    defaultValues: {
      fullName: '',
      phone: '',
      password: '',
      confirmPassword: '',
    },
  })

  const passwordValue = watch('password')

  const onSubmit = handleSubmit((values) => {
    register.mutate(
      {
        ...values,
        fullName: values.fullName.trim(),
        phone: digitsOnly(values.phone),
      },
      {
        onSuccess: () => {
          toast.success(message('auth.register.success'))
          navigate(getLocalizedPath('/account', locale), { replace: true })
        },
        onError: () => toast.error(message('auth.register.error')),
      },
    )
  })

  return (
    <AuthShell
      title={message('auth.register.title')}
      subtitle={message('auth.register.subtitle')}
      footer={
        <>
          {message('auth.register.hasAccount')}{' '}
          <Link
            to={getLocalizedPath('/login', locale)}
            viewTransition={true}
            className="font-semibold text-secondary hover:text-secondary-700 underline-offset-4 hover:underline"
          >
            {message('auth.register.signIn')}
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} noValidate className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="register-name">{message('auth.fields.fullName')}</Label>
          <Controller
            name="fullName"
            control={control}
            rules={{
              required: message('checkout.errors.required'),
              validate: (value) =>
                NAME_PATTERN.test(value.trim()) || message('checkout.errors.fullName'),
            }}
            render={({ field }) => (
              <Input
                {...field}
                id="register-name"
                type="text"
                autoComplete="name"
                aria-invalid={Boolean(errors.fullName)}
                className="h-11 rounded-xl border-primary-200/80 bg-neutral/60 px-3.5"
              />
            )}
          />
          {errors.fullName ? (
            <p role="alert" className="text-xs text-destructive">
              {errors.fullName.message}
            </p>
          ) : null}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="register-phone">{message('auth.fields.phone')}</Label>
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
                id="register-phone"
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
          <Label htmlFor="register-password">{message('auth.fields.password')}</Label>
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
                  id="register-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
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

        <div className="space-y-1.5">
          <Label htmlFor="register-confirm">{message('auth.fields.confirmPassword')}</Label>
          <Controller
            name="confirmPassword"
            control={control}
            rules={{
              required: message('checkout.errors.required'),
              validate: (value) =>
                value === passwordValue || message('auth.errors.passwordMismatch'),
            }}
            render={({ field }) => (
              <div className="relative">
                <Input
                  {...field}
                  id="register-confirm"
                  type={showConfirm ? 'text' : 'password'}
                  autoComplete="new-password"
                  aria-invalid={Boolean(errors.confirmPassword)}
                  className="h-11 rounded-xl border-primary-200/80 bg-neutral/60 px-3.5 pe-11"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((prev) => !prev)}
                  className="absolute end-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-tertiary transition-colors hover:text-secondary"
                  aria-label={
                    showConfirm
                      ? message('auth.fields.hidePassword')
                      : message('auth.fields.showPassword')
                  }
                >
                  {showConfirm ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            )}
          />
          {errors.confirmPassword ? (
            <p role="alert" className="text-xs text-destructive">
              {errors.confirmPassword.message}
            </p>
          ) : null}
        </div>

        <p className="text-xs leading-relaxed text-tertiary">
          {message('auth.register.terms')}
        </p>

        <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
          <Button
            type="submit"
            disabled={register.isPending}
            className="h-11 w-full rounded-xl bg-secondary text-secondary-foreground hover:bg-secondary-600"
          >
            <Sparkles className="size-4" />
            {register.isPending
              ? message('auth.register.submitting')
              : message('auth.register.submit')}
          </Button>
        </motion.div>
      </form>
    </AuthShell>
  )
}
