"use client";

import toast from "react-hot-toast";

type Props = {
  product: {
    id: string;
    name: string;
    price: number;
    image: string;
    color?: string;
    size?: string;
  };
};

export default function AddToCartButton({ product }: Props) {
  const handleAddToCart = () => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");

    cart.push({
      ...product,
      quantity: 1,
    });

    localStorage.setItem("cart", JSON.stringify(cart));

    window.dispatchEvent(new Event("storage"));

    toast.success(`${product.name} added to cart`);
  };

  return (
    <button
      onClick={handleAddToCart}
      className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg text-xl font-bold transition"
    >
      Add To Cart
    </button>
  );
}