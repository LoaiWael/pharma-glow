import { type FormEvent, useMemo, useRef, useState } from "react";
import { ArrowRight, Heart, Search, ShoppingBag, Sparkles, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useIntl } from "react-intl";
import { Link, useNavigate } from "react-router-dom";
import { ProfileMenu } from "@/components/ProfileMenu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { DEFAULT_LOCALE, isLocale, type Locale } from "@/i18n/locales";
import { getLocalizedPath } from "@/i18n/navigation";
import { useCart } from "@/features/cart";
import { useProducts } from "@/features/products";
import { useWishlist } from "@/features/wishlist";
import { cn } from "@/lib/utils";

const iconClassName =
  "inline-flex size-9 items-center justify-center rounded-lg text-secondary hover:bg-primary/70 hover:text-secondary";

export const NavSearch = () => {
  const intl = useIntl();
  const navigate = useNavigate();
  const locale: Locale = isLocale(intl.locale) ? intl.locale : DEFAULT_LOCALE;
  const isRtl = locale === "ar";
  const [searchOpen, setSearchOpen] = useState(false);
  const [panelVisible, setPanelVisible] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const { data: searchResults = [] } = useProducts({
    searchQuery: query.trim(),
  });

  const popularTags = useMemo(
    () => [
      { label: isRtl ? "سيروم الهيالورونيك" : "Hyaluronic Serum", query: isRtl ? "هيالورونيك" : "hyaluronic" },
      { label: isRtl ? "واقي شمس SPF50" : "Sunscreen SPF50", query: isRtl ? "واقي" : "sunscreen" },
      { label: isRtl ? "غسول رغوي" : "Foaming Cleanser", query: isRtl ? "غسول" : "cleanser" },
      { label: isRtl ? "مرطب غني" : "Rich Cream", query: isRtl ? "كريم" : "cream" },
    ],
    [isRtl]
  );

  const handleOpenChange = (open: boolean) => {
    if (open) {
      setSearchOpen(true);
      setPanelVisible(true);
      setTimeout(() => inputRef.current?.focus(), 50);
      return;
    }
    setPanelVisible(false);
  };

  const handleExitComplete = () => {
    setSearchOpen(false);
    setQuery("");
  };

  const performSearch = (searchQueryText: string) => {
    const trimmed = searchQueryText.trim();
    if (trimmed) {
      navigate(
        `${getLocalizedPath("/products", locale)}?q=${encodeURIComponent(trimmed)}`
      );
    } else {
      navigate(getLocalizedPath("/products", locale));
    }
    setPanelVisible(false);
  };

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    performSearch(query);
  };

  const displayedProducts = useMemo(() => {
    if (!query.trim()) return [];
    return searchResults.slice(0, 4);
  }, [query, searchResults]);

  return (
    <Popover open={searchOpen} onOpenChange={handleOpenChange}>
      <PopoverTrigger
        render={
          <motion.button
            type="button"
            className={cn(
              iconClassName,
              "transition-colors duration-200 hover:text-secondary-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary/40",
              searchOpen && "bg-primary/80 text-secondary"
            )}
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
        sideOffset={10}
        className={cn(
          "w-[min(26rem,calc(100vw-1.5rem))] gap-0 border-0 bg-transparent p-0 shadow-none ring-0",
          "duration-0 data-open:animate-none data-closed:animate-none"
        )}
      >
        <AnimatePresence onExitComplete={handleExitComplete}>
          {panelVisible ? (
            <motion.div
              key="search-popover-panel"
              className="flex flex-col overflow-hidden rounded-2xl border border-primary-200/80 bg-card/95 backdrop-blur-xl text-card-foreground shadow-xl ring-1 ring-black/5"
              initial={{ opacity: 0, y: 8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 6, scale: 0.97 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Header & Search Bar Input */}
              <div className="p-3.5 pb-2">
                <form
                  className="relative flex items-center"
                  role="search"
                  onSubmit={handleSearch}
                >
                  <Search
                    className="absolute start-3.5 size-4 text-tertiary/70 pointer-events-none"
                    aria-hidden="true"
                  />
                  <Input
                    ref={inputRef}
                    type="search"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder={intl.formatMessage({
                      id: "nav.searchPlaceholder",
                    })}
                    className="h-11 w-full rounded-xl bg-neutral/80 ps-10 pe-9 text-sm text-foreground placeholder:text-tertiary/70 border-primary-200/60 focus-visible:ring-2 focus-visible:ring-secondary/40 transition-all shadow-inner"
                    autoFocus
                  />
                  {query ? (
                    <button
                      type="button"
                      onClick={() => {
                        setQuery("");
                        inputRef.current?.focus();
                      }}
                      className="absolute end-3 text-tertiary hover:text-foreground p-1 rounded-full hover:bg-neutral transition-colors"
                      aria-label={intl.formatMessage({ id: "nav.searchClear" })}
                    >
                      <X className="size-3.5" />
                    </button>
                  ) : null}
                </form>
              </div>

              {/* Suggestions / Results area */}
              <div className="px-3.5 pb-3">
                {query.trim() === "" ? (
                  /* Popular tags suggestions */
                  <div className="pt-2">
                    <div className="flex items-center gap-1.5 px-1 pb-2 text-xs font-semibold uppercase tracking-wider text-tertiary">
                      <Sparkles className="size-3.5 text-secondary" />
                      <span>{intl.formatMessage({ id: "nav.searchPopular" })}</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {popularTags.map((tag) => (
                        <button
                          key={tag.query}
                          type="button"
                          onClick={() => {
                            setQuery(tag.query);
                            performSearch(tag.query);
                          }}
                          className="inline-flex items-center rounded-lg border border-primary-200/80 bg-primary-50/50 px-2.5 py-1 text-xs font-medium text-secondary-800 transition-colors hover:border-secondary/40 hover:bg-primary-100 hover:text-secondary-900 active:scale-95"
                        >
                          {tag.label}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : displayedProducts.length > 0 ? (
                  /* Live matching products list */
                  <div className="flex flex-col gap-1.5 pt-2">
                    <span className="px-1 text-xs font-medium text-tertiary">
                      {intl.formatMessage(
                        { id: "nav.searchViewAll" },
                        { count: searchResults.length }
                      )}
                    </span>
                    <div className="flex flex-col gap-1 divide-y divide-primary-100/50">
                      {displayedProducts.map((product) => {
                        const title = isRtl && product.titleAr ? product.titleAr : product.title;
                        const brand = isRtl && product.brandAr ? product.brandAr : product.brand;
                        const productUrl = `${getLocalizedPath(`/products/${product.id}`, locale)}`;

                        return (
                          <Link
                            key={product.id}
                            to={productUrl}
                            onClick={() => setPanelVisible(false)}
                            viewTransition={true}
                            className="group flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-primary-50/60 active:bg-primary-100/60"
                          >
                            <div className="relative size-12 shrink-0 overflow-hidden rounded-lg bg-neutral border border-primary-200/60">
                              <img
                                src={product.image}
                                alt={title}
                                className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                                loading="lazy"
                              />
                            </div>
                            <div className="flex flex-1 flex-col min-w-0">
                              {brand && (
                                <span className="text-[11px] font-medium text-tertiary truncate">
                                  {brand}
                                </span>
                              )}
                              <span className="text-xs font-semibold text-foreground truncate group-hover:text-secondary transition-colors">
                                {title}
                              </span>
                              <div className="mt-0.5 flex items-center gap-2">
                                <span className="text-xs font-bold text-secondary">
                                  {product.price} {isRtl ? "ر.س" : "SAR"}
                                </span>
                                {product.originalPrice && product.originalPrice > product.price && (
                                  <span className="text-[10px] text-tertiary line-through">
                                    {product.originalPrice} {isRtl ? "ر.س" : "SAR"}
                                  </span>
                                )}
                              </div>
                            </div>
                            <ArrowRight className="size-4 text-tertiary/50 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1 group-hover:text-secondary shrink-0" />
                          </Link>
                        );
                      })}
                    </div>

                    {/* View all button */}
                    <div className="pt-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => performSearch(query)}
                        className="w-full justify-center border-primary-200 hover:border-secondary hover:bg-primary/50 text-secondary font-medium rounded-xl text-xs py-2"
                      >
                        {intl.formatMessage(
                          { id: "nav.searchViewAll" },
                          { count: searchResults.length }
                        )}
                      </Button>
                    </div>
                  </div>
                ) : (
                  /* No results found state */
                  <div className="py-6 text-center">
                    <p className="text-sm font-medium text-secondary">
                      {intl.formatMessage({ id: "nav.searchNoResults" })}
                    </p>
                    <p className="mt-1 text-xs text-tertiary">
                      {intl.formatMessage({ id: "nav.searchEmpty" })}
                    </p>
                  </div>
                )}
              </div>
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

  const { data: cart } = useCart();
  const { data: wishlist } = useWishlist();

  const cartCount =
    cart?.items.reduce((total, item) => total + (item.quantity || 1), 0) ?? 0;
  const wishlistCount = wishlist?.items.length ?? 0;

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
          className={cn(iconClassName, "relative")}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
        >
          <Heart className="size-5" aria-hidden="true" />
          {wishlistCount > 0 && (
            <span className="absolute -top-1 -end-1 flex min-w-4.5 h-4.5 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white shadow-xs">
              {wishlistCount > 99 ? "99+" : wishlistCount}
            </span>
          )}
        </motion.span>
      </Link>

      <Link
        to={getLocalizedPath("/cart", locale)}
        aria-label={intl.formatMessage({ id: "nav.cart" })}
        viewTransition={true}
        className="hidden md:inline-flex"
      >
        <motion.span
          className={cn(iconClassName, "relative")}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
        >
          <ShoppingBag className="size-5" aria-hidden="true" />
          {cartCount > 0 && (
            <span className="absolute -top-1 -end-1 flex min-w-4.5 h-4.5 items-center justify-center rounded-full bg-secondary px-1 text-[10px] font-bold text-secondary-foreground shadow-xs">
              {cartCount > 99 ? "99+" : cartCount}
            </span>
          )}
        </motion.span>
      </Link>

      <ProfileMenu />
    </>
  );
};
