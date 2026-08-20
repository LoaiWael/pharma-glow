import { CartView } from "@/features/cart";
import { useEffect } from "react";

const CartPage = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);

  return <CartView />;
};

export default CartPage;
