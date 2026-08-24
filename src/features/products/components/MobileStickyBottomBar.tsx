import React, { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ShoppingBag, Zap, Check, Plus, Minus } from "lucide-react";
import { useIntl } from "react-intl";
import { cn } from "@/lib/utils";
import type { Product } from "@/features/products/types/product";

interface MobileStickyBottomBarProps {
  product: Product;
  onAddToCart?: (product: Product, quantity: number) => void;
  onViewCart?: () => void;
  onBuyNow?: (product: Product, quantity: number) => void;
  className?: string;
}

export const MobileStickyBottomBar: React.FC<MobileStickyBottomBarProps> = ({
  product,
  onAddToCart,
  onViewCart,
  onBuyNow,
  className,
}) => {
  const intl = useIntl();
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [inCartState, setInCartState] = useState<boolean>(product.isInCart ?? false);

  const price = product.price;
  const originalPrice = product.originalPrice;
  const stockCount = product.stockCount ?? 10;

  const handleIncrement = () => {
    if (quantity < stockCount) setQuantity((prev) => prev + 1);
  };

  const handleDecrement = () => {
    if (quantity > 1) setQuantity((prev) => prev - 1);
  };

  const handleAdd = () => {
    if (inCartState) {
      onViewCart?.();
      return;
    }
    setIsAdded(true);
    setInCartState(true);
    onAddToCart?.({ ...product, isInCart: true }, quantity);
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
        "lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md border-t border-border shadow-[0_-4px_20px_rgba(0,0,0,0.08)] px-4 py-2.5 pb-[calc(env(safe-area-inset-bottom,0px)+10px)]",
        className,
      )}
    >
      <div className="flex flex-col gap-2.5 max-w-lg mx-auto w-full">
        {/* Row 1: Price and Quantity Stepper spanning full width */}
        <div className="flex items-center justify-between w-full">
          {/* Price */}
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-black text-secondary">
                {price.toLocaleString()}
              </span>
              <span className="text-xs font-semibold text-tertiary">
                {intl.formatMessage({
                  id: "product.currencyFull",
                  defaultMessage: "جنيه مصري",
                })}
              </span>
            </div>
            {originalPrice && originalPrice > price && (
              <span className="text-[11px] text-tertiary line-through -mt-0.5">
                {originalPrice.toLocaleString()}{" "}
                {intl.formatMessage({
                  id: "product.currency",
                  defaultMessage: "جنيه",
                })}
              </span>
            )}
          </div>

          {/* Quantity Stepper */}
          <div className="flex items-center border border-border rounded-xl bg-neutral/40 p-0.5 shrink-0">
            <button
              type="button"
              onClick={handleDecrement}
              disabled={quantity <= 1}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-foreground disabled:opacity-30 transition-colors"
              aria-label="Decrease quantity"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="w-8 text-center font-bold text-xs text-foreground">
              {quantity}
            </span>
            <button
              type="button"
              onClick={handleIncrement}
              disabled={quantity >= stockCount}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-foreground disabled:opacity-30 transition-colors"
              aria-label="Increase quantity"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Row 2: Full Width Action Buttons */}
        <div
          className={cn(
            "grid gap-2 w-full",
            inCartState ? "grid-cols-1" : "grid-cols-2",
          )}
        >
          <motion.button
            type="button"
            whileTap={{ scale: 0.97 }}
            onClick={handleAdd}
            className={cn(
              "w-full py-3 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs",
              isAdded || inCartState
                ? "bg-emerald-600 text-white"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/90",
            )}
          >
            {isAdded ? (
              <>
                <Check className="w-4 h-4" />
                <span className="truncate">
                  {intl.formatMessage({
                    id: "product.addedToBagSuccess",
                    defaultMessage: "تمت الإضافة",
                  })}
                </span>
              </>
            ) : inCartState ? (
              <>
                <ShoppingBag className="w-4 h-4 shrink-0" />
                <span className="truncate">
                  {intl.formatMessage({
                    id: "product.viewBag",
                    defaultMessage: "عرض الحقيبة",
                  })}
                </span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4 shrink-0" />
                <span className="truncate">
                  {intl.formatMessage({
                    id: "product.addToBag",
                    defaultMessage: "أضف للسلة",
                  })}
                </span>
              </>
            )}
          </motion.button>

          <AnimatePresence>
            {!inCartState && (
              <motion.button
                type="button"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                whileTap={{ scale: 0.97 }}
                onClick={handleBuy}
                className="w-full py-3 px-3 rounded-xl font-bold text-xs border-2 border-secondary text-secondary hover:bg-secondary/10 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Zap className="w-4 h-4 fill-secondary shrink-0" />
                <span>
                  {intl.formatMessage({
                    id: "product.quickBuy",
                    defaultMessage: "شراء فوري",
                  })}
                </span>
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default MobileStickyBottomBar;
