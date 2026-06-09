"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type CartItem = {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity?: number;
  color?: string;
  size?: string;
};

export default function CartItems() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const freeGiftTarget = 2000;

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(savedCart.map((item: CartItem) => ({ ...item, quantity: item.quantity || 1 })));
  }, []);

  const updateCart = (newCart: CartItem[]) => {
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  };

  const increaseQty = (index: number) => {
    const newCart = [...cart];
    newCart[index].quantity = (newCart[index].quantity || 1) + 1;
    updateCart(newCart);
  };

  const decreaseQty = (index: number) => {
    const newCart = [...cart];
    if ((newCart[index].quantity || 1) > 1) {
      newCart[index].quantity = (newCart[index].quantity || 1) - 1;
      updateCart(newCart);
    }
  };

  const removeItem = (index: number) => {
    updateCart(cart.filter((_, i) => i !== index));
  };

  const total = cart.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);
  const remaining = Math.max(freeGiftTarget - total, 0);
  const progress = Math.min((total / freeGiftTarget) * 100, 100);

  if (cart.length === 0) return <p>Your cart is empty.</p>;

  return (
    <div className="space-y-6">
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
        <div className="flex justify-between font-bold mb-2">
          <span>🎁 Free Gift Progress</span>
          <span>₹{total} / ₹{freeGiftTarget}</span>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
          <div
            className="bg-green-600 h-4 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>

        <p className="mt-2 text-sm font-semibold">
          {remaining > 0
            ? `₹${remaining} और add करो, Free Gift unlock होगा`
            : "🎉 Free Gift Unlocked!"}
        </p>
      </div>

      {cart.map((item, index) => (
        <div key={index} className="flex items-center justify-between gap-4 border-b pb-4">
          <div className="flex items-center gap-4">
            <img src={item.image} alt={item.name} className="w-20 h-20 object-contain" />

            <div>
              <h3 className="font-bold">{item.name}</h3>

              {item.color && <p className="text-sm text-gray-600">Color: <b>{item.color}</b></p>}
              {item.size && <p className="text-sm text-gray-600">Size: <b>{item.size}</b></p>}

              <p className="text-green-600 font-bold">₹{item.price}</p>

              <div className="flex items-center gap-3 mt-2">
                <button onClick={() => decreaseQty(index)} className="px-3 py-1 bg-gray-200 rounded">-</button>
                <span>{item.quantity}</span>
                <button onClick={() => increaseQty(index)} className="px-3 py-1 bg-gray-200 rounded">+</button>
              </div>
            </div>
          </div>

          <button onClick={() => removeItem(index)} className="bg-red-600 text-white px-4 py-2 rounded">
            Remove
          </button>
        </div>
      ))}

      <div className="text-right text-2xl font-bold">
        Total: ₹{total}

        <Link href="/checkout" className="block mt-4 text-center bg-green-600 text-white py-3 rounded-lg text-xl">
          Proceed to Checkout
        </Link>
      </div>
    </div>
  );
}