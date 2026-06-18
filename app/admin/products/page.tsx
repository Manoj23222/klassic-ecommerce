import AdminProductsTable from "@/components/admin/AdminProductsTable";
import AdminProductForm from "@/components/AdminProductForm";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  await connectDB();

  const products = await Product.find({})
    .sort({ createdAt: -1 })
    .lean();

  const formattedProducts = products.map((product: any) => ({
  ...product,
  _id: String(product._id),
  id: String(product._id),
  createdAt: product.createdAt?.toISOString?.() || "",
  updatedAt: product.updatedAt?.toISOString?.() || "",

  variants: Array.isArray(product.variants)
    ? product.variants.map((v: any) => ({
        ...v,
        _id: v._id ? String(v._id) : "",
      }))
    : [],

  color_variants: Array.isArray(product.color_variants)
    ? product.color_variants.map((v: any) => ({
        ...v,
        _id: v._id ? String(v._id) : "",
      }))
    : [],

  specifications: Array.isArray(product.specifications)
    ? product.specifications.map((s: any) => ({
        ...s,
        _id: s._id ? String(s._id) : "",
      }))
    : [],

  attributeMeta: Array.isArray(product.attributeMeta)
    ? product.attributeMeta.map((a: any) => ({
        ...a,
        _id: a._id ? String(a._id) : "",
      }))
    : [],
}));

  return (
    <main className="min-h-screen bg-gray-100 px-3 py-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <section className="mt-6 bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
          <AdminProductsTable products={formattedProducts} />
        </section>
      </div>
    </main>
  );
}