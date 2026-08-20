import { WishlistEmptyState } from "@/features/wishlist";
import { useEffect } from "react";

const WishlistPage = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);

  return (
    <section className="flex min-h-[65vh] items-center justify-center py-12">
      <WishlistEmptyState />
    </section>
  );
};

export default WishlistPage;
