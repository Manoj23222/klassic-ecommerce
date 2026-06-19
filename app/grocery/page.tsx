import GroceryProductSection from "@/components/GroceryProductSection";
import Header from "@/components/Header";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";

export const dynamic = "force-dynamic";

type ProductType = {
  _id?: string;
  id?: string;
  name: string;
  description?: string;
  price: number;
  sale_price?: number;
  salePrice?: number;
  stock?: number;
  image?: string;
  category?: string;
  brand?: string;
};

const groceryCategories = [
  "Grocery",
  "Fruits & Vegetables",
  "Atta Rice & Dal",
  "Masala & Spices",
  "Papad & Pickles",
  "Oil & Ghee",
  "Snacks & Namkeen",
  "Biscuits & Cookies",
  "Tea & Coffee",
  "Milk & Dairy",
  "Bread & Bakery",
  "Cleaning & Household",
  "Personal Care",
  "Baby Care",
  "Pet Food",
  "Frozen Food",
];

const categoryTiles = [
  { name: "Fruits & Vegetables", icon: "🥦", href: "#products" },
  { name: "Atta Rice & Dal", icon: "🌾", href: "#products" },
  { name: "Masala & Spices", icon: "🌶️", href: "#products" },
  { name: "Oil & Ghee", icon: "🫙", href: "#products" },
  { name: "Snacks & Namkeen", icon: "🍿", href: "#products" },
  { name: "Milk & Dairy", icon: "🥛", href: "#products" },
  { name: "Cleaning", icon: "🧼", href: "#products" },
  { name: "Baby Care", icon: "🍼", href: "#products" },
];

async function getGroceryProducts(): Promise<ProductType[]> {
  try {
    await connectDB();

    const products = await Product.find({
      status: "Approved",
      $or: [
        { category: { $in: groceryCategories } },
        { category: { $regex: "grocery", $options: "i" } },
      ],
    })
      .sort({ createdAt: -1 })
      .lean();

    return products.map((product: any) => ({
      ...product,
      id: String(product._id),
      _id: String(product._id),
    }));
  } catch (error) {
    console.error("Grocery products fetch error:", error);
    return [];
  }
}

function getPrice(product: ProductType) {
  return Number(product.sale_price || product.salePrice || product.price || 0);
}

export default async function GroceryPage() {
  const products = await getGroceryProducts();

  const latest = products.slice(0, 8);
  const essentials = products
    .filter((p) =>
      ["Atta Rice & Dal", "Masala & Spices", "Oil & Ghee", "Grocery"].includes(
        p.category || ""
      )
    )
    .slice(0, 8);

  return (
    <main className="min-h-screen bg-[#f5f7ef]">
      <Header />

      <section className="bg-[#07150b] text-white">
        <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 py-8 md:py-12 lg:grid-cols-[1fr_360px]">
          <div>
            <p className="inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.25em] text-emerald-200">
              🛒 Klassic Grocery
            </p>

            <h1 className="mt-5 max-w-3xl text-4xl font-black leading-[1.05] tracking-tight md:text-6xl">
              Fresh grocery, premium savings.
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/70 md:text-base">
              Daily essentials, fresh picks, masala, dairy, snacks and household
              needs with fast delivery and trusted quality.
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              <Badge text="🚚 Fast Delivery" />
              <Badge text="💵 COD Available" />
              <Badge text="✅ Fresh Assured" />
              <Badge text="🎁 Daily Deals" />
            </div>

            <div className="mt-7 flex flex-wrap gap-3">
              <a
                href="#products"
                className="rounded-full bg-white px-7 py-3 text-sm font-black text-black"
              >
                Shop Grocery
              </a>

              <a
                href="#categories"
                className="rounded-full border border-white/20 px-7 py-3 text-sm font-black text-white"
              >
                Browse Categories
              </a>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/10 p-5 shadow-2xl backdrop-blur">
            <div className="rounded-[1.5rem] bg-[linear-gradient(145deg,#ecfccb,#ffffff)] p-6 text-black">
              <div className="text-center text-7xl">🥦🍎🥛</div>

              <h2 className="mt-4 text-center text-2xl font-black">
                Fresh Picks Today
              </h2>

              <p className="mt-2 text-center text-sm font-semibold text-gray-600">
                Save more on daily grocery essentials
              </p>

              <div className="mt-5 grid grid-cols-3 gap-2 text-center">
                <MiniStat value="20%" label="Off" />
                <MiniStat value="30m" label="Quick" />
                <MiniStat value="Fresh" label="Quality" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-5">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <TrustCard icon="⚡" title="Fast Delivery" text="Fresh items at doorstep" />
          <TrustCard icon="🔥" title="Smart Deals" text="Daily grocery savings" />
          <TrustCard icon="✅" title="Fresh Assured" text="Quality checked items" />
          <TrustCard icon="↩" title="Easy Returns" text="Simple support flow" />
        </div>
      </section>

      <section id="categories" className="mx-auto max-w-7xl px-4 py-5">
        <SectionTitle label="Shop Fast" title="Grocery Categories" />

        <div className="flex gap-3 overflow-x-auto pb-2">
          {categoryTiles.map((cat) => (
            <a
              key={cat.name}
              href={cat.href}
              className="min-w-[130px] rounded-[1.5rem] bg-white p-4 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#eef8df] text-3xl">
                {cat.icon}
              </div>
              <p className="mt-3 line-clamp-2 text-sm font-black">
                {cat.name}
              </p>
            </a>
          ))}
        </div>
      </section>

      {latest.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-5">
          <SectionTitle label="New Grocery" title="Fresh Arrivals" />
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {latest.map((product) => (
              <GroceryCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {essentials.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-5">
          <SectionTitle label="Daily Needs" title="Kitchen Essentials" />
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {essentials.map((product) => (
              <GroceryCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      <section id="products" className="mx-auto max-w-7xl px-4 py-6">
        <SectionTitle label="Complete Store" title="All Grocery Products" />

        {products.length > 0 ? (
          <div className="rounded-[2rem] bg-white p-3 shadow-sm sm:p-5">
            <GroceryProductSection products={products} />
          </div>
        ) : (
          <div className="rounded-[2rem] bg-white p-10 text-center shadow-sm">
            <div className="text-5xl">🛒</div>
            <h2 className="mt-4 text-2xl font-black">
              No grocery products found
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Approved grocery products will appear here.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}

function SectionTitle({ label, title }: { label: string; title: string }) {
  return (
    <div className="mb-4">
      <p className="text-xs font-black uppercase tracking-[0.25em] text-green-700/60">
        {label}
      </p>
      <h2 className="mt-1 text-2xl font-black md:text-3xl">{title}</h2>
    </div>
  );
}

function Badge({ text }: { text: string }) {
  return (
    <span className="rounded-full bg-white/10 px-4 py-2 text-xs font-black text-white ring-1 ring-white/10">
      {text}
    </span>
  );
}

function TrustCard({
  icon,
  title,
  text,
}: {
  icon: string;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-[1.5rem] bg-white p-4 shadow-sm">
      <p className="text-2xl">{icon}</p>
      <h3 className="mt-2 text-base font-black">{title}</h3>
      <p className="mt-1 text-xs font-semibold text-gray-500">{text}</p>
    </div>
  );
}

function MiniStat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-2xl bg-white/70 p-3">
      <p className="text-sm font-black">{value}</p>
      <p className="text-[10px] font-bold text-gray-500">{label}</p>
    </div>
  );
}

function GroceryCard({ product }: { product: ProductType }) {
  return (
    <a
      href={`/product/${product.id}`}
      className="group rounded-[1.5rem] bg-white p-3 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
    >
      <div className="aspect-square rounded-[1.2rem] bg-[#f1f7e8] p-3">
        <img
          src={product.image || "/placeholder.png"}
          alt={product.name}
          className="h-full w-full object-contain transition duration-500 group-hover:scale-105"
        />
      </div>

      <p className="mt-3 line-clamp-2 min-h-[40px] text-sm font-black">
        {product.name}
      </p>

      <p className="mt-1 text-xs font-semibold text-gray-500">
        {product.brand || product.category || "Klassic Grocery"}
      </p>

      <div className="mt-2 flex items-center justify-between gap-2">
        <p className="text-base font-black">
          ₹{getPrice(product).toLocaleString("en-IN")}
        </p>

        <span
          className={`rounded-full px-2 py-1 text-[10px] font-black ${
            Number(product.stock || 0) > 0
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {Number(product.stock || 0) > 0 ? "Stock" : "Out"}
        </span>
      </div>
    </a>
  );
}