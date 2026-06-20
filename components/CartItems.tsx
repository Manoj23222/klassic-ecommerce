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
    window.dispatchEvent(new Event("cart-updated"));
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
      <div className="rounded-2xl bg-white p-6 text-center sm:p-10">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#f6f7fb] text-3xl sm:h-20 sm:w-20">
          🛒
        </div>

        <h2 className="mt-4 text-xl font-black sm:text-2xl">
          Your cart is empty
        </h2>

        <p className="mt-1 text-xs text-gray-500 sm:text-sm">
          Add products to your cart and continue shopping.
        </p>

        <Link
          href="/"
          className="mt-5 inline-block rounded-full bg-black px-6 py-2.5 text-xs font-black text-white sm:px-8 sm:py-3 sm:text-sm"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-3 lg:grid-cols-[1fr_340px]">
      <section className="space-y-3">
        <div className="rounded-2xl border border-yellow-200 bg-yellow-50 p-3 sm:p-4">
          <div className="mb-2 flex justify-between gap-3 text-xs font-black sm:text-sm">
            <span>🎁 Free Gift</span>
            <span>
              ₹{subtotal.toLocaleString("en-IN")} / ₹
              {freeGiftTarget.toLocaleString("en-IN")}
            </span>
          </div>

          <div className="h-2 w-full overflow-hidden rounded-full bg-white sm:h-3">
            <div
              className="h-full rounded-full bg-green-600 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>

          <p className="mt-2 text-xs font-bold text-gray-700">
            {remaining > 0
              ? `Add ₹${remaining.toLocaleString("en-IN")} more for free gift.`
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
              className="rounded-2xl border bg-white p-3 shadow-sm sm:p-4"
            >
              <div className="flex gap-3">
                <Link
                  href={itemId ? `/product/${itemId}` : "#"}
                  className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl bg-[#f6f7fb] p-2 sm:h-28 sm:w-28"
                >
                  <img
                    src={item.image || "/placeholder.png"}
                    alt={item.name}
                    className="h-full w-full object-contain"
                  />
                </Link>

                <div className="min-w-0 flex-1">
                  <Link
                    href={itemId ? `/product/${itemId}` : "#"}
                    className="line-clamp-2 text-xs font-black leading-4 hover:text-orange-600 sm:text-base sm:leading-5"
                  >
                    {item.name}
                  </Link>

                  <div className="mt-1 flex flex-wrap gap-1 text-[10px] font-bold text-gray-500 sm:mt-2 sm:text-xs">
                    {item.color && (
                      <span className="rounded-full bg-gray-100 px-2 py-0.5">
                        {item.color}
                      </span>
                    )}

                    {item.size && (
                      <span className="rounded-full bg-gray-100 px-2 py-0.5">
                        {item.size}
                      </span>
                    )}

                    {item.sku && (
                      <span className="rounded-full bg-gray-100 px-2 py-0.5">
                        SKU
                      </span>
                    )}
                  </div>

                  <div className="mt-2 flex items-center justify-between gap-2">
                    <div>
                      <p className="text-sm font-black sm:text-lg">
                        ₹{itemTotal.toLocaleString("en-IN")}
                      </p>
                      <p className="text-[10px] text-gray-500 sm:text-xs">
                        ₹{Number(item.price || 0).toLocaleString("en-IN")} each
                      </p>
                    </div>

                    <div className="flex items-center gap-1 rounded-full border bg-white p-0.5">
                      <button
                        onClick={() => decreaseQty(index)}
                        className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 text-sm font-black"
                      >
                        -
                      </button>

                      <span className="min-w-6 text-center text-xs font-black">
                        {qty}
                      </span>

                      <button
                        onClick={() => increaseQty(index)}
                        className="flex h-7 w-7 items-center justify-center rounded-full bg-black text-sm font-black text-white"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="mt-2 flex gap-2">
                    <button className="rounded-full border px-3 py-1.5 text-[10px] font-black sm:text-xs">
                      Save
                    </button>

                    <button
                      onClick={() => removeItem(index)}
                      className="rounded-full bg-red-50 px-3 py-1.5 text-[10px] font-black text-red-600 sm:text-xs"
                    >
                      Remove
                    </button>
                  </div>

                  <div className="mt-2 rounded-xl bg-green-50 p-2 text-[10px] font-bold text-green-700 sm:text-xs">
                    🚚 Delivery 3-5 days • Easy returns
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </section>

      <aside className="h-fit rounded-2xl border bg-white p-4 shadow-sm lg:sticky lg:top-24">
        <h2 className="text-lg font-black sm:text-xl">Order Summary</h2>

        <div className="mt-4 space-y-2 text-xs sm:text-sm">
          <SummaryRow label={`Subtotal (${cart.length} items)`} value={subtotal} />
          <SummaryRow label="Delivery" value={deliveryCharge} free={deliveryCharge === 0} />
          <SummaryRow label="Discount" value={discount} minus />
        </div>

        <div className="my-4 border-t" />

        <div className="flex items-center justify-between">
          <p className="text-base font-black sm:text-lg">Total</p>
          <p className="text-xl font-black sm:text-2xl">
            ₹{total.toLocaleString("en-IN")}
          </p>
        </div>

        <Link
          href="/checkout"
          className="mt-4 block rounded-xl bg-black py-3 text-center text-xs font-black text-white sm:rounded-full sm:py-4 sm:text-sm"
        >
          Proceed to Checkout
        </Link>

        <div className="mt-3 grid grid-cols-4 gap-1 text-center text-[10px] font-bold text-gray-600 sm:grid-cols-2 sm:gap-2 sm:text-xs">
          <div className="rounded-xl bg-[#f6f7fb] p-2">🔒</div>
          <div className="rounded-xl bg-[#f6f7fb] p-2">↩</div>
          <div className="rounded-xl bg-[#f6f7fb] p-2">🚚</div>
          <div className="rounded-xl bg-[#f6f7fb] p-2">✅</div>
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
        {free
          ? "FREE"
          : `${minus ? "- " : ""}₹${value.toLocaleString("en-IN")}`}
      </span>
    </div>
  );
}