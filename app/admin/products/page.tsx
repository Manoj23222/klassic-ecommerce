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
    createdAt: product.createdAt
      ? new Date(product.createdAt).toISOString()
      : "",
    updatedAt: product.updatedAt
      ? new Date(product.updatedAt).toISOString()
      : "",
  }));

  return (
    <main className="min-h-screen bg-gray-100 px-3 py-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Product Management
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Add, edit, delete and manage marketplace products.
          </p>
        </div>

        <section className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-100">
          <AdminProductForm />
        </section>

        <section className="mt-6 bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
          <AdminProductsTable products={formattedProducts} />
        </section>
      </div>
    </main>
  );
}