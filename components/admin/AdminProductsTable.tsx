"use client";

import Link from "next/link";
import { useState } from "react";
import DeleteProductButton from "@/components/DeleteProductButton";

export default function AdminProductsTable({
  products,
}: {
  products: any[];
}) {
  const [search, setSearch] = useState("");
  const [stockFilter, setStockFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const filteredProducts = products.filter((item: any) => {
    const matchesSearch = item.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesStock =
      stockFilter === "all"
        ? true
        : stockFilter === "in"
        ? item.stock > 0
        : item.stock === 0;

    const matchesCategory =
      categoryFilter === "all"
        ? true
        : (item.category || "General") === categoryFilter;

    return matchesSearch && matchesStock && matchesCategory;
  });

  return (
    <>
      <input
        type="text"
        placeholder="Search product..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full border p-3 rounded-lg mb-4 outline-none focus:ring-2 focus:ring-blue-500"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="w-full border p-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Categories</option>
          <option value="General">General</option>
          <option value="Home & Kitchen">Home & Kitchen</option>
          <option value="Fashion">Fashion</option>
          <option value="Electronics">Electronics</option>
          <option value="Books">Books</option>
          <option value="Sports">Sports</option>
        </select>

        <select
          value={stockFilter}
          onChange={(e) => setStockFilter(e.target.value)}
          className="w-full border p-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Products</option>
          <option value="in">In Stock</option>
          <option value="out">Out Of Stock</option>
        </select>
      </div>

      <p className="mb-4 font-semibold">
        Showing {filteredProducts.length} of {products.length} products
      </p>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b-2 border-gray-300">
              <th className="text-left py-3 px-4">Image</th>
              <th className="text-left py-3 px-4">Name</th>
              <th className="text-left py-3 px-4">Category</th>
              <th className="text-left py-3 px-4">Featured</th>
              <th className="text-left py-3 px-4">Price</th>
              <th className="text-left py-3 px-4">Stock</th>
              <th className="text-left py-3 px-4">Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredProducts.map((item: any) => (
              <tr key={item.id} className="border-b hover:bg-gray-50 transition">
                <td className="py-4 px-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-14 h-14 object-contain rounded border bg-white"
                  />
                </td>

                <td className="py-4 px-4 font-medium">{item.name}</td>

                <td className="py-4 px-4">
                  <span className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                    {item.category || "General"}
                  </span>
                </td>

                <td className="py-4 px-4">
  {item.featured ? (
    <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-semibold">
      ⭐ Featured
    </span>
  ) : (
    <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm">
      Normal
    </span>
  )}
</td>

                <td className="py-4 px-4">₹{Number(item.price).toFixed(2)}</td>
<td className="py-4 px-4">
  <div className="flex flex-col gap-1">
    <span
      className={
        item.stock > 0
          ? "text-green-600 font-bold"
          : "text-red-600 font-bold"
      }
    >
      {item.stock}
    </span>

    {item.stock > 0 && item.stock < 5 && (
      <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-semibold w-fit">
        🔴 Low Stock
      </span>
    )}

    {item.stock === 0 && (
      <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs font-semibold w-fit">
        Out of Stock
      </span>
    )}
  </div>
</td>

                <td className="py-4 px-4">
                  <div className="flex gap-3 items-center">
                    <Link
                      href={`/admin/products/edit/${item.id}`}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-sm"
                    >
                      Edit
                    </Link>

                    <DeleteProductButton id={item.id} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}