"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import AddToCartButton from "@/components/AddToCartButton";

export default function BuyBox({
  productId,
  productName,
  price,
  mrp,
  image,
  sku,
  color,
  stock,
}: {
  productId: string;
  productName: string;
  price: number;
  mrp: number;
  image: string;
  sku: string;
  color: string;
  stock: number;
}) {
  const [secondsLeft, setSecondsLeft] = useState(28182);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 28182));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const time = useMemo(() => {
    const hrs = Math.floor(secondsLeft / 3600);
    const mins = Math.floor((secondsLeft % 3600) / 60);
    const secs = secondsLeft % 60;

    return {
      hrs: String(hrs).padStart(2, "0"),
      mins: String(mins).padStart(2, "0"),
      secs: String(secs).padStart(2, "0"),
    };
  }, [secondsLeft]);

  const discount =
    mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0;

  const emi = Math.ceil(price / 3);

  return (
    <section className="rounded-xl bg-white p-3 shadow-sm">
      <div className="rounded-xl bg-red-50 p-3">
        <p className="text-xs font-black uppercase tracking-wide text-red-600">
          Epic sale ends in
        </p>

        <div className="mt-1 flex items-center gap-2 text-lg font-black text-red-700">
          <span>{time.hrs} Hrs</span>
          <span>:</span>
          <span>{time.mins} Min</span>
          <span>:</span>
          <span>{time.secs} Sec</span>
        </div>
      </div>

      <div className="mt-4">
        <div className="flex flex-wrap items-end gap-2">
          {discount > 0 && (
            <span className="text-xl font-black text-green-600">
              ↓ {discount}%
            </span>
          )}

          <span className="text-sm text-gray-400 line-through">
            ₹{mrp.toLocaleString()}
          </span>
        </div>

        <p className="mt-1 text-3xl font-black text-gray-950">
          ₹{price.toLocaleString()}
        </p>

        <p className="mt-1 text-xs font-semibold text-gray-500">
          +₹19 Protect Promise Fee &gt;
        </p>

        <p
          className={`mt-2 text-sm font-black ${
            stock > 0 ? "text-green-600" : "text-red-600"
          }`}
        >
          {stock > 0 ? `In Stock: ${stock}` : "Out of Stock"}
        </p>
      </div>

      <div className="mt-4 grid gap-2">
        <button
          disabled={stock <= 0}
          className="rounded-xl bg-yellow-400 py-3 text-sm font-black text-black disabled:bg-gray-300 disabled:text-gray-500"
        >
          Buy with EMI From ₹{emi}/m
        </button>

        <Link
          href={stock > 0 ? `/checkout?productId=${productId}` : "#"}
          className={`rounded-xl border-2 py-3 text-center text-sm font-black ${
            stock > 0
              ? "border-blue-600 bg-white text-blue-700"
              : "border-gray-300 bg-gray-100 text-gray-500"
          }`}
        >
          Buy at ₹{price.toLocaleString()}
        </Link>

        <AddToCartButton
          product={{
            _id: productId,
            name: productName,
            price,
            image,
            sku,
            color,
            stock,
          }}
        />
      </div>
    </section>
  );
}