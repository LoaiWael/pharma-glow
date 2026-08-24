import { useState } from "react";
import { NavLink } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import { useIntl } from "react-intl";
import {
  Compass,
  Home,
  ShoppingBag,
  Tag,
  Sparkles,
  Heart,
  Star,
  HelpCircle,
  X,
} from "lucide-react";
import logo from "@/assets/logo.webp";
import { DEFAULT_LOCALE, isLocale, type Locale } from "@/i18n/locales";
import { getLocalizedPath } from "@/i18n/navigation";
import { NavActions, NavSearch } from "@/layout/NavActions";
import { cn } from "@/lib/utils";

export interface NavItemConfig {
  label: string;
  href: string;
  ariaLabel: string;
  icon: React.ReactNode;
}

export const DesktopHeader = () => {
  const intl = useIntl();
  const locale: Locale = isLocale(intl.locale) ? intl.locale : DEFAULT_LOCALE;
  const brandName = intl.formatMessage({ id: "brand.name" });
  const [isSubBarOpen, setIsSubBarOpen] = useState(false);

  // Primary navigation items (Home, Products, Offers, Skincare, Bodycare)
  const primaryNavItems: NavItemConfig[] = [
    {
      label: intl.formatMessage({ id: "nav.home" }),
      href: getLocalizedPath("/", locale),
      ariaLabel: intl.formatMessage({ id: "nav.home" }),
      icon: <Home className="size-4 shrink-0" />,
    },
    {
      label: intl.formatMessage({ id: "nav.products" }),
      href: getLocalizedPath("/products", locale),
      ariaLabel: intl.formatMessage({ id: "nav.products" }),
      icon: <ShoppingBag className="size-4 shrink-0" />,
    },
    {
      label: intl.formatMessage({ id: "category.skincare.title" }),
      href: getLocalizedPath("/skincare", locale),
      ariaLabel: intl.formatMessage({ id: "category.skincare.title" }),
      icon: <Sparkles className="size-4 shrink-0" />,
    },
    {
      label: intl.formatMessage({ id: "category.bodycare.title" }),
      href: getLocalizedPath("/bodycare", locale),
      ariaLabel: intl.formatMessage({ id: "category.bodycare.title" }),
      icon: <Heart className="size-4 shrink-0" />,
    },
    {
      label: intl.formatMessage({ id: "nav.offers" }),
      href: getLocalizedPath("/offers", locale),
      ariaLabel: intl.formatMessage({ id: "nav.offers" }),
      icon: <Tag className="size-4 shrink-0" />,
    },
  ];

  // Secondary sub-bar navigation items (Explore/Info links from CardNav)
  const secondaryNavItems: NavItemConfig[] = [
    {
      label: intl.formatMessage({ id: "nav.reviews" }),
      href: getLocalizedPath("/reviews", locale),
      ariaLabel: intl.formatMessage({ id: "nav.reviews" }),
      icon: <Star className="size-3.5 shrink-0" />,
    },
    {
      label: intl.formatMessage({ id: "nav.howToOrder" }),
      href: getLocalizedPath("/how-to-order", locale),
      ariaLabel: intl.formatMessage({ id: "nav.howToOrder" }),
      icon: <HelpCircle className="size-3.5 shrink-0" />,
    },
  ];

  return (
    <div className="relative w-full">
      {/* Main Bar */}
      <div className="relative z-20 w-full rounded-none border-b border-primary-200 bg-card/95 shadow-md backdrop-blur-md">
        <div className="flex h-16 w-full items-center justify-between px-4 lg:px-8">
          {/* Start: Brand Logo + Search */}
          <div className="flex shrink-0 items-center gap-4 lg:gap-6">
            <NavLink
              to={getLocalizedPath("/", locale)}
              className="flex items-center gap-3 no-underline group"
              aria-label={brandName}
              viewTransition={true}
            >
              <motion.img
                src={logo}
                alt=""
                className="h-10 w-10 rounded-full border-2 border-secondary/30 ring-2 ring-primary/50 object-cover shrink-0 p-0 shadow-xs"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              />
              <span className="text-base font-semibold tracking-tight text-secondary transition-colors group-hover:text-secondary-700">
                {brandName}
              </span>
            </NavLink>

            <div className="h-5 w-px bg-primary-200" aria-hidden="true" />

            <NavSearch />
          </div>

          {/* Center: Main Primary Page Links */}
          <nav
            className="flex flex-1 items-center justify-center gap-1.5 lg:gap-2 px-4"
            aria-label="Main Navigation"
          >
            {primaryNavItems.map((item) => (
              <NavLink
                key={item.href}
                to={item.href}
                end={item.href === getLocalizedPath("/", locale)}
                viewTransition={true}
                className={({ isActive }) =>
                  cn(
                    "relative inline-flex items-center gap-2 rounded-none px-3.5 py-2 text-sm font-medium transition-all duration-200",
                    isActive
                      ? "text-secondary font-semibold"
                      : "text-tertiary hover:text-secondary hover:bg-primary-50/70",
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <span
                      className={cn(
                        "transition-transform duration-200",
                        isActive
                          ? "text-secondary scale-110"
                          : "text-tertiary group-hover:text-secondary",
                      )}
                    >
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                    {isActive && (
                      <motion.div
                        layoutId="desktop-nav-active-pill"
                        className="absolute inset-x-1 -bottom-[1px] h-0.5 bg-secondary"
                        transition={{
                          type: "spring",
                          stiffness: 380,
                          damping: 30,
                        }}
                      />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* End: Actions (Wishlist, Cart, Profile) */}
          <div className="flex shrink-0 items-center gap-1.5">
            <NavActions />
          </div>
        </div>
      </div>

      {/* Sub-bar Container with Seamless Integrated Toggle Arrow */}
      <div className="pointer-events-none absolute inset-x-0 top-full z-10 flex px-4 lg:px-8">
        <div className="pointer-events-auto ms-auto me-6 flex items-start">
          <div className="flex items-center overflow-hidden rounded-b-xl border-x border-b border-primary-200/80 bg-neutral/95 shadow-sm backdrop-blur-md">
            {/* Sliding Sub-bar Content */}
            <AnimatePresence initial={false}>
              {isSubBarOpen && (
                <motion.div
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: "auto", opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                  className="flex items-center gap-1 sm:gap-2 overflow-hidden py-1.5 ps-3 pe-1.5"
                >
                  {secondaryNavItems.map((subItem) => (
                    <NavLink
                      key={subItem.href}
                      to={subItem.href}
                      viewTransition={true}
                      className={({ isActive }) =>
                        cn(
                          "inline-flex items-center gap-1.5 whitespace-nowrap rounded-lg px-2.5 py-1 text-xs font-medium transition-colors",
                          isActive
                            ? "text-secondary bg-primary-100 font-semibold shadow-2xs"
                            : "text-tertiary hover:text-secondary hover:bg-primary-50",
                        )
                      }
                    >
                      {subItem.icon}
                      <span>{subItem.label}</span>
                    </NavLink>
                  ))}
                  <div className="h-4 w-px bg-primary-200/80 mx-0.5" aria-hidden="true" />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Integrated Toggle Button */}
            <motion.button
              type="button"
              onClick={() => setIsSubBarOpen((prev) => !prev)}
              aria-label={isSubBarOpen ? "Close extra navigation" : "Open extra navigation"}
              aria-expanded={isSubBarOpen}
              className={cn(
                "flex h-9 cursor-pointer items-center justify-center gap-1.5 px-3 text-secondary transition-colors hover:bg-primary-100/70",
                !isSubBarOpen && "text-xs font-medium py-1.5"
              )}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {!isSubBarOpen && (
                <span className="text-xs font-medium text-tertiary transition-colors group-hover:text-secondary">
                  {intl.formatMessage({ id: "nav.explore" })}
                </span>
              )}
              <motion.div
                key={isSubBarOpen ? "open" : "closed"}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="flex items-center justify-center"
              >
                {isSubBarOpen ? (
                  <X className="size-4 stroke-[2.25]" />
                ) : (
                  <Compass className="size-4 stroke-[2]" />
                )}
              </motion.div>
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
};
