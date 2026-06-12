"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";

type Product = {
  _id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  image: string;
  sku: string;
  status: string;
  createdAt?: string;
};

export default function SellerProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const seller = JSON.parse(localStorage.getItem("seller") || "{}");

    if (!seller?.id) {
      toast.error("Please login as seller first");
      window.location.href = "/seller/login";
      return;
    }

    fetch(`/api/seller/products?seller_id=${seller.id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setProducts(data.products);
        } else {
          toast.error(data.message || "Products fetch failed");
        }
      })
      .catch(() => toast.error("Server error"))
      .finally(() => setLoading(false));
  }, []);

  const getStatusClass = (status: string) => {
    if (status === "Approved") {
      return "bg-green-100 text-green-700";
    }

    if (status === "Rejected") {
      return "bg-red-100 text-red-700";
    }

    return "bg-yellow-100 text-yellow-700";
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">My Products</h1>

          <Link
            href="/seller/products/add"
            className="bg-black text-white px-5 py-3 rounded-xl"
          >
            + Add Product
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow overflow-x-auto">
          {loading ? (
            <p className="p-6">Loading...</p>
          ) : products.length === 0 ? (
            <p className="p-6">No products added yet.</p>
          ) : (
            <table className="w-full text-left min-w-[850px]">
              <thead className="bg-gray-200">
                <tr>
                  <th className="p-4">Image</th>
                  <th className="p-4">Name</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">SKU</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Stock</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>

              <tbody>
                {products.map((product) => (
                  <tr key={product._id} className="border-t">
                    <td className="p-4">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                    </td>

                    <td className="p-4 font-semibold">{product.name}</td>
                    <td className="p-4">{product.category || "General"}</td>
                    <td className="p-4">{product.sku || "-"}</td>
                    <td className="p-4">₹{product.price}</td>
                    <td className="p-4">{product.stock}</td>

                    <td className="p-4">
                      <span
                        className={`${getStatusClass(
                          product.status
                        )} px-3 py-1 rounded-full text-sm`}
                      >
                        {product.status || "Pending Approval"}
                      </span>
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