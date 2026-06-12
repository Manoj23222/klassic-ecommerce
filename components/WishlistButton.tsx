"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

type Product = {
  id: string;
  name: string;
  price: number;
  image: string;
};

export default function WishlistButton({
  product,
}: {
  product: Product;
}) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const wishlist = JSON.parse(
      localStorage.getItem("wishlist") || "[]"
    );

    setSaved(
      wishlist.some(
        (item: Product) => item.id === product.id
      )
    );
  }, [product.id]);

  const toggleWishlist = () => {
    const wishlist = JSON.parse(
      localStorage.getItem("wishlist") || "[]"
    );

    if (saved) {
      const updated = wishlist.filter(
        (item: Product) => item.id !== product.id
      );

      localStorage.setItem(
        "wishlist",
        JSON.stringify(updated)
      );

      setSaved(false);

      toast.success("Removed from wishlist");
    } else {
      const updated = [...wishlist, product];

      localStorage.setItem(
        "wishlist",
        JSON.stringify(updated)
      );

      setSaved(true);

      toast.success("Added to wishlist");
    }

    window.dispatchEvent(new Event("storage"));
  };

  return (
    <button
      type="button"
      onClick={toggleWishlist}
      className={
        saved
          ? "w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-bold text-lg transition"
          : "w-full bg-pink-600 hover:bg-pink-700 text-white py-3 rounded-lg font-bold text-lg transition"
      }
    >
      {saved ? "❤️ Wishlisted" : "♡ Add to Wishlist"}
    </button>
  );
}