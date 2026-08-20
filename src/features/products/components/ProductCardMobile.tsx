import React, { useState } from "react";
import { motion } from "motion/react";
import {
  Check,
  Heart,
  Image as ImageIcon,
  Plus,
  Star,
  Truck,
} from "lucide-react";
import { useIntl, FormattedMessage } from "react-intl";
import { useNavigate } from "react-router-dom";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import {
  DEFAULT_LOCALE,
  isLocale,
  LOCALE_DIR,
  type Locale,
} from "@/i18n/locales";
import { cn } from "@/lib/utils";
import type { ProductCardProps } from "@/features/products/types/product";

const ProductImage: React.FC<{
  src?: string;
  alt: string;
  className?: string;
}> = ({ src, alt, className }) => {
  const [hasError, setHasError] = useState(false);

  if (!src || hasError) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 dark:bg-neutral-800 text-gray-400 dark:text-gray-500 p-2 text-center select-none">
        <ImageIcon className="w-8 h-8 stroke-[1.25]" />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setHasError(true)}
      className={className}
    />
  );
};

export const ProductCardMobile: React.FC<ProductCardProps> = ({
  product,
  id: propId,
  title: propTitle,
  image: propImage,
  images: propImages,
  price: propPrice,
  originalPrice: propOriginalPrice,
  discountPercent: propDiscountPercent,
  badge: propBadge,
  badgeText: propBadgeText,
  rating: propRating,
  reviewCount: propReviewCount,
  isFreeDelivery: propIsFreeDelivery,
  isFavorite: propIsFavorite,
  currencySymbol = "جنيه",
  className,
  onAddToCart,
  onToggleFavorite,
  onClick,
}) => {
  const intl = useIntl();
  const navigate = useNavigate();
  const locale: Locale = isLocale(intl.locale) ? intl.locale : DEFAULT_LOCALE;
  const direction = LOCALE_DIR[locale];

  const id = product?.id ?? propId ?? "1";
  const title = product?.titleAr ?? product?.title ?? propTitle ?? "";
  const singleImage = product?.image ?? propImage;
  const imageList =
    product?.images && product.images.length > 0
      ? product.images.filter(Boolean)
      : propImages && propImages.length > 0
        ? propImages.filter(Boolean)
        : singleImage
          ? [singleImage]
          : [];

  const price = product?.price ?? propPrice ?? 0;
  const originalPrice = product?.originalPrice ?? propOriginalPrice;

  const calculatedDiscount =
    originalPrice && originalPrice > price
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : undefined;
  const discountPercent =
    product?.discountPercent ?? propDiscountPercent ?? calculatedDiscount;

  const badge = product?.badge ?? propBadge ?? "best_of_us";
  const badgeTextProp = product?.badgeText ?? propBadgeText;
  const rating = product?.rating ?? propRating ?? 4.4;
  const reviewCount = product?.reviewCount ?? propReviewCount ?? 144;
  const isFreeDelivery = product?.isFreeDelivery ?? propIsFreeDelivery ?? true;
  const initialIsFavorite = product?.isFavorite ?? propIsFavorite ?? false;

  const [favState, setFavState] = useState<boolean>(initialIsFavorite);
  const [isAdded, setIsAdded] = useState<boolean>(false);
  const [api, setApi] = useState<CarouselApi>();
  const [currentSlide, setCurrentSlide] = useState<number>(0);

  React.useEffect(() => {
    if (!api) return;
    setCurrentSlide(api.selectedScrollSnap());
    const onSelect = () => {
      setCurrentSlide(api.selectedScrollSnap());
    };
    api.on("select", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  const getBadgeConfig = () => {
    if (badgeTextProp) {
      return { text: badgeTextProp, bg: "bg-tertiary-600 text-white" };
    }
    switch (badge) {
      case "best_of_us":
        return {
          text: intl.formatMessage({ id: "product.bestOfUs" }),
          bg: "bg-tertiary text-white",
        };
      case "most_ordered":
        return {
          text: intl.formatMessage({ id: "product.mostOrdered" }),
          bg: "bg-tertiary-700 text-white",
        };
      case "discount":
        return {
          text: discountPercent
            ? `${intl.formatMessage({ id: "product.discount" })} ${discountPercent}%`
            : intl.formatMessage({ id: "product.discount" }),
          bg: "bg-tertiary text-white",
        };
      case "new":
        return {
          text: intl.formatMessage({ id: "product.new" }),
          bg: "bg-tertiary-600 text-white",
        };
      default:
        return badge ? { text: badge, bg: "bg-tertiary text-white" } : null;
    }
  };

  const badgeConfig = getBadgeConfig();

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextFav = !favState;
    setFavState(nextFav);
    if (onToggleFavorite) {
      onToggleFavorite(id, nextFav);
    }
  };

  const handleAddClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1200);
    if (onAddToCart) {
      onAddToCart({
        id,
        title,
        image: imageList[0],
        price,
        originalPrice,
        discountPercent,
      });
    }
  };

  const handleCardClick = () => {
    if (onClick) {
      onClick(id);
    } else {
      navigate(`/products/${id}`, { viewTransition: true });
    }
  };

  const formattedPrice = intl.formatNumber(price);
  const formattedOriginalPrice = originalPrice
    ? intl.formatNumber(originalPrice)
    : null;
  const formattedReviewCount = intl.formatNumber(reviewCount);

  return (
    <div
      dir={direction}
      onClick={handleCardClick}
      className={cn(
        "group relative flex flex-col w-full bg-white dark:bg-neutral-900 rounded-lg border border-gray-200/80 dark:border-neutral-800 shadow-2xs overflow-hidden cursor-pointer select-none",
        className,
      )}
    >
      {/* Edge-to-edge photo with no outer padding */}
      <div className="relative w-full aspect-square bg-gray-50/80 dark:bg-neutral-800/60 overflow-hidden flex items-center justify-center">
        {badgeConfig && (
          <div className="absolute top-1.5 right-1.5 z-10">
            <span
              className={cn(
                "inline-block px-1.5 py-0.5 text-[9px] font-bold rounded shadow-2xs",
                badgeConfig.bg,
              )}
            >
              {badgeConfig.text}
            </span>
          </div>
        )}

        {/* Small Wishlist Heart Button */}
        <motion.button
          type="button"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.88 }}
          onClick={handleFavoriteClick}
          aria-label={intl.formatMessage({ id: "nav.wishlist" })}
          className="absolute top-1.5 left-1.5 z-10 w-7 h-7 bg-white/90 dark:bg-neutral-800/90 backdrop-blur-xs rounded-full shadow-2xs border border-gray-100 dark:border-neutral-700 flex items-center justify-center text-gray-500 hover:text-red-500 transition-colors"
        >
          <Heart
            className={cn(
              "w-3.5 h-3.5 transition-colors",
              favState
                ? "fill-red-500 text-red-500"
                : "text-gray-600 dark:text-gray-300",
            )}
          />
        </motion.button>

        {/* Product Image Carousel */}
        {imageList.length > 1 ? (
          <div
            className="w-full h-full relative"
            onClick={(e) => e.stopPropagation()}
          >
            <Carousel
              key={direction}
              dir={direction}
              opts={{ direction }}
              setApi={setApi}
              className="w-full h-full"
            >
              <CarouselContent className="h-full -ml-0">
                {imageList.map((imgSrc, idx) => (
                  <CarouselItem key={idx} className="pl-0 h-full">
                    <ProductImage
                      src={imgSrc}
                      alt={`${title} - ${idx + 1}`}
                      className="w-full h-full object-contain p-2 mix-blend-multiply dark:mix-blend-normal"
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>

            <div className="absolute bottom-1.5 left-0 right-0 z-10 flex items-center justify-center gap-1 pointer-events-auto">
              {imageList.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    api?.scrollTo(index);
                  }}
                  className={cn(
                    "rounded-full transition-all duration-300 focus:outline-none",
                    currentSlide === index
                      ? "w-2.5 h-1 bg-secondary"
                      : "w-1 h-1 bg-black/30 dark:bg-white/40 hover:bg-black/50",
                  )}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        ) : (
          <ProductImage
            src={imageList[0]}
            alt={title}
            className="w-full h-full object-contain p-2 mix-blend-multiply dark:mix-blend-normal"
          />
        )}
      </div>

      {/* Details Area */}
      <div className="flex flex-col flex-1 p-2 pt-1.5 space-y-1 text-right justify-between">
        <div className="space-y-1">
          <h3 className="text-xs font-semibold text-gray-900 dark:text-gray-100 leading-snug line-clamp-2 min-h-[2rem]">
            {title}
          </h3>

          {rating > 0 && (
            <div className="flex items-center justify-start gap-1">
              <div className="inline-flex items-center gap-1 bg-gray-100 dark:bg-neutral-800 text-gray-700 dark:text-gray-300 px-1.5 py-0.5 rounded text-[10px] font-semibold">
                <span className="text-gray-500 dark:text-gray-400 font-normal">
                  ({formattedReviewCount})
                </span>
                <span className="text-gray-900 dark:text-white font-bold">
                  {rating}
                </span>
                <Star className="w-2.5 h-2.5 fill-emerald-500 text-emerald-500 stroke-none" />
              </div>
            </div>
          )}

          {isFreeDelivery && (
            <div className="flex items-center gap-1 text-[10px] font-medium text-gray-600 dark:text-gray-300 pt-0.5">
              <Truck className="w-3 h-3 text-blue-600 dark:text-blue-400" />
              <span>
                <FormattedMessage id="product.freeDelivery" />
              </span>
            </div>
          )}
        </div>

        {/* Bottom Bar: Price & Add Button */}
        <div className="flex items-center justify-between pt-1 gap-1">
          <div className="flex flex-col justify-center min-w-0">
            <div className="flex items-baseline gap-0.5 text-gray-900 dark:text-white font-extrabold text-xs leading-tight">
              <span>{formattedPrice}</span>
              <span className="text-[10px] font-bold text-gray-700 dark:text-gray-300">
                {currencySymbol}
              </span>
            </div>

            {(formattedOriginalPrice ||
              (discountPercent && discountPercent > 0)) && (
              <div className="flex items-center gap-1 pt-0.5 flex-wrap">
                {formattedOriginalPrice && (
                  <span className="line-through text-[10px] text-gray-400 dark:text-gray-500 font-medium whitespace-nowrap">
                    {formattedOriginalPrice} {currencySymbol}
                  </span>
                )}

                {discountPercent && discountPercent > 0 && (
                  <span className="text-[9px] font-bold bg-secondary-100 text-secondary-900 dark:bg-secondary-900 dark:text-secondary-100 px-1 py-0.2 rounded shrink-0">
                    -{discountPercent}%
                  </span>
                )}
              </div>
            )}
          </div>

          <motion.button
            type="button"
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleAddClick}
            aria-label={intl.formatMessage({ id: "product.addToBag" })}
            className={cn(
              "w-7 h-7 rounded-md shadow-2xs border transition-all duration-200 flex items-center justify-center focus:outline-none shrink-0 self-end",
              isAdded
                ? "bg-emerald-600 border-emerald-600 text-white"
                : "bg-secondary text-secondary-foreground border-secondary hover:bg-secondary-700",
            )}
          >
            {isAdded ? (
              <Check className="w-3.5 h-3.5 stroke-[2.5]" />
            ) : (
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            )}
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default ProductCardMobile;
