"use client";

import toast from "react-hot-toast";

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
  const handleAddToCart = () => {
    try {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      const productId = String(product._id || product.id || "");

      const existingIndex = cart.findIndex(
        (item: any) =>
          String(item.id) === productId &&
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
          name: product.name,
          image: product.image,
          price: Number(product.price || 0),
          sku: product.sku || "",
          color: product.color || "",
          size: product.size || "",
          stock: Number(product.stock || 0),
          quantity: 1,
        });
      }

      localStorage.setItem("cart", JSON.stringify(cart));
      window.dispatchEvent(new Event("storage"));

      toast.success("Added to cart");
    } catch (error) {
      console.error(error);
      toast.error("Unable to add product");
    }
  };

  return (
    <button
      onClick={handleAddToCart}
      className="w-full rounded-full bg-black py-4 text-sm font-black text-white shadow-lg transition hover:bg-gray-800 sm:text-base"
    >
      Add To Cart
    </button>
  );
}