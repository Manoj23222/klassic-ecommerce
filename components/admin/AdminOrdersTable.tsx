"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AdminOrdersTable({
  orders,
}: {
  orders: any[];
}) {
  const router = useRouter();
  async function updateStatus(orderId: number, newStatus: string) {
  await fetch("/api/admin/update-order-status", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      orderId,
      status: newStatus,
    }),
  });

  setMessage("Status updated successfully ✅");

  setTimeout(() => {
    setMessage("");
  }, 3000);

  router.refresh();
}

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("newest");
  const [message, setMessage] = useState("");

  const ordersPerPage = 10;

  useEffect(() => {
    setCurrentPage(1);
  }, [search, status, sortBy]);

  function getStatusClass(status: string) {
    if (status === "Pending") return "bg-yellow-100 text-yellow-700";
    if (status === "Processing") return "bg-blue-100 text-blue-700";
    if (status === "Shipped") return "bg-purple-100 text-purple-700";
    if (status === "Delivered") return "bg-green-100 text-green-700";
    if (status === "Cancelled") return "bg-red-100 text-red-700";
    return "bg-gray-100 text-gray-700";
  }

  let filteredOrders = orders.filter((order: any) => {
    const text = `
      ${order.id}
      ${order.customer_name || ""}
      ${order.phone || ""}
      ${order.status || ""}
      ${order.payment_method || ""}
    `.toLowerCase();

    const matchesSearch = text.includes(search.toLowerCase());
    const matchesStatus = status === "All" || order.status === status;

    return matchesSearch && matchesStatus;
  });

  filteredOrders = [...filteredOrders].sort((a: any, b: any) => {
    if (sortBy === "newest") return b.id - a.id;
    if (sortBy === "oldest") return a.id - b.id;
    if (sortBy === "high") {
      return Number(b.total_amount) - Number(a.total_amount);
    }
    if (sortBy === "low") {
      return Number(a.total_amount) - Number(b.total_amount);
    }
    return 0;
  });

  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
  const startIndex = (currentPage - 1) * ordersPerPage;
  const currentOrders = filteredOrders.slice(
    startIndex,
    startIndex + ordersPerPage
  );

  return (
    <>
    {message && (
  <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 animate-bounce">
    <div className="bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg font-semibold">
      {message}
    </div>
  </div>
)}
      <input
        type="text"
        placeholder="Search by order id, name, phone, status..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full border p-3 rounded mb-4"
      />

      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="w-full border p-3 rounded mb-4"
      >
        <option value="All">All Status</option>
        <option value="Pending">Pending</option>
        <option value="Processing">Processing</option>
        <option value="Shipped">Shipped</option>
        <option value="Delivered">Delivered</option>
        <option value="Cancelled">Cancelled</option>
      </select>

      <select
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value)}
        className="w-full border p-3 rounded mb-6"
      >
        <option value="newest">Newest First</option>
        <option value="oldest">Oldest First</option>
        <option value="high">Highest Amount</option>
        <option value="low">Lowest Amount</option>
      </select>

      <p className="mb-4 font-semibold">
        Showing {filteredOrders.length} of {orders.length} orders
      </p>

      <div className="mb-6 flex gap-3">
        <button
          onClick={() => {
            setSearch("");
            setStatus("All");
            setSortBy("newest");
            setCurrentPage(1);
          }}
          className="bg-gray-700 text-white px-4 py-2 rounded"
        >
          Reset Filters
        </button>

        <a
          href="/api/admin/export-orders"
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Export Orders CSV
        </a>
      </div>

      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full border-collapse">
          <thead className="bg-slate-900 text-white">
            <tr>
              <th className="p-4 text-left">Order ID</th>
              <th className="p-4 text-left">Customer</th>
              <th className="p-4 text-left">Phone</th>
              <th className="p-4 text-left">Total</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-left">Payment</th>
              <th className="p-4 text-left">Date</th>
            </tr>
          </thead>

          <tbody>
            {currentOrders.length === 0 && (
              <tr>
                <td colSpan={7} className="p-6 text-center text-gray-500">
                  No orders found
                </td>
              </tr>
            )}

            {currentOrders.map((order: any) => (
              <tr
                key={order.id}
                onClick={() => router.push(`/admin/orders/${order.id}`)}
                className="border-b hover:bg-gray-50 transition cursor-pointer"
              >
                <td className="p-4">
                  <Link
                    href={`/admin/orders/${order.id}`}
                    className="text-blue-600 font-bold"
                    onClick={(e) => e.stopPropagation()}
                  >
                    #{order.id}
                  </Link>
                </td>

                <td className="p-4">{order.customer_name || "Guest"}</td>

                <td className="p-4">{order.phone || "-"}</td>

                <td className="p-4 font-bold text-green-700">
                  ₹{Number(order.total_amount || 0).toFixed(2)}
                </td>

                <td className="p-4" onClick={(e) => e.stopPropagation()}>
  <select
    value={order.status || "Pending"}
    onChange={(e) => updateStatus(order.id, e.target.value)}
    className={`px-3 py-1 rounded-full text-sm font-semibold border ${getStatusClass(
      order.status || "Pending"
    )}`}
  >
    <option value="Pending">Pending</option>
    <option value="Processing">Processing</option>
    <option value="Shipped">Shipped</option>
    <option value="Delivered">Delivered</option>
    <option value="Cancelled">Cancelled</option>
  </select>
</td>

                <td className="p-4">
                  <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                    {order.payment_method || "COD"}
                  </span>
                </td>

                <td className="p-4">
                  {order.created_at
                    ? new Date(order.created_at).toLocaleString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-between items-center p-4">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="bg-gray-700 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            Previous
          </button>

          <span className="font-semibold">
            Page {currentPage} of {totalPages || 1}
          </span>

          <button
            onClick={() =>
              setCurrentPage((p) => Math.min(p + 1, totalPages))
            }
            disabled={currentPage === totalPages || totalPages === 0}
            className="bg-gray-700 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
}