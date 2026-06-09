import Link from "next/link";
import Header from "@/components/Header";

type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  image: string;
  category?: string;
};

async function getProducts(): Promise<Product[]> {
  const res = await fetch("http://localhost:3000/api/products", {
    cache: "no-store",
  });

  const data = await res.json();
  return Array.isArray(data) ? data : [];
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const products = await getProducts();

  const filteredProducts = products.filter((item) =>
    item.name.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-gray-100">
      <Header />

      <section className="max-w-7xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold mb-6">
          Search Results for: {q}
        </h1>

        <p className="mb-6 font-semibold">
          Found {filteredProducts.length} products
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((item) => (
            <Link
              key={item.id}
              href={`/product/${item.id}`}
              className="bg-white rounded-2xl shadow hover:shadow-xl transition overflow-hidden block"
            >
              <img
                src={item.image}
                alt={item.name}
                className="h-56 w-full object-contain p-5 bg-white"
              />

              <div className="p-5">
                <span className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full">
                  {item.category || "General"}
                </span>

                <h3 className="mt-3 font-bold text-lg">{item.name}</h3>

                <p className="text-sm text-gray-500 line-clamp-2">
                  {item.description}
                </p>

                <p className="text-blue-700 font-bold text-xl mt-2">
                  ₹{Number(item.price).toFixed(2)}
                </p>

                <p className="text-green-600 font-semibold mt-1">
                  Stock: {item.stock}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}