import { useRef, useState, type ChangeEvent } from 'react'
import { Camera, LogOut, Sparkles, Trash2 } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useIntl } from 'react-intl'
import { toast } from 'sonner'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import type { Locale } from '@/i18n/locales'
import type { AccountProfile } from '../types'
import { readProfilePhoto } from '../utils/photo'
import { getAccountDisplayName, getAccountInitials } from '../utils/profile'

type AccountHeroProps = {
  profile: AccountProfile
  locale: Locale
  isSavingPhoto: boolean
  onSavePhoto: (avatarUrl: string | null) => void
  onLogout: () => void
}

export const AccountHero = ({ profile, locale, isSavingPhoto, onSavePhoto, onLogout }: AccountHeroProps) => {
  const intl = useIntl()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isReading, setIsReading] = useState(false)

  const message = (id: string) => intl.formatMessage({ id })
  const displayName = getAccountDisplayName(profile, locale)
  const initials = getAccountInitials(displayName, locale)
  const busy = isSavingPhoto || isReading

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return

    setIsReading(true)
    const result = await readProfilePhoto(file)
    setIsReading(false)

    if ('error' in result) {
      toast.error(message(result.error === 'tooLarge' ? 'account.photoTooLarge' : 'account.photoInvalid'))
      return
    }

    onSavePhoto(result.dataUrl)
  }

  return (
    <motion.header
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="mb-8 overflow-hidden rounded-3xl border border-primary-200/70 bg-linear-to-br from-primary-100/90 via-primary-50/80 to-card p-6 shadow-sm sm:p-8"
    >
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col items-center text-center gap-4 sm:flex-row sm:text-start sm:gap-6">
          <div className="relative shrink-0">
            <div className="relative size-20 sm:size-24 rounded-full p-1 ring-2 ring-primary-300/60 bg-card shadow-sm">
              <Avatar className="size-full">
                {profile.avatarUrl ? (
                  <AvatarImage src={profile.avatarUrl} alt={displayName} className="object-cover" />
                ) : null}
                <AvatarFallback className="bg-linear-to-br from-primary-200 via-primary-300 to-secondary-200 text-2xl font-bold tracking-tight text-secondary-900 sm:text-3xl">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="sr-only"
              onChange={handleFileChange}
            />

            <motion.button
              type="button"
              disabled={busy}
              whileHover={{ scale: busy ? 1 : 1.1 }}
              whileTap={{ scale: busy ? 1 : 0.92 }}
              onClick={() => fileInputRef.current?.click()}
              className="absolute end-0 bottom-0 z-10 flex size-8 cursor-pointer items-center justify-center rounded-full bg-secondary text-white shadow-md ring-2 ring-card transition-colors hover:bg-secondary-600 disabled:opacity-60"
              aria-label={message('account.changePhoto')}
            >
              <Camera className="size-3.5" />
            </motion.button>
          </div>

          <div className="flex flex-col items-center sm:items-start">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-secondary/10 px-2.5 py-0.5 text-xs font-semibold tracking-wide text-secondary uppercase">
              <Sparkles className="size-3" />
              <span>{message('account.glowMember')}</span>
            </div>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground md:text-3xl">
              {displayName}
            </h1>
            <p className="mt-1 text-sm text-tertiary">
              {intl.formatMessage(
                { id: 'account.memberSince' },
                {
                  date: intl.formatDate(profile.memberSince, {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  }),
                },
              )}
            </p>
            <AnimatePresence>
              {profile.avatarUrl ? (
                <motion.button
                  type="button"
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  disabled={busy}
                  onClick={() => onSavePhoto(null)}
                  className="mt-2.5 inline-flex cursor-pointer items-center gap-1.5 text-xs font-medium text-tertiary transition-colors hover:text-destructive disabled:opacity-60"
                >
                  <Trash2 className="size-3.5" />
                  {message('account.removePhoto')}
                </motion.button>
              ) : null}
            </AnimatePresence>
          </div>
        </div>

        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="self-stretch sm:self-center">
          <Button
            type="button"
            variant="outline"
            onClick={onLogout}
            className="h-10 w-full sm:w-auto rounded-xl border-destructive/20 text-destructive hover:bg-destructive/10 hover:text-destructive shadow-2xs"
          >
            <LogOut className="size-4" />
            {message('account.logout')}
          </Button>
        </motion.div>
      </div>
    </motion.header>
  )
}
