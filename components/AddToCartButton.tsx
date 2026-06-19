"use client";

import toast from "react-hot-toast";
import { ShoppingBag } from "lucide-react";

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

      toast.success("Added to cart");
    } catch (error) {
      console.error(error);
      toast.error("Unable to add product");
    }
  };

  return (
    <button
      onClick={handleAddToCart}
      disabled={stock <= 0}
      className={`flex w-full items-center justify-center gap-2 rounded-full py-3.5 text-sm font-black shadow-lg transition sm:text-base ${
        stock > 0
          ? "bg-black text-white hover:bg-gray-800"
          : "bg-gray-300 text-gray-500"
      }`}
    >
      <ShoppingBag size={18} />
      {stock > 0 ? "Add To Cart" : "Out Of Stock"}
    </button>
  );
}