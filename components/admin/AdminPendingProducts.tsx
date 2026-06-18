"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import AdminProductApprovalModal from "@/components/admin/AdminProductApprovalModal";

export default function AdminPendingProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  async function loadProducts() {
    setLoading(true);

    const res = await fetch("/api/admin/products/pending");
    const data = await res.json();

    if (data.success) {
      setProducts(data.products || []);
      setSelectedIds([]);
    }

    setLoading(false);
  }

  useEffect(() => {
    loadProducts();
  }, []);

  function toggleSelect(id: string) {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  async function bulkApprove() {
    if (selectedIds.length === 0) {
      toast.error("Select products first");
      return;
    }

    const res = await fetch("/api/admin/products/bulk-approve", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        product_ids: selectedIds,
      }),
    });

    const data = await res.json();

    if (data.success) {
      toast.success(`${data.approvedCount || 0} products approved`);
      loadProducts();
    } else {
      toast.error(data.message || "Bulk approve failed");
    }
  }

  async function quickApprove(productId: string) {
    const res = await fetch("/api/admin/products/approve", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        product_id: productId,
        comment: "Approved by admin",
      }),
    });

    const data = await res.json();

    if (data.success) {
      toast.success("Product approved");
      loadProducts();
    } else {
      toast.error(data.message || "Approve failed");
    }
  }

  return (
    <main className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 rounded-3xl bg-slate-950 p-6 text-white">
          <h1 className="text-3xl font-black">Product Approval Center</h1>

          <p className="mt-2 text-sm text-gray-300">
            Review seller submitted products before publishing.
          </p>
        </div>

        <section className="rounded-3xl bg-white p-5 shadow-sm">
          <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-black">Pending Products</h2>
              <p className="text-sm font-bold text-gray-500">
                Selected: {selectedIds.length}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-yellow-100 px-4 py-2 text-sm font-black text-yellow-700">
                {products.length} Pending
              </span>

              <button
                onClick={bulkApprove}
                className="rounded-xl bg-green-600 px-4 py-2 text-sm font-black text-white"
              >
                Bulk Approve
              </button>
            </div>
          </div>

          {loading ? (
            <div className="p-10 text-center font-bold text-gray-500">
              Loading products...
            </div>
          ) : products.length === 0 ? (
            <div className="p-10 text-center font-bold text-gray-500">
              No pending products found
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {products.map((product) => (
                <div
                  key={product._id}
                  className={`rounded-3xl border bg-white p-4 shadow-sm ${
                    selectedIds.includes(product._id)
                      ? "border-green-500 ring-2 ring-green-100"
                      : ""
                  }`}
                >
                  <div className="mb-3 flex items-center justify-between">
                    <label className="flex items-center gap-2 text-sm font-black">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(product._id)}
                        onChange={() => toggleSelect(product._id)}
                      />
                      Select
                    </label>

                    <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-black text-yellow-700">
                      Pending
                    </span>
                  </div>

                  <img
                    src={product.image || "/placeholder.png"}
                    alt={product.name}
                    className="h-48 w-full rounded-2xl object-contain"
                  />

                  <h3 className="mt-3 line-clamp-2 font-black">
                    {product.name}
                  </h3>

                  <p className="mt-1 text-sm text-gray-500">
                    Seller: {product.seller_store_name || "-"}
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    SKU: {product.sku || "-"}
                  </p>

                  <p className="mt-2 text-lg font-black text-green-700">
                    ₹
                    {Number(
                      product.sale_price ||
                        product.salePrice ||
                        product.price ||
                        0
                    ).toLocaleString()}
                  </p>

                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setSelectedProduct(product)}
                      className="rounded-xl border px-4 py-2 text-sm font-black text-blue-600"
                    >
                      Review
                    </button>

                    <button
                      onClick={() => quickApprove(product._id)}
                      className="rounded-xl bg-green-600 px-4 py-2 text-sm font-black text-white"
                    >
                      Approve
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {selectedProduct && (
        <AdminProductApprovalModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onDone={() => {
            setSelectedProduct(null);
            loadProducts();
          }}
        />
      )}
    </main>
  );
}