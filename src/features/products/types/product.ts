export type ProductCategory = "skin_care" | "body_care" | string;

export interface Product {
  id: string | number;
  title: string;
  titleAr?: string;
  category?: ProductCategory;
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
  inStock?: boolean;
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
  currencySymbol?: string;
  className?: string;
  // Event handlers
  onAddToCart?: (product: Partial<Product>) => void;
  onToggleFavorite?: (id: string | number, isFav: boolean) => void;
  onClick?: (id: string | number) => void;
}
