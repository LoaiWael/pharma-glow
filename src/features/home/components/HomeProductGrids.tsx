import React from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useIntl, FormattedMessage } from "react-intl";
import { Link } from "react-router-dom";
import ProductCard from "@/features/products/components/ProductCard";
import ProductCardMobile from "@/features/products/components/ProductCardMobile";
import {
  ProductGridSkeleton,
  useProducts,
  type Product,
} from "@/features/products";

interface ProductCarouselSectionProps {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  badgeLabel?: React.ReactNode;
  badgeBg?: string;
  cardBg?: string;
  products: Product[];
  viewAllHref: string;
  isPending?: boolean;
}

export const ProductCarouselCardSection: React.FC<
  ProductCarouselSectionProps
> = ({ title, subtitle, products, viewAllHref, isPending = false }) => {
  const intl = useIntl();
  const isRtl = intl.locale === "ar";

  const displayedProducts = products.slice(0, 4);

  return (
    <div className="flex flex-col justify-between">
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

      <AnimatePresence mode="wait">
        {isPending ? (
          <ProductGridSkeleton
            count={4}
            className="!grid-cols-2 sm:!grid-cols-2 md:!grid-cols-3 lg:!grid-cols-4"
          />
        ) : displayedProducts.length === 0 ? null : (
          <motion.div
            key="home-carousel-grid"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-3 md:gap-3 lg:gap-3.5"
          >
            {displayedProducts.map((product) => (
              <motion.div
                key={product.slug ?? product.id}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3 }}
                className="flex w-full"
              >
                <div className="w-full sm:hidden">
                  <ProductCardMobile
                    product={product}
                    className="h-full w-full"
                  />
                </div>
                <div className="hidden sm:flex w-full">
                  <ProductCard product={product} className="h-full w-full" />
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const ProductCarouselSection = ProductCarouselCardSection;

export const HomeBadgeGrids: React.FC = () => {
  const intl = useIntl();

  const bestOfUs = useProducts({ activeFilter: "best_of_us", perPage: 8 });
  const mostOrdered = useProducts({
    activeFilter: "most_ordered",
    perPage: 8,
  });
  const discount = useProducts({ activeFilter: "discount", perPage: 8 });
  const newArrivals = useProducts({ activeFilter: "new", perPage: 8 });

  return (
    <section className="my-8 md:my-12">
      <div className="flex flex-col gap-10 md:gap-14">
        <ProductCarouselCardSection
          badgeLabel={<FormattedMessage id="product.bestOfUs" />}
          badgeBg="bg-primary-200 text-primary-900 border-primary-300 dark:bg-primary-900 dark:text-primary-100"
          title={intl.formatMessage({ id: "home.sections.bestOfUs.title" })}
          subtitle={intl.formatMessage({
            id: "home.sections.bestOfUs.subtitle",
          })}
          products={bestOfUs.data ?? []}
          isPending={bestOfUs.isPending}
          viewAllHref="/products?badge=best_of_us"
        />

        <ProductCarouselCardSection
          badgeLabel={<FormattedMessage id="product.mostOrdered" />}
          badgeBg="bg-secondary-200 text-secondary-900 border-secondary-300 dark:bg-secondary-900 dark:text-secondary-100"
          title={intl.formatMessage({
            id: "home.sections.mostOrdered.title",
          })}
          subtitle={intl.formatMessage({
            id: "home.sections.mostOrdered.subtitle",
          })}
          products={mostOrdered.data ?? []}
          isPending={mostOrdered.isPending}
          viewAllHref="/products?badge=most_ordered"
        />

        <ProductCarouselCardSection
          badgeLabel={<FormattedMessage id="product.discount" />}
          badgeBg="bg-tertiary-200 text-tertiary-900 border-tertiary-300 dark:bg-tertiary-900 dark:text-tertiary-100"
          title={intl.formatMessage({ id: "home.sections.discount.title" })}
          subtitle={intl.formatMessage({
            id: "home.sections.discount.subtitle",
          })}
          products={discount.data ?? []}
          isPending={discount.isPending}
          viewAllHref="/products?badge=discount"
        />

        <ProductCarouselCardSection
          badgeLabel={<FormattedMessage id="product.new" />}
          badgeBg="bg-primary-600 text-white border-primary-700 dark:bg-primary-800 dark:text-primary-100"
          title={intl.formatMessage({ id: "home.sections.new.title" })}
          subtitle={intl.formatMessage({ id: "home.sections.new.subtitle" })}
          products={newArrivals.data ?? []}
          isPending={newArrivals.isPending}
          viewAllHref="/products?badge=new"
        />
      </div>
    </section>
  );
};

export const HomeCategoryGrids: React.FC = () => {
  const intl = useIntl();

  const skinCare = useProducts({ category: "skin_care", perPage: 8 });
  const bodyCare = useProducts({ category: "body_care", perPage: 8 });

  return (
    <section className="my-8 md:my-12">
      <div className="flex flex-col gap-10 md:gap-14">
        <ProductCarouselCardSection
          badgeLabel={<FormattedMessage id="category.skincare.title" />}
          badgeBg="bg-secondary-600 text-white border-secondary-700 dark:bg-secondary-800 dark:text-secondary-100"
          title={intl.formatMessage({ id: "home.category.skincare.title" })}
          subtitle={intl.formatMessage({
            id: "home.category.skincare.subtitle",
          })}
          products={skinCare.data ?? []}
          isPending={skinCare.isPending}
          viewAllHref="/products?category=skin_care"
        />

        <ProductCarouselCardSection
          badgeLabel={<FormattedMessage id="category.bodycare.title" />}
          badgeBg="bg-tertiary-600 text-white border-tertiary-700 dark:bg-tertiary-800 dark:text-tertiary-100"
          title={intl.formatMessage({ id: "home.category.bodycare.title" })}
          subtitle={intl.formatMessage({
            id: "home.category.bodycare.subtitle",
          })}
          products={bodyCare.data ?? []}
          isPending={bodyCare.isPending}
          viewAllHref="/products?category=body_care"
        />
      </div>
    </section>
  );
};
