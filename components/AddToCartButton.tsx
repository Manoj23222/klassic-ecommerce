"use client";

type Props = {
  product: {
    id: number;
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

    alert(`${product.name} added to cart`);
  };

  return (
    <button
      onClick={handleAddToCart}
      className="mt-6 w-full bg-blue-600 text-white py-3 rounded-lg text-xl"
    >
      Add To Cart
    </button>
  );
}