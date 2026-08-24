import { useEffect, useMemo, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { MapPin } from 'lucide-react'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { EGYPT_GOVERNORATES } from '@/features/checkout'
import type { Locale } from '@/i18n/locales'
import { useUpdateAccount } from '../api/use-account'
import type { AccountAddressValues, AccountProfile } from '../types'
import { applyAddressValues, toAddressValues } from '../utils/profile'
import { AccountField } from './AccountField'
import { AccountFormActions } from './AccountFormActions'

type AccountAddressFormProps = {
  profile: AccountProfile
  locale: Locale
}

export const AccountAddressForm = ({ profile, locale }: AccountAddressFormProps) => {
  const intl = useIntl()
  const updateAccount = useUpdateAccount()
  const [isEditing, setIsEditing] = useState(false)

  const message = (id: string, defaultMessage?: string) =>
    intl.formatMessage({ id, defaultMessage })

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<AccountAddressValues>({
    mode: 'onTouched',
    reValidateMode: 'onChange',
    defaultValues: toAddressValues(profile),
  })

  useEffect(() => {
    if (!isEditing) reset(toAddressValues(profile))
  }, [isEditing, profile, reset])

  const governorates = useMemo(
    () =>
      [...EGYPT_GOVERNORATES].sort((a, b) =>
        locale === 'ar' ? a.nameAr.localeCompare(b.nameAr, 'ar') : a.nameEn.localeCompare(b.nameEn, 'en'),
      ),
    [locale],
  )

  const optionalLabel = (label: string) => `${label} (${message('checkout.optional', 'optional')})`

  const onSubmit = handleSubmit((values) => {
    updateAccount.mutate(applyAddressValues(profile, values), {
      onSuccess: (nextProfile) => {
        reset(toAddressValues(nextProfile))
        setIsEditing(false)
        toast.success(message('account.saveSuccess'))
      },
      onError: () => toast.error(message('account.saveError')),
    })
  })

  const handleCancel = () => {
    reset(toAddressValues(profile))
    setIsEditing(false)
  }

  const readOnlyClass = 'h-10 px-3 read-only:bg-neutral/80 read-only:focus-visible:ring-0'

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.14, ease: 'easeOut' }}
    >
      <form onSubmit={onSubmit} noValidate>
        <Card className="rounded-2xl border-border/60 bg-card shadow-xs ring-foreground/5">
          <CardHeader className="border-b border-border/50 pb-4">
            <div className="flex items-start gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/40 text-secondary">
                <MapPin className="size-5" />
              </div>
              <div>
                <CardTitle className="text-lg font-semibold">{message('account.addressTitle')}</CardTitle>
                <CardDescription className="text-tertiary">{message('account.addressHint')}</CardDescription>
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
            <AccountField id="account-country" label={message('checkout.country')} required={isEditing}>
              <Input
                id="account-country"
                value={message('checkout.countryValue')}
                readOnly
                disabled
                className="h-10 px-3"
              />
            </AccountField>

            <Controller
              name="governorateId"
              control={control}
              rules={{
                validate: (value) =>
                  EGYPT_GOVERNORATES.some((governorate) => governorate.id === value) ||
                  message('checkout.errors.governorate'),
              }}
              render={({ field, fieldState }) => (
                <AccountField
                  id="account-governorate"
                  label={message('checkout.governorate')}
                  required={isEditing}
                  error={isEditing ? fieldState.error?.message : undefined}
                >
                  <Select
                    value={field.value || null}
                    disabled={!isEditing}
                    onValueChange={(value) => field.onChange(typeof value === 'string' ? value : '')}
                  >
                    <SelectTrigger
                      id="account-governorate"
                      aria-invalid={isEditing && fieldState.invalid}
                      className="h-10 w-full px-3 disabled:bg-neutral/80"
                    >
                      <SelectValue placeholder={message('checkout.governoratePlaceholder')} />
                    </SelectTrigger>
                    <SelectContent alignItemWithTrigger={false} align="start" className="max-h-60">
                      {governorates.map((governorate) => (
                        <SelectItem key={governorate.id} value={governorate.id}>
                          {locale === 'ar' ? governorate.nameAr : governorate.nameEn}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </AccountField>
              )}
            />

            <Controller
              name="city"
              control={control}
              rules={{
                validate: (value) => value.trim().length > 0 || message('checkout.errors.city'),
              }}
              render={({ field, fieldState }) => (
                <AccountField
                  id="account-city"
                  label={message('checkout.city')}
                  required={isEditing}
                  error={isEditing ? fieldState.error?.message : undefined}
                >
                  <Input
                    {...field}
                    id="account-city"
                    readOnly={!isEditing}
                    aria-invalid={isEditing && fieldState.invalid}
                    className={readOnlyClass}
                  />
                </AccountField>
              )}
            />

            <Controller
              name="building"
              control={control}
              rules={{
                validate: (value) => value.trim().length > 0 || message('checkout.errors.building'),
              }}
              render={({ field, fieldState }) => (
                <AccountField
                  id="account-building"
                  label={message('checkout.building')}
                  required={isEditing}
                  error={isEditing ? fieldState.error?.message : undefined}
                >
                  <Input
                    {...field}
                    id="account-building"
                    readOnly={!isEditing}
                    aria-invalid={isEditing && fieldState.invalid}
                    className={readOnlyClass}
                  />
                </AccountField>
              )}
            />

            <div className="sm:col-span-2">
              <Controller
                name="street"
                control={control}
                rules={{
                  validate: (value) => value.trim().length > 0 || message('checkout.errors.street'),
                }}
                render={({ field, fieldState }) => (
                  <AccountField
                    id="account-street"
                    label={message('checkout.street')}
                    required={isEditing}
                    error={isEditing ? fieldState.error?.message : undefined}
                  >
                    <Input
                      {...field}
                      id="account-street"
                      readOnly={!isEditing}
                      aria-invalid={isEditing && fieldState.invalid}
                      aria-describedby={errors.street ? 'account-street-error' : undefined}
                      className={readOnlyClass}
                    />
                  </AccountField>
                )}
              />
            </div>

            <div className="sm:col-span-2">
              <Controller
                name="landmark"
                control={control}
                render={({ field }) => (
                  <AccountField id="account-landmark" label={optionalLabel(message('checkout.landmark'))}>
                    <Input {...field} id="account-landmark" readOnly={!isEditing} className={readOnlyClass} />
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
