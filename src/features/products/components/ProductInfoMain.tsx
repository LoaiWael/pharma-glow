import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Star,
  ShieldCheck,
  Sparkles,
  Droplets,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useIntl } from "react-intl";
import { cn } from "@/lib/utils";
import type { Product } from "@/features/products/types/product";
import { DEFAULT_LOCALE, isLocale } from "@/i18n/locales";

interface ProductInfoMainProps {
  product: Product;
  selectedVolume?: string;
  onSelectVolume?: (vol: string) => void;
  className?: string;
}

export const ProductInfoMain: React.FC<ProductInfoMainProps> = ({
  product,
  selectedVolume,
  onSelectVolume,
  className,
}) => {
  const intl = useIntl();
  const locale = isLocale(intl.locale) ? intl.locale : DEFAULT_LOCALE;
  const isArabic = locale === "ar";

  const title = isArabic && product.titleAr ? product.titleAr : product.title;
  const brand =
    isArabic && product.brandAr
      ? product.brandAr
      : product.brand || "Pharma Glow";
  const rating = product.rating ?? 4.8;
  const reviewCount = product.reviewCount ?? 120;
  const volumeOptions =
    product.volumeOptions || (product.volume ? [product.volume] : []);

  const [activeVol, setActiveVol] = useState<string>(
    selectedVolume || volumeOptions[0] || "30 مل",
  );
  const [isDescExpanded, setIsDescExpanded] = useState(false);

  const handleVolumeChange = (vol: string) => {
    setActiveVol(vol);
    onSelectVolume?.(vol);
  };

  const reviewsPath = `/products/${product.id}/reviews`;

  return (
    <div className={cn("flex flex-col gap-4 text-foreground", className)}>
      {/* Brand Box Card */}
      <div className="flex items-center justify-between p-3.5 rounded-2xl border border-border/80 bg-white dark:bg-neutral-900 shadow-sm transition-colors">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-secondary/10 text-secondary font-bold text-base flex items-center justify-center border border-secondary/20 shrink-0 select-none">
            {brand.charAt(0)}
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-foreground leading-tight">
              {brand}
            </span>
            <span className="text-[11px] text-tertiary leading-tight mt-0.5">
              {intl.formatMessage({
                id: "product.authentic_guaranteed",
                defaultMessage: "منتجات أصلية معتمدة 100%",
              })}
            </span>
          </div>
        </div>
        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20 shrink-0 select-none">
          <ShieldCheck className="w-3.5 h-3.5" />
          {intl.formatMessage({
            id: "product.authentic_badge",
            defaultMessage: "أصلي 100%",
          })}
        </span>
      </div>

      {/* Main Title */}
      <h1 className="text-xl md:text-2xl lg:text-3xl font-bold leading-snug tracking-tight text-foreground m-0">
        {title}
      </h1>

      {/* Ratings & SKU row */}
      <div className="flex items-center gap-3 pb-2 border-b border-border/70 flex-wrap text-xs">
        <Link
          to={reviewsPath}
          viewTransition
          className="inline-flex items-center gap-1.5 bg-gray-100 dark:bg-neutral-800 text-gray-900 dark:text-white font-bold px-2.5 py-1 rounded-full text-xs cursor-pointer hover:bg-gray-200 dark:hover:bg-neutral-700 transition-colors"
        >
          <span>{rating.toFixed(1)}</span>
          <Star className="w-3.5 h-3.5 fill-emerald-500 text-emerald-500 stroke-none" />
        </Link>

        <Link
          to={reviewsPath}
          viewTransition
          className="text-tertiary hover:text-secondary underline decoration-dotted transition-colors cursor-pointer"
        >
          {intl.formatMessage(
            {
              id: "product.rating.reviewsCount",
              defaultMessage: "{count} تقييم",
            },
            { count: reviewCount },
          )}
        </Link>

        <span className="text-border">|</span>

        <span className="text-tertiary">
          {intl.formatMessage({
            id: "product.sku",
            defaultMessage: "رمز المنتج:",
          })}{" "}
          <strong className="text-foreground">
            PG-{String(product.id).toUpperCase()}
          </strong>
        </span>
      </div>

      {/* Volume / Size Options */}
      {volumeOptions.length > 0 && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-tertiary">
              {intl.formatMessage({
                id: "product.size",
                defaultMessage: "الحجم / السعة:",
              })}
            </span>
            <span className="font-bold text-foreground">{activeVol}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {volumeOptions.map((vol) => {
              const isSelected = vol === activeVol;
              return (
                <button
                  key={vol}
                  type="button"
                  onClick={() => handleVolumeChange(vol)}
                  className={cn(
                    "px-4 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer",
                    isSelected
                      ? "border-secondary bg-secondary/10 text-secondary ring-1 ring-secondary/30"
                      : "border-border bg-white dark:bg-neutral-800 text-tertiary hover:border-secondary/40",
                  )}
                >
                  {vol}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Quick Attributes: Skin Type & Ingredients */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
        {product.skinType && product.skinType.length > 0 && (
          <div className="p-3 rounded-xl border border-border/80 bg-white dark:bg-neutral-900 shadow-sm flex flex-col gap-1">
            <span className="text-[11px] font-semibold text-tertiary flex items-center gap-1">
              <Droplets className="w-3.5 h-3.5 text-secondary" />
              {intl.formatMessage({
                id: "product.skinType",
                defaultMessage: "نوع البشرة الملائم:",
              })}
            </span>
            <span className="text-foreground font-medium">
              {product.skinType.join("، ")}
            </span>
          </div>
        )}

        {product.keyIngredients && product.keyIngredients.length > 0 && (
          <div className="p-3 rounded-xl border border-border/80 bg-white dark:bg-neutral-900 shadow-sm flex flex-col gap-1">
            <span className="text-[11px] font-semibold text-tertiary flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-secondary" />
              {intl.formatMessage({
                id: "product.keyIngredients",
                defaultMessage: "المكون الفعال الأساسي:",
              })}
            </span>
            <span className="text-foreground font-medium">
              {product.keyIngredients.join("، ")}
            </span>
          </div>
        )}
      </div>

      {/* Short Description with expand/collapse */}
      {(product.descriptionAr || product.description) && (
        <div className="flex flex-col gap-1.5 text-xs text-foreground/90 leading-relaxed pt-1">
          <p
            className={cn(
              "m-0 transition-all",
              !isDescExpanded && "line-clamp-3",
            )}
          >
            {isArabic && product.descriptionAr
              ? product.descriptionAr
              : product.description || product.descriptionAr}
          </p>
          <button
            type="button"
            onClick={() => setIsDescExpanded(!isDescExpanded)}
            className="self-start text-[11px] text-secondary font-bold hover:underline flex items-center gap-0.5 cursor-pointer mt-0.5"
          >
            <span>
              {isDescExpanded
                ? intl.formatMessage({
                    id: "product.showLess",
                    defaultMessage: "عرض أقل",
                  })
                : intl.formatMessage({
                    id: "product.readMore",
                    defaultMessage: "قراءة المزيد",
                  })}
            </span>
            {isDescExpanded ? (
              <ChevronUp className="w-3 h-3" />
            ) : (
              <ChevronDown className="w-3 h-3" />
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductInfoMain;
