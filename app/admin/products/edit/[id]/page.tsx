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
      <main className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-blue-50 px-6 py-10">
        <div className="mx-auto max-w-4xl rounded-3xl border bg-white p-8 shadow-xl">
          <h1 className="text-3xl font-black text-red-600">
            Invalid product ID
          </h1>
          <Link
            href="/admin/products"
            className="mt-5 inline-flex rounded-xl bg-black px-5 py-3 text-sm font-bold text-white"
          >
            ← Back to Products
          </Link>
        </div>
      </main>
    );
  }

  await connectDB();

  const product = await Product.findById(id).lean();

  if (!product) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-blue-50 px-6 py-10">
        <div className="mx-auto max-w-4xl rounded-3xl border bg-white p-8 shadow-xl">
          <h1 className="text-3xl font-black text-red-600">
            Product not found
          </h1>
          <Link
            href="/admin/products"
            className="mt-5 inline-flex rounded-xl bg-black px-5 py-3 text-sm font-bold text-white"
          >
            ← Back to Products
          </Link>
        </div>
      </main>
    );
  }

  const formattedProduct = JSON.parse(JSON.stringify(product));

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-blue-50 px-3 py-5 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <Link
            href="/admin/products"
            className="inline-flex items-center rounded-xl bg-slate-950 px-4 py-2 text-sm font-black text-white shadow hover:bg-black"
          >
            ← Back to Products
          </Link>

          <div className="rounded-full border bg-white px-4 py-2 text-xs font-black text-slate-600 shadow-sm">
            Admin Product Control
          </div>
        </div>

        <section className="overflow-hidden rounded-[2rem] border bg-white shadow-2xl">
          <div className="border-b bg-gradient-to-r from-slate-950 via-blue-950 to-indigo-900 p-6 text-white">
            <p className="text-xs font-black uppercase tracking-[0.25em] text-blue-200">
              Klassic Admin
            </p>

            <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
              <div>
                <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
                  Edit Product
                </h1>
                <p className="mt-2 max-w-2xl text-sm text-slate-300">
                  Update product details, price, inventory, images, variants,
                  quantity options, status and marketplace visibility.
                </p>
              </div>

              <div className="rounded-2xl bg-white/10 p-4 text-right backdrop-blur">
                <p className="text-xs text-slate-300">Product ID</p>
                <p className="text-sm font-black">{String(formattedProduct._id).slice(-8)}</p>
              </div>
            </div>
          </div>

          <div className="grid gap-5 p-4 lg:grid-cols-[280px_1fr] lg:p-6">
            <aside className="space-y-3">
              <div className="rounded-3xl border bg-slate-50 p-4">
                <img
                  src={formattedProduct.image || "/placeholder.png"}
                  alt={formattedProduct.name}
                  className="h-56 w-full rounded-2xl bg-white object-contain p-3"
                />

                <h2 className="mt-4 line-clamp-2 text-lg font-black">
                  {formattedProduct.name}
                </h2>

                <p className="mt-1 text-sm font-bold text-slate-500">
                  {formattedProduct.category || "No Category"}
                </p>

                <div className="mt-4 grid grid-cols-2 gap-2 text-center text-xs">
                  <div className="rounded-2xl bg-white p-3 shadow-sm">
                    <p className="font-black text-slate-900">
                      ₹{Number(formattedProduct.price || 0).toFixed(0)}
                    </p>
                    <p className="text-slate-500">Price</p>
                  </div>

                  <div className="rounded-2xl bg-white p-3 shadow-sm">
                    <p className="font-black text-slate-900">
                      {formattedProduct.stock || 0}
                    </p>
                    <p className="text-slate-500">Stock</p>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border bg-white p-4 text-sm shadow-sm">
                <p className="font-black">Control Includes</p>
                <div className="mt-3 space-y-2 text-slate-600">
                  <p>✓ Product Details</p>
                  <p>✓ Images & Gallery</p>
                  <p>✓ Color / Size</p>
                  <p>✓ Quantity Options</p>
                  <p>✓ Status Control</p>
                  <p>✓ Delete Product</p>
                </div>
              </div>
            </aside>

            <div className="rounded-3xl border bg-white p-4 shadow-sm sm:p-5">
              <EditProductForm product={formattedProduct} />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}