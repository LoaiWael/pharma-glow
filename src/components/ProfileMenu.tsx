import { BadgeCheckIcon, LogOutIcon, PackageIcon } from 'lucide-react'
import { motion } from 'motion/react'
import { useIntl } from 'react-intl'
import { Link } from 'react-router-dom'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { DEFAULT_LOCALE, isLocale, type Locale } from '@/i18n/locales'
import { getLocalizedPath } from '@/i18n/navigation'

export const ProfileMenu = () => {
  const intl = useIntl()
  const locale: Locale = isLocale(intl.locale) ? intl.locale : DEFAULT_LOCALE
  const accountPath = getLocalizedPath('/account', locale)
  const ordersPath = getLocalizedPath('/orders', locale)
  const initials = locale === 'ar' ? 'فج' : 'PG'

  return (
    <DropdownMenu>
      <motion.span className="inline-flex" whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.94 }}>
        <DropdownMenuTrigger
          render={
            <Button
              variant="ghost"
              size="icon"
              className="size-9 rounded-full text-secondary hover:bg-primary/70"
              aria-label={intl.formatMessage({ id: 'nav.profile' })}
            />
          }
        >
          <Avatar size="sm">
            <AvatarFallback className="bg-primary text-xs font-medium text-secondary">
              {initials}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
      </motion.span>
      <DropdownMenuContent align="end" className="min-w-52 w-52">
        <DropdownMenuGroup>
          <DropdownMenuItem render={<Link to={accountPath} />}>
            <BadgeCheckIcon />
            {intl.formatMessage({ id: 'nav.account' })}
          </DropdownMenuItem>
          <DropdownMenuItem render={<Link to={ordersPath} />}>
            <PackageIcon />
            {intl.formatMessage({ id: 'nav.orders' })}
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <LogOutIcon />
          {intl.formatMessage({ id: 'nav.logout' })}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
