"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type CartItem = {
  id: string | number;
  _id?: string;
  name: string;
  price: number;
  image: string;
  quantity?: number;
  color?: string;
  size?: string;
  sku?: string;
  stock?: number;
};

export default function CartItems() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const freeGiftTarget = 2000;

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(
      savedCart.map((item: CartItem) => ({
        ...item,
        quantity: item.quantity || 1,
        price: Number(item.price || 0),
      }))
    );
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

  const subtotal = cart.reduce(
    (sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 1),
    0
  );

  const deliveryCharge = subtotal >= 999 || subtotal === 0 ? 0 : 49;
  const discount = subtotal >= 2000 ? Math.round(subtotal * 0.05) : 0;
  const total = subtotal + deliveryCharge - discount;

  const remaining = Math.max(freeGiftTarget - subtotal, 0);
  const progress = Math.min((subtotal / freeGiftTarget) * 100, 100);

  if (cart.length === 0) {
    return (
      <div className="rounded-[2rem] bg-white p-10 text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#f6f7fb] text-4xl">
          🛒
        </div>

        <h2 className="mt-5 text-2xl font-black">Your cart is empty</h2>

        <p className="mt-2 text-sm text-gray-500">
          Add products to your cart and continue shopping.
        </p>

        <Link
          href="/"
          className="mt-6 inline-block rounded-full bg-black px-8 py-3 text-sm font-black text-white"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <section className="space-y-4">
        <div className="rounded-[2rem] border border-yellow-200 bg-yellow-50 p-4">
          <div className="mb-2 flex justify-between gap-3 text-sm font-black">
            <span>🎁 Free Gift Progress</span>
            <span>
              ₹{subtotal.toLocaleString("en-IN")} / ₹
              {freeGiftTarget.toLocaleString("en-IN")}
            </span>
          </div>

          <div className="h-3 w-full overflow-hidden rounded-full bg-white">
            <div
              className="h-3 rounded-full bg-green-600 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>

          <p className="mt-2 text-sm font-bold text-gray-700">
            {remaining > 0
              ? `₹${remaining.toLocaleString("en-IN")} Adding more items will unlock a free gift.`
              : "🎉 Free Gift Unlocked!"}
          </p>
        </div>

        {cart.map((item, index) => {
          const itemId = String(item._id || item.id || "");
          const qty = Number(item.quantity || 1);
          const itemTotal = Number(item.price || 0) * qty;

          return (
            <div
              key={`${itemId}-${index}`}
              className="rounded-[2rem] border bg-white p-4 shadow-sm"
            >
              <div className="flex gap-4">
                <Link
                  href={itemId ? `/product/${itemId}` : "#"}
                  className="flex h-28 w-28 shrink-0 items-center justify-center rounded-2xl bg-[#f6f7fb] p-3"
                >
                  <img
                    src={item.image || "/placeholder.png"}
                    alt={item.name}
                    className="h-full w-full object-contain"
                  />
                </Link>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <Link
                        href={itemId ? `/product/${itemId}` : "#"}
                        className="line-clamp-2 text-base font-black hover:text-orange-600"
                      >
                        {item.name}
                      </Link>

                      <div className="mt-2 flex flex-wrap gap-2 text-xs font-bold text-gray-500">
                        {item.color && (
                          <span className="rounded-full bg-gray-100 px-3 py-1">
                            Color: {item.color}
                          </span>
                        )}

                        {item.size && (
                          <span className="rounded-full bg-gray-100 px-3 py-1">
                            Size: {item.size}
                          </span>
                        )}

                        {item.sku && (
                          <span className="rounded-full bg-gray-100 px-3 py-1">
                            SKU: {item.sku}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-lg font-black">
                        ₹{itemTotal.toLocaleString("en-IN")}
                      </p>
                      <p className="text-xs text-gray-500">
                        ₹{Number(item.price || 0).toLocaleString("en-IN")} each
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2 rounded-full border bg-white p-1">
                      <button
                        onClick={() => decreaseQty(index)}
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 font-black"
                      >
                        -
                      </button>

                      <span className="min-w-8 text-center text-sm font-black">
                        {qty}
                      </span>

                      <button
                        onClick={() => increaseQty(index)}
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-black font-black text-white"
                      >
                        +
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <button className="rounded-full border px-4 py-2 text-xs font-black">
                        Save for Later
                      </button>

                      <button
                        onClick={() => removeItem(index)}
                        className="rounded-full bg-red-50 px-4 py-2 text-xs font-black text-red-600"
                      >
                        Remove
                      </button>
                    </div>
                  </div>

                  <div className="mt-4 rounded-2xl bg-green-50 p-3 text-xs font-bold text-green-700">
                    🚚 Delivery expected in 3-5 days • Easy returns available
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </section>

      <aside className="h-fit rounded-[2rem] border bg-white p-5 shadow-sm lg:sticky lg:top-24">
        <h2 className="text-xl font-black">Order Summary</h2>

        <div className="mt-5 space-y-3 text-sm">
          <SummaryRow label={`Subtotal (${cart.length} items)`} value={subtotal} />
          <SummaryRow label="Delivery" value={deliveryCharge} free={deliveryCharge === 0} />
          <SummaryRow label="Discount" value={discount} minus />
        </div>

        <div className="my-5 border-t" />

        <div className="flex items-center justify-between">
          <p className="text-lg font-black">Total</p>
          <p className="text-2xl font-black">
            ₹{total.toLocaleString("en-IN")}
          </p>
        </div>

        <Link
          href="/checkout"
          className="mt-5 block rounded-full bg-black py-4 text-center text-sm font-black text-white"
        >
          Proceed to Checkout
        </Link>

        <div className="mt-4 grid grid-cols-2 gap-2 text-center text-xs font-bold text-gray-600">
          <div className="rounded-2xl bg-[#f6f7fb] p-3">🔒 Secure</div>
          <div className="rounded-2xl bg-[#f6f7fb] p-3">↩ Returns</div>
          <div className="rounded-2xl bg-[#f6f7fb] p-3">🚚 Fast</div>
          <div className="rounded-2xl bg-[#f6f7fb] p-3">✅ Genuine</div>
        </div>
      </aside>
    </div>
  );
}

function SummaryRow({
  label,
  value,
  free,
  minus,
}: {
  label: string;
  value: number;
  free?: boolean;
  minus?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-gray-500">{label}</span>
      <span className="font-black">
        {free ? "FREE" : `${minus ? "- " : ""}₹${value.toLocaleString("en-IN")}`}
      </span>
    </div>
  );
}