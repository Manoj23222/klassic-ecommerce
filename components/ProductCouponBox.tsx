"use client";

import { useState } from "react";
import Link from "next/link";

export default function ProductCouponBox({
  productId,
  price,
}: {
  productId: number;
  price: number;
}) {
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);

  const applyCoupon = (code: string) => {
    setCoupon(code);

    if (code === "WELCOME50") {
      setDiscount(50);
    } else if (code === "SAVE10") {
      setDiscount(Math.round(price * 0.1));
    }
  };

  const finalPrice = price - discount;

  return (
    <div className="mt-6 border rounded-xl overflow-hidden">
      <div className="bg-blue-700 text-white px-4 py-3 font-bold">
        Apply offers for maximum savings
      </div>

      <div className="p-4 space-y-3">
        <div className="border rounded-lg p-3 flex justify-between items-center">
          <div>
            <p className="font-bold">WELCOME50</p>
            <p className="text-sm text-gray-600">Get ₹50 instant discount</p>
          </div>
          <button onClick={() => applyCoupon("WELCOME50")} className="text-blue-600 font-bold">
            Apply
          </button>
        </div>

        <div className="border rounded-lg p-3 flex justify-between items-center">
          <div>
            <p className="font-bold">SAVE10</p>
            <p className="text-sm text-gray-600">Get 10% off on this order</p>
          </div>
          <button onClick={() => applyCoupon("SAVE10")} className="text-blue-600 font-bold">
            Apply
          </button>
        </div>

        {discount > 0 && (
          <div className="bg-green-50 border border-green-300 p-3 rounded-lg">
            <p className="font-bold text-green-700">Coupon Applied: {coupon}</p>
            <p>Discount: ₹{discount}</p>
            <p className="font-bold">Final Price: ₹{finalPrice}</p>

            <Link
              href={`/checkout?productId=${productId}&coupon=${coupon}`}
              className="mt-3 inline-block bg-green-600 text-white px-4 py-2 rounded"
            >
              Buy Now with Discount
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}