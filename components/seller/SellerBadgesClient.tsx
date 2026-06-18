"use client";

import { useEffect, useState } from "react";
import SellerCentralLayout from "@/components/seller/SellerCentralLayout";

const defaultBadges = [
  {
    badge_name: "Rising Star",
    badge_icon: "⭐",
    description: "Complete 10 orders to unlock.",
    progress: 40,
  },
  {
    badge_name: "Fast Shipping",
    badge_icon: "🚀",
    description: "Ship 90% orders on time.",
    progress: 65,
  },
  {
    badge_name: "Premium Store",
    badge_icon: "💎",
    description: "Maintain high rating and low returns.",
    progress: 75,
  },
  {
    badge_name: "Elite Seller",
    badge_icon: "👑",
    description: "Reach top seller performance level.",
    progress: 25,
  },
];

export default function SellerBadgesClient() {
  const [badges, setBadges] = useState<any[]>([]);

  useEffect(() => {
    const seller = JSON.parse(localStorage.getItem("seller") || "{}");
    const sellerId = seller?._id || seller?.id;

    if (!sellerId) return;

    fetch(`/api/seller/badges?seller_id=${sellerId}`)
      .then((res) => res.json())
      .then((data) => {
        setBadges(data.badges?.length ? data.badges : defaultBadges);
      });
  }, []);

  return (
    <SellerCentralLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-black">Seller Achievement Badges</h1>
        <p className="text-gray-500">
          Track store growth, trust score and reward achievements.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {badges.map((badge, index) => (
          <div key={index} className="rounded-3xl bg-white p-5 shadow-sm">
            <div className="text-5xl">{badge.badge_icon || "🏆"}</div>
            <h2 className="mt-4 text-xl font-black">{badge.badge_name}</h2>
            <p className="mt-2 text-sm text-gray-500">{badge.description}</p>

            <div className="mt-5 h-3 overflow-hidden rounded-full bg-gray-100">
              <div
                className="h-full rounded-full bg-blue-600"
                style={{ width: `${badge.progress || 100}%` }}
              />
            </div>

            <p className="mt-2 text-xs font-black text-blue-700">
              {badge.progress || 100}% Complete
            </p>
          </div>
        ))}
      </div>
    </SellerCentralLayout>
  );
}