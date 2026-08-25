import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  Search,
  Filter,
  RotateCcw,
  Check,
  Star,
  ChevronDown,
  Layers,
  CircleDollarSign,
  ArrowUpDown,
  X,
} from "lucide-react";
import { useIntl, FormattedMessage } from "react-intl";
import type { ProductType } from "../types";
import { useProductFilterMeta } from "../api/use-products";
import { useProductTypes } from "../api/use-product-types";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface ProductFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedType: ProductType;
  onTypeChange: (type: ProductType) => void;
  priceRange: [number, number];
  onPriceRangeChange: (range: [number, number]) => void;
  minPossiblePrice?: number;
  maxPossiblePrice?: number;
  minRating: number;
  onMinRatingChange: (rating: number) => void;
  sortBy: "featured" | "price_asc" | "price_desc" | "rating" | "discount";
  onSortByChange: (
    sort: "featured" | "price_asc" | "price_desc" | "rating" | "discount",
  ) => void;
  onResetFilters: () => void;
  hasActiveFilters: boolean;
  totalFilteredCount: number;
  className?: string;
  isSidebar?: boolean;
  /** Optional slug allowlist (e.g. skincare page). When set, only those API types show. */
  allowedProductTypes?: ProductType[];
  hideHeader?: boolean;
}

type ProductTypeOption = {
  id: ProductType;
  label: string;
};

export const ProductFilters: React.FC<ProductFiltersProps> = ({
  searchQuery,
  onSearchChange,
  selectedType,
  onTypeChange,
  priceRange,
  onPriceRangeChange,
  minPossiblePrice = 0,
  maxPossiblePrice = 2500,
  minRating,
  onMinRatingChange,
  sortBy,
  onSortByChange,
  onResetFilters,
  hasActiveFilters,
  totalFilteredCount,
  className,
  isSidebar = false,
  allowedProductTypes,
  hideHeader = false,
}) => {
  const intl = useIntl();
  const [isSortOpen, setIsSortOpen] = useState(false);
  const { data: filterMeta } = useProductFilterMeta();
  const { data: catalogTypes = [], isPending: isTypesPending } =
    useProductTypes();

  const productTypeOptions = React.useMemo((): ProductTypeOption[] => {
    const allOption: ProductTypeOption = {
      id: "all",
      label: intl.formatMessage({ id: "products.filters.type.all" }),
    };

    const fromApi = catalogTypes
      .filter(
        (type) =>
          !allowedProductTypes ||
          allowedProductTypes.length === 0 ||
          allowedProductTypes.includes(type.slug),
      )
      .map((type) => ({
        id: type.slug as ProductType,
        label: type.name,
      }));

    return [allOption, ...fromApi];
  }, [allowedProductTypes, catalogTypes, intl]);

  // Local immediate input state with debounce sync to parent query
  const [localSearch, setLocalSearch] = useState(searchQuery);

  useEffect(() => {
    setLocalSearch(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (localSearch !== searchQuery) {
        onSearchChange(localSearch);
      }
    }, 250);
    return () => clearTimeout(timer);
  }, [localSearch, onSearchChange, searchQuery]);


  const sortOptions = [
    {
      value: "featured",
      label: intl.formatMessage({ id: "products.filters.sort.featured" }),
    },
    {
      value: "price_asc",
      label: intl.formatMessage({ id: "products.filters.sort.priceAsc" }),
    },
    {
      value: "price_desc",
      label: intl.formatMessage({ id: "products.filters.sort.priceDesc" }),
    },
    {
      value: "rating",
      label: intl.formatMessage({ id: "products.filters.sort.rating" }),
    },
    {
      value: "discount",
      label: intl.formatMessage({ id: "products.filters.sort.discount" }),
    },
  ];

  const predefinedPriceRanges = [
    { label: "الكل / All", min: minPossiblePrice, max: maxPossiblePrice },
    { label: "< 500 ج.م", min: 0, max: 500 },
    { label: "500 - 1000 ج.م", min: 500, max: 1000 },
    { label: "1000 - 1500 ج.م", min: 1000, max: 1500 },
    { label: "> 1500 ج.م", min: 1500, max: maxPossiblePrice },
  ];

  return (
    <div
      className={cn(
        "w-full bg-white dark:bg-neutral-900/90 rounded-3xl border border-gray-200/80 dark:border-neutral-800 shadow-sm overflow-hidden transition-all duration-300 backdrop-blur-md",
        isSidebar && "sticky top-24",
        className,
      )}
    >
      {/* Top Filter Bar Header */}
      {!hideHeader && (
        <div className="p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 dark:border-neutral-800/80 select-none">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-secondary/10 dark:bg-secondary/20 flex items-center justify-center text-secondary shrink-0">
              <Filter className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2 m-0">
                <FormattedMessage id="products.filters.title" />
                {hasActiveFilters && (
                  <span className="w-2.5 h-2.5 rounded-full bg-secondary animate-pulse" />
                )}
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                <FormattedMessage
                  id="products.count"
                  values={{ count: totalFilteredCount }}
                />
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {hasActiveFilters && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
                onClick={(e) => {
                  e.stopPropagation();
                  onResetFilters();
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-secondary bg-secondary-50 dark:bg-secondary-950/40 hover:bg-secondary-100 transition-colors cursor-pointer border border-secondary/20"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <FormattedMessage id="products.filters.clearAll" />
              </motion.button>
            )}
          </div>
        </div>
      )}

      {/* Filter Body */}
      <div>
            <div className="p-4 sm:p-5 space-y-5">
              {/* Row 1: Search & Sorting */}
              <div className={cn("grid gap-3 items-center", isSidebar ? "grid-cols-1" : "grid-cols-1 md:grid-cols-12")}>
                {/* Search Field */}
                <div className={cn("relative", !isSidebar && "md:col-span-8")}>
                  <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none">
                    <Search className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={localSearch}
                    onChange={(e) => setLocalSearch(e.target.value)}
                    placeholder={intl.formatMessage({
                      id: "products.filters.searchPlaceholder",
                    })}
                    className="w-full h-11 pr-10 pl-9 rounded-2xl bg-gray-50 dark:bg-neutral-800/80 border border-gray-200 dark:border-neutral-700/80 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all"
                  />
                  {localSearch && (
                    <button
                      type="button"
                      onClick={() => {
                        setLocalSearch("");
                        onSearchChange("");
                      }}
                      className="absolute left-3 top-1/2 -translate-y-1/2 p-1 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-neutral-700 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Sort Dropdown using shadcn DropdownMenu */}
                <div className={cn(!isSidebar && "md:col-span-4")}>
                  <DropdownMenu open={isSortOpen} onOpenChange={setIsSortOpen}>
                    <DropdownMenuTrigger
                      render={
                        <button
                          type="button"
                          className="w-full h-11 px-4 rounded-2xl bg-gray-50 dark:bg-neutral-800/80 border border-gray-200 dark:border-neutral-700/80 text-sm font-semibold text-gray-800 dark:text-gray-200 flex items-center justify-between gap-2 hover:bg-gray-100 dark:hover:bg-neutral-800 focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all cursor-pointer"
                        />
                      }
                    >
                      <div className="flex items-center gap-2 truncate">
                        <ArrowUpDown className="w-4 h-4 text-secondary shrink-0" />
                        <span className="truncate text-xs sm:text-sm font-bold text-gray-900 dark:text-white">
                          {sortOptions.find((opt) => opt.value === sortBy)
                            ?.label ||
                            intl.formatMessage({
                              id: "products.filters.sort.featured",
                            })}
                        </span>
                      </div>
                      <ChevronDown
                        className={cn(
                          "w-4 h-4 text-gray-400 shrink-0 transition-transform duration-200",
                          isSortOpen && "rotate-180",
                        )}
                      />
                    </DropdownMenuTrigger>

                    <DropdownMenuContent
                      align="end"
                      side="bottom"
                      sideOffset={6}
                      className="w-56 rounded-2xl border border-gray-200 dark:border-neutral-700/80 bg-white dark:bg-neutral-900 p-1.5 shadow-xl ring-1 ring-black/5 dark:ring-white/10"
                    >
                      <DropdownMenuRadioGroup
                        value={sortBy}
                        onValueChange={(val) => {
                          onSortByChange(
                            val as
                              | "featured"
                              | "price_asc"
                              | "price_desc"
                              | "rating"
                              | "discount",
                          );
                          setIsSortOpen(false);
                        }}
                      >
                        {sortOptions.map((opt) => (
                          <DropdownMenuRadioItem
                            key={opt.value}
                            value={opt.value}
                            onClick={() => {
                              onSortByChange(
                                opt.value as
                                  | "featured"
                                  | "price_asc"
                                  | "price_desc"
                                  | "rating"
                                  | "discount",
                              );
                              setIsSortOpen(false);
                            }}
                            className="flex items-center rounded-xl py-2 text-xs sm:text-sm font-semibold text-gray-800 dark:text-gray-200 focus:text-gray-800 dark:focus:text-gray-200 focus:bg-gray-100 dark:focus:bg-neutral-800 data-[state=checked]:bg-secondary/10 data-[state=checked]:text-secondary dark:data-[state=checked]:text-secondary cursor-pointer"
                          >
                            <span>{opt.label}</span>
                          </DropdownMenuRadioItem>
                        ))}
                      </DropdownMenuRadioGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {/* Row 2: Product Types Chips */}
              <div className="space-y-2.5">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  <Layers className="w-4 h-4 text-secondary" />
                  <span>
                    <FormattedMessage id="products.filters.productTypes" />
                  </span>
                </div>

                <div className="flex flex-wrap gap-2 pt-0.5">
                  {isTypesPending
                    ? Array.from({ length: 6 }).map((_, index) => (
                        <div
                          key={index}
                          className="h-8 w-16 rounded-xl bg-primary-100 animate-pulse"
                        />
                      ))
                    : productTypeOptions.map((opt) => {
                        const isSelected = selectedType === opt.id;
                        return (
                          <motion.button
                            key={opt.id}
                            type="button"
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => onTypeChange(opt.id)}
                            className={cn(
                              "px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer flex items-center gap-1.5 border",
                              isSelected
                                ? "bg-secondary text-white border-secondary shadow-sm shadow-secondary/25"
                                : "bg-gray-100/80 dark:bg-neutral-800 text-gray-700 dark:text-gray-300 border-transparent hover:bg-gray-200 dark:hover:bg-neutral-700",
                            )}
                          >
                            {isSelected && (
                              <Check className="w-3.5 h-3.5 stroke-[3]" />
                            )}
                            {opt.label}
                          </motion.button>
                        );
                      })}
                </div>
              </div>

              {/* Row 3: Price Range Filter */}
              <div className="space-y-3 pt-1 border-t border-gray-100 dark:border-neutral-800/80">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    <CircleDollarSign className="w-4 h-4 text-secondary" />
                    <span>
                      <FormattedMessage id="products.filters.priceRange" />
                    </span>
                  </div>

                  <span className="text-xs font-extrabold text-secondary bg-secondary-50 dark:bg-secondary-950/50 px-2.5 py-1 rounded-lg border border-secondary/20">
                    {priceRange[0]} ج.م — {priceRange[1]} ج.م
                  </span>
                </div>

                {/* Preset Quick Range Buttons */}
                <div className="flex flex-wrap gap-2">
                  {predefinedPriceRanges.map((preset, idx) => {
                    const isPresetActive =
                      priceRange[0] === preset.min &&
                      priceRange[1] === preset.max;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() =>
                          onPriceRangeChange([preset.min, preset.max])
                        }
                        className={cn(
                          "px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer border",
                          isPresetActive
                            ? "bg-primary-300 dark:bg-primary-900 text-primary-950 dark:text-primary-100 border-primary-400"
                            : "bg-gray-50 dark:bg-neutral-800 text-gray-600 dark:text-gray-400 border-gray-200/60 dark:border-neutral-700/60 hover:bg-gray-100 dark:hover:bg-neutral-700",
                        )}
                      >
                        {preset.label}
                      </button>
                    );
                  })}
                </div>

                {/* Dual/Slider inputs */}
                <div className="grid grid-cols-2 gap-4 pt-1">
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-gray-500 dark:text-gray-400">
                      <FormattedMessage id="products.filters.minPrice" /> (ج.م)
                    </label>
                    <input
                      type="number"
                      min={minPossiblePrice}
                      max={priceRange[1]}
                      step={50}
                      value={priceRange[0]}
                      onChange={(e) => {
                        const val = Math.max(
                          minPossiblePrice,
                          Math.min(Number(e.target.value), priceRange[1]),
                        );
                        onPriceRangeChange([val, priceRange[1]]);
                      }}
                      className="w-full h-9 px-3 rounded-xl bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 text-xs font-bold text-gray-900 dark:text-white focus:outline-none focus:border-secondary"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-gray-500 dark:text-gray-400">
                      <FormattedMessage id="products.filters.maxPrice" /> (ج.م)
                    </label>
                    <input
                      type="number"
                      min={priceRange[0]}
                      max={maxPossiblePrice}
                      step={50}
                      value={priceRange[1]}
                      onChange={(e) => {
                        const val = Math.min(
                          maxPossiblePrice,
                          Math.max(Number(e.target.value), priceRange[0]),
                        );
                        onPriceRangeChange([priceRange[0], val]);
                      }}
                      className="w-full h-9 px-3 rounded-xl bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 text-xs font-bold text-gray-900 dark:text-white focus:outline-none focus:border-secondary"
                    />
                  </div>
                </div>
              </div>

              {/* Row 4: Rating Filter */}
              <div className="space-y-3 pt-2 border-t border-gray-100 dark:border-neutral-800/80">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span>
                    <FormattedMessage id="products.filters.rating" />
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { rate: 0, labelKey: "products.filter.all" },
                    { rate: 4.0, label: "+4.0" },
                    { rate: 4.5, label: "+4.5" },
                    { rate: 4.8, label: "+4.8" },
                  ].map((item) => {
                    const isSelected = minRating === item.rate;
                    const count = filterMeta?.ratingCounts?.[item.rate];
                    return (
                      <button
                        key={item.rate}
                        type="button"
                        onClick={() => onMinRatingChange(item.rate)}
                        className={cn(
                          "py-2 px-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer flex items-center justify-center gap-1 border",
                          isSelected
                            ? "bg-secondary text-white border-secondary shadow-xs shadow-secondary/20"
                            : "bg-gray-50 dark:bg-neutral-800/90 text-gray-700 dark:text-gray-300 border-gray-200/70 dark:border-neutral-700/70 hover:bg-gray-100 dark:hover:bg-neutral-700",
                        )}
                      >
                        {item.rate > 0 && (
                          <Star
                            className={cn(
                              "w-3.5 h-3.5 shrink-0",
                              isSelected
                                ? "fill-white text-white"
                                : "fill-amber-400 text-amber-400",
                            )}
                          />
                        )}
                        <span>
                          {item.labelKey ? (
                            <FormattedMessage id={item.labelKey} />
                          ) : (
                            item.label
                          )}
                        </span>
                        {count !== undefined && item.rate > 0 && (
                          <span
                            className={cn(
                              "text-[10px] font-normal",
                              isSelected ? "text-white/80" : "text-gray-400",
                            )}
                          >
                            ({count})
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
      </div>
    </div>
  );
};

export default ProductFilters;
