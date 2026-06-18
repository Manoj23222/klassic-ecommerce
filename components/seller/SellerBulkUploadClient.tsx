"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import SellerCentralLayout from "@/components/seller/SellerCentralLayout";

export default function SellerBulkUploadClient() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  async function uploadBulk() {
    const seller = JSON.parse(localStorage.getItem("seller") || "{}");
    const sellerId = seller?._id || seller?.id;

    if (!sellerId) {
      toast.error("Seller not found");
      return;
    }

    if (!file) {
      toast.error("Select CSV file");
      return;
    }

    const formData = new FormData();
    formData.append("seller_id", sellerId);
    formData.append(
      "seller_store_name",
      seller?.store_name || seller?.storeName || "Klassic Seller"
    );
    formData.append("file", file);

    setLoading(true);

    const res = await fetch("/api/seller/products/bulk-upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setLoading(false);

    setResult(data);

    if (data.success) {
      toast.success("Bulk upload completed");
    } else {
      toast.error(data.message || "Bulk upload failed");
    }
  }

  function downloadSample() {
    const csv = [
      "name,brand,sku,category,sub_category,leaf_category,price,sale_price,stock,image,description,short_description,hsnCode,gst,countryOfOrigin,gallery_images",
      "Samsung Galaxy S25,Samsung,KL-SAM-S25,Electronics,Mobiles,Smartphones,79999,74999,10,https://example.com/image.jpg,Premium smartphone,Flagship mobile,8517,18,India,https://example.com/1.jpg|https://example.com/2.jpg",
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "klassic-bulk-upload-sample.csv";
    a.click();

    URL.revokeObjectURL(url);
  }

  return (
    <SellerCentralLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-black">Bulk Upload</h1>
        <p className="text-gray-500">
          Upload multiple products using CSV file.
        </p>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
        <section className="rounded-3xl bg-white p-6 shadow-sm">
          <h2 className="text-xl font-black">Upload Product File</h2>

          <div className="mt-5 flex min-h-56 flex-col items-center justify-center rounded-3xl border-2 border-dashed border-blue-300 bg-blue-50 p-6 text-center">
            <p className="text-lg font-black text-blue-700">
              Drop CSV file here
            </p>

            <p className="mt-1 text-sm text-gray-500">
              Supported: .csv
            </p>

            <input
              type="file"
              accept=".csv"
              className="mt-5 rounded-xl border bg-white p-3"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />

            {file && (
              <p className="mt-3 text-sm font-bold text-green-700">
                Selected: {file.name}
              </p>
            )}
          </div>

          <button
            onClick={uploadBulk}
            disabled={loading}
            className="mt-5 rounded-xl bg-blue-600 px-8 py-3 font-black text-white disabled:opacity-60"
          >
            {loading ? "Uploading..." : "Upload Products"}
          </button>

          {result && (
            <div className="mt-5 rounded-2xl bg-gray-50 p-4">
              <p className="font-black">
                Created: {result.createdCount || 0}
              </p>
              <p className="font-black text-red-600">
                Failed: {result.failedCount || 0}
              </p>

              {result.failed?.length > 0 && (
                <div className="mt-3 space-y-2">
                  {result.failed.map((item: any, index: number) => (
                    <div
                      key={index}
                      className="rounded-xl bg-red-50 p-3 text-sm font-bold text-red-700"
                    >
                      {item.sku || item.name}: {item.reason}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </section>

        <aside className="rounded-3xl bg-white p-6 shadow-sm">
          <h2 className="text-xl font-black">CSV Format</h2>

          <div className="mt-4 space-y-2 text-sm font-semibold text-gray-600">
            <p>name</p>
            <p>brand</p>
            <p>sku</p>
            <p>category</p>
            <p>sub_category</p>
            <p>leaf_category</p>
            <p>price</p>
            <p>sale_price</p>
            <p>stock</p>
            <p>image</p>
            <p>gallery_images</p>
          </div>

          <button
            onClick={downloadSample}
            className="mt-5 rounded-xl border px-5 py-3 font-black text-blue-600"
          >
            Download Sample CSV
          </button>
        </aside>
      </div>
    </SellerCentralLayout>
  );
}