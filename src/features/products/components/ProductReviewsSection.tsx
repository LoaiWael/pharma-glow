import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Star, CheckCircle, ThumbsUp, MessageSquare, ArrowRight, ArrowLeft } from "lucide-react";
import { useIntl } from "react-intl";
import { cn } from "@/lib/utils";
import type { Product, ProductReview } from "@/features/products/types/product";
import { DEFAULT_LOCALE, isLocale, LOCALE_DIR } from "@/i18n/locales";

interface ProductReviewsSectionProps {
  product: Product;
  className?: string;
  maxDisplay?: number;
  showViewAllButton?: boolean;
}

export const ProductReviewsSection: React.FC<ProductReviewsSectionProps> = ({
  product,
  className,
  maxDisplay = 4,
  showViewAllButton = true,
}) => {
  const intl = useIntl();
  const locale = isLocale(intl.locale) ? intl.locale : DEFAULT_LOCALE;
  const isRtl = LOCALE_DIR[locale] === "rtl";

  const rating = product.rating ?? 4.8;
  const reviewCount = product.reviewCount ?? 120;
  const breakdown = product.ratingBreakdown || {
    5: Math.round(reviewCount * 0.75),
    4: Math.round(reviewCount * 0.18),
    3: Math.round(reviewCount * 0.05),
    2: Math.round(reviewCount * 0.01),
    1: Math.round(reviewCount * 0.01),
  };

  const defaultReviews: ProductReview[] = product.reviews || [
    {
      id: "dr1",
      author: "يارا أحمد",
      rating: 5,
      date: "منذ 4 أيام",
      title: "توهج وترطيب غير طبيعي!",
      comment:
        "المنتج أكثر من رائع، ناسب بشرتي الحساسة وخفف الجفاف والبهتان بشكل ملحوظ خلال 10 أيام. أنصح به جداً.",
      isVerifiedPurchase: true,
      helpfulCount: 18,
    },
    {
      id: "dr2",
      author: "أميرة عثمان",
      rating: 5,
      date: "منذ أسبوع",
      title: "أصلي وتوصيل سريع جداً",
      comment:
        "التغليف ممتاز والمنتج أصلي 100%. وصلني ثاني يوم مباشرة، تجربة شراء ممتازة من فارما جلو.",
      isVerifiedPurchase: true,
      helpfulCount: 9,
    },
    {
      id: "dr3",
      author: "شروق م.",
      rating: 4,
      date: "منذ 3 أسابيع",
      title: "جيد جداً وخفيف على البشرة",
      comment:
        "القوام خفيف جداً ولا يترك أي ملمس دهني، فقط تمنيت لو كان الحجم أكبر قليلاً.",
      isVerifiedPurchase: true,
      helpfulCount: 5,
    },
  ];

  const [filterRating, setFilterRating] = useState<number | null>(null);
  const [helpfulMap, setHelpfulMap] = useState<Record<string | number, boolean>>({});

  const toggleHelpful = (id: string | number) => {
    setHelpfulMap((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const filteredReviews = filterRating
    ? defaultReviews.filter((r) => r.rating === filterRating)
    : defaultReviews;

  const displayedReviews = maxDisplay
    ? filteredReviews.slice(0, maxDisplay)
    : filteredReviews;

  return (
    <section
      id="customer-reviews-section"
      className={cn(
        "rounded-2xl border border-border/80 bg-white dark:bg-neutral-900 p-5 md:p-6 shadow-xs flex flex-col gap-6 scroll-mt-24",
        className
      )}
    >
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-secondary" />
          <h2 className="text-lg md:text-xl font-bold text-foreground m-0">
            {intl.formatMessage(
              {
                id: "product.reviews.title",
                defaultMessage: "تقييمات وآراء العملاء ({count})",
              },
              { count: reviewCount }
            )}
          </h2>
        </div>

        {showViewAllButton && (
          <Link
            to={`/products/${product.id}/reviews`}
            viewTransition
            className="inline-flex items-center gap-1.5 text-xs font-bold text-secondary hover:text-secondary-700 transition-colors"
          >
            <span>
              {intl.formatMessage({
                id: "reviews.viewAll",
                defaultMessage: "عرض جميع التقييمات",
              })}
            </span>
            {isRtl ? (
              <ArrowLeft className="w-3.5 h-3.5" />
            ) : (
              <ArrowRight className="w-3.5 h-3.5" />
            )}
          </Link>
        )}
      </div>

      {/* Ratings Summary (Score box + Bar chart - Noon pattern) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-5 rounded-2xl bg-neutral/60 border border-border/70 items-center">
        {/* Big rating number & stars */}
        <div className="md:col-span-4 flex flex-col items-center justify-center text-center p-3 border-b md:border-b-0 md:border-e border-border/70">
          <span className="text-5xl font-black text-secondary">{rating.toFixed(1)}</span>
          <div className="flex items-center gap-1 my-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={cn(
                  "w-4 h-4",
                  star <= Math.round(rating)
                    ? "fill-amber-400 text-amber-400"
                    : "text-gray-300"
                )}
              />
            ))}
          </div>
          <span className="text-xs text-tertiary">
            {intl.formatMessage(
              {
                id: "product.reviews.basedOn",
                defaultMessage: "بناءً على {count} تقييم موثق",
              },
              { count: reviewCount }
            )}
          </span>
          <span className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
            <CheckCircle className="w-3.5 h-3.5" />{" "}
            {intl.formatMessage({
              id: "product.reviews.recommended",
              defaultMessage: "94% من المشترين يوصون بهذا المنتج",
            })}
          </span>
        </div>

        {/* 5-Star Distribution Progress Bars */}
        <div className="md:col-span-8 flex flex-col gap-2">
          {[5, 4, 3, 2, 1].map((stars) => {
            const count = (breakdown as Record<number, number>)[stars] || 0;
            const percent = reviewCount > 0 ? Math.round((count / reviewCount) * 100) : 0;
            const isSelected = filterRating === stars;

            return (
              <button
                key={stars}
                type="button"
                onClick={() => setFilterRating(isSelected ? null : stars)}
                className={cn(
                  "flex items-center gap-3 text-xs w-full p-1 rounded-lg transition-colors cursor-pointer text-start",
                  isSelected ? "bg-secondary/10 font-bold" : "hover:bg-neutral"
                )}
              >
                <div className="flex items-center gap-1 w-12 shrink-0">
                  <span className="font-bold text-foreground">{stars}</span>
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                </div>

                {/* Progress bar */}
                <div className="flex-1 h-2.5 rounded-full bg-gray-200 dark:bg-neutral-800 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-secondary transition-all duration-500"
                    style={{ width: `${percent}%` }}
                  />
                </div>

                <span className="w-10 text-end text-tertiary font-medium">
                  {percent}%
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Review items list */}
      <div className="flex flex-col divide-y divide-border/60">
        {displayedReviews.length === 0 ? (
          <p className="text-center py-6 text-xs text-tertiary">
            {intl.formatMessage({
              id: "product.reviews.empty",
              defaultMessage: "لا توجد تقييمات مطابقة لهذا الفلتر.",
            })}
          </p>
        ) : (
          displayedReviews.map((rev) => {
            const isHelpful = Boolean(helpfulMap[rev.id]);
            const count = (rev.helpfulCount || 0) + (isHelpful ? 1 : 0);

            return (
              <div key={rev.id} className="py-4 flex flex-col gap-2">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-full bg-secondary/15 text-secondary font-bold text-xs flex items-center justify-center">
                      {rev.author.charAt(0)}
                    </span>
                    <span className="font-bold text-xs text-foreground">{rev.author}</span>
                    {rev.isVerifiedPurchase && (
                      <span className="inline-flex items-center gap-0.5 text-[11px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md font-medium">
                        <CheckCircle className="w-3 h-3" />
                        {intl.formatMessage({
                          id: "product.reviews.verifiedPurchase",
                          defaultMessage: "مشترٍ موثق",
                        })}
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-tertiary">{rev.date}</span>
                </div>

                {/* Star rating for review */}
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={cn(
                        "w-3.5 h-3.5",
                        s <= rev.rating
                          ? "fill-amber-400 text-amber-400"
                          : "text-gray-300"
                      )}
                    />
                  ))}
                  {rev.title && (
                    <span className="ms-2 font-bold text-xs text-foreground">
                      {rev.title}
                    </span>
                  )}
                </div>

                <p className="text-xs text-tertiary leading-relaxed m-0">
                  {rev.comment}
                </p>

                {/* Helpful button */}
                <div className="flex items-center justify-end pt-1">
                  <button
                    type="button"
                    onClick={() => toggleHelpful(rev.id)}
                    className={cn(
                      "text-[11px] flex items-center gap-1.5 px-2.5 py-1 rounded-lg border transition-colors cursor-pointer",
                      isHelpful
                        ? "border-secondary bg-secondary/10 text-secondary font-semibold"
                        : "border-border text-tertiary hover:border-secondary/50"
                    )}
                  >
                    <ThumbsUp className="w-3 h-3" />
                    <span>
                      {intl.formatMessage(
                        {
                          id: "product.reviews.helpful",
                          defaultMessage: "مفيد ({count})",
                        },
                        { count }
                      )}
                    </span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {showViewAllButton && defaultReviews.length > 0 && (
        <div className="pt-2 flex justify-center">
          <Link
            to={`/products/${product.id}/reviews`}
            viewTransition
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl border border-secondary/30 bg-secondary/10 hover:bg-secondary/20 text-secondary font-bold text-xs transition-colors"
          >
            <span>
              {intl.formatMessage({
                id: "reviews.viewAll",
                defaultMessage: "عرض جميع التقييمات",
              })}
            </span>
            {isRtl ? (
              <ArrowLeft className="w-4 h-4" />
            ) : (
              <ArrowRight className="w-4 h-4" />
            )}
          </Link>
        </div>
      )}
    </section>
  );
};

export default ProductReviewsSection;
