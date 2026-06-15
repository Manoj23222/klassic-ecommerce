import Link from "next/link";

export const dynamic = "force-dynamic";

const cards = [
  {
    title: "AI Product Description",
    desc: "Product name, category, price से luxury description बनाओ.",
    href: "/admin/ai-center/description",
  },
  {
    title: "AI SEO Generator",
    desc: "SEO title, keywords, meta description generate करो.",
    href: "/admin/ai-center/seo",
  },
  {
    title: "AI Product Title",
    desc: "Amazon/Flipkart style product titles बनाओ.",
    href: "/admin/ai-center/title",
  },
  {
    title: "AI Sales Prediction",
    desc: "Orders + stock के हिसाब से sales forecast.",
    href: "/admin/ai-center/sales-prediction",
  },
  {
    title: "AI Trending Products",
    desc: "Most selling + low stock + hot products dashboard.",
    href: "/admin/ai-center/trending",
  },
];

export default function AICenterPage() {
  return (
    <main className="min-h-screen bg-[#f3f4f6] p-4 md:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 rounded-2xl bg-gradient-to-r from-slate-900 to-orange-600 p-6 text-white shadow">
          <p className="text-sm font-semibold text-orange-200">KLASSIC AI MARKETPLACE</p>
          <h1 className="mt-2 text-3xl font-black md:text-4xl">AI Center</h1>
          <p className="mt-2 max-w-2xl text-sm text-gray-100">
            Amazon + Flipkart level AI tools for product, SEO, sales and trending insights.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className="rounded-2xl border bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 text-2xl">
                🤖
              </div>
              <h2 className="text-xl font-black text-slate-900">{card.title}</h2>
              <p className="mt-2 text-sm text-gray-600">{card.desc}</p>
              <p className="mt-4 font-bold text-orange-600">Open →</p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}