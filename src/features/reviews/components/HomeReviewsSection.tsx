import React, {
  useRef,
  useState,
  useEffect,
  type PointerEvent,
  type MouseEvent,
} from "react";
import { Sparkles } from "lucide-react";
import { FormattedMessage } from "react-intl";
import { ReviewCard } from "./ReviewCard";
import { mockMediaReviews } from "../data/mockReviews";
import type { ReviewMediaItem } from "../types/review";
import { cn } from "@/lib/utils";

interface HomeReviewsSectionProps {
  reviews?: ReviewMediaItem[];
  className?: string;
}

export const HomeReviewsSection: React.FC<HomeReviewsSectionProps> = ({
  reviews = mockMediaReviews,
  className,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const isHoveredRef = useRef(false);
  const isDraggingRef = useRef(false);

  useEffect(() => {
    isHoveredRef.current = isHovered;
  }, [isHovered]);

  useEffect(() => {
    isDraggingRef.current = isDragging;
  }, [isDragging]);

  const currentXRef = useRef<number>(0);
  const singleSetWidthRef = useRef<number>(0);

  const dragState = useRef({
    startX: 0,
    startPosX: 0,
    hasMoved: false,
    pointerId: -1,
  });

  const shouldMarquee = reviews.length > 4;
  const repeatCount = shouldMarquee ? 4 : 1;
  const cloneSets = Array.from({ length: repeatCount }, (_, i) => i);

  // Measure single loop set width
  useEffect(() => {
    if (!shouldMarquee) return;
    const track = trackRef.current;
    if (!track) return;

    const measure = () => {
      const firstSet = track.children[0] as HTMLElement;
      if (firstSet) {
        singleSetWidthRef.current = firstSet.offsetWidth + 20; // width + gap
      }
    };

    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [shouldMarquee, reviews]);

  // Unified RequestAnimationFrame Auto-Scroller
  useEffect(() => {
    if (!shouldMarquee) return;
    const track = trackRef.current;
    if (!track) return;

    let rafId: number;
    let lastTime = performance.now();
    const speed = 40; // Pixels per second

    const update = (now: number) => {
      const delta = (now - lastTime) / 1000;
      lastTime = now;

      if (!isHoveredRef.current && !isDraggingRef.current) {
        const setWidth = singleSetWidthRef.current;

        if (setWidth > 0) {
          // Continuous scroll to the left
          currentXRef.current -= speed * delta;

          // Wrap seamlessly when one full set passes
          if (Math.abs(currentXRef.current) >= setWidth) {
            currentXRef.current += setWidth;
          }

          track.style.transform = `translate3d(${currentXRef.current}px, 0, 0)`;
        }
      }

      rafId = requestAnimationFrame(update);
    };

    // Initialize set width and starting position
    const initTimer = setTimeout(() => {
      const firstSet = track.children[0] as HTMLElement;
      if (firstSet) {
        singleSetWidthRef.current = firstSet.offsetWidth + 20;
        currentXRef.current = 0;
        track.style.transform = `translate3d(0px, 0, 0)`;
      }
    }, 50);

    rafId = requestAnimationFrame(update);

    return () => {
      clearTimeout(initTimer);
      cancelAnimationFrame(rafId);
    };
  }, [shouldMarquee, reviews]);

  // Pointer Drag Handlers
  const handlePointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;

    dragState.current = {
      startX: e.clientX,
      startPosX: currentXRef.current,
      hasMoved: false,
      pointerId: e.pointerId,
    };
  };

  const handlePointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (dragState.current.pointerId !== e.pointerId) return;
    const track = trackRef.current;
    if (!track) return;

    const deltaX = e.clientX - dragState.current.startX;
    if (!dragState.current.hasMoved) {
      if (Math.abs(deltaX) > 4) {
        dragState.current.hasMoved = true;
        setIsDragging(true);
        isDraggingRef.current = true;
        const container = containerRef.current;
        if (container) {
          container.setPointerCapture(e.pointerId);
        }
      } else {
        return;
      }
    }

    const setWidth = singleSetWidthRef.current;
    let newX = dragState.current.startPosX + deltaX;

    // Wrap during drag to guarantee infinite loop
    if (setWidth > 0) {
      if (newX > 0) {
        newX -= setWidth;
        dragState.current.startPosX -= setWidth;
      } else if (Math.abs(newX) >= setWidth * 2) {
        newX += setWidth;
        dragState.current.startPosX += setWidth;
      }
    }

    currentXRef.current = newX;
    track.style.transform = `translate3d(${newX}px, 0, 0)`;
  };

  const endDrag = (e: PointerEvent<HTMLDivElement>) => {
    if (dragState.current.pointerId !== e.pointerId) return;

    setIsDragging(false);
    isDraggingRef.current = false;

    const container = containerRef.current;
    if (container?.hasPointerCapture(e.pointerId)) {
      container.releasePointerCapture(e.pointerId);
    }

    dragState.current.pointerId = -1;
    // Reset hasMoved after a short delay so clickCapture can evaluate it
    setTimeout(() => {
      dragState.current.hasMoved = false;
    }, 50);
  };

  const handleClickCapture = (e: MouseEvent<HTMLDivElement>) => {
    if (dragState.current.hasMoved) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  if (reviews.length === 0) return null;

  return (
    <section
      className={cn("py-8 md:py-12 select-none overflow-hidden", className)}
    >
      <div className="container mx-auto px-4 md:px-6">
        {/* Section Header */}
        <div className="flex items-start justify-between gap-3 mb-6">
          <div className="space-y-1.5">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full border shadow-2xs mb-1 bg-secondary-200 text-secondary-900 border-secondary-300 dark:bg-secondary-900 dark:text-secondary-100">
              <Sparkles className="w-3.5 h-3.5 text-secondary-700 dark:text-secondary-300" />
              <FormattedMessage id="home.reviews.badge" />
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight leading-snug">
              <FormattedMessage id="home.reviews.title" />
            </h2>
            <p className="text-xs md:text-sm text-tertiary-700 dark:text-tertiary-300 max-w-xl">
              <FormattedMessage id="home.reviews.subtitle" />
            </p>
          </div>
        </div>

        {/* Reviews Viewport */}
        {shouldMarquee ? (
          <div
            dir="ltr"
            ref={containerRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
            onClickCapture={handleClickCapture}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={cn(
              "relative w-full overflow-hidden py-2 select-none touch-none",
              isDragging ? "cursor-grabbing" : "cursor-grab",
            )}
          >
            <div
              ref={trackRef}
              className="flex gap-5 w-max will-change-transform select-none"
              style={{ transform: "translate3d(0px, 0, 0)" }}
            >
              {cloneSets.map((setIdx) => (
                <div key={setIdx} className="flex gap-5 shrink-0 select-none">
                  {reviews.map((review) => (
                    <div
                      key={`${setIdx}-${review.id}`}
                      className="w-[78vw] max-w-[280px] sm:w-[280px] md:w-[300px] shrink-0 flex select-none pointer-events-auto"
                    >
                      <ReviewCard review={review} />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex gap-5 overflow-x-auto scrollbar-none py-2">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="w-[78vw] max-w-[280px] sm:w-[280px] md:w-[300px] shrink-0 flex"
              >
                <ReviewCard review={review} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default HomeReviewsSection;
