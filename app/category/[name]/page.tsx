import Header from "@/components/Header";
import ProductSearch from "@/components/ProductSearch";

type Product = {
  _id?: string;
  id?: string;
  name: string;
  description?: string;
  price: number;
  stock?: number;
  image?: string;
  category?: string;
};

async function getProducts(): Promise<Product[]> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/api/products`,
    {
      cache: "no-store",
    }
  );

  const data = await res.json();

  return Array.isArray(data) ? data : [];
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = await params;
  const categoryName = decodeURIComponent(name);

  const products = await getProducts();

  const filteredProducts = products.filter(
    (item) => (item.category || "General") === categoryName
  );

  return (
    <main className="min-h-screen bg-gray-100">
      <Header />

      <section className="max-w-7xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold mb-4">
          {categoryName} Products
        </h1>

        <p className="mb-6 font-semibold">
          Found {filteredProducts.length} products
        </p>

        <ProductSearch products={filteredProducts} />
      </section>
    </main>
  );
}