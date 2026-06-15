import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";

export const dynamic = "force-dynamic";

export default async function TrendingProductsPage() {
  await connectDB();

  const products = await Product.find().sort({ stock: 1, createdAt: -1 }).limit(30).lean();

  return (
    <main className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-3xl font-black">AI Trending Products Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Low stock + latest products को AI trending score दिया गया है.
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p: any) => {
            const stock = Number(p.stock || 0);
            const score = stock <= 5 ? 95 : stock <= 15 ? 80 : 60;

            return (
              <div key={String(p._id)} className="rounded-2xl bg-white p-4 shadow">
                <img
                  src={p.image || "/placeholder.png"}
                  alt={p.name}
                  className="h-40 w-full rounded-xl object-cover bg-gray-100"
                />
                <h2 className="mt-4 line-clamp-2 text-lg font-black">{p.name}</h2>
                <p className="mt-1 text-sm text-gray-500">{p.category || "General"}</p>

                <div className="mt-4 flex items-center justify-between">
                  <span className="font-black text-orange-600">₹{p.price}</span>
                  <span className="rounded-full bg-orange-100 px-3 py-1 text-sm font-bold text-orange-700">
                    AI Score {score}
                  </span>
                </div>

                <p className="mt-3 text-sm font-semibold">
                  {stock <= 5 ? "🔥 Hot product - restock needed" : "📈 Good trending chance"}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}