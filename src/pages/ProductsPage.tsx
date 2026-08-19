import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "motion/react";
import { Filter, Sparkles } from "lucide-react";
import { FormattedMessage } from "react-intl";
import { mockProducts, ProductCard } from "@/features/products";
import type { Product } from "@/features/products/types";

export const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [searchParams, setSearchParams] = useSearchParams();
  const activeFilter = searchParams.get("filter") || "all";
  const searchQuery = searchParams.get("q") || "";
  const [addedItemName, setAddedItemName] = useState<string | null>(null);

  const filterOptions = [
    {
      id: "all",
      labelId: "products.filter.all",
      image:
        "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=300&q=80",
    },
    {
      id: "best_of_us",
      labelId: "product.bestOfUs",
      image:
        "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=300&q=80",
    },
    {
      id: "most_ordered",
      labelId: "product.mostOrdered",
      image:
        "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=300&q=80",
    },
    {
      id: "discount",
      labelId: "product.discount",
      image:
        "https://images.unsplash.com/photo-1608248597261-e4d0947c6b1e?w=300&q=80",
    },
    {
      id: "new",
      labelId: "product.new",
      image:
        "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=300&q=80",
    },
  ];

  const handleFilterChange = (filterId: string) => {
    setSearchParams(
      (prev) => {
        const newParams = new URLSearchParams(prev);
        if (filterId === "all") {
          newParams.delete("filter");
        } else {
          newParams.set("filter", filterId);
        }
        return newParams;
      },
      { replace: true },
    );
  };

  const handleAddToCart = (product: Partial<Product>) => {
    setAddedItemName(product.title || "المنتج");
    setTimeout(() => setAddedItemName(null), 2500);
  };

  const handleToggleFavorite = (id: string | number, isFav: boolean) => {
    setProducts((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isFavorite: isFav } : item,
      ),
    );
  };

  const filteredProducts = products.filter((product) => {
    // Search query filter
    const matchesSearch = product.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    // Category badge filter
    if (activeFilter === "all") return matchesSearch;
    if (activeFilter === "best_of_us")
      return matchesSearch && product.badge === "best_of_us";
    if (activeFilter === "most_ordered")
      return matchesSearch && product.badge === "most_ordered";
    if (activeFilter === "discount")
      return (
        matchesSearch &&
        (product.badge === "discount" || (product.discountPercent ?? 0) > 0)
      );
    if (activeFilter === "new") return matchesSearch && product.badge === "new";

    return matchesSearch && product.badge === activeFilter;
  });

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-gray-50/60 dark:bg-neutral-950 py-8"
    >
      <div className="page-shell mx-auto space-y-8">
        {/* Toast Alert for Cart addition */}
        {addedItemName && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-gray-900 text-white dark:bg-white dark:text-gray-900 px-5 py-3 rounded-xl shadow-lg flex items-center gap-2 text-sm font-semibold"
          >
            <Sparkles className="w-4 h-4 text-yellow-400" />
            <span>
              <FormattedMessage
                id="products.addedSuccess"
                values={{ name: addedItemName }}
              />
            </span>
          </motion.div>
        )}

        {/* Page Header Banner */}
        <div
          className="relative overflow-hidden rounded-3xl p-8 md:p-12 shadow-lg min-h-[220px] flex items-center bg-cover bg-center text-white"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(15, 23, 42, 0.85), rgba(15, 23, 42, 0.45)), url('https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1600&q=80')`,
          }}
        >
          <div className="space-y-3 text-right max-w-2xl z-10">
            <div className="inline-flex items-center gap-2 text-rose-300 font-bold text-xs uppercase tracking-wider bg-rose-950/60 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-rose-500/20">
              <Sparkles className="w-3.5 h-3.5 text-rose-400" />
              <span>
                <FormattedMessage id="products.banner.badge" />
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight drop-shadow-xs text-white">
              <FormattedMessage id="products.banner.title" />
            </h1>
            <p className="text-gray-200 text-sm md:text-base leading-relaxed max-w-xl">
              <FormattedMessage id="products.banner.description" />
            </p>
          </div>
        </div>

        {/* Cool Image-based Centered Filters Bar */}
        <div className="flex flex-col items-center gap-6 py-4 w-full overflow-hidden">
          <div className="flex items-center justify-start sm:justify-center gap-5 sm:gap-8 md:gap-10 lg:gap-12 overflow-x-auto w-full max-w-full px-6 py-4 scrollbar-none">
            {filterOptions.map((option) => {
              const isActive = activeFilter === option.id;
              return (
                <button
                  key={option.id}
                  onClick={() => handleFilterChange(option.id)}
                  className="group flex flex-col items-center gap-3 transition-all duration-300 cursor-pointer focus:outline-hidden shrink-0"
                >
                  <div
                    className={`relative w-24 h-24 sm:w-30 sm:h-30 md:w-36 md:h-36 rounded-full p-1.5 transition-all duration-300 ${
                      isActive
                        ? "bg-gradient-to-tr from-rose-500 via-pink-500 to-amber-400 ring-4 ring-rose-500/25 scale-105 shadow-2xl"
                        : "bg-gray-200 dark:bg-neutral-800 hover:scale-105 hover:shadow-lg"
                    }`}
                  >
                    <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-white dark:border-neutral-900 bg-white dark:bg-neutral-900 shadow-inner">
                      <img
                        src={option.image}
                        alt={option.id}
                        className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-115 ${
                          isActive
                            ? "brightness-105"
                            : "brightness-95 group-hover:brightness-100"
                        }`}
                      />
                      <div
                        className={`absolute inset-0 transition-opacity duration-300 ${
                          isActive
                            ? "bg-rose-500/10"
                            : "bg-black/10 group-hover:bg-transparent"
                        }`}
                      />
                    </div>
                  </div>
                  <span
                    className={`text-sm md:text-base font-bold tracking-tight text-center transition-colors duration-200 ${
                      isActive
                        ? "text-rose-600 dark:text-rose-400"
                        : "text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white"
                    }`}
                  >
                    <FormattedMessage id={option.labelId} />
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 dark:text-gray-400 bg-white dark:bg-neutral-900 px-4 py-1.5 rounded-full border border-gray-200/80 dark:border-neutral-800 shadow-xs">
            <Filter className="w-3.5 h-3.5 text-rose-500" />
            <FormattedMessage
              id="products.count"
              values={{ count: filteredProducts.length }}
            />
          </div>
        </div>

        {/* Product Cards Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
                onToggleFavorite={handleToggleFavorite}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white dark:bg-neutral-900 rounded-3xl border border-gray-200/80 dark:border-neutral-800 space-y-3">
            <p className="text-gray-500 dark:text-gray-400 text-base font-semibold">
              <FormattedMessage id="products.empty" />
            </p>
            <button
              onClick={() => {
                setSearchParams({}, { replace: true });
              }}
              className="text-xs font-bold text-secondary underline hover:text-primary transition-colors"
            >
              <FormattedMessage id="products.resetFilters" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;
