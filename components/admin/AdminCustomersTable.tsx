"use client";

import { useMemo, useState } from "react";
import AdminCustomerActions from "@/components/admin/AdminCustomerActions";

export default function AdminCustomersTable({
  customers,
}: {
  customers: any[];
}) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");

  const filtered = useMemo(() => {
    return customers.filter((c) => {
      const text = `${c.name} ${c.email} ${c.phone} ${c.city}`.toLowerCase();

      const matchSearch = text.includes(search.toLowerCase());
      const matchStatus = status === "all" ? true : c.status === status;

      return matchSearch && matchStatus;
    });
  }, [customers, search, status]);

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-5">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search customer by name, email, phone..."
          className="border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
        />

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Customers</option>
          <option value="Active">Active</option>
          <option value="Blocked">Blocked</option>
        </select>
      </div>

      <p className="text-sm font-semibold text-gray-600 mb-4">
        Showing {filtered.length} of {customers.length} customers
      </p>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[950px] border-collapse">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="text-left p-3">Customer</th>
              <th className="text-left p-3">Contact</th>
              <th className="text-left p-3">Location</th>
              <th className="text-left p-3">Orders</th>
              <th className="text-left p-3">Spent</th>
              <th className="text-left p-3">Status</th>
              <th className="text-left p-3">Joined</th>
              <th className="text-left p-3">Action</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((c) => (
              <tr key={c.id} className="border-b hover:bg-gray-50">
                <td className="p-3">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                      {String(c.name || "C").charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold">{c.name}</p>
                      <p className="text-xs text-gray-500">ID: {c.id.slice(-6)}</p>
                    </div>
                  </div>
                </td>

                <td className="p-3">
                  <p className="font-medium">{c.email}</p>
                  <p className="text-sm text-gray-500">{c.phone || "No phone"}</p>
                </td>

                <td className="p-3">
                  <p>{c.city || "N/A"}</p>
                  <p className="text-sm text-gray-500">{c.pincode || ""}</p>
                </td>

                <td className="p-3 font-bold">{c.totalOrders}</td>

                <td className="p-3 font-bold">
                  ₹{Number(c.totalSpend || 0).toFixed(2)}
                </td>

                <td className="p-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      c.status === "Blocked"
                        ? "bg-red-100 text-red-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {c.status}
                  </span>
                </td>

                <td className="p-3 text-sm">
                  {c.created_at
                    ? new Date(c.created_at).toLocaleDateString("en-IN")
                    : "N/A"}
                </td>

                <td className="p-3">
                  <AdminCustomerActions
                    customerId={c.id}
                    status={c.status}
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