import React, { useState } from "react";
import { Plus, Check, ShoppingBag, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { useIntl } from "react-intl";
import { cn } from "@/lib/utils";
import type { Product } from "@/features/products/types/product";
import { DEFAULT_LOCALE, isLocale } from "@/i18n/locales";

interface FrequentlyBoughtTogetherProps {
  mainProduct: Product;
  complementaryProducts: Product[];
  onAddBundleToCart?: (products: Product[]) => void;
  className?: string;
}

export const FrequentlyBoughtTogether: React.FC<FrequentlyBoughtTogetherProps> = ({
  mainProduct,
  complementaryProducts = [],
  onAddBundleToCart,
  className,
}) => {
  const intl = useIntl();
  const locale = isLocale(intl.locale) ? intl.locale : DEFAULT_LOCALE;
  const isArabic = locale === "ar";

  // Bundle of main product + up to 2 complementary products
  const bundleItems = [mainProduct, ...complementaryProducts.slice(0, 2)];

  const [selectedIds, setSelectedIds] = useState<Record<string | number, boolean>>({
    [mainProduct.id]: true,
    ...(bundleItems[1] ? { [bundleItems[1].id]: true } : {}),
    ...(bundleItems[2] ? { [bundleItems[2].id]: true } : {}),
  });

  const [isBundleAdded, setIsBundleAdded] = useState(false);

  const toggleSelect = (id: string | number) => {
    setSelectedIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const activeProducts = bundleItems.filter((item) => selectedIds[item.id]);

  const totalPrice = activeProducts.reduce((sum, item) => sum + item.price, 0);
  const totalOriginalPrice = activeProducts.reduce(
    (sum, item) => sum + (item.originalPrice || item.price),
    0
  );
  const totalSavings = totalOriginalPrice - totalPrice;

  const handleAddBundle = () => {
    setIsBundleAdded(true);
    onAddBundleToCart?.(activeProducts);
    setTimeout(() => {
      setIsBundleAdded(false);
    }, 2000);
  };

  if (bundleItems.length < 2) return null;

  return (
    <section
      className={cn(
        "rounded-2xl border border-border/80 bg-white dark:bg-neutral-900 p-5 shadow-xs flex flex-col gap-5",
        className
      )}
    >
      <div className="flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-secondary" />
        <h2 className="text-lg md:text-xl font-bold text-foreground m-0">
          {intl.formatMessage({
            id: "product.bundle.title",
            defaultMessage: "يُشترى معاً في الغالب (روتين متكامل)",
          })}
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Visual Product Thumbnails with '+' connector */}
        <div className="lg:col-span-8 flex flex-col sm:flex-row items-center gap-3 justify-center sm:justify-start w-full">
          {bundleItems.map((item, index) => {
            const isChecked = Boolean(selectedIds[item.id]);
            const itemTitle = isArabic && item.titleAr ? item.titleAr : item.title;
            return (
              <React.Fragment key={item.id}>
                {index > 0 && (
                  <div className="w-8 h-8 rounded-full bg-neutral flex items-center justify-center text-tertiary shrink-0 font-bold self-center shadow-xs">
                    <Plus className="w-4 h-4" />
                  </div>
                )}
                <div
                  onClick={() => toggleSelect(item.id)}
                  className={cn(
                    "relative w-full max-w-[240px] sm:max-w-[160px] sm:flex-1 p-2.5 rounded-xl border-2 transition-all cursor-pointer bg-neutral/40 flex flex-col items-center gap-2",
                    isChecked
                      ? "border-secondary bg-secondary/5"
                      : "border-border/60 opacity-50 grayscale"
                  )}
                >
                  <div className="relative w-20 h-20 sm:w-24 sm:h-24">
                    <img
                      src={item.image}
                      alt={itemTitle}
                      className="w-full h-full object-contain"
                    />
                    <span
                      className={cn(
                        "absolute top-0 start-0 w-5 h-5 rounded-md flex items-center justify-center text-white text-xs",
                        isChecked ? "bg-secondary" : "bg-gray-400"
                      )}
                    >
                      {isChecked && <Check className="w-3.5 h-3.5" />}
                    </span>
                  </div>
                  <div className="text-center w-full">
                    <p className="text-[11px] font-medium text-foreground line-clamp-2 leading-tight">
                      {itemTitle}
                    </p>
                    <p className="text-xs font-bold text-secondary mt-1">
                      {item.price.toLocaleString()}{" "}
                      {intl.formatMessage({
                        id: "product.currency",
                        defaultMessage: "جنيه",
                      })}
                    </p>
                  </div>
                </div>
              </React.Fragment>
            );
          })}
        </div>

        {/* Total Price & Add All Button Box */}
        <div className="lg:col-span-4 p-4 rounded-xl bg-neutral/80 border border-border/80 flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <span className="text-xs text-tertiary font-medium">
              {intl.formatMessage(
                {
                  id: "product.bundle.total",
                  defaultMessage: "إجمالي الروتين المختار ({count} منتجات):",
                },
                { count: activeProducts.length }
              )}
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-secondary">
                {totalPrice.toLocaleString()}
              </span>
              <span className="text-xs font-medium text-tertiary">
                {intl.formatMessage({
                  id: "product.currency",
                  defaultMessage: "جنيه",
                })}
              </span>
              {totalSavings > 0 && (
                <span className="text-xs text-rose-600 font-bold bg-rose-50 dark:bg-rose-950/40 px-2 py-0.5 rounded-full">
                  {intl.formatMessage(
                    {
                      id: "product.bundle.saved",
                      defaultMessage: "وفرت {amount} جنيه",
                    },
                    { amount: totalSavings.toLocaleString() }
                  )}
                </span>
              )}
            </div>
          </div>

          <motion.button
            type="button"
            whileTap={{ scale: 0.98 }}
            onClick={handleAddBundle}
            disabled={activeProducts.length === 0}
            className={cn(
              "w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs",
              isBundleAdded
                ? "bg-emerald-600 text-white"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/90 disabled:bg-gray-300"
            )}
          >
            {isBundleAdded ? (
              <>
                <Check className="w-4 h-4" />
                <span>
                  {intl.formatMessage({
                    id: "product.bundle.added",
                    defaultMessage: "تمت إضافة الروتين للحقيبة",
                  })}
                </span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" />
                <span>
                  {intl.formatMessage({
                    id: "product.bundle.addSelected",
                    defaultMessage: "أضف العناصر المحددة للحقيبة",
                  })}
                </span>
              </>
            )}
          </motion.button>
        </div>
      </div>
    </section>
  );
};

export default FrequentlyBoughtTogether;
