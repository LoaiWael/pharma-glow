import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { UserRound } from 'lucide-react'
import { motion } from 'motion/react'
import { useIntl } from 'react-intl'
import { toast } from 'sonner'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { EGYPT_MOBILE_PATTERN, NAME_PATTERN } from '@/features/checkout'
import type { Locale } from '@/i18n/locales'
import { useUpdateAccount } from '../api/use-account'
import type { AccountPersonalValues, AccountProfile } from '../types'
import { applyPersonalValues, toPersonalValues } from '../utils/profile'
import { AccountField } from './AccountField'
import { AccountFormActions } from './AccountFormActions'

const digitsOnly = (value: string) => value.replace(/\D/g, '')
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

type AccountPersonalFormProps = {
  profile: AccountProfile
  locale: Locale
}

export const AccountPersonalForm = ({ profile, locale }: AccountPersonalFormProps) => {
  const intl = useIntl()
  const updateAccount = useUpdateAccount()
  const [isEditing, setIsEditing] = useState(false)

  const message = (id: string, defaultMessage?: string) =>
    intl.formatMessage({ id, defaultMessage })

  const requiredMessage = message('checkout.errors.required', 'This field is required.')

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<AccountPersonalValues>({
    mode: 'onTouched',
    reValidateMode: 'onChange',
    defaultValues: toPersonalValues(profile, locale),
  })

  useEffect(() => {
    if (!isEditing) reset(toPersonalValues(profile, locale))
  }, [isEditing, locale, profile, reset])

  const onSubmit = handleSubmit((values) => {
    updateAccount.mutate(applyPersonalValues(profile, values, locale), {
      onSuccess: (nextProfile) => {
        reset(toPersonalValues(nextProfile, locale))
        setIsEditing(false)
        toast.success(message('account.saveSuccess'))
      },
      onError: () => toast.error(message('account.saveError')),
    })
  })

  const handleCancel = () => {
    reset(toPersonalValues(profile, locale))
    setIsEditing(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.08, ease: 'easeOut' }}
    >
      <form onSubmit={onSubmit} noValidate>
        <Card className="rounded-2xl border-border/60 bg-card shadow-xs ring-foreground/5">
          <CardHeader className="border-b border-border/50 pb-4">
            <div className="flex items-start gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/40 text-secondary">
                <UserRound className="size-5" />
              </div>
              <div>
                <CardTitle className="text-lg font-semibold">{message('account.personalTitle')}</CardTitle>
                <CardDescription className="text-tertiary">{message('account.personalHint')}</CardDescription>
              </div>
            </div>
            <CardAction className="hidden sm:block">
              <AccountFormActions
                isEditing={isEditing}
                isDirty={isDirty}
                isSaving={updateAccount.isPending}
                editLabel={message('account.edit')}
                cancelLabel={message('account.cancel')}
                saveLabel={message('account.save')}
                savingLabel={message('account.saving')}
                onEdit={() => setIsEditing(true)}
                onCancel={handleCancel}
              />
            </CardAction>
          </CardHeader>
          <CardContent className="grid gap-5 pt-5 pb-6 sm:grid-cols-2">
            <Controller
              name="fullName"
              control={control}
              rules={{
                validate: (value) => {
                  const name = value.trim()
                  if (!name) return requiredMessage
                  if (!NAME_PATTERN.test(name)) return message('checkout.errors.fullName')
                  return true
                },
              }}
              render={({ field, fieldState }) => (
                <AccountField
                  id="account-full-name"
                  label={message('account.fullName')}
                  required={isEditing}
                  error={isEditing ? fieldState.error?.message : undefined}
                >
                  <Input
                    {...field}
                    id="account-full-name"
                    autoComplete="name"
                    readOnly={!isEditing}
                    aria-invalid={isEditing && fieldState.invalid}
                    aria-describedby={errors.fullName ? 'account-full-name-error' : undefined}
                    className="h-10 px-3 read-only:bg-neutral/80 read-only:focus-visible:ring-0"
                  />
                </AccountField>
              )}
            />

            <Controller
              name="phone"
              control={control}
              rules={{
                validate: (value) => {
                  const phone = digitsOnly(value)
                  if (!phone) return requiredMessage
                  if (!EGYPT_MOBILE_PATTERN.test(phone)) return message('checkout.errors.phone')
                  return true
                },
              }}
              render={({ field, fieldState }) => (
                <AccountField
                  id="account-phone"
                  label={message('account.phone')}
                  required={isEditing}
                  error={isEditing ? fieldState.error?.message : undefined}
                >
                  <Input
                    {...field}
                    id="account-phone"
                    type="tel"
                    inputMode="numeric"
                    autoComplete="tel"
                    dir="ltr"
                    maxLength={11}
                    readOnly={!isEditing}
                    onChange={(event) => field.onChange(digitsOnly(event.target.value).slice(0, 11))}
                    aria-invalid={isEditing && fieldState.invalid}
                    aria-describedby={errors.phone ? 'account-phone-error' : undefined}
                    className="h-10 px-3 read-only:bg-neutral/80 read-only:focus-visible:ring-0"
                  />
                </AccountField>
              )}
            />

            <div className="sm:col-span-2">
              <Controller
                name="email"
                control={control}
                rules={{
                  validate: (value) => {
                    const email = value.trim()
                    if (!email) return requiredMessage
                    if (!EMAIL_PATTERN.test(email)) return message('account.errors.email')
                    return true
                  },
                }}
                render={({ field, fieldState }) => (
                  <AccountField
                    id="account-email"
                    label={message('account.email')}
                    required={isEditing}
                    error={isEditing ? fieldState.error?.message : undefined}
                  >
                    <Input
                      {...field}
                      id="account-email"
                      type="email"
                      autoComplete="email"
                      dir="ltr"
                      readOnly={!isEditing}
                      placeholder={isEditing ? message('account.emailPlaceholder') : undefined}
                      aria-invalid={isEditing && fieldState.invalid}
                      aria-describedby={errors.email ? 'account-email-error' : undefined}
                      className="h-10 px-3 read-only:bg-neutral/80 read-only:focus-visible:ring-0"
                    />
                  </AccountField>
                )}
              />
            </div>
          </CardContent>
          <Separator className="bg-border/60 sm:hidden" />
          <CardFooter className="justify-end border-t-0 bg-neutral/60 p-4 sm:hidden">
            <AccountFormActions
              isEditing={isEditing}
              isDirty={isDirty}
              isSaving={updateAccount.isPending}
              editLabel={message('account.edit')}
              cancelLabel={message('account.cancel')}
              saveLabel={message('account.save')}
              savingLabel={message('account.saving')}
              onEdit={() => setIsEditing(true)}
              onCancel={handleCancel}
            />
          </CardFooter>
        </Card>
      </form>
    </motion.div>
  )
}
