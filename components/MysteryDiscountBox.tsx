"use client";

import { useState } from "react";
import Link from "next/link";

const rewards = [
  { label: "₹50 OFF", code: "WELCOME50" },
  { label: "10% OFF", code: "SAVE10" },
  { label: "₹100 OFF", code: "FLAT100" },
];

export default function MysteryDiscountBox() {
  const [reward, setReward] = useState<any>(null);

  const revealDiscount = () => {
    const random = rewards[Math.floor(Math.random() * rewards.length)];
    setReward(random);
  };

  return (
    <div className="bg-gradient-to-r from-purple-700 to-pink-600 text-white rounded-2xl p-4 text-center shadow-xl">
      <h2 className="text-xl font-bold">🎁 Mystery Discount Box</h2>
      <p className="mt-1 text-sm">Tap to reveal your surprise discount</p>

      {!reward ? (
        <button
          onClick={revealDiscount}
          className="mt-3 bg-yellow-400 text-black px-6 py-2 rounded-xl font-bold"
        >
          Reveal Discount
        </button>
      ) : (
        <div className="mt-3 bg-white text-black rounded-xl p-3 inline-block">
          <p className="text-lg font-bold">{reward.label}</p>
          <p className="text-sm mt-1">
            Coupon Code: <b>{reward.code}</b>
          </p>

          <Link
            href={`/?coupon=${reward.code}#products`}
            className="inline-block mt-2 bg-black text-white px-4 py-2 rounded-lg text-sm"
          >
            Shop Now
          </Link>
        </div>
      )}
    </div>
  );
}