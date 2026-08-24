export type ProductCategory = "skin_care" | "body_care" | "hair_care" | "makeup" | string;
export type ProductType = "all" | "serum" | "cream" | "cleanser" | "sunscreen" | "oil" | "scrub" | "lotion" | "gel" | "butter" | "toner" | "set";

export interface ProductFilterState {
  searchQuery: string;
  category: string;
  productType: ProductType;
  priceRange: [number, number];
  inStockOnly: boolean;
  freeDeliveryOnly: boolean;
  minRating: number;
  sortBy: "featured" | "price_asc" | "price_desc" | "rating" | "discount";
}

export interface ProductReview {
  id: string | number;
  author: string;
  rating: number;
  date: string;
  title?: string;
  comment: string;
  isVerifiedPurchase?: boolean;
  helpfulCount?: number;
}

export interface Product {
  id: string | number;
  title: string;
  titleAr?: string;
  brand?: string;
  brandAr?: string;
  category?: ProductCategory;
  productType?: ProductType;
  image: string;
  images?: string[]; // Multiple images array for product card/details carousel
  price: number; // Price in EGP
  originalPrice?: number; // Original price before discount in EGP
  discountPercent?: number; // Explicit discount percentage
  badge?: "best_of_us" | "most_ordered" | "discount" | "new" | string;
  badgeText?: string; // Custom text override for badge
  rating?: number; // e.g. 4.4
  reviewCount?: number; // e.g. 144
  isFreeDelivery?: boolean;
  isFavorite?: boolean;
  isInCart?: boolean;
  inStock?: boolean;
  stockCount?: number;
  volume?: string;
  volumeOptions?: string[];
  skinType?: string[];
  keyIngredients?: string[];
  description?: string;
  descriptionAr?: string;
  overviewHighlights?: string[];
  overviewHighlightsAr?: string[];
  howToUse?: string;
  howToUseAr?: string;
  specifications?: Record<string, string>;
  specificationsAr?: Record<string, string>;
  ratingBreakdown?: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
  reviews?: ProductReview[];
}

export interface ProductCardProps {
  product?: Product;
  // Flat props fallback for flexibility
  id?: string | number;
  title?: string;
  category?: ProductCategory;
  image?: string;
  images?: string[];
  price?: number;
  originalPrice?: number;
  discountPercent?: number;
  badge?: "best_of_us" | "most_ordered" | "discount" | "new" | string;
  badgeText?: string;
  rating?: number;
  reviewCount?: number;
  isFreeDelivery?: boolean;
  isFavorite?: boolean;
  isInCart?: boolean;
  currencySymbol?: string;
  className?: string;
  // Event handlers
  onAddToCart?: (product: Partial<Product>) => void;
  onToggleFavorite?: (id: string | number, isFav: boolean) => void;
  onClick?: (id: string | number) => void;
}
