import React, { useState, useMemo } from "react";
import { motion } from "motion/react";
import { useIntl } from "react-intl";
import { Link } from "react-router-dom";
import {
  Star,
  Sparkles,
  Search,
  Filter,
  CheckCircle2,
  MessageSquare,
  Camera,
  Layers,
  ArrowUpRight,
  ChevronDown,
} from "lucide-react";
import { mockMediaReviews } from "@/features/reviews/data/mockReviews";
import { HomeReviewsSection } from "@/features/reviews/components/HomeReviewsSection";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { isLocale, DEFAULT_LOCALE, type Locale } from "@/i18n/locales";
import { getLocalizedPath } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

export const ReviewsPage: React.FC = () => {
  const intl = useIntl();
  const locale: Locale = isLocale(intl.locale) ? intl.locale : DEFAULT_LOCALE;
  const isRtl = locale === "ar";

  // Active view tab: 'all' | 'media' | 'products'
  const [activeTab, setActiveTab] = useState<"all" | "media" | "products">(
    "all",
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRating, setSelectedRating] = useState<number | "all">("all");
  const [verifiedOnly, setVerifiedOnly] = useState(false);

  // Aggregate media reviews into the product-reviews tab until a reviews API exists.
  const productReviewsList = useMemo(() => {
    return mockMediaReviews.map((item) => ({
      id: item.id,
      author: item.authorName,
      rating: item.rating,
      date: item.date ?? "",
      comment: item.caption ?? "",
      isVerifiedPurchase: item.verifiedPurchase,
      productId: item.productId,
      productTitle: item.productName,
      productImage: item.productImage,
      productBrand: undefined as string | undefined,
      title: undefined as string | undefined,
    }));
  }, []);

  // Filter media reviews
  const filteredMediaReviews = useMemo(() => {
    return mockMediaReviews.filter((item) => {
      if (
        selectedRating !== "all" &&
        Math.floor(item.rating) !== selectedRating
      ) {
        return false;
      }
      if (verifiedOnly && !item.verifiedPurchase) {
        return false;
      }
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchCaption = item.caption?.toLowerCase().includes(query);
        const matchAuthor = item.authorName?.toLowerCase().includes(query);
        const matchProduct = item.productName?.toLowerCase().includes(query);
        return matchCaption || matchAuthor || matchProduct;
      }
      return true;
    });
  }, [selectedRating, verifiedOnly, searchQuery]);

  // Filter text/product reviews
  const filteredProductReviews = useMemo(() => {
    return productReviewsList.filter((item) => {
      if (
        selectedRating !== "all" &&
        Math.floor(item.rating) !== selectedRating
      ) {
        return false;
      }
      if (verifiedOnly && !item.isVerifiedPurchase) {
        return false;
      }
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchTitle = item.title?.toLowerCase().includes(query);
        const matchComment = item.comment?.toLowerCase().includes(query);
        const matchAuthor = item.author?.toLowerCase().includes(query);
        const matchProduct = item.productTitle?.toLowerCase().includes(query);
        return matchTitle || matchComment || matchAuthor || matchProduct;
      }
      return true;
    });
  }, [productReviewsList, selectedRating, verifiedOnly, searchQuery]);

  // Stats calculation
  const totalReviewsCount = mockMediaReviews.length + productReviewsList.length;
  const avgRating = 4.9;

  return (
    <main className="min-h-screen bg-neutral/15 pb-20 pt-6 sm:pt-10">
      {/* 1. Hero / Header Section */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-primary/20 via-card to-card border border-border/80 p-6 sm:p-10 lg:p-12 shadow-sm">
          {/* Subtle decorative glow */}
          <div className="absolute top-0 end-0 -me-20 -mt-20 w-80 h-80 rounded-full bg-primary/25 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 start-0 -ms-20 -mb-20 w-80 h-80 rounded-full bg-secondary/15 blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-primary/30 text-secondary text-xs sm:text-sm font-semibold border border-primary/40 mb-4">
              <Sparkles className="size-4 animate-pulse text-secondary" />
              <span>{intl.formatMessage({ id: "reviews.page.badge" })}</span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-foreground tracking-tight leading-tight mb-4">
              {intl.formatMessage({ id: "reviews.page.title" })}
            </h1>

            <p className="text-muted-foreground text-sm sm:text-base lg:text-lg leading-relaxed max-w-2xl">
              {intl.formatMessage({ id: "reviews.page.subtitle" })}
            </p>
          </div>

          {/* Quick Stats Grid */}
          <div className="mt-8 pt-8 border-t border-border/60 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            <div className="bg-background/70 backdrop-blur-sm border border-border/60 rounded-2xl p-4">
              <div className="text-xs sm:text-sm text-muted-foreground font-medium mb-1">
                {intl.formatMessage({ id: "reviews.stats.total" })}
              </div>
              <div className="text-2xl sm:text-3xl font-black text-foreground">
                +{totalReviewsCount * 25}
              </div>
            </div>

            <div className="bg-background/70 backdrop-blur-sm border border-border/60 rounded-2xl p-4">
              <div className="text-xs sm:text-sm text-muted-foreground font-medium mb-1">
                {intl.formatMessage({ id: "reviews.stats.rating" })}
              </div>
              <div className="text-2xl sm:text-3xl font-black text-foreground flex items-center gap-1.5">
                <span>{avgRating}</span>
                <div className="flex text-amber-500">
                  <Star className="size-4 sm:size-5 fill-amber-400 text-amber-400" />
                </div>
              </div>
            </div>

            <div className="bg-background/70 backdrop-blur-sm border border-border/60 rounded-2xl p-4">
              <div className="text-xs sm:text-sm text-muted-foreground font-medium mb-1">
                {intl.formatMessage({ id: "reviews.stats.satisfaction" })}
              </div>
              <div className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400">
                98.4%
              </div>
            </div>

            <div className="bg-background/70 backdrop-blur-sm border border-border/60 rounded-2xl p-4">
              <div className="text-xs sm:text-sm text-muted-foreground font-medium mb-1">
                {intl.formatMessage({ id: "reviews.stats.community" })}
              </div>
              <div className="text-2xl sm:text-3xl font-black text-secondary">
                100% {isRtl ? "موثق" : "Verified"}
              </div>
            </div>
          </div>
        </div>

        {/* 2. Interactive Navigation Tabs & Filter Bar */}
        <div className="mt-8 bg-card border border-border/80 rounded-3xl p-4 sm:p-5 shadow-xs space-y-4">
          {/* Row 1: The 3 Main Tabs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 p-1.5 bg-neutral/50 dark:bg-neutral-900/50 border border-border/60 rounded-2xl">
            <button
              type="button"
              onClick={() => setActiveTab("all")}
              className={cn(
                "flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer select-none text-center",
                activeTab === "all"
                  ? "bg-secondary text-white shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-card/60",
              )}
            >
              <Layers className="size-4 shrink-0" />
              <span>
                {intl.formatMessage(
                  { id: "reviews.tabs.all" },
                  {
                    count: mockMediaReviews.length + productReviewsList.length,
                  },
                )}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("media")}
              className={cn(
                "flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer select-none text-center",
                activeTab === "media"
                  ? "bg-secondary text-white shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-card/60",
              )}
            >
              <Camera className="size-4 shrink-0" />
              <span>
                {intl.formatMessage(
                  { id: "reviews.tabs.media" },
                  { count: mockMediaReviews.length },
                )}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("products")}
              className={cn(
                "flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer select-none text-center",
                activeTab === "products"
                  ? "bg-secondary text-white shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-card/60",
              )}
            >
              <MessageSquare className="size-4 shrink-0" />
              <span>
                {intl.formatMessage(
                  { id: "reviews.tabs.products" },
                  { count: productReviewsList.length },
                )}
              </span>
            </button>
          </div>

          {/* Row 2: Search & Filter Controls */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 pt-1">
            {/* Live Search */}
            <div className="relative flex-1">
              <Search className="size-4 absolute top-1/2 -translate-y-1/2 start-3.5 text-muted-foreground pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={intl.formatMessage({
                  id: "reviews.filter.search",
                })}
                className="w-full bg-background border border-border rounded-xl ps-9 pe-3 py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition-all"
              />
            </div>

            {/* Filters Sub-group */}
            <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5">
              {/* Rating Filter (Shadcn DropdownMenu) */}
              <DropdownMenu>
                <DropdownMenuTrigger className="flex-1 sm:flex-initial inline-flex items-center justify-between gap-2 bg-background border border-border hover:border-secondary/40 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-secondary/30 transition-all cursor-pointer select-none min-w-[140px]">
                  <div className="flex items-center gap-1.5 truncate">
                    <Filter className="size-3.5 text-muted-foreground shrink-0" />
                    <span className="truncate">
                      {selectedRating === "all"
                        ? intl.formatMessage({ id: "reviews.filter.rating" })
                        : `${selectedRating} ${isRtl ? "نجوم" : "Stars"}`}
                    </span>
                  </div>
                  <ChevronDown className="size-3.5 text-muted-foreground shrink-0 opacity-70" />
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  align="end"
                  className="w-48 p-1.5 rounded-2xl bg-card border border-border shadow-lg z-50 text-foreground"
                >
                  <DropdownMenuGroup>
                    <DropdownMenuLabel className="text-xs font-semibold px-2 py-1 text-muted-foreground">
                      {intl.formatMessage({ id: "reviews.filter.rating" })}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="my-1 bg-border/60" />

                    <DropdownMenuItem
                      onClick={() => setSelectedRating("all")}
                      className={cn(
                        "flex items-center justify-between px-2.5 py-2 rounded-xl text-xs sm:text-sm font-medium cursor-pointer transition-colors",
                        selectedRating === "all"
                          ? "bg-secondary/10 text-secondary font-bold"
                          : "hover:bg-neutral/50 text-foreground",
                      )}
                    >
                      <span>
                        {intl.formatMessage({ id: "reviews.filter.rating" })}
                      </span>
                      {selectedRating === "all" && (
                        <span className="size-1.5 rounded-full bg-secondary" />
                      )}
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      onClick={() => setSelectedRating(5)}
                      className={cn(
                        "flex items-center justify-between px-2.5 py-2 rounded-xl text-xs sm:text-sm font-medium cursor-pointer transition-colors",
                        selectedRating === 5
                          ? "bg-secondary/10 text-secondary font-bold"
                          : "hover:bg-neutral/50 text-foreground",
                      )}
                    >
                      <div className="flex items-center gap-1.5">
                        <span className="text-amber-500">★★★★★</span>
                        <span>5 {isRtl ? "نجوم" : "Stars"}</span>
                      </div>
                      {selectedRating === 5 && (
                        <span className="size-1.5 rounded-full bg-secondary" />
                      )}
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      onClick={() => setSelectedRating(4)}
                      className={cn(
                        "flex items-center justify-between px-2.5 py-2 rounded-xl text-xs sm:text-sm font-medium cursor-pointer transition-colors",
                        selectedRating === 4
                          ? "bg-secondary/10 text-secondary font-bold"
                          : "hover:bg-neutral/50 text-foreground",
                      )}
                    >
                      <div className="flex items-center gap-1.5">
                        <span className="text-amber-500">★★★★☆</span>
                        <span>4 {isRtl ? "نجوم" : "Stars"}</span>
                      </div>
                      {selectedRating === 4 && (
                        <span className="size-1.5 rounded-full bg-secondary" />
                      )}
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      onClick={() => setSelectedRating(3)}
                      className={cn(
                        "flex items-center justify-between px-2.5 py-2 rounded-xl text-xs sm:text-sm font-medium cursor-pointer transition-colors",
                        selectedRating === 3
                          ? "bg-secondary/10 text-secondary font-bold"
                          : "hover:bg-neutral/50 text-foreground",
                      )}
                    >
                      <div className="flex items-center gap-1.5">
                        <span className="text-amber-500">★★★☆☆</span>
                        <span>3 {isRtl ? "نجوم" : "Stars"}</span>
                      </div>
                      {selectedRating === 3 && (
                        <span className="size-1.5 rounded-full bg-secondary" />
                      )}
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Verified Filter Toggle Button */}
              <button
                type="button"
                onClick={() => setVerifiedOnly(!verifiedOnly)}
                className={cn(
                  "flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium border transition-all cursor-pointer select-none whitespace-nowrap",
                  verifiedOnly
                    ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800 shadow-xs"
                    : "bg-background text-muted-foreground border-border hover:text-foreground",
                )}
              >
                <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
                <span>
                  {intl.formatMessage({ id: "reviews.filter.verifiedOnly" })}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* 3. Main Content Display based on Tab */}
        <div className="mt-8">
          {/* A. Media Visuals Section (Shown in 'all' or 'media' tabs) */}
          {(activeTab === "all" || activeTab === "media") && (
            <section className="mb-12">
              <div className="bg-card border border-border/80 rounded-3xl overflow-hidden shadow-xs">
                <HomeReviewsSection
                  reviews={filteredMediaReviews}
                  className="py-6 md:py-8"
                />
              </div>
            </section>
          )}

          {/* B. Product Written Reviews Grid (Shown in 'all' or 'products' tabs) */}
          {(activeTab === "all" || activeTab === "products") && (
            <section className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="flex items-center gap-2">
                    <MessageSquare className="size-5 text-secondary" />
                    <h2 className="text-xl sm:text-2xl font-bold text-foreground">
                      {intl.formatMessage(
                        { id: "reviews.tabs.products" },
                        { count: filteredProductReviews.length },
                      )}
                    </h2>
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                    {isRtl
                      ? "آراء وتقييمات مفصلة على مختلف منتجات العناية بالبشرة والجسم"
                      : "Detailed experiences and feedback across our curated skincare range"}
                  </p>
                </div>
              </div>

              {filteredProductReviews.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {filteredProductReviews.map((review, idx) => (
                    <motion.div
                      key={review.id || idx}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35, delay: idx * 0.05 }}
                      className="bg-card border border-border/80 rounded-3xl p-5 sm:p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                    >
                      <div>
                        {/* Header: Author + Rating */}
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div className="flex items-center gap-2.5">
                            <div className="size-9 rounded-full bg-primary/30 text-secondary font-bold text-xs flex items-center justify-center border border-primary/40">
                              {review.author?.charAt(0) || "U"}
                            </div>
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="text-xs sm:text-sm font-bold text-foreground">
                                  {review.author}
                                </span>
                                {review.isVerifiedPurchase && (
                                  <CheckCircle2 className="size-3.5 text-emerald-600" />
                                )}
                              </div>
                              <span className="text-[11px] text-muted-foreground">
                                {review.date}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-0.5 text-amber-400">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={cn(
                                  "size-3.5",
                                  i < review.rating
                                    ? "fill-amber-400 text-amber-400"
                                    : "text-border",
                                )}
                              />
                            ))}
                          </div>
                        </div>

                        {/* Title & Comment */}
                        <h4 className="text-sm sm:text-base font-bold text-foreground mb-1.5">
                          {review.title}
                        </h4>
                        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                          "{review.comment}"
                        </p>
                      </div>

                      {/* Product footer attachment */}
                      <div className="mt-5 pt-4 border-t border-border/60 flex flex-col xs:flex-row items-stretch xs:items-center justify-between gap-3">
                        <Link
                          to={getLocalizedPath(
                            `/products/${review.productId}`,
                            locale,
                          )}
                          className="flex items-center gap-2.5 min-w-0 flex-1 group"
                        >
                          <img
                            src={review.productImage}
                            alt={review.productTitle}
                            className="size-9 rounded-lg object-cover border border-border/60 shrink-0 group-hover:scale-105 transition-transform"
                          />
                          <div className="min-w-0 flex-1">
                            <p className="text-[11px] font-semibold text-foreground group-hover:text-secondary truncate transition-colors">
                              {review.productTitle}
                            </p>
                            <span className="text-[10px] text-muted-foreground block truncate">
                              {review.productBrand}
                            </span>
                          </div>
                        </Link>

                        <Link
                          to={getLocalizedPath(
                            `/products/${review.productId}/reviews`,
                            locale,
                          )}
                          className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-secondary bg-primary/20 hover:bg-secondary hover:text-white border border-primary/30 hover:border-secondary transition-all duration-200 shrink-0 group/btn shadow-2xs cursor-pointer select-none text-center"
                        >
                          <span>{intl.formatMessage({ id: "reviews.viewProductReviews" })}</span>
                          <ArrowUpRight className="size-3.5 transition-transform duration-200 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                        </Link>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-card border border-dashed border-border rounded-3xl">
                  <MessageSquare className="size-12 text-muted-foreground/40 mx-auto mb-3" />
                  <h3 className="text-base font-bold text-foreground">
                    {intl.formatMessage({ id: "reviews.empty.title" })}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
                    {intl.formatMessage({ id: "reviews.empty.desc" })}
                  </p>
                </div>
              )}
            </section>
          )}
        </div>
      </div>
    </main>
  );
};

export default ReviewsPage;
