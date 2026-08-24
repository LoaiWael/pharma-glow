import { useIntl } from 'react-intl'
import { toast } from 'sonner'
import { DEFAULT_LOCALE, isLocale, type Locale } from '@/i18n/locales'
import { useAccount, useUpdateAccount } from '../api/use-account'
import { AccountAddressForm } from './AccountAddressForm'
import { AccountHero } from './AccountHero'
import { AccountPersonalForm } from './AccountPersonalForm'
import { AccountShortcuts } from './AccountShortcuts'

export const AccountView = () => {
  const intl = useIntl()
  const locale: Locale = isLocale(intl.locale) ? intl.locale : DEFAULT_LOCALE
  const { data: profile, isLoading } = useAccount()
  const updateAccount = useUpdateAccount()

  const handleLogout = () => {
    toast.warning(intl.formatMessage({ id: 'nav.logoutConfirmTitle' }), {
      description: intl.formatMessage({ id: 'nav.logoutConfirmDescription' }),
      duration: 6000,
      action: {
        label: intl.formatMessage({ id: 'nav.logoutConfirmAction' }),
        onClick: () => {
          toast.success(intl.formatMessage({ id: 'nav.logoutSuccess' }))
        },
      },
    })
  }

  const handleSavePhoto = (avatarUrl: string | null) => {
    if (!profile) return

    updateAccount.mutate(
      { ...profile, avatarUrl },
      {
        onSuccess: () => {
          toast.success(intl.formatMessage({ id: avatarUrl ? 'account.photoSuccess' : 'account.photoRemoved' }))
        },
        onError: () => toast.error(intl.formatMessage({ id: 'account.saveError' })),
      },
    )
  }

  if (isLoading || !profile) {
    return (
      <section className="py-8 md:py-12">
        <div className="h-28 animate-pulse rounded-2xl bg-primary-100/70" />
        <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(18rem,0.8fr)]">
          <div className="h-80 animate-pulse rounded-2xl bg-primary-50" />
          <div className="h-48 animate-pulse rounded-2xl bg-primary-50" />
        </div>
      </section>
    )
  }

  return (
    <section className="py-8 md:py-12">
      <AccountHero
        profile={profile}
        locale={locale}
        isSavingPhoto={updateAccount.isPending}
        onSavePhoto={handleSavePhoto}
        onLogout={handleLogout}
      />

      <div className="mb-6">
        <AccountShortcuts />
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
        <AccountPersonalForm profile={profile} locale={locale} />
        <AccountAddressForm profile={profile} locale={locale} />
      </div>
    </section>
  )
}
