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
        return (
          productCategory === cleanCategory ||
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
    <main className="min-h-screen bg-[#f7f5f1]">
      <Header />

      <section className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-8 rounded-[2rem] bg-black p-8 text-white">
          <p className="text-xs font-black uppercase tracking-[0.25em] text-white/50">
            Klassic Category
          </p>

          <h1 className="mt-3 text-4xl font-black capitalize tracking-tight">
            {title}
          </h1>

          <p className="mt-2 text-sm font-semibold text-white/60">
            Explore approved products from trusted Klassic sellers.
          </p>
        </div>

        <ProductSearch products={products} />
      </section>
    </main>
  );
}