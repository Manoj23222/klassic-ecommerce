import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import Link from "next/link";
import AdminProductReviewActions from "@/components/AdminProductReviewActions";

export const dynamic = "force-dynamic";

export default async function AdminProductReviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await connectDB();

  const { id } = await params;

  const product: any = await Product.findById(id).lean();

  if (!product) {
    return (
      <main className="p-10">
        <h1 className="text-3xl font-bold mb-4">Product not found</h1>
        <Link href="/admin/products" className="text-blue-600">
          Back to Products
        </Link>
      </main>
    );
  }

  const p = JSON.parse(JSON.stringify(product));

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <Link
          href="/admin/products"
          className="inline-block mb-5 bg-gray-800 text-white px-4 py-2 rounded-lg"
        >
          Back
        </Link>

        <div className="bg-white rounded-2xl shadow p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              {p.image ? (
                <img
                  src={p.image}
                  alt={p.name}
                  className="w-full max-h-[450px] object-cover rounded-xl border"
                />
              ) : (
                <div className="h-[350px] bg-gray-200 rounded-xl flex items-center justify-center">
                  No Image
                </div>
              )}

              {p.gallery_images?.length > 0 && (
                <div className="flex flex-wrap gap-3 mt-4">
                  {p.gallery_images.map((img: string, index: number) => (
                    <img
                      key={index}
                      src={img}
                      alt="Gallery"
                      className="w-24 h-24 object-cover rounded-lg border"
                    />
                  ))}
                </div>
              )}
            </div>

            <div>
              <h1 className="text-3xl font-bold mb-3">{p.name}</h1>

              <p className="text-gray-600 mb-4">
                {p.short_description || p.description}
              </p>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <Info title="Status" value={p.status} />
                <Info title="SKU" value={p.sku} />
                <Info title="Seller" value={p.seller_store_name || "Seller"} />
                <Info title="Category" value={p.category} />
                <Info title="Sub Category" value={p.sub_category || "-"} />
                <Info title="Brand" value={p.brand || "-"} />
                <Info title="Price" value={`₹${p.price}`} />
                <Info title="Sale Price" value={`₹${p.sale_price || 0}`} />
                <Info title="Stock" value={String(p.stock)} />
                <Info title="Colors" value={p.colors || "-"} />
                <Info title="Sizes" value={p.sizes || "-"} />
                <Info title="Tags" value={p.tags || "-"} />
              </div>

              <div className="mb-6">
                <h2 className="text-xl font-bold mb-2">Full Description</h2>
                <p className="text-gray-700 whitespace-pre-line">
                  {p.description || "No description"}
                </p>
              </div>

              {p.reject_reason && (
                <div className="mb-6 bg-red-50 text-red-700 p-4 rounded-xl">
                  <h2 className="font-bold">Reject Reason</h2>
                  <p>{p.reject_reason}</p>
                </div>
              )}

              <AdminProductReviewActions
                productId={p._id}
                currentStatus={p.status}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function Info({ title, value }: { title: string; value: string }) {
  return (
    <div className="border rounded-xl p-3 bg-gray-50">
      <p className="text-xs text-gray-500">{title}</p>
      <p className="font-bold break-words">{value}</p>
    </div>
  );
}