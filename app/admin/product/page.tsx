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
    id: String(product._id),
  }));

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">
        Product Management
      </h1>

      <div className="bg-white p-6 rounded-xl shadow">
        <AdminProductForm />
      </div>

      <div className="mt-8 bg-white rounded-xl shadow p-6">
        <AdminProductsTable products={formattedProducts} />
      </div>
    </div>
  );
}