import { type FormEvent, useState } from "react";
import { Heart, Search, ShoppingBag } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useIntl } from "react-intl";
import { Link } from "react-router-dom";
import { ProfileMenu } from "@/components/ProfileMenu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import { DEFAULT_LOCALE, isLocale, type Locale } from "@/i18n/locales";
import { getLocalizedPath } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

const iconClassName =
  "inline-flex size-9 items-center justify-center rounded-lg text-secondary hover:bg-primary/70 hover:text-secondary";

export const NavSearch = () => {
  const intl = useIntl();
  const [searchOpen, setSearchOpen] = useState(false);
  const [panelVisible, setPanelVisible] = useState(false);
  const [query, setQuery] = useState("");

  const handleOpenChange = (open: boolean) => {
    if (open) {
      setSearchOpen(true);
      setPanelVisible(true);
      return;
    }
    setPanelVisible(false);
  };

  const handleExitComplete = () => {
    setSearchOpen(false);
    setQuery("");
  };

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPanelVisible(false);
  };

  return (
    <Popover open={searchOpen} onOpenChange={handleOpenChange}>
      <PopoverTrigger
        render={
          <motion.button
            type="button"
            className={iconClassName}
            aria-label={intl.formatMessage({ id: "nav.search" })}
            aria-expanded={searchOpen}
            aria-haspopup="dialog"
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
          />
        }
      >
        <Search className="size-5" aria-hidden="true" />
      </PopoverTrigger>

      <PopoverContent
        side="bottom"
        align="start"
        sideOffset={8}
        className={cn(
          "w-[min(22rem,calc(100vw-1.5rem))] gap-0 border-0 bg-transparent p-0 shadow-none ring-0",
          "duration-0 data-open:animate-none data-closed:animate-none",
        )}
      >
        <AnimatePresence onExitComplete={handleExitComplete}>
          {panelVisible ? (
            <motion.div
              key="search-popover-panel"
              className="flex flex-col rounded-lg border border-primary-200 bg-card p-3 text-card-foreground shadow-md"
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.98 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
            >
              <PopoverHeader>
                <PopoverTitle className="text-secondary">
                  {intl.formatMessage({ id: "nav.searchTitle" })}
                </PopoverTitle>
                <PopoverDescription className="text-tertiary">
                  {intl.formatMessage({ id: "nav.searchEmpty" })}
                </PopoverDescription>
              </PopoverHeader>
              <form
                className="mt-3 flex flex-col gap-3"
                role="search"
                onSubmit={handleSearch}
              >
                <Input
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder={intl.formatMessage({
                    id: "nav.searchPlaceholder",
                  })}
                  className="h-11 bg-neutral text-foreground"
                  autoFocus
                />
                <motion.div
                  className="flex justify-end"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button type="submit" variant="secondary">
                    {intl.formatMessage({ id: "nav.searchSubmit" })}
                  </Button>
                </motion.div>
              </form>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </PopoverContent>
    </Popover>
  );
};

export const NavActions = () => {
  const intl = useIntl();
  // const { pathname } = useLocation();
  const locale: Locale = isLocale(intl.locale) ? intl.locale : DEFAULT_LOCALE;
  // const nextLocale: Locale = locale === "en" ? "ar" : "en";
  // const switchedPath = getLocalizedPath(pathname, nextLocale);

  return (
    <>
      {/* <Link
        to={switchedPath}
        aria-label={nextLocale === 'en' ? 'Switch to English' : 'التبديل إلى العربية'}
        viewTransition={true}
      >
        <motion.span
          className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg px-2.5 text-xs font-medium text-secondary hover:bg-primary/70 hover:text-secondary"
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
        >
          <Globe className="size-4" aria-hidden="true" />
          <FormattedMessage id="nav.language" />
        </motion.span>
      </Link> */}

      <Link
        to={getLocalizedPath("/wishlist", locale)}
        aria-label={intl.formatMessage({ id: "nav.wishlist" })}
        viewTransition={true}
        className="hidden md:inline-flex"
      >
        <motion.span
          className={iconClassName}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
        >
          <Heart className="size-5" aria-hidden="true" />
        </motion.span>
      </Link>

      <Link
        to={getLocalizedPath("/cart", locale)}
        aria-label={intl.formatMessage({ id: "nav.cart" })}
        viewTransition={true}
        className="hidden md:inline-flex"
      >
        <motion.span
          className={iconClassName}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
        >
          <ShoppingBag className="size-5" aria-hidden="true" />
        </motion.span>
      </Link>

      <ProfileMenu />
    </>
  );
};
