import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useIntl } from "react-intl";
import {
  ChevronLeft,
  ChevronRight,
  Home,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import {
  useProduct,
  useRelatedProducts,
  ProductImageGallery,
  ProductInfoMain,
  ProductBuyBox,
  MobileStickyBottomBar,
  FrequentlyBoughtTogether,
  ProductOverviewTabs,
  ProductReviewsSection,
  ProductRelevantCarousel,
  type Product,
} from "@/features/products";
import { DEFAULT_LOCALE, isLocale, LOCALE_DIR } from "@/i18n/locales";

export const ProductDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const intl = useIntl();
  const locale = isLocale(intl.locale) ? intl.locale : DEFAULT_LOCALE;
  const isRtl = LOCALE_DIR[locale] === "rtl";

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, [id]);

  const { data: product, isLoading } = useProduct(id || "p1");
  const { data: relatedProducts = [] } = useRelatedProducts(
    id || "p1",
    product?.category,
  );

  const [selectedVolume, setSelectedVolume] = useState<string | undefined>(
    product?.volume,
  );
  const [isFav, setIsFav] = useState(product?.isFavorite || false);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-[var(--page-max-width)] px-4 sm:px-6 lg:px-8 py-8 animate-pulse flex flex-col gap-6">
        <div className="h-6 w-48 bg-gray-200 dark:bg-neutral-800 rounded-md" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="flex flex-col gap-4">
            <div className="h-[460px] bg-gray-200 dark:bg-neutral-800 rounded-2xl" />
            <div className="h-[220px] bg-gray-200 dark:bg-neutral-800 rounded-2xl" />
          </div>
          <div className="flex flex-col gap-4">
            <div className="h-8 bg-gray-200 dark:bg-neutral-800 rounded-md w-3/4" />
            <div className="h-6 bg-gray-200 dark:bg-neutral-800 rounded-md w-1/2" />
            <div className="h-40 bg-gray-200 dark:bg-neutral-800 rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-[var(--page-max-width)] px-4 py-16 text-center flex flex-col items-center gap-4">
        <h2 className="text-xl font-bold text-foreground">
          {intl.formatMessage({
            id: "product.notFound.title",
            defaultMessage: "المنتج غير موجود",
          })}
        </h2>
        <p className="text-sm text-tertiary">
          {intl.formatMessage({
            id: "product.notFound.desc",
            defaultMessage: "ربما تم حذف المنتج أو أن الرابط غير صحيح.",
          })}
        </p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-secondary text-secondary-foreground font-semibold text-sm"
        >
          {isRtl ? (
            <ArrowRight className="w-4 h-4" />
          ) : (
            <ArrowLeft className="w-4 h-4" />
          )}
          <span>
            {intl.formatMessage({
              id: "product.notFound.browse",
              defaultMessage: "تصفح جميع المنتجات",
            })}
          </span>
        </Link>
      </div>
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

  const handleAddToCart = (item: Product, qty: number) => {
    console.log("Adding to cart:", item.title, "Qty:", qty);
  };

  const handleBuyNow = (item: Product, qty: number) => {
    console.log("Buy now initiated:", item.title, "Qty:", qty);
  };

  const handleAddBundleToCart = (bundle: Product[]) => {
    console.log("Adding bundle to cart:", bundle);
  };

  const productTitle =
    locale === "ar" && product.titleAr ? product.titleAr : product.title;

  return (
    <div className="min-h-screen bg-neutral/30 pb-24 lg:pb-16">
      <div className="mx-auto max-w-[var(--page-max-width)] px-3.5 sm:px-6 lg:px-8 py-5 flex flex-col gap-6">
        {/* Breadcrumbs Navigation */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-1.5 text-xs text-tertiary flex-wrap"
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

          <span className="text-foreground font-semibold line-clamp-1 max-w-[240px] sm:max-w-md">
            {productTitle}
          </span>
        </nav>

        {/* 
          2-Column Large Screen Layout:
          - Column 1 (Right in RTL / Left in LTR): 
              1. ProductImageGallery (Photos with zoom & thumbnails)
              2. ProductBuyBox (Under the preview photos on desktop)
          - Column 2 (Left in RTL / Right in LTR): 
              Product Info, Brand, Title, Rating, Attributes, etc.
        */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-10 items-start">
          {/* Column 1: Photos Gallery + Buy Box directly underneath on desktop */}
          <div className="lg:col-span-6 xl:col-span-6 flex flex-col gap-6">
            <ProductImageGallery
              images={product.images || [product.image]}
              title={product.titleAr || product.title}
              badge={product.badge}
              badgeText={product.badgeText}
              isFavorite={isFav}
              onToggleFavorite={() => setIsFav(!isFav)}
            />
          </div>

          {/* Column 2: Product Info Main */}
          <div className="lg:col-span-6 xl:col-span-6 flex flex-col gap-4">
            <ProductInfoMain
              product={product}
              selectedVolume={selectedVolume}
              onSelectVolume={setSelectedVolume}
            />
            <ProductBuyBox
              product={product}
              selectedVolume={selectedVolume}
              onAddToCart={handleAddToCart}
              onBuyNow={handleBuyNow}
            />
          </div>
        </div>

        {/* Frequently Bought Together (Routine Bundle Builder) */}
        <FrequentlyBoughtTogether
          mainProduct={product}
          complementaryProducts={relatedProducts}
          onAddBundleToCart={handleAddBundleToCart}
        />

        {/* Product Overview, Specifications & How-to-use Tabs */}
        <ProductOverviewTabs product={product} />

        {/* Ratings and Reviews Section */}
        <ProductReviewsSection product={product} />

        {/* More Relevant Products Carousel */}
        <ProductRelevantCarousel
          products={relatedProducts}
          title={intl.formatMessage({
            id: "product.relevant.title",
            defaultMessage: "منتجات مشابهة وموصى بها لروتينك",
          })}
        />
      </div>

      {/* Fixed Sticky Action Bar on Small/Mobile Screens */}
      <MobileStickyBottomBar
        product={product}
        onAddToCart={handleAddToCart}
        onBuyNow={handleBuyNow}
      />
    </div>
  );
};

export default ProductDetailsPage;
