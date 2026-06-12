"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

type Product = {
  _id: string;
  name: string;
  seller_store_name: string;
  category: string;
  price: number;
  stock: number;
  image: string;
  sku: string;
  status: string;
  rejection_reason?: string;
};

export default function PendingProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/admin/products");
      const data = await res.json();

      if (data.success) {
        setProducts(data.products);
      } else {
        toast.error(data.message || "Products fetch failed");
      }
    } catch {
      toast.error("Server error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const updateStatus = async (
    productId: string,
    status: "Approved" | "Rejected"
  ) => {
    let rejection_reason = "";

    if (status === "Rejected") {
      const reason = prompt("Enter rejection reason:");

      if (!reason || reason.trim().length < 3) {
        toast.error("Rejection reason required");
        return;
      }

      rejection_reason = reason.trim();
    }

    const res = await fetch("/api/admin/products/update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        productId,
        status,
        rejection_reason,
      }),
    });

    const data = await res.json();

    if (data.success) {
      toast.success(`Product ${status}`);
      fetchProducts();
    } else {
      toast.error(data.message || "Update failed");
    }
  };

  const pendingProducts = products.filter(
    (product) => product.status === "Pending Approval"
  );

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">
          Pending Product Approval
        </h1>

        <div className="bg-white rounded-2xl shadow overflow-x-auto">
          {loading ? (
            <p className="p-6">Loading...</p>
          ) : pendingProducts.length === 0 ? (
            <p className="p-6">No pending products.</p>
          ) : (
            <table className="w-full text-left min-w-[1000px]">
              <thead className="bg-gray-200">
                <tr>
                  <th className="p-4">Image</th>
                  <th className="p-4">Product</th>
                  <th className="p-4">Seller</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">SKU</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Stock</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Action</th>
                </tr>
              </thead>

              <tbody>
                {pendingProducts.map((product) => (
                  <tr key={product._id} className="border-t">
                    <td className="p-4">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                    </td>

                    <td className="p-4 font-semibold">{product.name}</td>
                    <td className="p-4">
                      {product.seller_store_name || "Seller"}
                    </td>
                    <td className="p-4">{product.category}</td>
                    <td className="p-4">{product.sku || "-"}</td>
                    <td className="p-4">₹{product.price}</td>
                    <td className="p-4">{product.stock}</td>

                    <td className="p-4">
                      <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm">
                        {product.status}
                      </span>
                    </td>

                    <td className="p-4 flex gap-2">
                      <button
                        onClick={() =>
                          updateStatus(product._id, "Approved")
                        }
                        className="bg-green-600 text-white px-4 py-2 rounded-lg"
                      >
                        Approve
                      </button>

                      <button
                        onClick={() =>
                          updateStatus(product._id, "Rejected")
                        }
                        className="bg-red-600 text-white px-4 py-2 rounded-lg"
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}