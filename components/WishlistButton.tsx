"use client";

import { useEffect, useState } from "react";

type Product = {
  id: number;
  name: string;
  price: number;
  image: string;
};

export default function WishlistButton({ product }: { product: Product }) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
    setSaved(wishlist.some((item: Product) => item.id === product.id));
  }, [product.id]);

  const toggleWishlist = () => {
    const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");

    if (saved) {
      const updated = wishlist.filter((item: Product) => item.id !== product.id);
      localStorage.setItem("wishlist", JSON.stringify(updated));
      setSaved(false);
      alert("Removed from wishlist");
    } else {
      const updated = [...wishlist, product];
      localStorage.setItem("wishlist", JSON.stringify(updated));
      setSaved(true);
      alert("Added to wishlist");
    }
  };

  return (
    <button
      type="button"
      onClick={toggleWishlist}
      className={
        saved
          ? "w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-bold text-lg"
          : "w-full bg-pink-600 hover:bg-pink-700 text-white py-3 rounded-lg font-bold text-lg"
      }
    >
      {saved ? "❤️ Wishlisted" : "♡ Add to Wishlist"}
    </button>
  );
}