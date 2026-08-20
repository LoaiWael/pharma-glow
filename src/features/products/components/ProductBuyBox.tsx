import React, { useState } from "react";
import { motion } from "motion/react";
import { ShoppingBag, Zap, Check, Plus, Minus } from "lucide-react";
import { useIntl } from "react-intl";
import { cn } from "@/lib/utils";
import type { Product } from "@/features/products/types/product";

interface ProductBuyBoxProps {
  product: Product;
  selectedVolume?: string;
  onAddToCart?: (product: Product, quantity: number) => void;
  onBuyNow?: (product: Product, quantity: number) => void;
  className?: string;
}

export const ProductBuyBox: React.FC<ProductBuyBoxProps> = ({
  product,
  onAddToCart,
  onBuyNow,
  className,
}) => {
  const intl = useIntl();
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  const price = product.price;
  const originalPrice = product.originalPrice;
  const discountPercent = product.discountPercent;
  const stockCount = product.stockCount ?? 10;

  const handleIncrement = () => {
    if (quantity < stockCount) setQuantity((prev) => prev + 1);
  };

  const handleDecrement = () => {
    if (quantity > 1) setQuantity((prev) => prev - 1);
  };

  const handleAdd = () => {
    setIsAdded(true);
    onAddToCart?.(product, quantity);
    setTimeout(() => {
      setIsAdded(false);
    }, 2000);
  };

  const handleBuy = () => {
    onBuyNow?.(product, quantity);
  };

  return (
    <div
      className={cn(
        "rounded-2xl border border-border/80 bg-white dark:bg-neutral-900 p-5 shadow-sm flex flex-col gap-4 sticky top-24",
        className,
      )}
    >
      {/* Price section */}
      <div className="flex flex-col gap-1">
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-black text-secondary">
            {price.toLocaleString()}
          </span>
          <span className="text-sm font-medium text-tertiary">
            {intl.formatMessage({
              id: "product.currencyFull",
              defaultMessage: "جنيه مصري",
            })}
          </span>
        </div>

        {originalPrice && originalPrice > price && (
          <div className="flex items-center gap-2 text-xs">
            <span className="text-tertiary line-through">
              {originalPrice.toLocaleString()}{" "}
              {intl.formatMessage({
                id: "product.currency",
                defaultMessage: "جنيه",
              })}
            </span>
            {discountPercent && (
              <span className="px-2 py-0.5 rounded-full font-bold bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300">
                {intl.formatMessage(
                  {
                    id: "product.discountBadge",
                    defaultMessage: "خصم {percent}%",
                  },
                  { percent: discountPercent },
                )}
              </span>
            )}
          </div>
        )}
        <p className="text-[11px] text-tertiary">
          {intl.formatMessage({
            id: "product.vatIncluded",
            defaultMessage: "الأسعار تشمل ضريبة القيمة المضافة",
          })}
        </p>
      </div>

      {/* Quantity Selector */}
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs font-semibold text-tertiary">
          {intl.formatMessage({
            id: "product.quantity",
            defaultMessage: "الكمية:",
          })}
        </span>
        <div className="flex items-center border border-border rounded-xl bg-neutral/40 p-1">
          <button
            type="button"
            onClick={handleDecrement}
            disabled={quantity <= 1}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-foreground hover:bg-white dark:hover:bg-neutral-800 disabled:opacity-30 transition-colors"
            aria-label="Decrease quantity"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <span className="w-9 text-center font-bold text-sm text-foreground">
            {quantity}
          </span>
          <button
            type="button"
            onClick={handleIncrement}
            disabled={quantity >= stockCount}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-foreground hover:bg-white dark:hover:bg-neutral-800 disabled:opacity-30 transition-colors"
            aria-label="Increase quantity"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Action Buttons: Add to Bag & Buy Now */}
      <div className="flex flex-col gap-2.5 pt-1">
        <motion.button
          type="button"
          whileTap={{ scale: 0.98 }}
          onClick={handleAdd}
          className={cn(
            "w-full py-3.5 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer",
            isAdded
              ? "bg-emerald-600 text-white shadow-emerald-500/20"
              : "bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-secondary/20",
          )}
        >
          {isAdded ? (
            <>
              <Check className="w-4 h-4" />
              <span>
                {intl.formatMessage({
                  id: "product.addedToBagSuccess",
                  defaultMessage: "تمت الإضافة إلى الحقيبة",
                })}
              </span>
            </>
          ) : (
            <>
              <ShoppingBag className="w-4 h-4" />
              <span>
                {intl.formatMessage({
                  id: "product.addToBag",
                  defaultMessage: "أضف إلى الحقيبة",
                })}
              </span>
            </>
          )}
        </motion.button>

        <motion.button
          type="button"
          whileTap={{ scale: 0.98 }}
          onClick={handleBuy}
          className="w-full py-3 px-4 rounded-xl font-bold text-sm border-2 border-secondary text-secondary hover:bg-secondary/10 flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          <Zap className="w-4 h-4 fill-secondary" />
          <span>
            {intl.formatMessage({
              id: "product.buyNow",
              defaultMessage: "اشتري الآن",
            })}
          </span>
        </motion.button>
      </div>
    </div>
  );
};

export default ProductBuyBox;
