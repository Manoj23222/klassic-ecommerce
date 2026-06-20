import Header from "@/components/Header";
import ProductSearch from "@/components/ProductSearch";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import Link from "next/link";

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

function normalize(value: string) {
  return decodeURIComponent(value || "")
    .toLowerCase()
    .replace(/-/g, " ")
    .trim();
}

async function getProducts(categoryName: string): Promise<ProductType[]> {
  try {
    await connectDB();

    const products = await Product.find({ status: "Approved" })
      .sort({ createdAt: -1 })
      .lean();

    const cleanCategory = normalize(categoryName);

    return products
      .filter((product: any) => {
        const productCategory = normalize(product.category || "");
        const subCategory = normalize(product.sub_category || product.subcategory || "");
        const leafCategory = normalize(product.leaf_category || "");

        return (
          productCategory === cleanCategory ||
          subCategory === cleanCategory ||
          leafCategory === cleanCategory ||
          productCategory.includes(cleanCategory) ||
          cleanCategory.includes(productCategory)
        );
      })
      .map((product: any) => ({
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
    console.error("Category products fetch error:", error);
    return [];
  }
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = await params;
  const products = await getProducts(name);
  const title = decodeURIComponent(name).replace(/-/g, " ");

  return (
    <main className="min-h-screen bg-[#f1f3f6] pb-20">
      <Header />

      <section className="mx-auto max-w-7xl px-3 py-3 md:px-4 md:py-6">
        <div className="mb-3 text-xs font-black text-blue-600">
          <Link href="/">Home</Link> / <span className="capitalize">{title}</span>
        </div>

        <div className="mb-4 rounded-3xl bg-gradient-to-r from-slate-950 via-black to-slate-900 p-4 text-white shadow-xl md:p-8">
          <p className="text-[10px] font-black uppercase tracking-[0.25em] text-white/50 md:text-xs">
            Klassic Category
          </p>

          <h1 className="mt-2 text-2xl font-black capitalize md:text-4xl">
            {title}
          </h1>

          <p className="mt-1 text-xs font-semibold text-white/60 md:text-sm">
            Explore approved products from trusted Klassic sellers.
          </p>

          <p className="mt-3 inline-block rounded-full bg-yellow-400 px-4 py-2 text-xs font-black text-black">
            {products.length} Products Available
          </p>
        </div>

        <div className="mb-4 flex gap-2 overflow-x-auto pb-2">
          <Chip text="All" active />
          <Chip text="New Arrival" />
          <Chip text="Best Seller" />
          <Chip text="Top Rated" />
          <Chip text="In Stock" />
          <Chip text="Offers" />
        </div>

        <div className="mb-4 grid grid-cols-3 gap-2 md:grid-cols-6">
          <MiniFilter title="Sort" value="Popular" />
          <MiniFilter title="Price" value="Low-High" />
          <MiniFilter title="Stock" value="Available" />
          <MiniFilter title="Discount" value="Offers" />
          <MiniFilter title="Brand" value="All" />
          <MiniFilter title="Delivery" value="Fast" />
        </div>

        <div className="rounded-2xl bg-white p-2 shadow-sm md:p-4">
          <ProductSearch products={products} />
        </div>
      </section>
    </main>
  );
}

function Chip({ text, active = false }: { text: string; active?: boolean }) {
  return (
    <span
      className={`shrink-0 rounded-full px-4 py-2 text-xs font-black shadow-sm ${
        active ? "bg-black text-white" : "bg-white text-gray-700"
      }`}
    >
      {text}
    </span>
  );
}

function MiniFilter({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white p-3 shadow-sm">
      <p className="text-[9px] font-black uppercase text-gray-400">
        {title}
      </p>
      <p className="mt-1 text-xs font-black text-gray-900">{value}</p>
    </div>
  );
}