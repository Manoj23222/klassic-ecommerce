"use client";

import { useMemo, useState } from "react";
import AdminSellerActions from "./AdminSellerActions";

export default function AdminSellersTable({
  sellers,
}: {
  sellers: any[];
}) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");

  const filtered = useMemo(() => {
    return sellers.filter((seller) => {
      const text =
        `${seller.name} ${seller.store_name} ${seller.email}`.toLowerCase();

      const matchSearch = text.includes(search.toLowerCase());

      const matchStatus =
        status === "all"
          ? true
          : seller.status === status;

      return matchSearch && matchStatus;
    });
  }, [sellers, search, status]);

  return (
    <div>
      <div className="grid md:grid-cols-2 gap-4 mb-5">
        <input
          type="text"
          placeholder="Search seller..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-xl px-4 py-3 outline-none"
        />

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border rounded-xl px-4 py-3"
        >
          <option value="all">All Sellers</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
          <option value="Suspended">Suspended</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[1100px]">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="p-3 text-left">Seller</th>
              <th className="p-3 text-left">Store</th>
              <th className="p-3 text-left">Category</th>
              <th className="p-3 text-left">Products</th>
              <th className="p-3 text-left">Orders</th>
              <th className="p-3 text-left">Sales</th>
              <th className="p-3 text-left">Trust</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((seller) => (
              <tr
                key={seller.id}
                className="border-b hover:bg-gray-50"
              >
                <td className="p-3">
                  <div>
                    <p className="font-bold">
                      {seller.name}
                    </p>

                    <p className="text-sm text-gray-500">
                      {seller.email}
                    </p>
                  </div>
                </td>

                <td className="p-3">
                  {seller.store_name}
                </td>

                <td className="p-3">
                  {seller.category || "General"}
                </td>

                <td className="p-3">
                  {seller.total_products}
                </td>

                <td className="p-3">
                  {seller.total_orders}
                </td>

                <td className="p-3">
                  ₹
                  {Number(
                    seller.total_sales || 0
                  ).toLocaleString("en-IN")}
                </td>

                <td className="p-3">
                  <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs">
                    {seller.trust_score}
                  </span>
                </td>

                <td className="p-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      seller.status === "Approved"
                        ? "bg-green-100 text-green-700"
                        : seller.status === "Pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : seller.status === "Rejected"
                        ? "bg-red-100 text-red-700"
                        : "bg-orange-100 text-orange-700"
                    }`}
                  >
                    {seller.status}
                  </span>
                </td>

                <td className="p-3">
                  <AdminSellerActions
                    sellerId={seller.id}
                    status={seller.status}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}