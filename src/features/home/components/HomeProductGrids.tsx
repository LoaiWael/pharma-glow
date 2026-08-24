import React from "react";
import { motion } from "motion/react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useIntl, FormattedMessage } from "react-intl";
import { Link } from "react-router-dom";
import ProductCard from "@/features/products/components/ProductCard";
import ProductCardMobile from "@/features/products/components/ProductCardMobile";
import { mockProducts } from "@/features/products/data/mockProducts";
import type { Product } from "@/features/products/types/product";

interface ProductCarouselSectionProps {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  badgeLabel?: React.ReactNode;
  badgeBg?: string;
  cardBg?: string;
  products: Product[];
  viewAllHref: string;
}

export const ProductCarouselCardSection: React.FC<
  ProductCarouselSectionProps
> = ({ title, subtitle, products, viewAllHref }) => {
  const intl = useIntl();
  const isRtl = intl.locale === "ar";

  const displayedProducts = products.slice(0, 4);

  if (displayedProducts.length === 0) return null;

  return (
    <div className="flex flex-col justify-between">
      {/* Top Section Header */}
      <div className="flex items-end justify-between gap-3 mb-4">
        <div className="space-y-1">
          <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white leading-snug">
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

      {/* Grid of Products (Max 4) */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-3 md:gap-3 lg:gap-3.5">
        {displayedProducts.map((product) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3 }}
            className="flex w-full"
          >
            <div className="w-full sm:hidden">
              <ProductCardMobile product={product} className="h-full w-full" />
            </div>
            <div className="hidden sm:flex w-full">
              <ProductCard product={product} className="h-full w-full" />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export const ProductCarouselSection = ProductCarouselCardSection;

export const HomeBadgeGrids: React.FC = () => {
  const intl = useIntl();

  const bestOfUsProducts = mockProducts.filter((p) => p.badge === "best_of_us");
  const mostOrderedProducts = mockProducts.filter(
    (p) => p.badge === "most_ordered",
  );
  const discountProducts = mockProducts.filter(
    (p) =>
      p.badge === "discount" || (p.discountPercent && p.discountPercent > 0),
  );
  const newProducts = mockProducts.filter((p) => p.badge === "new");

  return (
    <section className="my-8 md:my-12">
      <div className="flex flex-col gap-10 md:gap-14">
        {/* Best of Us */}
        <ProductCarouselCardSection
          badgeLabel={<FormattedMessage id="product.bestOfUs" />}
          badgeBg="bg-primary-200 text-primary-900 border-primary-300 dark:bg-primary-900 dark:text-primary-100"
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
          title={intl.formatMessage({ id: "home.sections.new.title" })}
          subtitle={intl.formatMessage({ id: "home.sections.new.subtitle" })}
          products={newProducts}
          viewAllHref="/products?badge=new"
        />
      </div>
    </section>
  );
};

export const HomeCategoryGrids: React.FC = () => {
  const intl = useIntl();

  const skinCareProducts = mockProducts.filter(
    (p) => p.category === "skin_care",
  );
  const bodyCareProducts = mockProducts.filter(
    (p) => p.category === "body_care",
  );

  return (
    <section className="my-8 md:my-12">
      <div className="flex flex-col gap-10 md:gap-14">
        {/* Skin Care Category Grid Cell */}
        <ProductCarouselCardSection
          badgeLabel={<FormattedMessage id="category.skincare.title" />}
          badgeBg="bg-secondary-600 text-white border-secondary-700 dark:bg-secondary-800 dark:text-secondary-100"
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
          title={intl.formatMessage({ id: "home.category.bodycare.title" })}
          subtitle={intl.formatMessage({
            id: "home.category.bodycare.subtitle",
          })}
          products={bodyCareProducts}
          viewAllHref="/products?category=body_care"
        />
      </div>
    </section>
  );
};
