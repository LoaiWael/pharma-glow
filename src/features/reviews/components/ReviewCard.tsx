import React, { useState } from "react";
import { motion } from "motion/react";
import { Image as ImageIcon, X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import type { ReviewCardProps } from "../types/review";

export const ReviewCard: React.FC<ReviewCardProps> = ({
  review,
  className,
  onMediaClick,
}) => {
  const [imageError, setImageError] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleCardClick = () => {
    if (onMediaClick) {
      onMediaClick(review);
    } else {
      setIsOpen(true);
    }
  };

  return (
    <>
      <motion.div
        onClick={handleCardClick}
        whileHover={{ y: -4 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className={cn(
          "group relative flex flex-col w-full h-[400px] sm:h-[440px] md:h-[480px] rounded-3xl overflow-hidden cursor-pointer select-none bg-neutral-900 border border-black/5 dark:border-white/10 shadow-md hover:shadow-xl transition-all duration-300",
          className,
        )}
      >
        {/* Background Media (Image) */}
        <div className="absolute inset-0 w-full h-full bg-neutral-900 overflow-hidden">
          {!imageError ? (
            <img
              src={review.mediaUrl}
              alt={review.caption || review.authorName || "Review image"}
              loading="lazy"
              draggable={false}
              onError={() => setImageError(true)}
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 pointer-events-none select-none"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-neutral-800 text-neutral-400 p-4 select-none">
              <ImageIcon className="w-12 h-12 stroke-[1.25] mb-2" />
            </div>
          )}
        </div>
      </motion.div>

      {/* Image Preview Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent
          showCloseButton={false}
          overlayClassName="bg-black/80 backdrop-blur-md"
          className="relative max-w-4xl p-0 overflow-hidden bg-neutral-900/90 border border-white/15 rounded-3xl shadow-2xl backdrop-blur-xl text-white outline-none"
        >
          <DialogTitle className="sr-only">
            {review.caption || review.authorName || "Review Image"}
          </DialogTitle>
          <DialogDescription className="sr-only">
            {review.caption || "Full preview of review image"}
          </DialogDescription>

          {/* High-visibility Floating Close Button */}
          <DialogClose className="absolute top-4 end-4 z-50 inline-flex size-10 items-center justify-center rounded-full bg-black/60 hover:bg-black/90 text-white hover:text-white border border-white/20 backdrop-blur-md shadow-lg transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer outline-none">
            <X className="size-5 stroke-[2.5]" />
            <span className="sr-only">Close</span>
          </DialogClose>

          {/* Image Container */}
          <div className="relative w-full max-h-[85vh] flex items-center justify-center p-3 sm:p-6 overflow-hidden">
            <img
              src={review.mediaUrl}
              alt={review.caption || review.authorName || "Review image"}
              draggable={false}
              className="max-h-[78vh] w-auto max-w-full rounded-2xl object-contain select-none shadow-2xl"
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ReviewCard;

