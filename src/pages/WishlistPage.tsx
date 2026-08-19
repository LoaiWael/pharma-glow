import { WishlistEmptyState } from "@/features/wishlist";

const WishlistPage = () => {
  return (
    <section className="flex min-h-[65vh] items-center justify-center py-12">
      <WishlistEmptyState />
    </section>
  );
};

export default WishlistPage;
