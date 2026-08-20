import React, { useState, useRef, useCallback } from "react";
import { Heart, Share2, ZoomIn, ChevronLeft, ChevronRight, Check } from "lucide-react";
import { useIntl } from "react-intl";
import { cn } from "@/lib/utils";
import { DEFAULT_LOCALE, isLocale, LOCALE_DIR } from "@/i18n/locales";

interface ProductImageGalleryProps {
  images?: string[];
  title: string;
  badge?: string;
  badgeText?: string;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
  className?: string;
}

export const ProductImageGallery: React.FC<ProductImageGalleryProps> = ({
  images = [],
  title,
  badge,
  badgeText,
  isFavorite = false,
  onToggleFavorite,
  className,
}) => {
  const intl = useIntl();
  const locale = isLocale(intl.locale) ? intl.locale : DEFAULT_LOCALE;
  const isRtl = LOCALE_DIR[locale] === "rtl";

  const allImages =
    images.length > 0
      ? images
      : [
          "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=1200&q=85",
        ];

  const [activeIndex, setActiveIndex] = useState(0);
  const [isZooming, setIsZooming] = useState(false);
  const [copied, setCopied] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const zoomLayerRef = useRef<HTMLDivElement>(null);
  const rafIdRef = useRef<number | null>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || !zoomLayerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const percentX = Math.max(0, Math.min(100, (x / rect.width) * 100));
    const percentY = Math.max(0, Math.min(100, (y / rect.height) * 100));

    // Use requestAnimationFrame for 60fps / 120fps hardware accelerated updates without React state re-renders
    if (rafIdRef.current) {
      cancelAnimationFrame(rafIdRef.current);
    }

    rafIdRef.current = requestAnimationFrame(() => {
      if (zoomLayerRef.current) {
        zoomLayerRef.current.style.backgroundPosition = `${percentX}% ${percentY}%`;
      }
    });
  }, []);

  const handleMouseEnter = () => {
    setIsZooming(true);
  };

  const handleMouseLeave = () => {
    setIsZooming(false);
    if (rafIdRef.current) {
      cancelAnimationFrame(rafIdRef.current);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          url: window.location.href,
        });
      } catch {
        // Fallback
      }
    } else {
      navigator.clipboard?.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : allImages.length - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveIndex((prev) => (prev < allImages.length - 1 ? prev + 1 : 0));
  };

  return (
    <div
      className={cn(
        "relative flex flex-col-reverse lg:flex-row gap-3 select-none",
        className,
      )}
    >
      {/* Thumbnail Bar */}
      <div className="flex lg:flex-col gap-2.5 overflow-x-auto lg:overflow-y-auto max-h-[520px] scrollbar-none py-1 px-0.5">
        {allImages.map((img, idx) => {
          const isSelected = idx === activeIndex;
          return (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveIndex(idx)}
              onMouseEnter={() => setActiveIndex(idx)}
              className={cn(
                "relative flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 transition-all duration-200 bg-white dark:bg-neutral-900 p-1 cursor-pointer focus:outline-none",
                isSelected
                  ? "border-secondary ring-2 ring-secondary/20 shadow-xs scale-105"
                  : "border-border hover:border-secondary/50 opacity-75 hover:opacity-100",
              )}
              aria-label={`Thumbnail ${idx + 1}`}
            >
              <img
                src={img}
                alt={`${title} - view ${idx + 1}`}
                className="w-full h-full object-contain object-center rounded-lg"
              />
            </button>
          );
        })}
      </div>

      {/* Main Image Stage */}
      <div className="relative flex-1 bg-white dark:bg-neutral-900 rounded-2xl border border-border/80 shadow-xs overflow-hidden">
        {/* Floating Badges */}
        <div className="absolute top-3.5 start-3.5 z-20 flex flex-col gap-1.5 pointer-events-none">
          {badge && (
            <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-secondary text-secondary-foreground shadow-xs">
              {badgeText ||
                (badge === "best_of_us"
                  ? intl.formatMessage({ id: "product.bestOfUs", defaultMessage: "أفضل المنتجات" })
                  : badge === "most_ordered"
                    ? intl.formatMessage({ id: "product.mostOrdered", defaultMessage: "الأكثر طلباً" })
                    : badge === "discount"
                      ? intl.formatMessage({ id: "product.discount", defaultMessage: "الخصومات والعروض" })
                      : badge === "new"
                        ? intl.formatMessage({ id: "product.new", defaultMessage: "وصل حديثاً" })
                        : badge)}
            </span>
          )}
        </div>

        {/* Action Buttons (Wishlist & Share) */}
        <div className="absolute top-3.5 end-3.5 z-20 flex items-center gap-2">
          <button
            type="button"
            onClick={handleShare}
            className="w-9 h-9 rounded-full bg-white/90 dark:bg-neutral-800/90 backdrop-blur-xs border border-border flex items-center justify-center text-tertiary hover:text-secondary hover:bg-white transition-colors shadow-xs cursor-pointer"
            title={intl.formatMessage({ id: "product.shareProduct", defaultMessage: "مشاركة المنتج" })}
            aria-label={intl.formatMessage({ id: "product.shareProduct", defaultMessage: "مشاركة المنتج" })}
          >
            {copied ? (
              <Check className="w-4 h-4 text-emerald-600" />
            ) : (
              <Share2 className="w-4 h-4" />
            )}
          </button>
          <button
            type="button"
            onClick={onToggleFavorite}
            className={cn(
              "w-9 h-9 rounded-full bg-white/90 dark:bg-neutral-800/90 backdrop-blur-xs border border-border flex items-center justify-center transition-colors shadow-xs cursor-pointer",
              isFavorite
                ? "text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                : "text-tertiary hover:text-rose-500 hover:bg-white",
            )}
            title={intl.formatMessage({ id: "product.addToWishlist", defaultMessage: "إضافة للمفضلة" })}
            aria-label={intl.formatMessage({ id: "product.addToWishlist", defaultMessage: "إضافة للمفضلة" })}
          >
            <Heart className={cn("w-4 h-4", isFavorite && "fill-current")} />
          </button>
        </div>

        {/* Zoomable Container Viewport with 60/120fps Direct GPU Acceleration */}
        <div
          ref={containerRef}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onMouseMove={handleMouseMove}
          className="relative w-full aspect-square flex items-center justify-center p-4 cursor-crosshair overflow-hidden"
        >
          {/* Base Static Image */}
          <img
            src={allImages[activeIndex]}
            alt={title}
            className={cn(
              "w-full h-full object-contain object-center pointer-events-none transition-opacity duration-150",
              isZooming ? "opacity-0" : "opacity-100",
            )}
          />

          {/* High-Performance Zoomed Layer with Hardware Acceleration */}
          <div
            ref={zoomLayerRef}
            className={cn(
              "absolute inset-0 w-full h-full pointer-events-none transition-opacity duration-150 will-change-[background-position]",
              isZooming ? "opacity-100" : "opacity-0",
            )}
            style={{
              backgroundImage: `url(${allImages[activeIndex]})`,
              backgroundPosition: "50% 50%",
              backgroundSize: "240%",
              backgroundRepeat: "no-repeat",
            }}
          />

          {/* Mobile navigation arrows */}
          {allImages.length > 1 && (
            <div className="lg:hidden absolute inset-x-2 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none">
              <button
                type="button"
                onClick={handlePrev}
                className="pointer-events-auto w-8 h-8 rounded-full bg-white/80 dark:bg-neutral-800/80 shadow-md border border-border flex items-center justify-center text-foreground cursor-pointer"
                aria-label="Previous image"
              >
                {isRtl ? (
                  <ChevronRight className="w-4 h-4" />
                ) : (
                  <ChevronLeft className="w-4 h-4" />
                )}
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="pointer-events-auto w-8 h-8 rounded-full bg-white/80 dark:bg-neutral-800/80 shadow-md border border-border flex items-center justify-center text-foreground cursor-pointer"
                aria-label="Next image"
              >
                {isRtl ? (
                  <ChevronLeft className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </button>
            </div>
          )}

          {/* Hint badge */}
          <div className="hidden lg:flex absolute bottom-3 end-3 z-10 items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 text-white text-[11px] backdrop-blur-xs pointer-events-none opacity-75">
            <ZoomIn className="w-3.5 h-3.5" />
            <span>
              {intl.formatMessage({
                id: "product.hoverToZoom",
                defaultMessage: "مرر للتكبير",
              })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductImageGallery;
