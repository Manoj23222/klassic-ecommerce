"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type Order = {
  id: string;
  customer_name?: string;
  phone?: string;
  status?: string;
  total_amount?: number;
  payment_method?: string;
  created_at?: string;
};

export default function MyOrdersClient({ orders }: { orders: Order[] }) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string[]>([]);

  const toggleStatus = (value: string) => {
    setStatus((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const q = search.toLowerCase();

      const matchSearch =
        String(order.id).toLowerCase().includes(q) ||
        (order.customer_name || "").toLowerCase().includes(q) ||
        (order.phone || "").toLowerCase().includes(q);

      const matchStatus =
        status.length === 0 || status.includes(order.status || "Pending");

      return matchSearch && matchStatus;
    });
  }, [orders, search, status]);

  return (
    <div className="grid lg:grid-cols-[260px_1fr] gap-4">
      <aside className="bg-white rounded shadow h-fit">
        <h2 className="text-lg font-bold px-5 py-4 border-b">Filters</h2>

        <div className="px-5 py-4">
          <h3 className="text-sm font-bold mb-3">ORDER STATUS</h3>

          <div className="space-y-3 text-sm">
            {["Pending", "Processing", "Shipped", "Delivered", "Cancelled"].map(
              (item) => (
                <label key={item} className="flex gap-2 items-center">
                  <input
                    type="checkbox"
                    checked={status.includes(item)}
                    onChange={() => toggleStatus(item)}
                  />
                  {item}
                </label>
              )
            )}
          </div>
        </div>
      </aside>

      <div>
        <div className="flex mb-4">
          <input
            className="flex-1 bg-white border px-4 py-3 rounded-l text-sm md:text-base outline-none"
            placeholder="Search by order id, name or phone"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <button className="bg-blue-600 text-white px-4 md:px-8 rounded-r font-semibold text-sm md:text-base">
            🔍 Search
          </button>
        </div>

        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded shadow p-8 text-center">
            <h2 className="text-xl font-bold">No Orders Found</h2>
            <p className="text-gray-500 mt-2 text-sm">
              Try another search or clear filters.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredOrders.map((order) => {
              const statusText = order.status || "Pending";

              const statusColor =
                statusText === "Delivered"
                  ? "bg-green-500"
                  : statusText === "Cancelled"
                  ? "bg-red-500"
                  : "bg-orange-500";

              return (
                <Link
                  key={order.id}
                  href={`/my-orders/${order.id}`}
                  className="block bg-white border rounded shadow-sm hover:shadow-md transition p-4"
                >
                  <div className="grid md:grid-cols-[1.2fr_160px_220px] gap-4 items-start">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        Order #{order.id.slice(-6).toUpperCase()}
                      </p>

                      <p className="text-sm text-gray-600 mt-2">
                        {order.customer_name || "Guest"}
                      </p>

                      <p className="text-sm text-gray-500">
                        Phone: {order.phone || "-"}
                      </p>

                      <p className="text-xs text-gray-400 mt-2">
                        {order.created_at
                          ? new Date(order.created_at).toLocaleDateString(
                              "en-IN"
                            )
                          : ""}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm font-bold">
                        ₹{order.total_amount || 0}
                      </p>

                      <p className="text-xs text-gray-500 mt-2">
                        {order.payment_method || "COD"}
                      </p>
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`w-3 h-3 rounded-full ${statusColor}`} />
                        <p className="text-sm font-bold">{statusText}</p>
                      </div>

                      <p className="text-xs text-gray-600 mt-2">
                        Click to view full order details
                      </p>

                      <p className="text-blue-600 text-sm font-semibold mt-3">
                        ★ Rate & Review Product
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}