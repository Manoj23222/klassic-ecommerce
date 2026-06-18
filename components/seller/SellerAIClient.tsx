"use client";

import Link from "next/link";
import SellerCentralLayout from "@/components/seller/SellerCentralLayout";

const tools = [
  {
    title: "AI Product Description",
    text: "Generate rich product descriptions.",
    href: "/seller/ai/description",
  },
  {
    title: "AI SEO Generator",
    text: "Create SEO title, keywords and meta description.",
    href: "/seller/ai/seo",
  },
  {
    title: "AI Product Title",
    text: "Generate marketplace friendly product titles.",
    href: "/seller/ai/title",
  },
  {
    title: "AI Sales Prediction",
    text: "Estimate product demand and selling chance.",
    href: "/seller/ai/sales-prediction",
  },
  {
    title: "AI Trending Products",
    text: "Find trending products for your category.",
    href: "/seller/ai/trending",
  },
];

export default function SellerAIClient() {
  return (
    <SellerCentralLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-black">AI Center</h1>
        <p className="text-gray-500">
          Generate better product content and seller insights.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {tools.map((tool) => (
          <Link
            key={tool.href}
            href={tool.href}
            className="rounded-3xl bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="text-4xl">🤖</div>
            <h2 className="mt-4 text-xl font-black">{tool.title}</h2>
            <p className="mt-2 text-sm font-semibold text-gray-500">
              {tool.text}
            </p>

            <div className="mt-5 inline-block rounded-xl bg-blue-600 px-5 py-3 text-sm font-black text-white">
              Open Tool
            </div>
          </Link>
        ))}
      </div>
    </SellerCentralLayout>
  );
}