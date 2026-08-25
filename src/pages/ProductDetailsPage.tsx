import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useIntl } from "react-intl";
import { toast } from "sonner";
import { AnimatePresence, motion } from "motion/react";
import {
  ChevronLeft,
  ChevronRight,
  Home,
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
  ProductDetailSkeleton,
  RelatedProductsSkeleton,
  ProductEmptyState,
  type Product,
} from "@/features/products";
import { DEFAULT_LOCALE, isLocale, LOCALE_DIR } from "@/i18n/locales";
import { getLocalizedPath } from "@/i18n/navigation";

export const ProductDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const intl = useIntl();
  const locale = isLocale(intl.locale) ? intl.locale : DEFAULT_LOCALE;
  const isRtl = LOCALE_DIR[locale] === "rtl";
  const productKey = id || "";

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, [id]);

  const { data: product, isPending, isError } = useProduct(productKey);
  const {
    data: relatedProducts = [],
    isPending: isRelatedPending,
  } = useRelatedProducts(product?.id ?? productKey, product?.category);

  const [selectedVolume, setSelectedVolume] = useState<string | undefined>(
    product?.volume,
  );
  const [isFav, setIsFav] = useState(product?.isFavorite || false);

  useEffect(() => {
    setSelectedVolume(product?.volume);
    setIsFav(product?.isFavorite || false);
  }, [product]);

  if (isPending) {
    return <ProductDetailSkeleton />;
  }

  if (isError || !product) {
    return (
      <div className="mx-auto max-w-[var(--page-max-width)] px-4 py-16">
        <ProductEmptyState />
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

  const productTitle =
    locale === "ar" && product.titleAr ? product.titleAr : product.title;

  const cartPath = getLocalizedPath("/cart", locale);

  const handleViewCart = () => {
    navigate(cartPath, { viewTransition: true });
  };

  const handleAddToCart = (item: Product) => {
    const name =
      locale === "ar" && item.titleAr ? item.titleAr : item.title;
    toast.success(
      intl.formatMessage({ id: "products.addedSuccess" }, { name }),
    );
    navigate(cartPath, { viewTransition: true });
  };

  const handleBuyNow = () => {
    navigate(cartPath, { viewTransition: true });
  };

  const handleAddBundleToCart = () => {
    toast.success(
      intl.formatMessage({
        id: "product.bundle.added",
        defaultMessage: "تمت إضافة الروتين للحقيبة",
      }),
    );
    navigate(cartPath, { viewTransition: true });
  };

  const handleToggleFavorite = () => {
    const nextFav = !isFav;
    setIsFav(nextFav);
    toast.success(
      intl.formatMessage(
        {
          id: nextFav
            ? "product.addedToWishlistSuccess"
            : "product.removedFromWishlistSuccess",
        },
        { name: productTitle },
      ),
    );
  };

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
              onToggleFavorite={handleToggleFavorite}
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
              key={product.id}
              product={product}
              selectedVolume={selectedVolume}
              onAddToCart={handleAddToCart}
              onViewCart={handleViewCart}
              onBuyNow={handleBuyNow}
            />
          </div>
        </div>

        {/* Frequently Bought Together (Routine Bundle Builder) */}
        {relatedProducts.length > 0 && (
          <FrequentlyBoughtTogether
            mainProduct={product}
            complementaryProducts={relatedProducts}
            onAddBundleToCart={handleAddBundleToCart}
          />
        )}

        {/* Product Overview, Specifications & How-to-use Tabs */}
        <ProductOverviewTabs product={product} />

        {/* Ratings and Reviews Section */}
        <ProductReviewsSection product={product} />

        {/* More Relevant Products Carousel */}
        <AnimatePresence mode="wait">
          {isRelatedPending ? (
            <RelatedProductsSkeleton />
          ) : relatedProducts.length > 0 ? (
            <motion.div
              key="related-products"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <ProductRelevantCarousel
                products={relatedProducts}
                title={intl.formatMessage({
                  id: "product.relevant.title",
                  defaultMessage: "منتجات مشابهة وموصى بها لروتينك",
                })}
              />
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      {/* Fixed Sticky Action Bar on Small/Mobile Screens */}
      <MobileStickyBottomBar
        key={product.id}
        product={product}
        onAddToCart={handleAddToCart}
        onViewCart={handleViewCart}
        onBuyNow={handleBuyNow}
      />
    </div>
  );
};

export default ProductDetailsPage;
