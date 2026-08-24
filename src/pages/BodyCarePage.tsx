import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Filter } from "lucide-react";
import { FormattedMessage } from "react-intl";
import {
  useProducts,
  ProductCard,
  ProductCardMobile,
  ProductFilters,
  type Product,
  type ProductType,
} from "@/features/products";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PageFadeIn } from "@/components/AnimationContainer";
import { itemProductCardVariants } from "@/lib/animation-variants";

const BODY_CARE_ALLOWED_TYPES: ProductType[] = [
  "oil",
  "scrub",
  "lotion",
  "gel",
  "butter",
  "set",
];

export const BodyCarePage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const urlSearchQuery = searchParams.get("q") || "";
  const urlType = (searchParams.get("type") as ProductType) || "all";
  const urlMinPrice = searchParams.get("minPrice")
    ? Number(searchParams.get("minPrice"))
    : 0;
  const urlMaxPrice = searchParams.get("maxPrice")
    ? Number(searchParams.get("maxPrice"))
    : 2500;
  const urlMinRating = searchParams.get("minRating")
    ? Number(searchParams.get("minRating"))
    : 0;
  const urlSortBy =
    (searchParams.get("sortBy") as
      | "featured"
      | "price_asc"
      | "price_desc"
      | "rating"
      | "discount") || "featured";

  // Local state initialized / synced with URL
  const [searchQuery, setSearchQuery] = useState<string>(urlSearchQuery);
  const [selectedType, setSelectedType] = useState<ProductType>(urlType);
  const [priceRange, setPriceRange] = useState<[number, number]>([
    urlMinPrice,
    urlMaxPrice,
  ]);
  const [minRating, setMinRating] = useState<number>(urlMinRating);
  const [sortBy, setSortBy] = useState<
    "featured" | "price_asc" | "price_desc" | "rating" | "discount"
  >(urlSortBy);

  // Keep state in sync with URL searchParams changes
  React.useEffect(() => {
    setSearchQuery(urlSearchQuery);
    setSelectedType(urlType);
    setPriceRange([urlMinPrice, urlMaxPrice]);
    setMinRating(urlMinRating);
    setSortBy(urlSortBy);
  }, [
    urlSearchQuery,
    urlType,
    urlMinPrice,
    urlMaxPrice,
    urlMinRating,
    urlSortBy,
  ]);

  const updateParam = (key: string, value: string | null) => {
    setSearchParams(
      (prev) => {
        const newParams = new URLSearchParams(prev);
        if (!value || value === "" || value === "all" || value === "0") {
          newParams.delete(key);
        } else {
          newParams.set(key, value);
        }
        return newParams;
      },
      { replace: true },
    );
  };

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    updateParam("q", val);
  };

  const handleTypeChange = (type: ProductType) => {
    setSelectedType(type);
    updateParam("type", type === "all" ? null : type);
  };

  const handlePriceRangeChange = (range: [number, number]) => {
    setPriceRange(range);
    setSearchParams(
      (prev) => {
        const newParams = new URLSearchParams(prev);
        if (range[0] > 0) newParams.set("minPrice", range[0].toString());
        else newParams.delete("minPrice");

        if (range[1] < 2500) newParams.set("maxPrice", range[1].toString());
        else newParams.delete("maxPrice");
        return newParams;
      },
      { replace: true },
    );
  };

  const handleMinRatingChange = (rating: number) => {
    setMinRating(rating);
    updateParam("minRating", rating > 0 ? rating.toString() : null);
  };

  const handleSortByChange = (
    sort: "featured" | "price_asc" | "price_desc" | "rating" | "discount",
  ) => {
    setSortBy(sort);
    updateParam("sortBy", sort === "featured" ? null : sort);
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedType("all");
    setPriceRange([0, 2500]);
    setMinRating(0);
    setSortBy("featured");
    setSearchParams({}, { replace: true });
  };

  const hasActiveFilters =
    searchQuery.trim() !== "" ||
    selectedType !== "all" ||
    priceRange[0] > 0 ||
    priceRange[1] < 2500 ||
    minRating > 0 ||
    sortBy !== "featured";

  const handleAddToCart = (_product: Partial<Product>) => {
    // Cart persistence handled elsewhere; Sonner toast is shown from ProductCard.
  };

  const { data: filteredProducts = [] } = useProducts({
    searchQuery,
    category: "body_care",
    productType: selectedType,
    priceRange,
    minRating,
    sortBy,
  });

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-gray-50/60 dark:bg-neutral-950 py-8 pb-24 lg:pb-8"
    >
      <div className="page-shell mx-auto space-y-8">
        {/* Page Header Banner */}
        <PageFadeIn
          yOffset={14}
          duration={0.45}
          className="relative overflow-hidden rounded-3xl p-8 md:p-12 shadow-lg min-h-[220px] flex items-center bg-cover bg-center text-white"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(15, 23, 42, 0.85), rgba(15, 23, 42, 0.45)), url('https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1600&q=80')`,
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.1, ease: "easeOut" }}
            className="space-y-3 text-right max-w-2xl z-10"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.35, delay: 0.15 }}
              className="inline-flex items-center gap-2 text-amber-300 font-bold text-xs uppercase tracking-wider bg-amber-950/60 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-amber-500/20"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>
                <FormattedMessage id="category.bodycare.title" />
              </span>
            </motion.div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight drop-shadow-xs text-white">
              <FormattedMessage id="home.category.bodycare.title" />
            </h1>
            <p className="text-gray-200 text-sm md:text-base leading-relaxed max-w-xl">
              <FormattedMessage id="category.bodycare.description" />
            </p>
          </motion.div>
        </PageFadeIn>

        {/* Main Content Layout: Sidebar on Desktop (lg+), Grid on Right */}
        <div className="flex flex-col lg:flex-row items-start gap-8">
          {/* Desktop Filters Sidebar */}
          <aside className="hidden lg:block w-80 shrink-0">
            <PageFadeIn delay={0.2} yOffset={10}>
              <ProductFilters
                searchQuery={searchQuery}
                onSearchChange={handleSearchChange}
                selectedType={selectedType}
                onTypeChange={handleTypeChange}
                priceRange={priceRange}
                onPriceRangeChange={handlePriceRangeChange}
                minPossiblePrice={0}
                maxPossiblePrice={2500}
                minRating={minRating}
                onMinRatingChange={handleMinRatingChange}
                sortBy={sortBy}
                onSortByChange={handleSortByChange}
                onResetFilters={handleResetFilters}
                hasActiveFilters={hasActiveFilters}
                totalFilteredCount={filteredProducts.length}
                isSidebar={true}
                allowedProductTypes={BODY_CARE_ALLOWED_TYPES}
              />
            </PageFadeIn>
          </aside>

          {/* Products Grid Content Area */}
          <div className="flex-1 w-full min-w-0">
            <AnimatePresence mode="popLayout">
              {filteredProducts.length > 0 ? (
                <motion.div
                  layout
                  className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-2.5 sm:gap-3.5 md:gap-4 lg:gap-4 xl:gap-4.5 justify-items-center"
                >
                  <AnimatePresence mode="popLayout">
                    {filteredProducts.map((product) => (
                      <motion.div
                        key={product.id}
                        layout
                        variants={itemProductCardVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="w-full h-full flex justify-center"
                      >
                        <div className="w-full sm:hidden">
                          <ProductCardMobile
                            product={product}
                            onAddToCart={handleAddToCart}
                          />
                        </div>
                        <div className="hidden sm:flex w-full justify-center">
                          <ProductCard
                            product={product}
                            onAddToCart={handleAddToCart}
                          />
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
              ) : (
                <motion.div
                  key="empty-state"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="text-center py-16 bg-white dark:bg-neutral-900 rounded-3xl border border-gray-200/80 dark:border-neutral-800 space-y-3 w-full"
                >
                  <p className="text-gray-500 dark:text-gray-400 text-base font-semibold">
                    <FormattedMessage id="products.empty" />
                  </p>
                  <button
                    onClick={handleResetFilters}
                    className="text-xs font-bold text-secondary underline hover:text-primary transition-colors cursor-pointer"
                  >
                    <FormattedMessage id="products.resetFilters" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Mobile Fixed Bottom Filter Bar */}
      <div className="fixed bottom-0 inset-x-0 z-40 lg:hidden bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md border-t border-gray-200/80 dark:border-neutral-800 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] px-4 py-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-gray-700 dark:text-gray-300">
          <span className="font-bold text-gray-900 dark:text-white">
            <FormattedMessage
              id="products.count"
              values={{ count: filteredProducts.length }}
            />
          </span>
          {hasActiveFilters && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-secondary text-white">
              مفعل
            </span>
          )}
        </div>

        <Dialog>
          <DialogTrigger
            render={
              <button
                type="button"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-secondary text-white text-xs font-bold shadow-sm shadow-secondary/25 hover:bg-secondary-600 transition-all cursor-pointer"
              />
            }
          >
            <Filter className="w-4 h-4" />
            <FormattedMessage id="products.filters.openButton" />
            {hasActiveFilters && (
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
            )}
          </DialogTrigger>

          <DialogContent className="max-w-xl max-h-[85vh] overflow-y-auto p-4 sm:p-6 rounded-3xl border border-gray-200/80 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-right">
            <DialogHeader className="mb-2">
              <DialogTitle className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Filter className="w-5 h-5 text-secondary" />
                <FormattedMessage id="products.filters.title" />
              </DialogTitle>
            </DialogHeader>

            <ProductFilters
              searchQuery={searchQuery}
              onSearchChange={handleSearchChange}
              selectedType={selectedType}
              onTypeChange={handleTypeChange}
              priceRange={priceRange}
              onPriceRangeChange={handlePriceRangeChange}
              minPossiblePrice={0}
              maxPossiblePrice={2500}
              minRating={minRating}
              onMinRatingChange={handleMinRatingChange}
              sortBy={sortBy}
              onSortByChange={handleSortByChange}
              onResetFilters={handleResetFilters}
              hasActiveFilters={hasActiveFilters}
              totalFilteredCount={filteredProducts.length}
              isSidebar={false}
              hideHeader={true}
              allowedProductTypes={BODY_CARE_ALLOWED_TYPES}
              className="border-0 shadow-none bg-transparent dark:bg-transparent p-0"
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default BodyCarePage;
