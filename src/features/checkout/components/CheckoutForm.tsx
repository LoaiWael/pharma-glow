import { useEffect, useMemo } from 'react'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { Banknote, MapPin, UserRound } from 'lucide-react'
import { motion } from 'motion/react'
import { useIntl } from 'react-intl'
import { Input } from '@/components/ui/input'
import { buttonVariants } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { DEFAULT_LOCALE, isLocale, type Locale } from '@/i18n/locales'
import { cn } from '@/lib/utils'
import { EGYPT_GOVERNORATES } from '../data/egypt-governorates'
import type { CheckoutFormValues, PlaceOrderPayload } from '../types'
import { emptyCheckoutForm, EGYPT_MOBILE_PATTERN, NAME_PATTERN } from '../utils/validate-checkout'
import { CheckoutField, checkoutControlClassName } from './CheckoutField'

export const CHECKOUT_FORM_ID = 'checkout-form'

type CheckoutPlaceOrderButtonProps = {
  isSubmitting: boolean
  isValid: boolean
  form?: string
  className?: string
}

export const CheckoutPlaceOrderButton = ({
  isSubmitting,
  isValid,
  form,
  className,
}: CheckoutPlaceOrderButtonProps) => {
  const intl = useIntl()
  const disabled = isSubmitting || !isValid

  return (
    <motion.button
      type="submit"
      form={form}
      disabled={disabled}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      className={cn(
        buttonVariants({ variant: 'secondary', size: 'lg' }),
        'h-12 w-full rounded-xl text-base font-medium shadow-sm',
        className,
      )}
    >
      {isSubmitting
        ? intl.formatMessage({ id: 'checkout.placingOrder', defaultMessage: 'Placing order…' })
        : intl.formatMessage({ id: 'checkout.placeOrder', defaultMessage: 'Place order' })}
    </motion.button>
  )
}

type CheckoutFormProps = {
  isAuthenticated: boolean
  defaultContact: { fullName: string; phone: string }
  onSubmit: (payload: Omit<PlaceOrderPayload, 'items'>) => void
  onValidityChange: (isValid: boolean) => void
}

const digitsOnly = (value: string) => value.replace(/\D/g, '')

export const CheckoutForm = ({
  isAuthenticated,
  defaultContact,
  onSubmit,
  onValidityChange,
}: CheckoutFormProps) => {
  const intl = useIntl()
  const locale: Locale = isLocale(intl.locale) ? intl.locale : DEFAULT_LOCALE

  const message = (id: string, defaultMessage?: string) =>
    intl.formatMessage({ id, defaultMessage })

  const requiredMessage = message('checkout.errors.required', 'This field is required.')
  const requiredRule = {
    validate: (value: string) => value.trim().length > 0 || requiredMessage,
  }

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormValues>({
    mode: 'onTouched',
    reValidateMode: 'onChange',
    defaultValues: emptyCheckoutForm({
      fullName: defaultContact.fullName,
      phone: defaultContact.phone,
    }),
  })

  const values = useWatch({ control })

  const isFormComplete =
    (isAuthenticated ||
      (NAME_PATTERN.test((values.fullName ?? '').trim()) &&
        EGYPT_MOBILE_PATTERN.test(digitsOnly(values.phone ?? '')))) &&
    EGYPT_GOVERNORATES.some((governorate) => governorate.id === values.governorateId) &&
    (values.city ?? '').trim().length > 0 &&
    (values.street ?? '').trim().length > 0 &&
    (values.building ?? '').trim().length > 0

  useEffect(() => {
    onValidityChange(isFormComplete)
  }, [isFormComplete, onValidityChange])

  const governorates = useMemo(
    () =>
      [...EGYPT_GOVERNORATES].sort((a, b) =>
        locale === 'ar' ? a.nameAr.localeCompare(b.nameAr, 'ar') : a.nameEn.localeCompare(b.nameEn, 'en'),
      ),
    [locale],
  )

  const submitOrder = handleSubmit((data) => {
    onSubmit({
      contact: {
        fullName: isAuthenticated ? defaultContact.fullName : data.fullName.trim(),
        phone: isAuthenticated ? defaultContact.phone : digitsOnly(data.phone),
      },
      address: {
        country: 'EG',
        governorateId: data.governorateId,
        city: data.city.trim(),
        street: data.street.trim(),
        building: data.building.trim(),
        landmark: data.landmark.trim(),
      },
      notes: data.notes.trim(),
      paymentMethod: 'cash_on_delivery',
    })
  })

  const optionalLabel = (label: string) =>
    `${label} (${message('checkout.optional', 'optional')})`

  return (
    <form id={CHECKOUT_FORM_ID} onSubmit={submitOrder} className="space-y-6" noValidate>
      <section className="rounded-2xl border border-border/60 bg-card p-5 shadow-xs sm:p-6 space-y-4">
        <div className="flex items-start gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/40 text-secondary">
            <UserRound className="size-5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              {message('checkout.contactTitle', 'Contact details')}
            </h2>
            <p className="mt-0.5 text-sm text-tertiary">
              {isAuthenticated
                ? message('checkout.contactHintAuth', 'We will use the details saved on your account.')
                : message('checkout.contactHintGuest', 'Enter your name and Egyptian mobile number.')}
            </p>
          </div>
        </div>

        {isAuthenticated ? (
          <div className="rounded-xl bg-neutral px-4 py-3 text-sm">
            <p className="font-medium text-foreground">{defaultContact.fullName}</p>
            <p className="mt-0.5 text-tertiary" dir="ltr">
              {defaultContact.phone}
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
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
                <CheckoutField
                  id="checkout-full-name"
                  label={message('checkout.fullName', 'Full name')}
                  required
                  error={fieldState.error?.message}
                >
                  <Input
                    {...field}
                    id="checkout-full-name"
                    autoComplete="name"
                    placeholder={message('checkout.fullNamePlaceholder', 'e.g. Sara Ahmed')}
                    aria-invalid={fieldState.invalid}
                    aria-describedby={errors.fullName ? 'checkout-full-name-error' : undefined}
                    className="h-10 px-3"
                  />
                </CheckoutField>
              )}
            />

            <Controller
              name="phone"
              control={control}
              rules={{
                validate: (value) => {
                  const phone = digitsOnly(value)
                  if (!phone) return requiredMessage
                  if (!EGYPT_MOBILE_PATTERN.test(phone)) {
                    return message(
                      'checkout.errors.phone',
                      'Enter an 11-digit number starting with 010, 011, 012, or 015.',
                    )
                  }
                  return true
                },
              }}
              render={({ field, fieldState }) => (
                <CheckoutField
                  id="checkout-phone"
                  label={message('checkout.phone', 'Mobile number')}
                  required
                  error={fieldState.error?.message}
                >
                  <Input
                    {...field}
                    id="checkout-phone"
                    type="tel"
                    inputMode="numeric"
                    autoComplete="tel"
                    dir="ltr"
                    maxLength={11}
                    value={field.value}
                    onChange={(event) => field.onChange(digitsOnly(event.target.value).slice(0, 11))}
                    placeholder={message('checkout.phonePlaceholder', '01xxxxxxxxx')}
                    aria-invalid={fieldState.invalid}
                    aria-describedby={errors.phone ? 'checkout-phone-error' : undefined}
                    className="h-10 px-3"
                  />
                </CheckoutField>
              )}
            />
          </div>
        )}
      </section>

      <section className="rounded-2xl border border-border/60 bg-card p-5 shadow-xs sm:p-6 space-y-4">
        <div className="flex items-start gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/40 text-secondary">
            <MapPin className="size-5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              {message('checkout.addressTitle', 'Delivery address')}
            </h2>
            <p className="mt-0.5 text-sm text-tertiary">
              {message('checkout.egyptOnly', 'Delivery is available within Egypt only.')}
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <CheckoutField id="checkout-country" label={message('checkout.country', 'Country')} required>
            <Input
              id="checkout-country"
              value={message('checkout.countryValue', 'Egypt')}
              readOnly
              disabled
              className="h-10 px-3"
            />
          </CheckoutField>

          <Controller
            name="governorateId"
            control={control}
            rules={{
              validate: (value) =>
                EGYPT_GOVERNORATES.some((governorate) => governorate.id === value) ||
                message('checkout.errors.governorate'),
            }}
            render={({ field, fieldState }) => (
              <CheckoutField
                id="checkout-governorate"
                label={message('checkout.governorate', 'Governorate')}
                required
                error={fieldState.error?.message}
              >
                <Select
                  value={field.value || null}
                  onValueChange={(value) => field.onChange(typeof value === 'string' ? value : '')}
                >
                  <SelectTrigger
                    id="checkout-governorate"
                    aria-invalid={fieldState.invalid}
                    aria-describedby={errors.governorateId ? 'checkout-governorate-error' : undefined}
                    className="h-10 w-full px-3"
                  >
                    <SelectValue
                      placeholder={message('checkout.governoratePlaceholder', 'Select a governorate')}
                    />
                  </SelectTrigger>
                  <SelectContent alignItemWithTrigger={false} align="start" className="max-h-60">
                    {governorates.map((governorate) => (
                      <SelectItem key={governorate.id} value={governorate.id}>
                        {governorate.nameEn}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CheckoutField>
            )}
          />

          <Controller
            name="city"
            control={control}
            rules={requiredRule}
            render={({ field, fieldState }) => (
              <CheckoutField
                id="checkout-city"
                label={message('checkout.city', 'City / area')}
                required
                error={fieldState.error?.message}
              >
                <Input
                  {...field}
                  id="checkout-city"
                  autoComplete="address-level2"
                  placeholder={message('checkout.cityPlaceholder', 'e.g. Nasr City')}
                  aria-invalid={fieldState.invalid}
                  aria-describedby={errors.city ? 'checkout-city-error' : undefined}
                  className="h-10 px-3"
                />
              </CheckoutField>
            )}
          />

          <Controller
            name="building"
            control={control}
            rules={{
              validate: (value) =>
                value.trim().length > 0 || message('checkout.errors.building'),
            }}
            render={({ field, fieldState }) => (
              <CheckoutField
                id="checkout-building"
                label={message('checkout.building', 'Building / apartment')}
                required
                error={fieldState.error?.message}
              >
                <Input
                  {...field}
                  id="checkout-building"
                  placeholder={message('checkout.buildingPlaceholder', 'Building 12, apt 4')}
                  aria-invalid={fieldState.invalid}
                  aria-describedby={errors.building ? 'checkout-building-error' : undefined}
                  className="h-10 px-3"
                />
              </CheckoutField>
            )}
          />

          <div className="sm:col-span-2">
            <Controller
              name="street"
              control={control}
              rules={{
                validate: (value) =>
                  value.trim().length > 0 || message('checkout.errors.street'),
              }}
              render={({ field, fieldState }) => (
                <CheckoutField
                  id="checkout-street"
                  label={message('checkout.street', 'Street address')}
                  required
                  error={fieldState.error?.message}
                >
                  <Input
                    {...field}
                    id="checkout-street"
                    autoComplete="street-address"
                    placeholder={message('checkout.streetPlaceholder', 'Street name and number')}
                    aria-invalid={fieldState.invalid}
                    aria-describedby={errors.street ? 'checkout-street-error' : undefined}
                    className="h-10 px-3"
                  />
                </CheckoutField>
              )}
            />
          </div>

          <Controller
            name="landmark"
            control={control}
            render={({ field }) => (
              <CheckoutField
                id="checkout-landmark"
                label={optionalLabel(message('checkout.landmark', 'Landmark'))}
              >
                <Input
                  {...field}
                  id="checkout-landmark"
                  placeholder={message('checkout.landmarkPlaceholder', 'Next to a pharmacy or mosque')}
                  className="h-10 px-3"
                />
              </CheckoutField>
            )}
          />

          <div className="sm:col-span-2">
            <Controller
              name="notes"
              control={control}
              render={({ field }) => (
                <CheckoutField
                  id="checkout-notes"
                  label={optionalLabel(message('checkout.notes', 'Order notes'))}
                >
                  <textarea
                    {...field}
                    id="checkout-notes"
                    rows={3}
                    placeholder={message('checkout.notesPlaceholder', 'Delivery instructions (optional)')}
                    className={cn(checkoutControlClassName(), 'h-auto min-h-20 resize-y')}
                  />
                </CheckoutField>
              )}
            />
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-border/60 bg-card p-5 shadow-xs sm:p-6 space-y-4">
        <div className="flex items-start gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/40 text-secondary">
            <Banknote className="size-5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              {message('checkout.paymentTitle', 'Payment')}
            </h2>
            <p className="mt-0.5 text-sm text-tertiary">
              {message('checkout.paymentCodHint', 'Pay in cash when your order arrives.')}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 rounded-xl border border-secondary/30 bg-primary/20 px-4 py-3">
          <input
            type="radio"
            id="checkout-cod"
            name="paymentMethod"
            checked
            onChange={() => undefined}
            className="mt-1 accent-(--color-secondary)"
          />
          <label htmlFor="checkout-cod" className="space-y-0.5">
            <span className="block text-sm font-semibold text-foreground">
              {message('checkout.paymentCod', 'Cash on delivery')}
            </span>
            <span className="block text-xs text-tertiary">
              {message('checkout.codOnly', 'This is currently the only available payment method.')}
            </span>
          </label>
        </div>
      </section>
    </form>
  )
}
