import { ChevronRight, LogOut, Package, Sparkles, UserCheck } from 'lucide-react'
import { motion } from 'motion/react'
import { useIntl } from 'react-intl'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { getAccountDisplayName, getAccountInitials, MOCK_PROFILE, useAccount } from '@/features/account'
import { useLogout } from '@/features/auth'
import { DEFAULT_LOCALE, isLocale, type Locale } from '@/i18n/locales'
import { getLocalizedPath } from '@/i18n/navigation'
import { cn } from '@/lib/utils'

export const ProfileMenu = () => {
  const intl = useIntl()
  const locale: Locale = isLocale(intl.locale) ? intl.locale : DEFAULT_LOCALE
  const { data: profile } = useAccount()
  const logout = useLogout()
  const accountPath = getLocalizedPath('/account', locale)
  const ordersPath = getLocalizedPath('/orders', locale)
  const memberProfile = profile ?? MOCK_PROFILE
  const memberName = getAccountDisplayName(memberProfile, locale)
  const initials = getAccountInitials(memberName, locale)

  const handleLogout = () => {
    toast.warning(intl.formatMessage({ id: 'nav.logoutConfirmTitle' }), {
      description: intl.formatMessage({ id: 'nav.logoutConfirmDescription' }),
      duration: 6000,
      action: {
        label: intl.formatMessage({ id: 'nav.logoutConfirmAction' }),
        onClick: () => {
          logout.mutate(undefined, {
            onSuccess: () => {
              toast.success(intl.formatMessage({ id: 'nav.logoutSuccess' }))
            },
          })
        },
      },
    })
  }

  return (
    <DropdownMenu>
      <motion.span className="inline-flex" whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.94 }}>
        <DropdownMenuTrigger
          render={
            <Button
              variant="ghost"
              size="icon"
              className="size-9 rounded-full text-secondary ring-1 ring-primary-300/60 hover:bg-primary/70 hover:ring-secondary/40 transition-all shadow-xs"
              aria-label={intl.formatMessage({ id: 'nav.profile' })}
            />
          }
        >
          <Avatar className="size-full">
            {memberProfile.avatarUrl ? (
              <AvatarImage src={memberProfile.avatarUrl} alt={memberName} />
            ) : null}
            <AvatarFallback className="bg-linear-to-br from-primary-200 to-primary-300 text-xs font-semibold text-secondary-900 ring-1 ring-white/80">
              {initials}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
      </motion.span>

      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className={cn(
          "w-64 rounded-2xl border border-primary-200/80 bg-card/95 p-1.5 backdrop-blur-xl shadow-xl ring-1 ring-black/5"
        )}
      >
        {/* User Card Header */}
        <div className="flex items-center gap-3 rounded-xl bg-gradient-to-br from-primary-100/70 via-primary-50/50 to-neutral/80 p-3 mb-1 border border-primary-200/50">
          <Avatar className="size-9 shrink-0 ring-2 ring-card shadow-xs">
            {memberProfile.avatarUrl ? (
              <AvatarImage src={memberProfile.avatarUrl} alt={memberName} />
            ) : null}
            <AvatarFallback className="bg-primary text-xs font-bold text-secondary-900">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col min-w-0 flex-1">
            <div className="flex items-center gap-1">
              <span className="text-xs font-bold text-foreground truncate">
                {memberName}
              </span>
              <Sparkles className="size-3 text-secondary shrink-0" />
            </div>
            <span className="text-[11px] text-tertiary truncate">
              {intl.formatMessage({ id: 'nav.profileGuest' })}
            </span>
          </div>
        </div>

        {/* Menu Navigation Items */}
        <DropdownMenuGroup className="space-y-0.5">
          <DropdownMenuItem
            render={<Link to={accountPath} viewTransition={true} />}
            className="group/item flex items-center justify-between rounded-xl px-2.5 py-2 text-xs font-medium text-foreground transition-all hover:bg-primary-50/80 active:bg-primary-100/70 cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <div className="flex size-7 items-center justify-center rounded-lg bg-primary-100/80 text-secondary-800 transition-colors group-hover/item:bg-secondary group-hover/item:text-white">
                <UserCheck className="size-3.5" />
              </div>
              <span>{intl.formatMessage({ id: 'nav.account' })}</span>
            </div>
            <ChevronRight className="size-3.5 text-tertiary/40 transition-transform group-hover/item:translate-x-0.5 rtl:group-hover/item:-translate-x-0.5 group-hover/item:text-secondary" />
          </DropdownMenuItem>

          <DropdownMenuItem
            render={<Link to={ordersPath} viewTransition={true} />}
            className="group/item flex items-center justify-between rounded-xl px-2.5 py-2 text-xs font-medium text-foreground transition-all hover:bg-primary-50/80 active:bg-primary-100/70 cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <div className="flex size-7 items-center justify-center rounded-lg bg-primary-100/80 text-secondary-800 transition-colors group-hover/item:bg-secondary group-hover/item:text-white">
                <Package className="size-3.5" />
              </div>
              <span>{intl.formatMessage({ id: 'nav.orders' })}</span>
            </div>
            <ChevronRight className="size-3.5 text-tertiary/40 transition-transform group-hover/item:translate-x-0.5 rtl:group-hover/item:-translate-x-0.5 group-hover/item:text-secondary" />
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator className="my-1.5 bg-primary-200/50" />

        {/* Logout Action Button */}
        <DropdownMenuItem
          onClick={handleLogout}
          className="group/logout flex items-center justify-between rounded-xl px-2.5 py-2 text-xs font-medium text-rose-600 transition-all hover:bg-rose-50/80 hover:text-rose-600 active:bg-rose-100/70 cursor-pointer focus:bg-rose-50/80 focus:text-rose-600 focus:**:text-rose-600"
        >
          <div className="flex items-center gap-2.5">
            <div className="flex size-7 items-center justify-center rounded-lg bg-rose-100/70 text-rose-600 transition-colors group-hover/logout:bg-rose-600 group-hover/logout:!text-white">
              <LogOut className="size-3.5" />
            </div>
            <span className="!text-rose-600">{intl.formatMessage({ id: 'nav.logout' })}</span>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
