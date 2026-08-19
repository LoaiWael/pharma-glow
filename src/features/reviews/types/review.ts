export interface ReviewMediaItem {
  id: string;
  type?: 'image' | 'video';
  mediaUrl: string;
  thumbnailUrl?: string;
  authorName: string;
  authorAvatar?: string;
  authorHandle?: string;
  rating: number;
  productName?: string;
  productId?: string;
  productImage?: string;
  likesCount?: number;
  verifiedPurchase?: boolean;
  date?: string;
  caption?: string;
}

export interface ReviewCardProps {
  review: ReviewMediaItem;
  className?: string;
  onMediaClick?: (review: ReviewMediaItem) => void;
  onProductClick?: (productId: string) => void;
}
