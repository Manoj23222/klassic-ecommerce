"use client";
import SellerTopBar from "@/components/SellerTopBar";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { Suspense } from "react";
type Product = {
  _id: string;
  name: string;
  category: string;
  sub_category?: string;
  price: number;
  stock: number;
  image?: string;
  status: string;
  createdAt?: string;
};

function SellerProductsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const statusFilter = searchParams.get("status");
  const stockFilter = searchParams.get("stock");

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, [statusFilter, stockFilter]);

  const loadProducts = async () => {
    try {
      setLoading(true);

      const sellerData = localStorage.getItem("seller");

      if (!sellerData) {
        toast.error("Please login first");
        router.push("/seller/login");
        return;
      }

      const seller = JSON.parse(sellerData);
      const sellerId = seller._id || seller.id;

      if (!sellerId) {
        toast.error("Seller ID not found");
        router.push("/seller/login");
        return;
      }

      let url = `/api/seller/products?seller_id=${sellerId}`;

      if (statusFilter) {
        url += `&status=${encodeURIComponent(statusFilter)}`;
      }

      if (stockFilter) {
        url += `&stock=${encodeURIComponent(stockFilter)}`;
      }

      const res = await fetch(url, {
        cache: "no-store",
      });

      const data = await res.json();

      if (data.success) {
        setProducts(data.products || []);
      } else {
        toast.error(data.message || "Products load failed");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const statusColor = (status: string) => {
    if (status === "Approved") return "bg-green-100 text-green-700";
    if (status === "Rejected") return "bg-red-100 text-red-700";
    if (status === "Draft") return "bg-gray-100 text-gray-700";
    return "bg-yellow-100 text-yellow-700";
  };

  const pageTitle =
    stockFilter === "out"
      ? "Out of Stock Products"
      : statusFilter
      ? `${statusFilter} Products`
      : "My Products";

  if (loading) {
    return <div className="p-10 text-xl font-bold">Loading products...</div>;
  }

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold">{pageTitle}</h1>
            <p className="text-gray-600">Manage your seller products</p>
          </div>

          <Link
            href="/seller/products/add"
            className="bg-blue-600 text-white px-5 py-3 rounded-xl font-bold whitespace-nowrap"
          >
            + Add Product
          </Link>
        </div>

        <div className="flex flex-wrap gap-3 mb-5">
          <Link
            href="/seller/products"
            className="bg-white border px-4 py-2 rounded-xl font-bold"
          >
            All
          </Link>

          <Link
            href="/seller/products?status=Pending Approval"
            className="bg-yellow-100 text-yellow-700 px-4 py-2 rounded-xl font-bold"
          >
            Pending Approval
          </Link>

          <Link
            href="/seller/products?status=Approved"
            className="bg-green-100 text-green-700 px-4 py-2 rounded-xl font-bold"
          >
            Approved
          </Link>

          <Link
            href="/seller/products?status=Rejected"
            className="bg-red-100 text-red-700 px-4 py-2 rounded-xl font-bold"
          >
            Rejected
          </Link>

          <Link
            href="/seller/products?status=Draft"
            className="bg-gray-100 text-gray-700 px-4 py-2 rounded-xl font-bold"
          >
            Draft
          </Link>

          <Link
            href="/seller/products?stock=out"
            className="bg-orange-100 text-orange-700 px-4 py-2 rounded-xl font-bold"
          >
            Out of Stock
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow overflow-hidden">
          {products.length === 0 ? (
            <div className="p-10 text-center">
              <h2 className="text-2xl font-bold mb-3">No products found</h2>
              <p className="text-gray-600 mb-5">
                Start by adding your first seller product.
              </p>

              <Link
                href="/seller/products/add"
                className="bg-blue-600 text-white px-5 py-3 rounded-xl"
              >
                Add First Product
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[850px]">
                <thead className="bg-gray-900 text-white">
                  <tr>
                    <th className="p-4">Product</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Price</th>
                    <th className="p-4">Stock</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {products.map((product) => (
                    <tr key={product._id} className="border-b hover:bg-gray-50">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          {product.image ? (
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-14 h-14 object-cover rounded-lg border"
                            />
                          ) : (
                            <div className="w-14 h-14 bg-gray-200 rounded-lg flex items-center justify-center text-xs text-gray-500">
                              No Img
                            </div>
                          )}

                          <div>
                            <h3 className="font-bold">{product.name}</h3>
                            <p className="text-sm text-gray-500">
                              ID: {product._id.slice(-6)}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="p-4">
                        <div>{product.category || "General"}</div>

                        {product.sub_category && (
                          <div className="text-sm text-gray-500">
                            {product.sub_category}
                          </div>
                        )}
                      </td>

                      <td className="p-4 font-bold">₹{product.price}</td>

                      <td className="p-4">
                        {product.stock <= 0 ? (
                          <span className="text-red-600 font-bold">
                            Out of Stock
                          </span>
                        ) : product.stock <= 5 ? (
                          <span className="text-orange-600 font-bold">
                            Low: {product.stock}
                          </span>
                        ) : (
                          <span>{product.stock}</span>
                        )}
                      </td>

                      <td className="p-4">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-bold ${statusColor(
                            product.status
                          )}`}
                        >
                          {product.status || "Pending Approval"}
                        </span>
                      </td>

                      <td className="p-4">
                        <Link
                          href={`/seller/products/edit/${product._id}`}
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm inline-block"
                        >
                          Edit
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </main>
    
  );
}export default function SellerProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="p-10 text-center font-bold">
          Loading seller products...
        </div>
      }
    >
      <SellerProductsContent />
    </Suspense>
  );
}