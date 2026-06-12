import EditProductForm from "@/components/EditProductForm";
import Link from "next/link";
import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";

export const dynamic = "force-dynamic";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return (
      <main className="min-h-screen bg-gray-100 px-6 py-6">
        <h1 className="text-3xl font-bold">Invalid product ID</h1>
      </main>
    );
  }

  await connectDB();

  const product: any = await Product.findById(id).lean();

  if (!product) {
    return (
      <main className="min-h-screen bg-gray-100 px-6 py-6">
        <h1 className="text-3xl font-bold">Product not found</h1>
      </main>
    );
  }

  const formattedProduct = {
    ...product,
    id: String(product._id),
  };

  return (
    <main className="min-h-screen bg-gray-100 px-6 py-5">
      <div className="max-w-5xl mx-auto">
        <Link
          href="/admin/product"
          className="inline-flex items-center bg-gray-900 hover:bg-black text-white px-4 py-2 rounded-lg shadow mb-4"
        >
          ← Back to Products
        </Link>

        <div className="w-full bg-white p-6 rounded-xl shadow">
          <h1 className="text-3xl font-bold mb-6">Edit Product</h1>

          <EditProductForm product={formattedProduct} />
        </div>
      </div>
    </main>
  );
}