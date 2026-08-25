import { motion } from 'motion/react'
import { cn } from '@/lib/utils'

type ProductCardSkeletonProps = {
  className?: string
}

export const ProductCardSkeleton = ({ className }: ProductCardSkeletonProps) => (
  <div className={cn('flex w-full flex-col gap-2.5', className)}>
    <div className="aspect-[3/4] w-full rounded-2xl bg-primary-100 animate-pulse" />
    <div className="h-3.5 w-4/5 rounded-full bg-primary-100 animate-pulse" />
    <div className="h-3 w-2/5 rounded-full bg-primary-100 animate-pulse" />
    <div className="mt-1 h-8 w-full rounded-xl bg-primary-100 animate-pulse" />
  </div>
)

type ProductGridSkeletonProps = {
  count?: number
  className?: string
}

export const ProductGridSkeleton = ({
  count = 6,
  className,
}: ProductGridSkeletonProps) => (
  <motion.div
    key="product-grid-skeleton"
    className={cn(
      'grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-2.5 sm:gap-3.5 md:gap-4 lg:gap-4 xl:gap-4.5 w-full',
      className,
    )}
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.3, ease: 'easeOut' }}
  >
    {Array.from({ length: count }).map((_, index) => (
      <ProductCardSkeleton key={index} />
    ))}
  </motion.div>
)

export const ProductDetailSkeleton = () => (
  <motion.div
    key="product-detail-skeleton"
    className="mx-auto max-w-[var(--page-max-width)] px-4 sm:px-6 lg:px-8 py-8"
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.3, ease: 'easeOut' }}
  >
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <div className="lg:col-span-5 space-y-3">
        <div className="aspect-square w-full rounded-3xl bg-primary-100 animate-pulse" />
        <div className="grid grid-cols-4 gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="aspect-square rounded-xl bg-primary-100 animate-pulse" />
          ))}
        </div>
      </div>
      <div className="lg:col-span-4 space-y-4">
        <div className="h-4 w-24 rounded-full bg-primary-100 animate-pulse" />
        <div className="h-8 w-full rounded-full bg-primary-100 animate-pulse" />
        <div className="h-8 w-3/4 rounded-full bg-primary-100 animate-pulse" />
        <div className="h-5 w-40 rounded-full bg-primary-100 animate-pulse" />
        <div className="h-24 w-full rounded-2xl bg-primary-100 animate-pulse" />
      </div>
      <div className="lg:col-span-3 space-y-3">
        <div className="h-48 w-full rounded-3xl bg-primary-100 animate-pulse" />
        <div className="h-12 w-full rounded-xl bg-primary-100 animate-pulse" />
      </div>
    </div>
  </motion.div>
)

export const RelatedProductsSkeleton = () => (
  <motion.div
    key="related-products-skeleton"
    className="flex gap-3 overflow-hidden py-2"
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -8 }}
    transition={{ duration: 0.3, ease: 'easeOut' }}
  >
    {Array.from({ length: 4 }).map((_, index) => (
      <div key={index} className="min-w-[140px] max-w-[180px] flex-1">
        <ProductCardSkeleton />
      </div>
    ))}
  </motion.div>
)
