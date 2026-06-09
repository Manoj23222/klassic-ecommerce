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
    <div className="max-w-7xl mx-auto px-6 mt-8">
      <div className="bg-gradient-to-r from-purple-700 to-pink-600 text-white rounded-2xl p-6 text-center shadow-xl">
        <h2 className="text-3xl font-bold">🎁 Mystery Discount Box</h2>
        <p className="mt-2">Tap to reveal your surprise discount</p>

        {!reward ? (
          <button
            onClick={revealDiscount}
            className="mt-5 bg-yellow-400 text-black px-8 py-3 rounded-xl font-bold"
          >
            Reveal Discount
          </button>
        ) : (
          <div className="mt-5 bg-white text-black rounded-xl p-5 inline-block">
            <p className="text-xl font-bold">{reward.label}</p>
            <p className="mt-2">
              Coupon Code: <b>{reward.code}</b>
            </p>

            <Link
              href={`/?coupon=${reward.code}#products`}
              className="inline-block mt-4 bg-black text-white px-5 py-2 rounded-lg"
            >
              Shop Now
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}