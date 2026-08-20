import React, { useRef, useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { useIntl } from "react-intl";
import ProductCard from "@/features/products/components/ProductCard";
import type { Product } from "@/features/products/types/product";
import { cn } from "@/lib/utils";

interface ProductRelevantCarouselProps {
  products: Product[];
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  badgeLabel?: React.ReactNode;
  badgeBg?: string;
  cardBg?: string;
  className?: string;
}

export const ProductRelevantCarousel: React.FC<ProductRelevantCarouselProps> = ({
  products = [],
  title = "منتجات مشابهة وموصى بها لروتينك",
  subtitle,
  badgeLabel,
  badgeBg = "bg-secondary-200 text-secondary-900 border-secondary-300 dark:bg-secondary-900 dark:text-secondary-100",
  cardBg = "rounded-2xl border border-border/80 bg-white dark:bg-neutral-900 p-5 md:p-6 shadow-xs",
  className,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const intl = useIntl();
  const isRtl = intl.locale === "ar";

  const [canScrollLeft, setCanScrollLeft] = useState<boolean>(false);
  const [canScrollRight, setCanScrollRight] = useState<boolean>(true);

  // Check scroll position to dynamically show/hide side arrows
  const updateScrollButtons = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;

    const { scrollLeft, scrollWidth, clientWidth } = el;
    const maxScroll = scrollWidth - clientWidth;

    if (maxScroll <= 2) {
      setCanScrollLeft(false);
      setCanScrollRight(false);
      return;
    }

    const absScroll = Math.abs(scrollLeft);

    if (isRtl) {
      // In RTL layout:
      // Content start is at far RIGHT. Content end is at far LEFT.
      const isAtRightEdge =
        absScroll < 5 ||
        (scrollLeft > 0 && Math.abs(scrollLeft - maxScroll) < 5);
      const isAtLeftEdge =
        Math.abs(absScroll - maxScroll) < 5 ||
        (scrollLeft < 0 && Math.abs(absScroll - maxScroll) < 5);

      setCanScrollRight(!isAtRightEdge);
      setCanScrollLeft(!isAtLeftEdge);
    } else {
      // In LTR layout:
      // Content start is at far LEFT. Content end is at far RIGHT.
      const isAtLeftEdge = scrollLeft <= 5;
      const isAtRightEdge = scrollLeft >= maxScroll - 5;

      setCanScrollLeft(!isAtLeftEdge);
      setCanScrollRight(!isAtRightEdge);
    }
  }, [isRtl]);

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;

    updateScrollButtons();
    el.addEventListener("scroll", updateScrollButtons, { passive: true });
    window.addEventListener("resize", updateScrollButtons);

    return () => {
      el.removeEventListener("scroll", updateScrollButtons);
      window.removeEventListener("resize", updateScrollButtons);
    };
  }, [updateScrollButtons, products]);

  const handleScrollLeft = () => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const isMobile = window.innerWidth < 640;
    const scrollAmount = isMobile ? 240 : container.clientWidth * 0.75;
    container.scrollBy({
      left: -scrollAmount,
      behavior: "smooth",
    });
  };

  const handleScrollRight = () => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const isMobile = window.innerWidth < 640;
    const scrollAmount = isMobile ? 240 : container.clientWidth * 0.75;
    container.scrollBy({
      left: scrollAmount,
      behavior: "smooth",
    });
  };

  if (products.length === 0) return null;

  return (
    <section
      className={cn(
        "relative flex flex-col gap-4 overflow-hidden",
        cardBg,
        className
      )}
    >
      {/* Top Section Header */}
      <div className="flex items-start justify-between gap-3 mb-1">
        <div className="space-y-1">
          {badgeLabel && (
            <span
              className={cn(
                "inline-flex items-center gap-1.5 text-xs font-bold px-3 py-0.5 rounded-full border shadow-2xs mb-1",
                badgeBg
              )}
            >
              {badgeLabel}
            </span>
          )}
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-secondary" />
            <h2 className="text-lg md:text-xl font-extrabold text-gray-900 dark:text-white tracking-tight leading-snug m-0">
              {title}
            </h2>
          </div>
          {subtitle && (
            <p className="text-xs md:text-sm text-tertiary-700 dark:text-tertiary-300 line-clamp-1">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Carousel Track Container with Side Animated Floating Navigation Arrows */}
      <div className="relative group/carousel my-auto">
        {/* Left Side Navigation Arrow */}
        <AnimatePresence>
          {canScrollLeft && (
            <motion.button
              type="button"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleScrollLeft}
              aria-label={intl.formatMessage({ id: "home.sections.prev", defaultMessage: "Previous" })}
              className="absolute left-1 top-1/2 -translate-y-1/2 z-20 w-9 h-9 md:w-10 md:h-10 rounded-full bg-white/90 dark:bg-neutral-800/90 backdrop-blur-md border border-gray-200 dark:border-neutral-700 text-gray-800 dark:text-neutral-100 shadow-md flex items-center justify-center hover:bg-white dark:hover:bg-neutral-700 transition-all cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
            </motion.button>
          )}
        </AnimatePresence>

        {/* Right Side Navigation Arrow */}
        <AnimatePresence>
          {canScrollRight && (
            <motion.button
              type="button"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleScrollRight}
              aria-label={intl.formatMessage({ id: "home.sections.next", defaultMessage: "Next" })}
              className="absolute right-1 top-1/2 -translate-y-1/2 z-20 w-9 h-9 md:w-10 md:h-10 rounded-full bg-white/90 dark:bg-neutral-800/90 backdrop-blur-md border border-gray-200 dark:border-neutral-700 text-gray-800 dark:text-neutral-100 shadow-md flex items-center justify-center hover:bg-white dark:hover:bg-neutral-700 transition-all cursor-pointer"
            >
              <ChevronRight className="w-5 h-5 stroke-[2.5]" />
            </motion.button>
          )}
        </AnimatePresence>

        {/* Scrollable Products Track with Smooth Snap */}
        <div
          ref={scrollContainerRef}
          className="flex gap-3.5 md:gap-4 overflow-x-auto overflow-y-clip scroll-smooth scrollbar-none snap-x snap-mandatory sm:snap-none py-2 px-1 -mx-1 select-none touch-pan-x"
        >
          {products.map((product) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3 }}
              className="w-[80vw] max-w-[230px] sm:w-[230px] md:w-[250px] shrink-0 snap-center sm:snap-start flex"
            >
              <ProductCard
                product={product}
                className="h-full w-full bg-white/95 dark:bg-neutral-900/95 shadow-2xs"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductRelevantCarousel;
