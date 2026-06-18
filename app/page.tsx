
import Header from "@/components/Header";
import ProductSearch from "@/components/ProductSearch";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";

export const dynamic = "force-dynamic";

type ProductType = {
  _id: string;
  id: string;
  name: string;
  description?: string;
  price: number;
  sale_price?: number;
  salePrice?: number;
  stock: number;
  image: string;
  category?: string;
  featured?: boolean;
  variants?: any[];
  color_variants?: any[];
};

async function getProducts(): Promise<ProductType[]> {
  try {
    await connectDB();

    const rawProducts = await Product.find({ status: "Approved" })
      .sort({ createdAt: -1 })
      .lean();

    const products = JSON.parse(JSON.stringify(rawProducts));

    return products.map((product: any) => ({
      ...product,
      _id: String(product._id),
      id: String(product._id),

      variants: Array.isArray(product.variants)
        ? product.variants.map((v: any) => ({
            ...v,
            _id: v._id ? String(v._id) : undefined,
          }))
        : [],

      color_variants: Array.isArray(product.color_variants)
        ? product.color_variants.map((v: any) => ({
            ...v,
            _id: v._id ? String(v._id) : undefined,
          }))
        : [],
    }));
  } catch (error) {
    console.error("Products fetch error:", error);
    return [];
  }
}

const categories = [
  { name: "Fashion", href: "/category/fashion", icon: "🧥" },
  { name: "Electronics", href: "/category/electronics", icon: "🎧" },
  { name: "Home & Decor", href: "/category/home", icon: "🛋️" },
  { name: "Groceries", href: "/category/grocery", icon: "🥦" },
];

export default async function Home() {
  const products = await getProducts();
  const trendingProducts = products.slice(0, 6);

  return (
    <main className="min-h-screen bg-[#f7f5f1] text-[#111]">
      <Header />

      <section className="border-b border-white/10 bg-black px-4 py-2 text-center text-xs font-bold uppercase tracking-[0.25em] text-white">
        Free express delivery on orders above ₹5000
      </section>

      <section className="relative overflow-hidden bg-[#f7f5f1]">
        <div className="mx-auto max-w-7xl px-4 py-8 md:py-12">
          <div className="relative overflow-hidden rounded-[2.5rem] bg-black text-white shadow-[0_30px_80px_rgba(0,0,0,0.18)]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.22),transparent_32%),linear-gradient(120deg,rgba(0,0,0,0.95),rgba(0,0,0,0.55))]" />

            <div className="relative grid min-h-[360px] items-center gap-6 px-6 py-8 md:px-10 lg:grid-cols-[1fr_340px]">
              <div className="max-w-2xl">
                <p className="text-xs font-black uppercase tracking-[0.35em] text-white/60">
                  Klassic Curated Collection
                </p>

                <h1 className="mt-4 text-4xl font-black leading-[1] tracking-tight md:text-5xl">
                  Elevate your lifestyle.
                </h1>

                <p className="mt-6 max-w-xl text-base font-medium leading-7 text-white/70 md:text-lg">
                  Discover premium products, trusted sellers, exclusive rewards
                  and a smoother shopping experience built for modern India.
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                  <a
                    href="#products"
                    className="rounded-full bg-white px-8 py-3 text-sm font-black text-black transition hover:bg-[#e8ded0]"
                  >
                    Explore Now
                  </a>

                  <a
                    href="#rewards"
                    className="rounded-full border border-white/25 px-8 py-3 text-sm font-black text-white transition hover:bg-white/10"
                  >
                    Member Rewards
                  </a>
                </div>
              </div>

              <div className="hidden lg:block">
                <div className="rounded-[2rem] border border-white/10 bg-white/10 p-5 backdrop-blur-xl">
                  <div className="aspect-[4/5] rounded-[1.5rem] bg-[linear-gradient(145deg,#2b2b2b,#0a0a0a)] p-6 shadow-2xl">
                    <div className="flex h-full flex-col justify-between rounded-[1.2rem] border border-white/10 p-6">
                      <div>
                        <p className="text-xs font-black uppercase tracking-[0.25em] text-white/50">
                          Premium Drop
                        </p>
                        <h2 className="mt-3 text-3xl font-black">
                          New Luxury Deals
                        </h2>
                      </div>

                      <div className="space-y-3">
                        <div className="h-3 w-28 rounded-full bg-white/20" />
                        <div className="h-3 w-44 rounded-full bg-white/10" />
                        <div className="h-3 w-36 rounded-full bg-white/10" />
                      </div>

                      <div className="rounded-full bg-white px-5 py-3 text-center text-sm font-black text-black">
                        Shop Collection
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.25em] text-gray-400">
              Curated For You
            </p>
            <h2 className="mt-2 text-3xl font-black">Shop by Category</h2>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {categories.map((category) => (
            <a
              key={category.name}
              href={category.href}
              className="group rounded-[2rem] border border-black/5 bg-white p-5 shadow-[0_10px_40px_rgba(0,0,0,0.04)] transition hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(0,0,0,0.08)]"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#f3eee7] text-3xl">
                {category.icon}
              </div>

              <h3 className="mt-5 text-lg font-black">{category.name}</h3>

              <p className="mt-1 text-sm font-semibold text-gray-500">
                Explore premium picks
              </p>
            </a>
          ))}
        </div>
      </section>

      {trendingProducts.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-8">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.25em] text-gray-400">
                Trending Exclusives
              </p>
              <h2 className="mt-2 text-3xl font-black">Latest Arrivals</h2>
            </div>

            <a
              href="#products"
              className="hidden rounded-full border border-black/10 bg-white px-5 py-3 text-sm font-black md:inline-block"
            >
              View All
            </a>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {trendingProducts.map((product) => (
              <a
                key={product.id}
                href={`/product/${product.id}`}
                className="group rounded-[2rem] bg-white p-4 shadow-[0_10px_40px_rgba(0,0,0,0.04)] transition hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(0,0,0,0.08)]"
              >
                <div className="aspect-square overflow-hidden rounded-[1.5rem] bg-[#f4f1ec]">
                  <img
                    src={product.image || "/placeholder.png"}
                    alt={product.name}
                    className="h-full w-full object-contain p-6 transition duration-500 group-hover:scale-105"
                  />
                </div>

                <h3 className="mt-4 line-clamp-2 text-base font-black">
                  {product.name}
                </h3>

                <p className="mt-2 text-lg font-black">
                  ₹
                  {Number(
                    product.sale_price || product.salePrice || product.price || 0
                  ).toLocaleString("en-IN")}
                </p>
              </a>
            ))}
          </div>
        </section>
      )}

    

      <section id="products" className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-6">
          <p className="text-xs font-black uppercase tracking-[0.25em] text-gray-400">
            Complete Collection
          </p>

          <h2 className="mt-2 text-3xl font-black">Explore Products</h2>
        </div>

        <ProductSearch products={products} />
      </section>
    </main>
  );
}