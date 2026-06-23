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
  brand?: string;
  featured?: boolean;
  flashSale?: boolean;
  sales_count?: number;
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
  { name: "Groceries", href: "/grocery", icon: "🥦" },
  { name: "Beauty", href: "/category/beauty", icon: "✨" },
  { name: "Lifestyle", href: "/category/lifestyle", icon: "👜" },
];

const brandCards = ["Klassic", "Urban Luxe", "Prime Craft", "Elite Home"];

function getPrice(product: ProductType) {
  return Number(product.sale_price || product.salePrice || product.price || 0);
}

function getMrp(product: ProductType) {
  const price = getPrice(product);
  const base = Number(product.price || 0);
  if (base > price) return base;
  return Math.round(price * 1.18);
}

export default async function Home() {
  const products = await getProducts();

  const latestProducts = products.slice(0, 6);
  const flashProducts = products.filter((p) => p.flashSale).slice(0, 6);
  const bestSellers = [...products]
    .sort((a, b) => Number(b.sales_count || 0) - Number(a.sales_count || 0))
    .slice(0, 6);

  return (
    <main className="min-h-screen bg-[#f1f3f6] pb-20 text-[#111]">
      <Header />

      <section className="bg-black px-4 py-2 text-center text-[10px] font-black uppercase tracking-[0.25em] text-white sm:text-xs">
        Luxury deals • Fast delivery • Trusted sellers • Secure checkout
      </section>

      <section className="mx-auto max-w-7xl px-3 py-3 md:px-4 md:py-6">
        <div className="relative overflow-hidden rounded-[2rem] bg-black text-white shadow-xl">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.22),transparent_32%),linear-gradient(120deg,rgba(0,0,0,0.98),rgba(0,0,0,0.55))]" />

          <div className="relative grid min-h-[190px] items-center gap-4 px-4 py-5 md:min-h-[330px] md:px-10 md:py-10 lg:grid-cols-[1fr_340px]">
            <div className="max-w-2xl">
              <p className="text-[10px] font-black uppercase tracking-[0.35em] text-white/60 sm:text-xs">
                Klassic Luxury Marketplace
              </p>

              <h1 className="mt-3 text-2xl font-black leading-tight tracking-tight md:text-5xl">
                Premium shopping, redesigned.
              </h1>

              <p className="mt-4 max-w-xl text-sm font-medium leading-6 text-white/70 md:text-base">
                Shop curated products, trusted sellers, luxury collections,
                fast delivery and secure payments in one Klassic experience.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href="#products"
                  className="rounded-full bg-white px-6 py-2.5 text-xs font-black text-black"
                >
                  Explore Products
                </a>

                <a
                  href="#flash-sale"
                  className="rounded-full border border-white/25 px-6 py-2.5 text-xs font-black text-white"
                >
                  Flash Sale
                </a>
              </div>
            </div>

            <div className="hidden lg:block">
              <div className="rounded-[2rem] border border-white/10 bg-white/10 p-5 backdrop-blur-xl">
                <div className="aspect-[4/5] rounded-[1.5rem] bg-[linear-gradient(145deg,#2b2b2b,#0a0a0a)] p-6 shadow-2xl">
                  <div className="flex h-full flex-col justify-between rounded-[1.2rem] border border-white/10 p-6">
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.25em] text-white/50">
                        Today Special
                      </p>
                      <h2 className="mt-3 text-2xl font-black">
                        Up to 60% Off
                      </h2>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <MiniDarkStat value="12" label="Hours" />
                      <MiniDarkStat value="45" label="Minutes" />
                      <MiniDarkStat value="30" label="Seconds" />
                    </div>

                    <div className="rounded-full bg-white px-5 py-3 text-center text-xs font-black text-black">
                      Shop Now
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <TrustBadges />

      <section className="mx-auto max-w-7xl px-4 py-5">
        <SectionTitle label="Curated For You" title="Shop by Category" />

        <div className="grid grid-cols-3 gap-2 md:grid-cols-3 lg:grid-cols-6">
          {categories.map((category) => (
            <a
              key={category.name}
              href={category.href}
              className="group rounded-2xl border border-black/5 bg-white p-3 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f3eee7] text-2xl">
                {category.icon}
              </div>

              <h3 className="mt-3 text-sm font-black">{category.name}</h3>

              <p className="mt-1 text-[10px] font-semibold text-gray-500">
                Premium picks
              </p>
            </a>
          ))}
        </div>
      </section>

      <section id="flash-sale" className="mx-auto max-w-7xl px-4 py-5">
        <div className="rounded-[2rem] bg-black p-4 text-white shadow-xl sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.25em] text-white/50 sm:text-xs">
                Limited Time
              </p>
              <h2 className="mt-1 text-2xl font-black sm:text-3xl">
                Flash Sale
              </h2>
            </div>

            <div className="rounded-full bg-white px-4 py-2 text-xs font-black text-black">
              Ending Soon
            </div>
          </div>

          <ProductRail
            products={(flashProducts.length ? flashProducts : latestProducts).slice(0, 6)}
            dark
          />
        </div>
      </section>

      {latestProducts.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-5">
          <SectionTitle label="Trending Exclusives" title="Latest Arrivals" />
          <ProductRail products={latestProducts} />
        </section>
      )}

      {bestSellers.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-5">
          <SectionTitle label="Popular Now" title="Best Sellers" />
          <ProductRail products={bestSellers} />
        </section>
      )}

      <section className="mx-auto max-w-7xl px-4 py-5">
        <SectionTitle label="Premium Brands" title="Top Brands Showcase" />

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {brandCards.map((brand) => (
            <div key={brand} className="rounded-2xl bg-white p-4 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black text-base font-black text-white">
                {brand.slice(0, 1)}
              </div>
              <h3 className="mt-3 text-base font-black">{brand}</h3>
              <p className="mt-1 text-xs text-gray-500">
                Premium quality collection
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-5">
        <div className="rounded-[2rem] bg-white p-5 shadow-sm md:p-6">
          <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.25em] text-gray-400">
                Seller Spotlight
              </p>
              <h2 className="mt-2 text-2xl font-black">
                Trusted sellers, premium service.
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-gray-500">
                Klassic supports seller trust score, payouts, returns, Q&A,
                reviews and product moderation for safer shopping.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center">
              <MiniStat value="98%" label="Positive" />
              <MiniStat value="24h" label="Support" />
              <MiniStat value="4.8★" label="Rating" />
            </div>
          </div>
        </div>
      </section>

      <section id="products" className="mx-auto max-w-7xl px-4 py-5">
        <SectionTitle label="Complete Collection" title="Explore Products" />

        {products.length > 0 ? (
          <ProductSearch products={products} />
        ) : (
          <div className="rounded-[2rem] bg-white p-10 text-center shadow-sm">
            <h2 className="text-2xl font-black">No products found</h2>
            <p className="mt-2 text-sm text-gray-500">
              Approved products will appear here.
            </p>
          </div>
        )}
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-12 pt-5">
        <div className="rounded-[2rem] bg-black p-6 text-center text-white">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-white/50">
            Klassic Newsletter
          </p>
          <h2 className="mt-3 text-2xl font-black">
            Get luxury deals first.
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-white/60">
            Stay updated with new arrivals, seller drops, flash sales and
            Klassic rewards.
          </p>

          <div className="mx-auto mt-5 flex max-w-md gap-2 rounded-full bg-white p-2">
            <input
              placeholder="Enter email"
              className="flex-1 rounded-full px-4 text-sm text-black outline-none"
            />
            <button className="rounded-full bg-black px-5 py-3 text-sm font-black text-white">
              Join
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}

function ProductRail({
  products,
  dark = false,
}: {
  products: ProductType[];
  dark?: boolean;
}) {
  return (
    <div className="mt-4 flex gap-3 overflow-x-auto pb-3 sm:grid sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 sm:overflow-visible">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} dark={dark} />
      ))}
    </div>
  );
}

function ProductCard({
  product,
  dark = false,
}: {
  product: ProductType;
  dark?: boolean;
}) {
  const price = getPrice(product);
  const mrp = getMrp(product);

  return (
    <a
      href={`/product/${product.id}`}
      className={`group flex min-w-[220px] min-h-[250px] flex-col rounded-[1.1rem] p-2 transition hover:-translate-y-1 sm:min-w-0 sm:min-h-[300px] ${
        dark
          ? "bg-white/10 text-white hover:bg-white/15"
          : "bg-white shadow-sm hover:shadow-md"
      }`}
    >
      <div
        className={`flex h-[110px] items-center justify-center overflow-hidden rounded-xl p-2 sm:h-[185px] ${
          dark ? "bg-white/10" : "bg-[#f4f1ec]"
        }`}
      >
        <img
          src={product.image || "/placeholder.png"}
          alt={product.name}
          className="max-h-full max-w-full object-contain transition duration-300 group-hover:scale-105"
        />
      </div>

      <p
        className={`mt-2 text-[8px] font-black uppercase tracking-widest sm:text-[10px] ${
          dark ? "text-white/50" : "text-gray-400"
        }`}
      >
        {product.brand || product.category || "Klassic"}
      </p>

      <h3 className="mt-1 line-clamp-2 min-h-[30px] text-[10px] font-black leading-4 sm:text-sm">
        {product.name}
      </h3>

      <div className="mt-auto flex items-center justify-between gap-2 pt-2">
        <p className="text-xs font-black sm:text-base">
          ₹{price.toLocaleString("en-IN")}
        </p>

        <span
          className={`rounded-full px-2 py-0.5 text-[8px] font-black sm:text-[10px] ${
            product.stock > 0
              ? dark
                ? "bg-green-400 text-black"
                : "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {product.stock > 0 ? "In Stock" : "Out"}
        </span>
      </div>

      {mrp > price && (
        <p className={`mt-0.5 text-[9px] line-through ${dark ? "text-white/40" : "text-gray-400"}`}>
          ₹{mrp.toLocaleString("en-IN")}
        </p>
      )}
    </a>
  );
}

function SectionTitle({ label, title }: { label: string; title: string }) {
  return (
    <div className="mb-4">
      <p className="text-[10px] font-black uppercase tracking-[0.25em] text-gray-400 sm:text-xs">
        {label}
      </p>
      <h2 className="mt-1 text-2xl font-black sm:text-3xl">{title}</h2>
    </div>
  );
}

function TrustBadges() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-3">
      <div className="grid grid-cols-2 gap-2 rounded-[2rem] bg-white p-3 shadow-sm lg:grid-cols-4">
        <MiniBadge icon="🔒" title="Secure Payments" text="Safe checkout" />
        <MiniBadge icon="🚚" title="Fast Delivery" text="Quick shipping" />
        <MiniBadge icon="↩" title="Easy Returns" text="Simple return flow" />
        <MiniBadge icon="✅" title="Trusted Sellers" text="Verified quality" />
      </div>
    </section>
  );
}

function MiniBadge({
  icon,
  title,
  text,
}: {
  icon: string;
  title: string;
  text: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-[#f7f5f1] p-3">
      <div className="text-xl">{icon}</div>
      <div>
        <p className="text-sm font-black">{title}</p>
        <p className="text-[10px] text-gray-500">{text}</p>
      </div>
    </div>
  );
}

function MiniStat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-2xl bg-[#f7f5f1] p-4">
      <p className="text-xl font-black">{value}</p>
      <p className="text-xs font-bold text-gray-500">{label}</p>
    </div>
  );
}

function MiniDarkStat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-2xl bg-white/10 p-3 text-center">
      <p className="text-lg font-black">{value}</p>
      <p className="text-[10px] text-white/50">{label}</p>
    </div>
  );
}