import React, { useRef, useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, ChevronRight, ArrowLeft, ArrowRight } from "lucide-react";
import { useIntl, FormattedMessage } from "react-intl";
import { Link } from "react-router-dom";
import ProductCard from "@/features/products/components/ProductCard";
import { mockProducts } from "@/features/products/data/mockProducts";
import type { Product } from "@/features/products/types/product";
import { cn } from "@/lib/utils";

interface ProductCarouselSectionProps {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  badgeLabel?: React.ReactNode;
  badgeBg?: string;
  cardBg?: string;
  products: Product[];
  viewAllHref: string;
}

export const ProductCarouselCardSection: React.FC<ProductCarouselSectionProps> = ({
  title,
  subtitle,
  badgeLabel,
  badgeBg = "bg-secondary-200 text-secondary-900 border-secondary-300 dark:bg-secondary-900 dark:text-secondary-100",
  cardBg = "bg-primary-50/80 dark:bg-primary-950/20 border-primary-200/80 dark:border-primary-900/40",
  products,
  viewAllHref,
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
      const isAtRightEdge = absScroll < 5 || (scrollLeft > 0 && Math.abs(scrollLeft - maxScroll) < 5);
      const isAtLeftEdge = Math.abs(absScroll - maxScroll) < 5 || (scrollLeft < 0 && Math.abs(absScroll - maxScroll) < 5);

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
    <div
      className={cn(
        "relative rounded-3xl p-5 md:p-6 border shadow-xs transition-all flex flex-col justify-between overflow-hidden",
        cardBg
      )}
    >
      {/* Top Section Header */}
      <div className="flex items-start justify-between gap-3 mb-4">
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
          <h3 className="text-xl md:text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight leading-snug">
            {title}
          </h3>
          {subtitle && (
            <p className="text-xs md:text-sm text-tertiary-700 dark:text-tertiary-300 line-clamp-1">
              {subtitle}
            </p>
          )}
        </div>

        {/* View All Link */}
        <Link
          to={viewAllHref}
          viewTransition={true}
          className="inline-flex items-center gap-1 text-xs md:text-sm font-bold text-secondary hover:text-secondary-700 dark:text-secondary-400 transition-colors shrink-0 pt-1 group"
        >
          <span>
            <FormattedMessage id="home.sections.viewAll" />
          </span>
          {isRtl ? (
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          ) : (
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          )}
        </Link>
      </div>

      {/* Carousel Track Container with Side Arrows */}
      <div className="relative group/carousel my-auto">
        {/* Left Side Navigation Arrow (Scrolls content to the Left) */}
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
              aria-label={intl.formatMessage({ id: "home.sections.prev" })}
              className="absolute left-1 top-1/2 -translate-y-1/2 z-20 w-9 h-9 md:w-10 md:h-10 rounded-full bg-white/90 dark:bg-neutral-800/90 backdrop-blur-md border border-tertiary-200 dark:border-neutral-700 text-tertiary-800 dark:text-neutral-100 shadow-md flex items-center justify-center hover:bg-white dark:hover:bg-neutral-700 transition-all"
            >
              <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
            </motion.button>
          )}
        </AnimatePresence>

        {/* Right Side Navigation Arrow (Scrolls content to the Right) */}
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
              aria-label={intl.formatMessage({ id: "home.sections.next" })}
              className="absolute right-1 top-1/2 -translate-y-1/2 z-20 w-9 h-9 md:w-10 md:h-10 rounded-full bg-white/90 dark:bg-neutral-800/90 backdrop-blur-md border border-tertiary-200 dark:border-neutral-700 text-tertiary-800 dark:text-neutral-100 shadow-md flex items-center justify-center hover:bg-white dark:hover:bg-neutral-700 transition-all"
            >
              <ChevronRight className="w-5 h-5 stroke-[2.5]" />
            </motion.button>
          )}
        </AnimatePresence>

        {/* Scrollable Products Carousel with Snap Centering on Small Screens */}
        <div
          ref={scrollContainerRef}
          className="flex gap-3.5 md:gap-4 overflow-x-auto scroll-smooth scrollbar-none snap-x snap-mandatory sm:snap-none py-2 px-1 -mx-1 select-none"
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
    </div>
  );
};

export const ProductCarouselSection = ProductCarouselCardSection;

export const HomeBadgeGrids: React.FC = () => {
  const intl = useIntl();

  const bestOfUsProducts = mockProducts.filter((p) => p.badge === "best_of_us");
  const mostOrderedProducts = mockProducts.filter(
    (p) => p.badge === "most_ordered"
  );
  const discountProducts = mockProducts.filter(
    (p) =>
      p.badge === "discount" || (p.discountPercent && p.discountPercent > 0)
  );
  const newProducts = mockProducts.filter((p) => p.badge === "new");

  return (
    <section className="py-6 md:py-10">
      <div className="container mx-auto px-4 md:px-6">
        {/* 2 Columns Grid Layout on Large Screens */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Best of Us */}
          <ProductCarouselCardSection
            badgeLabel={<FormattedMessage id="product.bestOfUs" />}
            badgeBg="bg-primary-200 text-primary-900 border-primary-300 dark:bg-primary-900 dark:text-primary-100"
            cardBg="bg-primary-50/80 dark:bg-primary-950/20 border-primary-200/80 dark:border-primary-900/40"
            title={intl.formatMessage({ id: "home.sections.bestOfUs.title" })}
            subtitle={intl.formatMessage({
              id: "home.sections.bestOfUs.subtitle",
            })}
            products={bestOfUsProducts}
            viewAllHref="/products?badge=best_of_us"
          />

          {/* Most Ordered */}
          <ProductCarouselCardSection
            badgeLabel={<FormattedMessage id="product.mostOrdered" />}
            badgeBg="bg-secondary-200 text-secondary-900 border-secondary-300 dark:bg-secondary-900 dark:text-secondary-100"
            cardBg="bg-secondary-50/80 dark:bg-secondary-950/20 border-secondary-200/80 dark:border-secondary-900/40"
            title={intl.formatMessage({
              id: "home.sections.mostOrdered.title",
            })}
            subtitle={intl.formatMessage({
              id: "home.sections.mostOrdered.subtitle",
            })}
            products={mostOrderedProducts}
            viewAllHref="/products?badge=most_ordered"
          />

          {/* Discounts & Offers */}
          <ProductCarouselCardSection
            badgeLabel={<FormattedMessage id="product.discount" />}
            badgeBg="bg-tertiary-200 text-tertiary-900 border-tertiary-300 dark:bg-tertiary-900 dark:text-tertiary-100"
            cardBg="bg-tertiary-50/80 dark:bg-tertiary-950/20 border-tertiary-200/80 dark:border-tertiary-900/40"
            title={intl.formatMessage({ id: "home.sections.discount.title" })}
            subtitle={intl.formatMessage({
              id: "home.sections.discount.subtitle",
            })}
            products={discountProducts}
            viewAllHref="/products?badge=discount"
          />

          {/* New Arrivals */}
          <ProductCarouselCardSection
            badgeLabel={<FormattedMessage id="product.new" />}
            badgeBg="bg-primary-600 text-white border-primary-700 dark:bg-primary-800 dark:text-primary-100"
            cardBg="bg-primary-100/60 dark:bg-primary-950/30 border-primary-200 dark:border-primary-900/50"
            title={intl.formatMessage({ id: "home.sections.new.title" })}
            subtitle={intl.formatMessage({ id: "home.sections.new.subtitle" })}
            products={newProducts}
            viewAllHref="/products?badge=new"
          />
        </div>
      </div>
    </section>
  );
};

export const HomeCategoryGrids: React.FC = () => {
  const intl = useIntl();

  const skinCareProducts = mockProducts.filter(
    (p) => p.category === "skin_care"
  );
  const bodyCareProducts = mockProducts.filter(
    (p) => p.category === "body_care"
  );

  return (
    <section className="py-6 md:py-10">
      <div className="container mx-auto px-4 md:px-6">
        {/* 2 Columns Grid Layout on Large Screens */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Skin Care Category Grid Cell */}
          <ProductCarouselCardSection
            badgeLabel={<FormattedMessage id="category.skincare.title" />}
            badgeBg="bg-secondary-600 text-white border-secondary-700 dark:bg-secondary-800 dark:text-secondary-100"
            cardBg="bg-secondary-100/50 dark:bg-secondary-950/30 border-secondary-200 dark:border-secondary-900/50"
            title={intl.formatMessage({ id: "home.category.skincare.title" })}
            subtitle={intl.formatMessage({
              id: "home.category.skincare.subtitle",
            })}
            products={skinCareProducts}
            viewAllHref="/products?category=skin_care"
          />

          {/* Body Care Category Grid Cell */}
          <ProductCarouselCardSection
            badgeLabel={<FormattedMessage id="category.bodycare.title" />}
            badgeBg="bg-tertiary-600 text-white border-tertiary-700 dark:bg-tertiary-800 dark:text-tertiary-100"
            cardBg="bg-tertiary-100/50 dark:bg-tertiary-950/30 border-tertiary-200 dark:border-tertiary-900/50"
            title={intl.formatMessage({ id: "home.category.bodycare.title" })}
            subtitle={intl.formatMessage({
              id: "home.category.bodycare.subtitle",
            })}
            products={bodyCareProducts}
            viewAllHref="/products?category=body_care"
          />
        </div>
      </div>
    </section>
  );
};
