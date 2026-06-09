import EditProductForm from "@/components/EditProductForm";
import db from "@/lib/db";
import Link from "next/link";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [products]: any = await db.query(
    "SELECT * FROM products WHERE id = ?",
    [id]
  );

  if (products.length === 0) {
    return (
      <main className="min-h-screen bg-gray-100 px-6 py-6">
        <h1 className="text-3xl font-bold">Product not found</h1>
      </main>
    );
  }

  const product = products[0];

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

          <EditProductForm product={product} />
        </div>
      </div>
    </main>
  );
}