import React, { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useIntl } from "react-intl";
import { Star, ChevronLeft, ChevronRight, Home } from "lucide-react";
import { useProduct, ProductReviewsSection, ProductDetailSkeleton, ProductEmptyState } from "@/features/products";
import { isLocale, DEFAULT_LOCALE, LOCALE_DIR } from "@/i18n/locales";

export const ProductReviewsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const intl = useIntl();
  const locale = isLocale(intl.locale) ? intl.locale : DEFAULT_LOCALE;
  const isRtl = LOCALE_DIR[locale] === "rtl";

  const { data: product, isPending, isError } = useProduct(id || "");

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, [id]);

  if (isPending) {
    return (
      <main className="min-h-screen bg-neutral/20 py-8 lg:py-12">
        <ProductDetailSkeleton />
      </main>
    );
  }

  if (isError || !product) {
    return (
      <main className="min-h-screen bg-neutral/20 py-8 lg:py-12">
        <ProductEmptyState />
      </main>
    );
  }

  const categoryName =
    product.category === "skin_care"
      ? intl.formatMessage({
          id: "category.skincare.title",
          defaultMessage: "العناية بالبشرة",
        })
      : product.category === "body_care"
      ? intl.formatMessage({
          id: "category.bodycare.title",
          defaultMessage: "العناية بالجسم",
        })
      : intl.formatMessage({
          id: "products.filter.all",
          defaultMessage: "جميع المنتجات",
        });

  const categoryPath =
    product.category === "skin_care"
      ? "/skincare"
      : product.category === "body_care"
      ? "/bodycare"
      : "/products";

  const productTitle =
    locale === "ar" && product.titleAr
      ? product.titleAr
      : product.title;

  return (
    <main className="min-h-screen bg-neutral/20 py-8 lg:py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        {/* Breadcrumbs Navigation */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-1.5 text-xs text-tertiary flex-wrap mb-6"
        >
          <Link
            to="/"
            viewTransition
            className="hover:text-secondary flex items-center gap-1 transition-colors"
          >
            <Home className="w-3.5 h-3.5" />
            <span>
              {intl.formatMessage({
                id: "nav.home",
                defaultMessage: "الرئيسية",
              })}
            </span>
          </Link>
          {isRtl ? (
            <ChevronLeft className="w-3.5 h-3.5" />
          ) : (
            <ChevronRight className="w-3.5 h-3.5" />
          )}

          <Link
            to={categoryPath}
            viewTransition
            className="hover:text-secondary transition-colors"
          >
            {categoryName}
          </Link>
          {isRtl ? (
            <ChevronLeft className="w-3.5 h-3.5" />
          ) : (
            <ChevronRight className="w-3.5 h-3.5" />
          )}

          <Link
            to={`/products/${product.id}`}
            viewTransition
            className="hover:text-secondary transition-colors line-clamp-1 max-w-[200px] sm:max-w-xs"
          >
            {productTitle}
          </Link>
          {isRtl ? (
            <ChevronLeft className="w-3.5 h-3.5" />
          ) : (
            <ChevronRight className="w-3.5 h-3.5" />
          )}

          <span className="text-foreground font-semibold">
            {intl.formatMessage({
              id: "nav.reviews",
              defaultMessage: "التقييمات",
            })}
          </span>
        </nav>

        {/* Product Quick Header */}
        <div className="bg-card border border-border/70 rounded-3xl p-6 mb-8 flex flex-col sm:flex-row items-center gap-6 shadow-sm">
          <img
            src={product.image}
            alt={isRtl ? product.titleAr || product.title : product.title}
            className="size-24 rounded-2xl object-cover border border-border/50 shadow-inner shrink-0"
          />
          <div className="flex-1 text-center sm:text-start space-y-1">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-primary/20 text-secondary border border-primary/30">
              {isRtl ? product.brandAr || product.brand : product.brand}
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-foreground line-clamp-2">
              {isRtl ? product.titleAr || product.title : product.title}
            </h1>
            <div className="flex items-center justify-center sm:justify-start gap-2 pt-1">
              <div className="flex items-center gap-1 text-amber-500">
                <Star className="size-4 fill-amber-400 text-amber-400" />
                <span className="text-sm font-bold text-foreground">
                  {product.rating}
                </span>
              </div>
              <span className="text-xs text-muted-foreground">
                ({product.reviewCount} {isRtl ? "تقييم" : "reviews"})
              </span>
            </div>
          </div>
        </div>

        {/* Product Reviews Section Component */}
        <div className="bg-card border border-border/70 rounded-3xl p-6 sm:p-8 shadow-sm">
          <ProductReviewsSection
            product={product}
            maxDisplay={0}
            showViewAllButton={false}
          />
        </div>
      </div>
    </main>
  );
};

export default ProductReviewsPage;
