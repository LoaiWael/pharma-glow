import React, { useState } from "react";
import { FileText, Sparkles, HelpCircle, ShieldCheck } from "lucide-react";
import { useIntl } from "react-intl";
import { cn } from "@/lib/utils";
import type { Product } from "@/features/products/types/product";
import { useProductTypes } from "@/features/products/api/use-product-types";
import { DEFAULT_LOCALE, isLocale } from "@/i18n/locales";

interface ProductOverviewTabsProps {
  product: Product;
  className?: string;
}

type TabType = "overview" | "specifications" | "howToUse";

export const ProductOverviewTabs: React.FC<ProductOverviewTabsProps> = ({
  product,
  className,
}) => {
  const intl = useIntl();
  const locale = isLocale(intl.locale) ? intl.locale : DEFAULT_LOCALE;
  const isArabic = locale === "ar";

  const [activeTab, setActiveTab] = useState<TabType>("overview");

  const { data: productTypes = [] } = useProductTypes();

  const brandName = isArabic && product.brandAr ? product.brandAr : product.brand || "Pure";
  
  const categoryLabel =
    product.category === "skin_care"
      ? intl.formatMessage({ id: "category.skincare.title", defaultMessage: "العناية بالبشرة" })
      : product.category === "body_care"
      ? intl.formatMessage({ id: "category.bodycare.title", defaultMessage: "العناية بالجسم" })
      : intl.formatMessage({ id: "products.filter.all", defaultMessage: "جميع المنتجات" });

  const productTypeLabel =
    productTypes.find((type) => type.slug === product.productType)?.name ||
    product.productType ||
    "-";

  const specifications: Record<string, string> = {
    [intl.formatMessage({ id: "product.tabs.brand", defaultMessage: "العلامة التجارية" })]: brandName,
    [intl.formatMessage({ id: "product.tabs.mainCategory", defaultMessage: "الفئة الأساسية" })]: categoryLabel,
    [intl.formatMessage({ id: "product.tabs.productType", defaultMessage: "نوع المنتج" })]: productTypeLabel,
    [intl.formatMessage({ id: "product.size", defaultMessage: "الحجم / السعة:" })]: product.volume || "-",
    ...(product.specifications || {}),
  };

  const productDescription =
    isArabic && product.descriptionAr
      ? product.descriptionAr
      : product.description || product.descriptionAr;

  const productHowToUse =
    isArabic && product.howToUseAr
      ? product.howToUseAr
      : product.howToUse || product.howToUseAr;

  return (
    <section
      className={cn(
        "rounded-2xl border border-border/80 bg-white dark:bg-neutral-900 p-5 shadow-xs flex flex-col gap-6",
        className
      )}
    >
      {/* Tabs Header */}
      <div className="flex border-b border-border gap-2 overflow-x-auto scrollbar-none">
        <button
          type="button"
          onClick={() => setActiveTab("overview")}
          className={cn(
            "pb-3 px-4 font-bold text-sm border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer",
            activeTab === "overview"
              ? "border-secondary text-secondary"
              : "border-transparent text-tertiary hover:text-foreground"
          )}
        >
          <Sparkles className="w-4 h-4" />
          <span>
            {intl.formatMessage({
              id: "product.tabs.overview",
              defaultMessage: "نظرة عامة على المنتج",
            })}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("specifications")}
          className={cn(
            "pb-3 px-4 font-bold text-sm border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer",
            activeTab === "specifications"
              ? "border-secondary text-secondary"
              : "border-transparent text-tertiary hover:text-foreground"
          )}
        >
          <FileText className="w-4 h-4" />
          <span>
            {intl.formatMessage({
              id: "product.tabs.specifications",
              defaultMessage: "المواصفات والبيانات",
            })}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("howToUse")}
          className={cn(
            "pb-3 px-4 font-bold text-sm border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer",
            activeTab === "howToUse"
              ? "border-secondary text-secondary"
              : "border-transparent text-tertiary hover:text-foreground"
          )}
        >
          <HelpCircle className="w-4 h-4" />
          <span>
            {intl.formatMessage({
              id: "product.tabs.howToUse",
              defaultMessage: "طريقة الاستخدام والنصائح",
            })}
          </span>
        </button>
      </div>

      {/* Tab Content */}
      <div className="text-sm leading-relaxed text-foreground">
        {activeTab === "overview" && (
          <div className="flex flex-col gap-5">
            <p className="text-base text-foreground/90 font-medium">
              {productDescription ||
                "تم تصميم هذا المنتج بعناية فائقة ليوفر أقصى درجات الفاعلية والترطيب للبشرة، معتمد من أطباء الجلدية وخالٍ من المكونات القاسية."}
            </p>

            {product.overviewHighlights && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                {product.overviewHighlights.map((hl, i) => (
                  <div
                    key={i}
                    className="p-3.5 rounded-xl bg-neutral/80 border border-border/80 flex items-start gap-2.5"
                  >
                    <ShieldCheck className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                    <span className="text-xs text-foreground font-medium">{hl}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "specifications" && (
          <div className="rounded-xl border border-border overflow-hidden">
            <table className="w-full text-xs text-start">
              <tbody>
                {Object.entries(specifications).map(([key, value], idx) => (
                  <tr
                    key={key}
                    className={cn(
                      "border-b border-border/60 last:border-0",
                      idx % 2 === 0 ? "bg-neutral/40" : "bg-white dark:bg-neutral-900"
                    )}
                  >
                    <td className="py-3 px-4 font-bold text-tertiary w-1/3 border-e border-border/60">
                      {key}
                    </td>
                    <td className="py-3 px-4 text-foreground font-medium">{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "howToUse" && (
          <div className="flex flex-col gap-4 p-4 rounded-xl bg-neutral/60 border border-border">
            <h3 className="text-sm font-bold text-secondary m-0">
              {intl.formatMessage({
                id: "product.tabs.howToUseTitle",
                defaultMessage: "خطوات الاستخدام الأمثل:",
              })}
            </h3>
            <p className="text-xs text-foreground leading-relaxed">
              {productHowToUse ||
                "يُستخدم يومياً صباحاً ومساءً كجزء من روتين العناية المنتظم. ضعي كمية مناسبة على راحة اليد ودلكي بلطف بحركات دائرية حتى تمام الامتصاص."}
            </p>

            <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 text-[11px] text-amber-900 dark:text-amber-200">
              💡 <strong>{intl.formatMessage({ id: "product.tabs.glowTipTitle", defaultMessage: "نصيحة التوهج:" })}</strong>{" "}
              {intl.formatMessage({
                id: "product.tabs.glowTipContent",
                defaultMessage: "للحصول على أفضل نتيجة مرطبة، يُفضل وضع السيروم على بشرة رطبة قليلاً بعد تنظيفها بالغسول المناسب وقبل وضع كريم الترطيب.",
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductOverviewTabs;
