import { WishlistView } from "@/features/wishlist";
import { useEffect } from "react";

const WishlistPage = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);

  return <WishlistView />;
};

export default WishlistPage;
