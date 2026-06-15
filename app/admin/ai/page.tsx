import Link from "next/link";

const tools = [
  {
    title: "AI Product Description",
    href: "/admin/ai/product-description",
    desc: "Product name से professional description generate करें.",
  },
  {
    title: "AI SEO Generator",
    href: "/admin/ai/seo",
    desc: "SEO title, keywords और meta description बनाएं.",
  },
  {
    title: "AI Product Title",
    href: "/admin/ai/title",
    desc: "Amazon/Flipkart style product titles बनाएं.",
  },
  {
    title: "AI Sales Prediction",
    href: "/admin/ai/sales",
    desc: "Sales, stock और demand prediction देखें.",
  },
  {
    title: "AI Trending Products",
    href: "/admin/ai/trending",
    desc: "Marketplace trending product ideas देखें.",
  },
];

export default function AdminAICenterPage() {
  return (
    <main>
      <h1 className="text-2xl sm:text-3xl font-bold mb-2">
        AI Center
      </h1>

      <p className="text-gray-500 mb-6">
        Klassic marketplace के smart AI tools.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {tools.map((tool) => (
          <Link
            key={tool.href}
            href={tool.href}
            className="bg-white border rounded-2xl p-5 shadow-sm hover:shadow-lg transition"
          >
            <h2 className="text-xl font-bold">{tool.title}</h2>
            <p className="text-sm text-gray-500 mt-2">{tool.desc}</p>

            <span className="inline-block mt-5 bg-black text-white px-4 py-2 rounded-xl text-sm font-bold">
              Open Tool
            </span>
          </Link>
        ))}
      </div>
    </main>
  );
}