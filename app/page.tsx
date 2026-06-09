export const dynamic = "force-dynamic";
import Header from "@/components/Header";
import ProductSearch from "@/components/ProductSearch";
import db from "@/lib/db";

type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  image: string;
  category?: string;
  featured?: number | boolean;
};

async function getProducts(): Promise<Product[]> {
  try {
    const [products]: any = await db.query(
      "SELECT * FROM products ORDER BY id DESC"
    );

    return products;
  } catch (error) {
    console.error("Products fetch error:", error);
    return [];
  }
}

export default async function Home() {
  const products = await getProducts();

  return (
    <main className="min-h-screen bg-gray-100">
      <Header />

      <section className="relative overflow-hidden bg-gradient-to-r from-indigo-700 via-blue-600 to-cyan-500 text-white py-24 text-center">
        <div className="absolute -top-20 -left-20 w-72 h-72 bg-white opacity-10 rounded-full"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-yellow-300 opacity-20 rounded-full blur-3xl"></div>

        <div className="relative z-10">
          <h1 className="text-6xl font-extrabold">Welcome to Klassic</h1>

          <p className="mt-5 text-2xl">
            Smart Shopping • Best Deals • Fast Delivery
          </p>

          <a
            href="#products"
            className="inline-block mt-8 bg-yellow-400 text-black px-8 py-4 rounded-xl font-bold hover:bg-yellow-300 shadow-lg"
          >
            Shop Now
          </a>
        </div>
      </section>

      <section id="products" className="max-w-7xl mx-auto px-6 py-10">
        <ProductSearch products={products} />
      </section>
    </main>
  );
}