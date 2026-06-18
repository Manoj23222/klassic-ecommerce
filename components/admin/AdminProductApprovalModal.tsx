"use client";

import { useState } from "react";
import toast from "react-hot-toast";

export default function AdminProductApprovalModal({
  product,
  onClose,
  onDone,
}: {
  product: any;
  onClose: () => void;
  onDone: () => void;
}) {
  const [reason, setReason] = useState("");
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  async function approveProduct() {
    setLoading(true);

    const res = await fetch("/api/admin/products/approve", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        product_id: product._id,
        comment: comment || "Approved by admin",
      }),
    });

    const data = await res.json();
    setLoading(false);

    if (data.success) {
      toast.success("Product approved");
      onDone();
    } else {
      toast.error(data.message || "Approve failed");
    }
  }

  async function rejectProduct() {
    if (!reason.trim()) {
      toast.error("Reject reason required");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/admin/products/reject", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        product_id: product._id,
        reason,
        comment,
      }),
    });

    const data = await res.json();
    setLoading(false);

    if (data.success) {
      toast.success("Product rejected");
      onDone();
    } else {
      toast.error(data.message || "Reject failed");
    }
  }

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 p-4">
      <div className="max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-3xl bg-white p-5 shadow-2xl">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black">Review Product</h2>
            <p className="text-sm text-gray-500">
              Check product details, images, SKU, pricing and seller info.
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl bg-gray-100 px-4 py-2 font-black"
          >
            ✕
          </button>
        </div>

        <div className="grid gap-5 lg:grid-cols-[360px_1fr]">
          <section>
            <img
              src={product.image || "/placeholder.png"}
              alt={product.name}
              className="h-80 w-full rounded-2xl border object-contain"
            />

            <div className="mt-3 flex gap-2 overflow-x-auto">
              {(product.gallery_images || []).map((img: string, index: number) => (
                <img
                  key={index}
                  src={img}
                  alt=""
                  className="h-20 w-20 rounded-xl border object-contain"
                />
              ))}
            </div>
          </section>

          <section className="space-y-4">
            <div>
              <h3 className="text-xl font-black">{product.name}</h3>
              <p className="text-sm text-gray-500">
                Seller: {product.seller_store_name || "-"}
              </p>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <Info label="SKU" value={product.sku || "-"} />
              <Info label="Category" value={product.category || "-"} />
              <Info label="Leaf Category" value={product.leaf_category || "-"} />
              <Info
                label="Price"
                value={`₹${Number(product.price || 0).toLocaleString()}`}
              />
              <Info
                label="Sale Price"
                value={`₹${Number(
                  product.sale_price || product.salePrice || 0
                ).toLocaleString()}`}
              />
              <Info label="Stock" value={String(product.stock || 0)} />
              <Info label="HSN" value={product.hsnCode || "-"} />
              <Info label="GST" value={`${product.gst || 0}%`} />
            </div>

            <div className="rounded-2xl bg-gray-50 p-4">
              <h4 className="font-black">Description</h4>
              <p className="mt-2 text-sm leading-6 text-gray-700">
                {product.description || "No description"}
              </p>
            </div>

            <div className="rounded-2xl bg-blue-50 p-4">
              <h4 className="font-black text-blue-800">Dynamic Attributes</h4>
              <div className="mt-2 grid gap-2 md:grid-cols-2">
                {Object.entries(product.attributes || {}).map(([key, value]) => (
                  <Info key={key} label={key} value={String(value)} />
                ))}
              </div>
            </div>

            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Admin approval comment"
              className="w-full rounded-2xl border p-3"
              rows={3}
            />

            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Reject reason required only for rejection"
              className="w-full rounded-2xl border p-3"
              rows={3}
            />

            <div className="grid gap-3 md:grid-cols-2">
              <button
                disabled={loading}
                onClick={rejectProduct}
                className="rounded-2xl bg-red-600 px-5 py-3 font-black text-white disabled:opacity-60"
              >
                Reject Product
              </button>

              <button
                disabled={loading}
                onClick={approveProduct}
                className="rounded-2xl bg-green-600 px-5 py-3 font-black text-white disabled:opacity-60"
              >
                Approve Product
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border bg-white p-3">
      <p className="text-xs font-black uppercase tracking-widest text-gray-400">
        {label}
      </p>
      <p className="mt-1 font-bold text-gray-900">{value}</p>
    </div>
  );
}