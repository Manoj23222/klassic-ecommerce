"use client";

import { useState } from "react";
import Link from "next/link";

const rewards = [
  { label: "₹50 OFF", code: "WELCOME50" },
  { label: "10% OFF", code: "SAVE10" },
  { label: "₹100 OFF", code: "FLAT100" },
  { label: "Free Gift", code: "GIFT" },
];

export default function DailySpinWheel() {
  const [reward, setReward] = useState<any>(null);
  const [spinning, setSpinning] = useState(false);

  const spin = () => {
    setSpinning(true);

    setTimeout(() => {
      const random = rewards[Math.floor(Math.random() * rewards.length)];
      setReward(random);
      setSpinning(false);
    }, 1200);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 mt-8">
      <div className="bg-white rounded-2xl shadow-xl p-6 text-center border">
        <h2 className="text-3xl font-bold">🎡 Daily Spin Wheel</h2>
        <p className="text-gray-600 mt-2">
          Spin once and unlock today&apos;s reward
        </p>

        <div
          className={`mx-auto mt-6 w-44 h-44 rounded-full border-8 border-yellow-400 flex items-center justify-center text-5xl bg-gradient-to-r from-pink-500 to-purple-600 ${
            spinning ? "animate-spin" : ""
          }`}
        >
          🎁
        </div>

        {!reward ? (
          <button
            onClick={spin}
            disabled={spinning}
            className="mt-6 bg-black text-white px-8 py-3 rounded-xl font-bold"
          >
            {spinning ? "Spinning..." : "Spin Now"}
          </button>
        ) : (
          <div className="mt-6 bg-green-50 border border-green-200 rounded-xl p-5 inline-block">
            <p className="text-xl font-bold text-green-700">
              You won: {reward.label}
            </p>

            <p className="mt-2">
              Coupon Code: <b>{reward.code}</b>
            </p>

            <Link
              href={`/?coupon=${reward.code}#products`}
              className="inline-block mt-4 bg-green-600 text-white px-5 py-2 rounded-lg"
            >
              Use Reward
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}