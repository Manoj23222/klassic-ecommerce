"use client";

import { useState } from "react";
import toast from "react-hot-toast";

export default function AdminWithdrawRequestsClient({
  requests,
}: {
  requests: any[];
}) {
  const [items, setItems] = useState<any[]>(requests || []);
  const [loadingId, setLoadingId] = useState("");

  async function updateStatus(id: string, status: "Approved" | "Rejected") {
    setLoadingId(id);

    const res = await fetch("/api/admin/withdraw-requests", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ withdrawId: id, status }),
    });

    const data = await res.json();
    setLoadingId("");

    if (!data.success) {
      toast.error(data.message || "Update failed");
      return;
    }

    toast.success(data.message);

    setItems((prev) =>
      prev.map((item) =>
        item._id === id ? { ...item, status: data.withdraw.status } : item
      )
    );
  }

  return (
    <section className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-black">Withdraw Requests</h1>
        <p className="text-gray-500">
          Approve or reject seller wallet withdraw requests.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-900 text-white">
              <tr>
                <th className="p-4 text-left">Seller</th>
                <th className="p-4 text-left">Store</th>
                <th className="p-4 text-left">Amount</th>
                <th className="p-4 text-left">Method</th>
                <th className="p-4 text-left">Status</th>
                <th className="p-4 text-left">Date</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>

            <tbody>
              {items.map((item) => (
                <tr key={item._id} className="border-b">
                  <td className="p-4 font-bold">
                    {item.seller_name || "Seller"}
                  </td>

                  <td className="p-4">{item.seller_store_name || "-"}</td>

                  <td className="p-4 font-black text-green-700">
                    ₹{Number(item.amount || 0).toLocaleString("en-IN")}
                  </td>

                  <td className="p-4">{item.method || "Bank Transfer"}</td>

                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        item.status === "Approved"
                          ? "bg-green-100 text-green-700"
                          : item.status === "Rejected"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>

                  <td className="p-4 text-gray-500">
                    {item.createdAt
                      ? new Date(item.createdAt).toLocaleDateString("en-IN")
                      : "-"}
                  </td>

                  <td className="p-4 text-right">
                    {item.status === "Pending" ? (
                      <div className="flex justify-end gap-2">
                        <button
                          disabled={loadingId === item._id}
                          onClick={() => updateStatus(item._id, "Approved")}
                          className="bg-green-600 text-white px-4 py-2 rounded-xl font-bold hover:bg-green-700 disabled:opacity-60"
                        >
                          Approve
                        </button>

                        <button
                          disabled={loadingId === item._id}
                          onClick={() => updateStatus(item._id, "Rejected")}
                          className="bg-red-600 text-white px-4 py-2 rounded-xl font-bold hover:bg-red-700 disabled:opacity-60"
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span className="text-gray-400 font-bold">Completed</span>
                    )}
                  </td>
                </tr>
              ))}

              {items.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-10 text-center text-gray-500">
                    No withdraw requests found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}