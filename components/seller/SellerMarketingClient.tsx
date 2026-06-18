"use client";

import Link from "next/link";
import SellerCentralLayout from "@/components/seller/SellerCentralLayout";

const tools = [
  {
    title: "Banner Manager",
    description: "Create homepage and store banners",
    href: "/seller/marketing/banners",
    icon: "🖼️",
  },
  {
    title: "Coupon Manager",
    description: "Create discount coupons",
    href: "/seller/marketing/coupons",
    icon: "🎟️",
  },
  {
    title: "Campaign Manager",
    description: "Run flash sales and promotions",
    href: "/seller/marketing/campaigns",
    icon: "🚀",
  },
  {
    title: "Store SEO",
    description: "Optimize store ranking",
    href: "/seller/marketing/seo",
    icon: "📈",
  },
  {
    title: "Push Notifications",
    description: "Send customer notifications",
    href: "/seller/marketing/notifications",
    icon: "🔔",
  },
  {
    title: "Social Media Tools",
    description: "Share products on social media",
    href: "/seller/marketing/social",
    icon: "📱",
  },
];

export default function SellerMarketingClient() {
  return (
    <SellerCentralLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-black">
          Marketing Center
        </h1>

        <p className="text-gray-500">
          Grow your sales with campaigns and promotions.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {tools.map((tool) => (
          <Link
            key={tool.href}
            href={tool.href}
            className="rounded-3xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="text-5xl">
              {tool.icon}
            </div>

            <h2 className="mt-4 text-xl font-black">
              {tool.title}
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              {tool.description}
            </p>

            <div className="mt-5 inline-flex rounded-xl bg-blue-600 px-5 py-3 text-sm font-black text-white">
              Open
            </div>
          </Link>
        ))}
      </div>
    </SellerCentralLayout>
  );
}