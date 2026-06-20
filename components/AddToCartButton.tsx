"use client";

import toast from "react-hot-toast";
import { ShoppingBag, CheckCircle } from "lucide-react";
import { useState } from "react";

type Props = {
  product: {
    id?: string;
    _id?: string;
    name: string;
    price: number;
    image: string;
    sku?: string;
    color?: string;
    size?: string;
    stock?: number;
  };
};

export default function AddToCartButton({ product }: Props) {
  const [added, setAdded] = useState(false);
  const stock = Number(product.stock || 0);

  const handleAddToCart = () => {
    try {
      if (stock <= 0) {
        toast.error("Product is out of stock");
        return;
      }

      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      const productId = String(product._id || product.id || "");

      const existingIndex = cart.findIndex(
        (item: any) =>
          String(item.id || item._id) === productId &&
          item.color === product.color &&
          item.size === product.size &&
          item.sku === product.sku
      );

      if (existingIndex > -1) {
        cart[existingIndex].quantity =
          Number(cart[existingIndex].quantity || 1) + 1;
      } else {
        cart.push({
          id: productId,
          _id: productId,
          name: product.name,
          image: product.image || "/placeholder.png",
          price: Number(product.price || 0),
          sku: product.sku || "",
          color: product.color || "",
          size: product.size || "",
          stock,
          quantity: 1,
        });
      }

      localStorage.setItem("cart", JSON.stringify(cart));

      window.dispatchEvent(new Event("storage"));
      window.dispatchEvent(new Event("cart-updated"));

      setAdded(true);
      toast.success("Added to cart");

      setTimeout(() => setAdded(false), 1200);
    } catch (error) {
      console.error(error);
      toast.error("Unable to add product");
    }
  };

  return (
    <button
      type="button"
      onClick={handleAddToCart}
      disabled={stock <= 0}
      className={`flex w-full items-center justify-center gap-1.5 rounded-xl py-2.5 text-xs font-black shadow-md transition sm:rounded-full sm:py-3 sm:text-sm ${
        stock > 0
          ? added
            ? "bg-green-600 text-white"
            : "bg-slate-950 text-white hover:bg-black"
          : "bg-gray-300 text-gray-500"
      }`}
    >
      {added ? <CheckCircle size={16} /> : <ShoppingBag size={16} />}
      {stock > 0 ? (added ? "Added" : "Add Cart") : "Out Stock"}
    </button>
  );
}